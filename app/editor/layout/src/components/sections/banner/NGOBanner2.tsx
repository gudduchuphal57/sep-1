"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type CtaButton = {
  label?: string;
  href?: string;
  variant?: "primary" | "secondary" | string;
};

type NgoSlide = {
  title?: string;
  pretitle?: string;
  desc?: string;
  bgImageUrl?: string;
  image?: string;
  overlayOpacity?: number;
  ctaButtons?: CtaButton[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBanner2({ data = {} }: SectionProps) {
  const slides = useMemo<NgoSlide[]>(() => {
    const fromBannerSlides = Array.isArray(data.bannerSlides)
      ? data.bannerSlides
      : null;
    const fromSlides = Array.isArray(data.slides) ? data.slides : null;
    const fromBanner = Array.isArray(data.banner) ? data.banner : null;
    const raw = fromBannerSlides ?? fromSlides ?? fromBanner;

    if (raw && raw.length > 0) {
      return raw.map((slide) => {
        const s = (isRecord(slide) ? slide : {}) as NgoSlide & {
          button?: CtaButton;
          secondButton?: CtaButton;
        };
        const image = s.image ?? s.bgImageUrl ?? "";
        const hasDedicatedButtons = Boolean(s.button || s.secondButton);
        const ctaButtons = hasDedicatedButtons
          ? ([s.button, s.secondButton].filter(Boolean) as CtaButton[])
          : (s.ctaButtons ?? []);
        return {
          ...s,
          image,
          bgImageUrl: s.bgImageUrl ?? image,
          ctaButtons,
        };
      });
    }

    return [
      {
        title: typeof data.title === "string" ? data.title : undefined,
        pretitle: typeof data.pretitle === "string" ? data.pretitle : undefined,
        desc:
          typeof data.desc === "string"
            ? data.desc
            : typeof data.description === "string"
              ? data.description
              : undefined,
        bgImageUrl: data.backgroundImage,
        image: data.backgroundImage,
        overlayOpacity: 0.55,
        ctaButtons: (data.buttons ?? []).map((b) => ({
          label: b.label,
          href: b.href,
          variant: b.variant,
        })),
      },
    ];
  }, [data]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (totalSlides <= 1) return undefined;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [totalSlides]);

  if (!slides.length) return null;

  const slide = slides[currentSlide] ?? slides[0];
  const overlayOpacity = slide.overlayOpacity ?? 0.55;

  return (
    <section className="relative h-[470px] min-h-[470px] w-full overflow-hidden bg-black font-sans sm:h-[570px] sm:min-h-[570px]">
      {slides.map((banner, index) => {
        const src = banner.bgImageUrl ?? banner.image ?? "";
        return (
          <div
            key={`${src}-${index}`}
            className={`absolute inset-0 h-full w-full transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            {src ? (
              <Image
                src={src}
                alt={banner.title ?? "Banner slide"}
                fill
                priority={index === 0}
                unoptimized={isUnoptimizedImageSrc(src)}
                className="object-cover"
                sizes="100vw"
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={src}
              />
            ) : null}
          </div>
        );
      })}

      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-orange-950/20 via-transparent to-transparent"
        aria-hidden="true"
      />

      {totalSlides > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-2 sm:bottom-auto sm:left-3 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:gap-3 md:left-14">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-all duration-300 sm:h-5 sm:w-5 ${
                currentSlide === index
                  ? "border-[#ff521d]"
                  : "border-[#ff521d]/70 hover:border-[#ff521d]"
              }`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "h-1.5 w-1.5 bg-[#ff521d] sm:h-2.5 sm:w-2.5"
                    : "h-0 w-0"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-16 md:px-20">
        <div className="mx-auto flex h-full w-full max-w-[1000px] flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center">
            {slide.pretitle && (
              <div className="mb-1 font-serif text-xl font-medium leading-tight text-white sm:mb-2 sm:text-[48px] lg:text-[56px]">
                {slide.pretitle}
              </div>
            )}
            {slide.title && (
              <h1 className="max-w-[900px] font-serif text-2xl font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[52px] sm:leading-[1.05] lg:text-[64px] xl:text-[68px]">
                {slide.title}
              </h1>
            )}
            {slide.desc && (
              <p className="mt-2.5 line-clamp-2 max-w-[700px] text-[13px] font-normal leading-relaxed text-white/95 sm:mt-4 sm:line-clamp-none sm:text-[15px] lg:text-[16px]">
                {slide.desc}
              </p>
            )}
          </div>

          {slide.ctaButtons && slide.ctaButtons.length > 0 && (
            <div className="mt-5 flex w-full max-w-[500px] flex-nowrap items-center justify-center gap-2.5 px-2 sm:mt-6 sm:gap-4">
              {slide.ctaButtons.map((cta, index) => {
                const isPrimary = cta.variant === "primary" || !cta.variant;
                return (
                  <Link
                    key={`${cta.href}-${index}`}
                    href={cta.href || "#"}
                    className={`inline-flex h-[40px] min-w-0 flex-1 items-center justify-center rounded-full px-3.5 text-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-[52px] sm:min-w-[190px] sm:flex-initial sm:px-7 sm:text-[16px] ${
                      isPrimary
                        ? "bg-[#ff521d] font-bold text-white"
                        : "bg-[#3d376d] font-medium text-white"
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">
                      {cta.label}
                    </span>
                    <span className="ml-1.5 text-[15px] font-normal leading-none sm:ml-2.5 sm:text-[20px]">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {totalSlides > 1 && (
        <div className="absolute bottom-5 right-4 z-30 hidden items-center gap-2 sm:bottom-8 sm:right-8 sm:flex sm:gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="group flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/25 bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/15"
          >
            <ChevronLeft
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="group flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/25 bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/15"
          >
            <ChevronRight
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      )}
    </section>
  );
}
