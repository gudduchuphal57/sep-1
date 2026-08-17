"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { isUnoptimizedImageSrc } from "../../../lib/media";

export type EventsGalleryPreviewProps = {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export default function EventsGalleryPreview({
  images,
  activeIndex,
  onIndexChange,
  onClose,
}: EventsGalleryPreviewProps) {
  const total = images.length;
  const safeIndex = total ? ((activeIndex % total) + total) % total : 0;
  const currentImage = images[safeIndex];

  const showPrev = useCallback(() => {
    if (!total) return;
    onIndexChange((safeIndex - 1 + total) % total);
  }, [onIndexChange, safeIndex, total]);

  const showNext = useCallback(() => {
    if (!total) return;
    onIndexChange((safeIndex + 1) % total);
  }, [onIndexChange, safeIndex, total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, showNext, showPrev]);

  if (typeof document === "undefined" || !currentImage) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex select-none items-center justify-center overflow-hidden bg-[#030712]/95"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-white/10 active:scale-95"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showPrev();
          }}
          aria-label="Previous image"
          className="absolute left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        className="relative flex h-[85vh] w-full max-w-4xl items-center justify-center px-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-full w-full">
          <Image
            src={currentImage}
            alt={`Gallery preview image ${safeIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            unoptimized={isUnoptimizedImageSrc(currentImage)}
          />
        </div>
      </div>

      {total > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showNext();
          }}
          aria-label="Next image"
          className="absolute right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-white/10 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {total > 1 && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold text-white">
          {safeIndex + 1} / {total}
        </p>
      )}
    </div>,
    document.body,
  );
}
