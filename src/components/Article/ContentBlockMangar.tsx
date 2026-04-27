"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ContentBlock, ContentBlockType } from "@/types";
import BlockAdder from "./BlockAdder";
import ContentBlockItem from "./ContentBlockItem";

interface ContentBlockManagerProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  onBlockDelete?: (id: number) => void;
}

export default function ContentBlockManager({
  blocks,
  onBlocksChange,
  onBlockDelete,
}: ContentBlockManagerProps) {
  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: -Date.now(),
      type,
      content: "",
      config:
        type === "HEADING"
          ? { level: 2 }
          : type === "LIST"
            ? { listType: "unordered" }
            : type === "URL"
              ? { alt: "" }
              : // : type === "link"
                //   ? { url: "" }
                undefined,
    };

    onBlocksChange([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id: number, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...updates } : block,
    );
    onBlocksChange(updatedBlocks);
  };

  const handleDeleteBlock = (id: number) => {
    if (onBlockDelete) onBlockDelete(id);

    const filteredBlocks = blocks.filter((block) => block.id !== id);
    onBlocksChange(filteredBlocks);
  };

  const handleDuplicateBlock = (id: number) => {
    const blockToDuplicate = blocks.find((block) => block.id === id);
    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: -Date.now(),
        content:
          blockToDuplicate.type === "URL" ? "" : blockToDuplicate.content,
      };
      const index = blocks.findIndex((block) => block.id === id);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, duplicatedBlock);
      onBlocksChange(newBlocks);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedBlocks = Array.from(blocks);
    const [removed] = reorderedBlocks.splice(result.source.index, 1);
    reorderedBlocks.splice(result.destination.index, 0, removed);

    onBlocksChange(reorderedBlocks);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable
                  key={`${block.id}-${index}`}
                  draggableId={String(block.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative group"
                    >
                      <ContentBlockItem
                        block={block}
                        onUpdate={(updates) =>
                          handleUpdateBlock(block.id, updates)
                        }
                        onDelete={() => handleDeleteBlock(block.id)}
                        onDuplicate={() => handleDuplicateBlock(block.id)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">
            No content blocks yet. Add your first block!
          </p>
        </div>
      )}

      <BlockAdder onAddBlock={handleAddBlock} />

      <div className="text-sm text-gray-500 mt-4">
        {blocks.length} block{blocks.length !== 1 ? "s" : ""} added
      </div>
    </div>
  );
}
