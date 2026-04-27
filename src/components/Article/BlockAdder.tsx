"use client";

import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { ContentBlockType } from "@/types";

const BLOCK_TYPES: {
  type: ContentBlockType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    type: "PARAGRAPH",
    label: "Paragraph",
    icon: "📝",
    description: "Add text content",
  },
  {
    type: "HEADING",
    label: "Heading",
    icon: "🔤",
    description: "Add a title or heading",
  },
  {
    type: "LIST",
    label: "List",
    icon: "📋",
    description: "Add bulleted or numbered list",
  },
  {
    type: "URL",
    label: "Image",
    icon: "🖼️",
    description: "Add an image with alt text",
  },
];

interface BlockAdderProps {
  onAddBlock: (type: ContentBlockType) => void;
}

export default function BlockAdder({ onAddBlock }: BlockAdderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="font-medium">Add Content Block</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-border rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BLOCK_TYPES.map((blockType) => (
                <button
                  key={blockType.type}
                  type="button"
                  onClick={() => {
                    onAddBlock(blockType.type);
                    setIsOpen(false);
                  }}
                  className="p-4 border border-border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{blockType.icon}</span>
                    <span className="font-medium">{blockType.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {blockType.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
