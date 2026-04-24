import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  totalPages,
}: PaginationProps) => {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const count = 1;
  const totalPageNumbers = count * 2 + 3;

  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPaginationRange = () => {
    const shouldShowAllPages = totalPages <= totalPageNumbers;

    if (shouldShowAllPages) {
      return range(1, totalPages);
    }

    const leftside = Math.max(currentPage - count, 1);
    const rightside = Math.min(currentPage + count, totalPages);

    const shouldShowLeftDots = leftside > 2;
    const shouldShowRightDots = rightside < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = count + 3;
      return [...range(1, leftItemCount), "DOTS", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = count + 3;
      return [
        firstPageIndex,
        "DOTS",
        ...range(totalPages - rightItemCount + 1, totalPages),
      ];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        firstPageIndex,
        "DOTS",
        ...range(leftside, rightside),
        "DOTS",
        lastPageIndex,
      ];
    }

    return range(1, totalPages);
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex justify-between items-center 2xl:items-end px-2 pt-6 2xl:pt-8">
      <span className="text-xs 2xl:text-base text-secondary">
        Showing {currentPage} to {itemsPerPage} out of {totalPages} pages.
      </span>
      <nav className="flex items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center cursor-pointer 2xl:w-12 2xl:h-12 w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-base 2xl:text-xl" />
        </button>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "DOTS") {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(Number(pageNumber))}
              className={`flex items-center justify-center 2xl:h-11 2xl:w-11 w-9 h-9 rounded-lg text-sm 2xl:text-base font-medium cursor-pointer transition-colors
              ${
                currentPage === pageNumber
                  ? "bg-green-600 text-white border-green-600"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center cursor-pointer 2xl:w-12 2xl:h-12 w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
          aria-label="Next page"
        >
          <FaChevronRight className="text-base 2xl:text-lg" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
