"use client";
import React from "react";

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  title: string;
  des: string;
  renderCell?: (value: any, key?: string) => React.ReactNode;
  loading?: boolean; // <-- add loading prop
}

const DataTable = <T extends { [key: string]: any }>({
  columns,
  data,
  actions,
  title,
  des,
  renderCell,
  loading = false,
}: TableProps<T>) => {
  const skeletonRows = 6;

  return (
    <section className="rounded-lg py-4 bg-white border border-border px-4 flex flex-col gap-4 md:h-[50vh] xl:h-[70vh] mt-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg text-primary font-bold">{title}</h1>
          <span className="text-base text-secondary">{des}</span>
        </div>
      </header>

      <div className="overflow-x-auto bg-white shadow rounded-lg flex-1">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: skeletonRows }).map((_, idx) => (
                <tr key={idx} className="border-b border-border animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-b border-border hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-gray-600"
                    >
                      {renderCell
                        ? renderCell(row[col.key], col.key)
                        : (row[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-sm cursor-pointer">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTable;
