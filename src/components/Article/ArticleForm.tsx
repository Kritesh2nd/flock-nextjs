"use client";

import React, { useState } from "react";
import { ContentBlock, ContentBlockType, DynamicFormData } from "@/types";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios.utils";
import ContentBlockManager from "./ContentBlockMangar";
import toast from "react-hot-toast";
import { LuSend } from "react-icons/lu";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { PiNewspaper } from "react-icons/pi";

export default function ArticleForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<DynamicFormData>({
    heading: "",
    subHeading: "",
    image: null,
    articleContent: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContentUpdate = (blocks: ContentBlock[]) => {
    setFormData((prev) => ({
      ...prev,
      articleContent: blocks,
    }));
  };

  const validateImage = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, or WEBP images are allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "Image must be under 5MB";
    }

    return null;
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);

    if (error) {
      toast.error(error);
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const turn = (data: ContentBlockType, level: any) => {
    if (data != "HEADING") return data;

    if (level == null || level == undefined) return "H2";

    return "H" + level;
  };

  const validateForm = (draft = false) => {
    const newErrors: Record<string, string> = {};
    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    } else if (formData.heading.length < 5) {
      newErrors.heading = "Heading must be at least 5 characters";
    }
    if (!formData.subHeading.trim()) {
      newErrors.subHeading = "Sub Heading is required";
    }
    if (!formData.articleContent.length) {
      newErrors.articleContent = "At least one content block is required";
    }

    formData.articleContent.forEach((block, index) => {
      if (
        (block.type === "PARAGRAPH" || block.type === "HEADING") &&
        !block.content?.trim()
      ) {
        newErrors[`block-${index}`] = "This block cannot be empty";
      }

      if (block.type === "URL" && !block.config?.file && !block.content) {
        newErrors[`block-${index}`] = "Image or URL is required";
      }
    });

    if (!formData.image) {
      newErrors.image = "Image is required";
    }
    if (formData.image) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = "Only JPG or PNG images are allowed";
      }

      if (formData.image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image size must be under 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        heading: formData.heading,
        subHeading: formData.subHeading,
        articleContent: formData.articleContent.map((block, i) => {
          if (block.type === "URL") {
            return {
              contentType: turn(block.type, block.config?.level),
              content: block.content || "",
              order: i,
            };
          }

          return {
            contentType: turn(block.type, block.config?.level),
            content: block.content,
            order: i,
          };
        }),
      };

      const createRes = await axiosInstance.post("/article/create", payload);
      const articleId = createRes.data.id;

      const imageForm = new FormData();

      if (formData.image instanceof File) {
        imageForm.append("mainImage", formData.image);
      }

      formData.articleContent.forEach((block) => {
        if (block.type === "URL" && block.config?.file) {
          imageForm.append("articleImages", block.config.file);
        }
      });

      const uploadRes = await axiosInstance.post(
        `/article/add-update-images/${articleId}`,
        imageForm,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      toast.success("Article published successfully!");
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to publish article. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 px-14">
      <FaArrowLeft
        size={20}
        onClick={() => router.push("/dashboard/articles")}
        className="cursor-pointer text-primary/80"
      />
      <div className="flex gap-4 items-center">
        <PiNewspaper size={28} />
        <h1 className="text-2xl font-medium">Create New Article</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="heading"
            value={formData.heading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, heading: e.target.value }))
            }
            className="w-full px-4 py-2 border border-border rounded-md"
          />
          {errors.heading && (
            <span className="text-red-500 text-xs mt-1">{errors.heading}</span>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subtitle
          </label>
          <textarea
            id="subtitle"
            value={formData.subHeading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subHeading: e.target.value }))
            }
            className="w-full px-4 py-2 border border-border rounded-md"
          />
          {errors.subHeading && (
            <span className="text-red-500 text-xs mt-1">
              {errors.subHeading}
            </span>
          )}
        </div>

        {/* Main Image */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>

          {preview ? (
            <div className="mt-2 h-[20vh]">
              <Image
                src={preview}
                alt="Preview"
                width={350}
                height={350}
                className="w-full h-full object-contain rounded-md border border-border"
              />
            </div>
          ) : (
            <>
              <label
                htmlFor="image"
                className="h-[20vh] w-full border border-border rounded-lg flex flex-col items-center justify-center cursor-pointer text-gray-500"
              >
                <AiOutlineCloudUpload size={28} />
                <span className="text-sm">JPG or PNG (5 MB)</span>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {errors.image && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.image}
                </span>
              )}
            </>
          )}
        </div>
        <hr className="border border-border" />
        {/* Content Blocks */}
        <div className="mt-4">
          <div className="flex gap-2 flex-col mb-4">
            <h2 className="text-xl font-semibold">Article Content</h2>
            <p className="text-sm text-gray-500">
              Add and arrange content blocks. Drag to reorder them.{" "}
            </p>
          </div>

          <ContentBlockManager
            blocks={formData.articleContent}
            onBlocksChange={handleContentUpdate}
          />
          {errors.articleContent && (
            <span className="text-red-500 text-xs mt-1">
              {errors.articleContent}
            </span>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="py-6 border-t flex gap-2 justify-between">
          <button
            type="button"
            disabled={isSubmitting}
            className="border border-border bg-[#D9D9D970] text-secondary px-4 py-2 rounded-md cursor-pointer"
            onClick={() => router.push("/dashboard/articles")}
          >
            Cancel
          </button>
          <div className="flex gap-3 items-end justify-end w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-4 rounded-md cursor-pointer py-2 flex items-center gap-1.5"
            >
              <LuSend />
              {isSubmitting ? "Publishing Article..." : "Publish Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
