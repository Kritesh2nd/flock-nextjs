"use client";

import { ContentBlock } from "@/types";
import { getArticleImageUrl } from "@/utils/imageHelper";
import {
  DragHandleDots2Icon,
  TrashIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface ContentBlockItemProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps: any;
}

export default function ContentBlockItem({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
}: ContentBlockItemProps) {
  const handleRemoveImage = () => {
    if (block.config?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(block.config.previewUrl);
    }

    onUpdate({
      config: {
        ...block.config,
        file: undefined,
        previewUrl: "",
      },
      content: "",
    });
  };

  const handleImageValidation = (file: File) => {
    const maxSizeMB = 5;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, or WEBP images are allowed.";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Image must be less than ${maxSizeMB}MB.`;
    }

    return null;
  };
  const renderBlockInput = () => {
    switch (block.type) {
      case "HEADING":
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Heading Level:</label>
              <select
                value={block.config?.level || 2}
                onChange={(e) =>
                  onUpdate({
                    config: {
                      ...block.config,
                      level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
                    },
                  })
                }
                className="px-2 py-1 border border-border rounded text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded text-xl font-semibold"
              placeholder="Enter heading text"
            />
          </div>
        );

      case "PARAGRAPH":
        return (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded min-h-[100px]"
            placeholder="Enter paragraph text"
            rows={4}
          />
        );

      case "LIST":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">List Type:</label>
              <select
                value={block.config?.listType || "unordered"}
                onChange={(e) =>
                  onUpdate({
                    config: {
                      ...block.config,
                      listType: e.target.value as "ordered" | "unordered",
                    },
                  })
                }
                className="px-2 py-1 border border-border rounded text-sm"
              >
                <option value="unordered">Bulleted</option>
                <option value="ordered">Numbered</option>
              </select>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded min-h-[100px]"
              placeholder="Enter list items (one per line)"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Enter each list item on a new line
            </p>
          </div>
        );

      case "URL":
        return (
          <div className="space-y-3">
            {/* File input */}

            {/* Preview */}
            {block.config?.previewUrl ? (
              <div className="mt-2 h-[20vh] relative">
                <Image
                  src={
                    block.config?.previewUrl?.startsWith("blob:")
                      ? block.config.previewUrl
                      : getArticleImageUrl(block.config?.previewUrl)
                  }
                  height={200}
                  width={300}
                  alt={block.config?.alt || "Image preview"}
                  className="h-full w-full rounded border object-contain"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm cursor-pointer"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <input
                  id={`image-${block.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const error = handleImageValidation(file);
                    if (error) {
                      toast.error(error);
                      e.target.value = "";
                      return;
                    }
                    const previewUrl = URL.createObjectURL(file);

                    onUpdate({
                      config: {
                        ...block.config,
                        file,
                        previewUrl,
                      },
                      content: "",
                    });
                  }}
                  className="w-full hidden px-3 py-2 border border-border rounded"
                />
                <label
                  htmlFor={`image-${block.id}`}
                  className="h-[20vh] w-full border border-border rounded-lg flex flex-col items-center justify-center cursor-pointer text-gray-500"
                >
                  <AiOutlineCloudUpload size={28} />
                  <span className="text-sm">JPG or PNG (5 MB)</span>
                </label>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-move p-1 hover:bg-gray-100 rounded"
          >
            <DragHandleDots2Icon className="w-5 h-5 text-gray-400" />
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            {block?.type?.toUpperCase() || "PARAGRAPH"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <CopyIcon className="w-4 h-4 text-gray-600 cursor-pointer" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 hover:bg-red-50 rounded text-red-600"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {renderBlockInput()}
    </div>
  );
}
