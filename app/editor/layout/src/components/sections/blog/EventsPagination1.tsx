"use client";

type EventsPagination1Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function EventsPagination1({
  currentPage,
  totalPages,
  onPageChange,
}: EventsPagination1Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d61b58]/40 text-[#d61b58] transition-colors hover:bg-[#fee4ee] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-[#d61b58] bg-[#d61b58] text-white"
                    : "border-[#d61b58]/40 text-[#d61b58] hover:bg-[#fee4ee]"
                }`}
              >
                {page}
              </button>
            );
          },
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d61b58]/40 text-[#d61b58] transition-colors hover:bg-[#fee4ee] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
