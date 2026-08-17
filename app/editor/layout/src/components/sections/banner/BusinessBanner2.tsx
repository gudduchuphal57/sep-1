"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { SectionProps } from "../../../types/section";

export default function BusinessBanner2({ data = {} }: SectionProps) {
  const slides = data.bannerSlides ?? [];
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex];
  const hasSlider = slides.length > 1;
  const isVideo = data.bannerBackgroundMode === "video";
  const mediaImage = activeSlide?.image ?? data.backgroundImage;
  const mediaVideo = activeSlide?.video ?? data.backgroundVideo;
  const mediaAlt =
    activeSlide?.alt ?? data.backgroundImageTitle ?? data.title ?? "";
  const buttons = data.buttons ?? [];
  const badge = typeof data.badge === "string" ? data.badge : "";
  const decorativeNumber =
    typeof data.decorativeNumber === "string" ? data.decorativeNumber : "";
  const background =
    data.bannerBackgroundMode === "gradient"
      ? `linear-gradient(135deg, ${
          data.bannerBackgroundColor ?? "#f4f0e8"
        }, ${data.bannerGradientColor ?? "#f4f0e8"})`
      : data.bannerBackgroundMode === "solid"
        ? (data.bannerBackgroundColor ?? "#f4f0e8")
        : "#f4f0e8";

  const selectPreviousSlide = () => {
    setActiveSlideIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  };

  const selectNextSlide = () => {
    setActiveSlideIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="grid w-full overflow-hidden lg:grid-cols-2"
      style={{
        minHeight: `${data.bannerHeight ?? 70}dvh`,
        background,
      }}
    >
      <div className="relative min-h-[380px]">
        {isVideo && mediaVideo ? (
          <video
            key={`${mediaVideo}-${activeSlideIndex}`}
            autoPlay
            loop
            muted
            playsInline
            poster={mediaImage}
            data-editor-media
            data-editor-media-type="video"
            data-editor-media-src={mediaVideo}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={mediaVideo} />
          </video>
        ) : mediaImage ? (
          <Image
            key={`${mediaImage}-${activeSlideIndex}`}
            src={mediaImage}
            alt={mediaAlt}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={mediaImage}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized={mediaImage.startsWith("data:")}
            className="object-cover"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-6 border border-white/55" />

        {badge && (
          <div className="absolute right-0 top-12 bg-[#ff5d3b] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white">
            {badge}
          </div>
        )}

        {hasSlider && (
          <>
            <button
              type="button"
              onClick={selectPreviousSlide}
              className="absolute left-8 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-[#102a43] shadow-lg transition hover:bg-white"
              aria-label="Previous banner slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={selectNextSlide}
              className="absolute right-8 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-[#102a43] shadow-lg transition hover:bg-white"
              aria-label="Next banner slide"
            >
              ›
            </button>
            <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.image}-${index}`}
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlideIndex
                      ? "w-8 bg-[#ff5d3b]"
                      : "w-2.5 bg-white/80"
                  }`}
                  aria-label={`Go to banner slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
        {decorativeNumber && (
          <span className="absolute right-8 top-8 text-8xl font-black leading-none text-[#102a43]/5">
            {decorativeNumber}
          </span>
        )}

        {data.pretitle && (
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-[#ff5d3b]">
            {data.pretitle}
          </p>
        )}

        {data.title && (
          <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.035em] text-[#102a43] sm:text-5xl xl:text-6xl">
            {data.title}
          </h1>
        )}

        {data.desc && (
          <p className="mt-7 max-w-xl border-l-4 border-[#ff5d3b] pl-5 text-base leading-7 text-[#536475]">
            {data.desc}
          </p>
        )}

        {buttons.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {buttons.map((button, index) => (
              <Link
                key={`${button.label}-${index}`}
                href={button.href}
                className={
                  button.variant === "secondary"
                    ? "inline-flex border border-[#102a43] px-6 py-3 text-sm font-bold text-[#102a43]"
                    : "inline-flex bg-[#102a43] px-6 py-3 text-sm font-bold text-white"
                }
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
