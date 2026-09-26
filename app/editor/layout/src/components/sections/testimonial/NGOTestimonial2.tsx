"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import { FaRegStar, FaStar } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type TestimonialItem = {
  name?: string;
  designation?: string;
  image?: string;
  rating?: number;
  message?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const STAR_COUNT = 5;

const getStarRating = (value?: number) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return STAR_COUNT;
  return Math.min(STAR_COUNT, Math.max(0, Math.round(raw)));
};

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  if (typeof value.title === "string") return value.title;
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOTestimonial2({ data = {} }: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Testimonials");
  const title = toTitleText(data.title);
  const description =
    typeof data.desc === "string"
      ? data.desc
      : typeof data.description === "string"
        ? data.description
        : undefined;
  const testimonials = (Array.isArray(data.testimonials)
    ? data.testimonials
    : Array.isArray(data.items)
      ? data.items
      : []) as TestimonialItem[];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      testimonials.length === 0
        ? 0
        : prev === testimonials.length - 1
          ? 0
          : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      testimonials.length === 0
        ? 0
        : prev === 0
          ? testimonials.length - 1
          : prev - 1,
    );
  };

  useEffect(() => {
    if (testimonials.length <= 1) return undefined;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  const active = testimonials[currentIndex] ?? testimonials[0];
  const imgSrc = active.image ?? "";

  return (
    <section
      data-editor-section-label="Testimonial Content"
      data-editor-fields="pretitle title desc testimonials"
      className="relative overflow-hidden bg-[#fafafa] px-0 pb-10 pt-0 font-sans"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-100/60 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-sm" />
            <span>{pretitle}</span>
          </div>
          {title ? (
            <h2 className="font-serif text-3xl font-extrabold text-[#0F172A] sm:text-4xl md:mt-1 md:tracking-tight lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="relative mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50 sm:p-10 md:mt-12 md:p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] opacity-40 [background-size:12px_12px]" />

          <div className="relative z-10 grid grid-cols-1 items-stretch gap-2 md:gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col items-center justify-center text-center lg:col-span-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-orange-50 sm:h-36 sm:w-36">
                {imgSrc && (
                  <Image
                    src={imgSrc}
                    alt={active.name ?? "Testimonial"}
                    fill
                    sizes="144px"
                    className="object-cover"
                    unoptimized={isUnoptimizedImageSrc(imgSrc)}
                  />
                )}
              </div>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#1E1B4B] md:mt-4">
                {active.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {active.designation || "Charity Bingo"}{" "}
                <span className="text-[#FF4500]">Canada</span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {Array.from({ length: STAR_COUNT }).map((_, i) =>
                  i < getStarRating(active.rating) ? (
                    <FaStar key={i} className="text-sm text-amber-400" />
                  ) : (
                    <FaRegStar key={i} className="text-sm text-slate-300" />
                  ),
                )}
              </div>
            </div>

            <div className="mx-auto hidden h-auto w-[1px] border-r border-dashed border-slate-200 lg:col-span-1 lg:block" />

            <div className="flex flex-col justify-between lg:col-span-7">
              <div className="flex min-h-[160px] flex-1 flex-col sm:min-h-[140px]">
                {active.message ? (
                  <p className="h-64 overflow-hidden text-sm leading-relaxed text-slate-600 sm:h-36">
                    {active.message}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex items-center justify-center gap-10 pt-4 md:justify-start md:gap-3">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-[#FF4500] hover:bg-[#FF4500] hover:text-white hover:shadow-md"
                >
                  <FiArrowLeft className="text-base" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-[#FF4500] hover:bg-[#FF4500] hover:text-white hover:shadow-md"
                >
                  <FiArrowRight className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
