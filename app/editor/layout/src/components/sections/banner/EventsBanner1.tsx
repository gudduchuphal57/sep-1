"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { BannerSlideData, ButtonData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type Slide = BannerSlideData & { secondButton?: ButtonData };

export default function EventsBanner1({ data = {} }: SectionProps) {
  const slides = useMemo<Slide[]>(() => {
    if (Array.isArray(data.bannerSlides)) {
      if (data.bannerSlides.length === 0) return [];

      return data.bannerSlides.map((slide) => ({
        ...slide,
        image: slide.image ?? data.backgroundImage ?? "",
        video: slide.video ?? data.backgroundVideo,
        alt: slide.alt ?? data.backgroundImageTitle ?? "Banner slide",
        title: slide.title ?? data.title ?? "",
        desc: slide.desc ?? data.desc,
        button: slide.button ?? data.buttons?.[0],
        secondButton: slide.secondButton ?? data.buttons?.[1],
      }));
    }

    return [
      {
        image: data.backgroundImage ?? "",
        video: data.backgroundVideo,
        alt: data.backgroundImageTitle ?? "Background",
        title: data.title ?? "",
        desc: data.desc,
        button: data.buttons?.[0],
        secondButton: data.buttons?.[1],
      },
    ];
  }, [data]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const goToSlide = (nextIndex: number) => {
    setActiveIndex((current) => {
      if (current === nextIndex) return current;
      setPrevIndex(current);
      return nextIndex;
    });
  };

  const goToPrev = () => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % slides.length;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const isVideo = data.bannerBackgroundMode === "video";

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden font-sans"
      style={{ height: `${data.bannerHeight ?? 100}vh` }}
    >
      {slides.map((slide, index) => {
        const base =
          "absolute inset-0 transition-transform transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";
        const positionClass =
          index === activeIndex
            ? "translate-x-0 opacity-100 z-20"
            : index === prevIndex
              ? "-translate-x-full opacity-0 z-20"
              : "translate-x-full opacity-0 z-0";

        return (
          <div
            key={index}
            className={`${base} ${positionClass}`}
            aria-hidden={index !== activeIndex}
          >
            {isVideo && slide.video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={slide.image}
                data-editor-media
                data-editor-media-type="video"
                data-editor-media-src={slide.video}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={slide.video} />
              </video>
            ) : slide.image ? (
              <Image
                src={slide.image}
                alt={slide.alt ?? "Banner slide"}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={slide.image}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
                unoptimized={isUnoptimizedImageSrc(slide.image)}
              />
            ) : null}
          </div>
        );
      })}

      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

      <div className="relative z-30 mx-auto flex h-full w-full max-w-7xl items-center px-6 py-10 lg:px-8">
        <div className="max-w-3xl space-y-3 text-white">
          {activeSlide?.pretitle && (
            <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d7e]" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/90">
                {activeSlide.pretitle}
              </span>
            </div>
          )}

          {activeSlide?.title && (
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl sm:leading-[1.04] md:text-5xl md:leading-[1.02] lg:text-6xl">
              {activeSlide.title}
            </h1>
          )}

          {activeSlide?.desc && (
            <p className="max-w-2xl text-base font-normal text-white sm:text-lg md:text-xl lg:text-xl">
              {activeSlide.desc}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {(() => {
              const primaryBtn = activeSlide?.button ?? data.buttons?.[0];

              return primaryBtn ? (
                <Link href={primaryBtn.href ?? "#"}>
                  <button className="cursor-pointer rounded-[20px] bg-[#ff2d70] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#ff2d70]/30 transition hover:bg-[#d61b58] sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3 md:text-base">
                    {primaryBtn.label}
                  </button>
                </Link>
              ) : null;
            })()}

            {(() => {
              const secondaryBtn = activeSlide?.secondButton ?? data.buttons?.[1];

              return secondaryBtn ? (
                <Link href={secondaryBtn.href ?? "#"}>
                  <button className="cursor-pointer rounded-[20px] bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ff2d70] hover:text-white sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3 md:text-base">
                    {secondaryBtn.label}
                  </button>
                </Link>
              ) : null;
            })()}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:left-4 sm:h-11 sm:w-11 md:left-6 md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:right-4 sm:h-11 sm:w-11 md:right-6 md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}
    </div>
  );
}
