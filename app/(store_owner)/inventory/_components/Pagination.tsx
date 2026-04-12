"use client";

import { cn } from "@/app/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center gap-3 justify-between bg-muted/20 border-t border-border/50">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        Showing {start}–{end} of {totalItems} Products
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground disabled:opacity-30 hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all",
              page === currentPage
                ? "editorial-gradient text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:bg-primary/5"
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground disabled:opacity-30 hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
