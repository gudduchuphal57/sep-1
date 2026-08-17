"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

import type { GalleryImageData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { useOptionalPreview } from "../../context/PreviewContext";
import EventsGalleryPreview from "./EventsGalleryPreview";

const iconMap: Record<string, LucideIcon> = {
  IconArrowRight: ArrowRight,
  IconSparkles: Sparkles,
};

const renderIcon = (iconName: string | undefined, className: string) => {
  const IconComp = (iconName && iconMap[iconName]) || ArrowRight;
  return <IconComp className={className} aria-hidden />;
};

export default function EventsGallery1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const images = (data.images ?? []) as GalleryImageData[];
  const cta = data.cta;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewContext = useOptionalPreview();
  const canOpenPreview = previewContext?.isPreview ?? true;
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const previewImages = images
    .map((image) => image.src ?? image.image ?? "")
    .filter(Boolean);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const showSection = () => setIsVisible(true);
    showSection();
    const fallbackTimer = window.setTimeout(showSection, 250);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showSection();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative mt-8 w-full overflow-hidden md:mt-10 lg:mt-14"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, idx) => {
            const src = image.src ?? image.image ?? "";

            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => {
                  if (canOpenPreview) setPreviewIndex(idx);
                }}
                aria-label={image.alt ?? image.title ?? "Gallery image"}
                className={`block w-full overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white text-left shadow-[0_25px_80px_-45px_rgba(214,27,88,0.35)] transition duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                } hover:-translate-y-1`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="group relative h-72 overflow-hidden sm:h-80">
                  {src ? (
                    <Image
                      src={src}
                      alt={image.alt ?? "Gallery image"}
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={src}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width:1024px) 100vw, 33vw"
                      unoptimized={isUnoptimizedImageSrc(src)}
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {cta?.label && (
          <div className="mt-10 flex justify-center">
            <Link
              href={cta.href ?? "/gallery"}
              className="group inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full bg-[#d61b58] px-6 text-sm font-semibold text-white shadow-xl shadow-[#d61b58]/10 transition hover:bg-[#b01648]"
            >
              {cta.label}
              <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-3">
                {renderIcon(cta.icon, "h-4 w-4")}
              </span>
            </Link>
          </div>
        )}
      </div>

      {previewIndex !== null && previewImages.length > 0 && (
        <EventsGalleryPreview
          images={previewImages}
          activeIndex={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </section>
  );
}
