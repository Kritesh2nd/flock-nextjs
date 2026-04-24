// components/TableSkeleton.tsx
import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showPagination?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 7,
  columns = 6,
  showHeader = true,
  showPagination = true,
}) => {
  return (
    <div className="w-full animate-pulse">
      {/* Table */}
      <div className="overflow-hidden rounded- border border-gray-200">
        {/* Header */}
        {showHeader && (
          <div className="flex items-center border-b border-border bg-gray-50 px-4 py-3 h-15">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`header-${colIndex}`}
                className={`h-4 rounded bg-gray-300 ${
                  colIndex === 0
                    ? "w-[5%]"
                    : colIndex === 1
                      ? "w-[20%]"
                      : colIndex === 2
                        ? "w-1/5"
                        : "w-1/6"
                } ${colIndex < columns - 1 ? "mr-4" : ""}`}
              ></div>
            ))}
          </div>
        )}

        {/* Body Rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex items-center px-4 py-4 h-15"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`h-3 rounded ${
                    colIndex === 0
                      ? "w-[5%] bg-gray-200"
                      : colIndex === 1
                        ? "w-[20%] bg-gray-200"
                        : colIndex === 2
                          ? "w-1/5 bg-gray-200"
                          : "w-1/6 bg-gray-200"
                  } ${colIndex < columns - 1 ? "mr-4" : ""}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="mt-2 flex items-center justify-between w-full">
          <div className="w-30 h-4 bg-gray-200 rounded-sm" />
          <div className="flex space-x-2">
            <div className="h-10 rounded-md w-10 bg-gray-200"></div>
            <div className="h-10 rounded-md w-10 bg-gray-200"></div>
            <div className="h-10 rounded-md w-10 bg-gray-200"></div>
            <div className="h-10 rounded-md w-10 bg-gray-200"></div>
            <div className="h-10 rounded-md w-10 bg-gray-200"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;
