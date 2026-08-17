"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const wordContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const wordReveal = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.75, ease },
  },
};

function RevealWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={className}
      variants={wordContainer}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em]"
        >
          <motion.span className="inline-block" variants={wordReveal}>
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

const bypassImageOptimization = (src: string) =>
  src.startsWith("data:") ||
  src.startsWith("http://") ||
  src.startsWith("https://");

export default function RealEstateBanner1({
  data = {},
}: SectionProps) {
  const slides = useMemo(
    () =>
      data.bannerSlides?.length
        ? data.bannerSlides.slice(0, 3)
        : [
          {
            image: data.backgroundImage ?? "",
            alt: data.backgroundImageTitle ?? data.title ?? "",
            title: data.title ?? "",
            desc: data.desc,
            button: data.buttons?.[0],
          },
        ],
    [
      data.backgroundImage,
      data.backgroundImageTitle,
      data.bannerSlides,
      data.buttons,
      data.desc,
      data.title,
    ],
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = slides[activeSlide] ?? slides[0];
  const currentImage = currentSlide?.image || data.backgroundImage || "";
  const currentTitle = currentSlide?.title || data.title || "";
  const currentDescription = currentSlide?.desc || data.desc;
  const primary = currentSlide?.button ?? data.buttons?.[0];
  const secondary = data.buttons?.[1];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative isolate h-[calc(100svh-4rem)] w-full overflow-hidden bg-[#141414] md:h-[calc(100svh-14rem)]" style={{height: `${data.bannerHeight ?? 70}vh`,}}>
      <motion.div
        key={currentImage}
        className="absolute inset-0"
        initial={{ opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.35, ease }}
      >
        {currentImage && (
          <Image
            src={currentImage}
            alt={currentSlide?.alt || data.backgroundImageTitle || currentTitle}
            fill
            priority
            sizes="100vw"
            unoptimized={bypassImageOptimization(currentImage)}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={currentImage}
            className="object-cover object-[55%_center] sm:object-center"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/50 to-transparent" />

      <motion.div
        className="relative z-2 flex h-full w-full flex-col justify-center overflow-hidden px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-[11px]"
            >
              {data.pretitle}
            </motion.p>

            {currentTitle && (
              <RevealWords
                key={currentTitle}
                text={currentTitle}
                className="mt-3 text-[1.6rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white min-[380px]:text-[1.85rem] sm:mt-4 sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem]"
              />
            )}

            {currentDescription && (
              <motion.p
                variants={fadeUp}
                className="mt-3 max-w-70 text-[13px] leading-relaxed text-white/85 sm:mt-4 sm:max-w-lg sm:text-sm md:text-base"
              >
                {currentDescription}
              </motion.p>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3"
            >
              {primary && (
                <Link
                  href={primary.href}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#141414] transition hover:bg-white/90 sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                >
                  {primary.label}
                </Link>
              )}
              {secondary && (
                <Link
                  href={secondary.href}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/80 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                >
                  {secondary.label}
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setActiveSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
              )
            }
            className="absolute left-2 top-[35%] z-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-3 sm:top-[42%] sm:h-9 sm:w-9 md:left-6 md:h-11 md:w-11"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2 top-[35%] z-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-3 sm:top-[42%] sm:h-9 sm:w-9 md:right-6 md:h-11 md:w-11"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-sm" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-5 flex -translate-x-1/2 gap-2 sm:bottom-8">
            {slides.map((slide, index) => (
              <button
                key={`${slide.title}-${index}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition ${activeSlide === index ? "w-8 bg-white" : "w-2 bg-white/45"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

    </section>
  );
}
