"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById } from "../action";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { PiNewspaper } from "react-icons/pi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiDraftLine } from "react-icons/ri";
import { LuSend } from "react-icons/lu";
import axiosInstance from "@/lib/axios.utils";
import ContentBlockManager from "@/components/Article/ContentBlockMangar";
import { getArticleImageUrl } from "@/utils/imageHelper";

export default function EditArticleForm() {
  const { id } = useParams();
  const articleId = Number(id);
  const router = useRouter();

  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    image: null as File | string | null,
    articleContent: [] as any[],
  });
  const [deletedBlockIds, setDeletedBlockIds] = useState<number[]>([]);

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const article = await getArticleById(articleId);
      if (!article) {
        toast.error("Article not found");
        router.push("/dashboard/articles");
        return;
      }

      const articleContent = Array.isArray(article.articleContent)
        ? article.articleContent.map((block: any, index: number) => {
            let blockType = "PARAGRAPH";
            const contentType = String(block.contentType || "").toUpperCase();

            if (contentType.startsWith("H") && /^H[1-6]$/.test(contentType)) {
              blockType = "HEADING";
            } else if (contentType === "PARAGRAPH") {
              blockType = "PARAGRAPH";
            } else if (contentType === "LIST") {
              blockType = "LIST";
            } else if (contentType === "URL") {
              blockType = "URL";
            }

            const levelMatch = contentType.match(/^H([1-6])$/);
            const level = levelMatch ? parseInt(levelMatch[1]) : 2;
            const url =
              blockType === "URL"
                ? block.content || block.config?.url || ""
                : "";

            return {
              id: block.id,
              type: blockType,
              content: block.content || "",
              config: {
                level: block.config?.level || level,
                listType: block.config?.listType || "unordered",
                alt: block.config?.alt || "",
                url: url,
                file: null as File | null,
                previewUrl: url,
              },
            };
          })
        : [];

      let imageUrl = article.imageUrl || null;
      if (imageUrl && typeof imageUrl === "string") {
        imageUrl = imageUrl.replace("{undefined}", "");
        imageUrl = imageUrl.replace(/^\/+/, "");
      }

      setFormData({
        heading: article.heading || "",
        subHeading: article.subHeading || "",
        image: imageUrl,
        articleContent,
      });

      if (imageUrl) {
        setPreview(imageUrl);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to load article");
      router.push("/dashboard/articles");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  const handleContentUpdate = (blocks: any[]) => {
    setFormData((prev) => ({ ...prev, articleContent: blocks }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const turn = (type: string, level: any) => {
    if (type !== "HEADING") return type;

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

      if (
        block.type === "URL" &&
        !block.config?.file &&
        !block.config?.url &&
        !block.content
      ) {
        newErrors[`block-${index}`] = "Image or URL is required";
      }
    });

    if (formData.image && formData.image instanceof File) {
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
          const blockPayload: any = {
            content: block.content || "",
            contentType: turn(block.type, block.config?.level),
            order: i,
          };

          if (block.type === "URL") {
            if (block.config?.file instanceof File) {
              blockPayload.content = "";
            } else {
              blockPayload.content =
                block.config?.url || block.config?.previewUrl || "";
            }
          }

          if (typeof block.id === "number" && block.id > 0) {
            blockPayload.id = block.id;
          }

          return blockPayload;
        }),

        contentDeletionIds: deletedBlockIds,
      };

      await axiosInstance.patch(`/article/update/${articleId}`, payload);

      const hasNewMainImage = formData.image instanceof File;
      const hasNewContentImages = (formData.articleContent || []).some(
        (block: any) =>
          block.type === "URL" && block.config?.file instanceof File,
      );

      if (hasNewMainImage || hasNewContentImages) {
        const imageForm = new FormData();

        if (formData.image instanceof File) {
          imageForm.append("mainImage", formData.image);
        }
        const existingImages: string[] = [];

        formData.articleContent.forEach((block) => {
          if (block.type === "URL") {
            if (block.config.file instanceof File) {
              imageForm.append("articleImages", block.config.file);
            } else if (block.config.previewUrl) {
              existingImages.push(block.config.previewUrl);
            }
          }
        });

        await axiosInstance.post(
          `/article/add-update-images/${articleId}`,
          imageForm,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      toast.success("Article updated!");
      router.push("/dashboard/articles");
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update article";
      toast.error(errorMessage);
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
        <h1 className="text-2xl font-medium">Edit Article</h1>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="bg-gray-100 h-5 w-20 rounded-lg" />
            <div className="bg-gray-200 w-full h-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 h-5 w-20 rounded-lg" />
            <div className="bg-gray-200 w-full h-20 rounded-lg" />
          </div>{" "}
          <div className="space-y-2">
            <div className="bg-gray-100 h-5 w-20 rounded-lg" />
            <div className="bg-gray-200 w-full h-30 rounded-lg" />
          </div>{" "}
          <div className="space-y-2">
            <div className="bg-gray-100 h-5 w-20 rounded-lg" />
            <div className="bg-gray-200 w-full h-30 rounded-lg" />
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.heading && (
              <span className="text-red-500 text-xs mt-1">
                {errors.heading}
              </span>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subtitle *
            </label>
            <textarea
              id="subtitle"
              value={formData.subHeading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subHeading: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
              <div className="relative mt-2 h-[20vh]">
                <img
                  src={
                    preview?.startsWith("blob:")
                      ? preview
                      : getArticleImageUrl(preview)
                  }
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md border border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm cursor-pointer"
                >
                  ×
                </button>
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
                Add and arrange content blocks. Drag to reorder them.
              </p>
            </div>

            <ContentBlockManager
              blocks={formData.articleContent}
              onBlocksChange={handleContentUpdate}
              onBlockDelete={(id: number) => {
                if (id > 0) setDeletedBlockIds((prev) => [...prev, id]);
              }}
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
                {isSubmitting ? "Updating Article..." : "Update Article"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
