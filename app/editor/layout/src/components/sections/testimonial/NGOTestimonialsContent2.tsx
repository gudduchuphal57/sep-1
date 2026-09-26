"use client";

import Image from "next/image";
import { FaQuoteLeft, FaRegStar, FaStar } from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type TestimonialItem = {
  name?: string;
  designation?: string;
  image?: string;
  rating?: number;
  message?: string;
};

const STAR_COUNT = 5;

const getStarRating = (value?: number) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return STAR_COUNT;
  return Math.min(STAR_COUNT, Math.max(0, Math.round(raw)));
};

const toPlain = (value: unknown) => {
  if (typeof value === "string") return value.trim();
  if (!isRecord(value)) return "";
  return [value.line1, value.highlight, value.line2, value.part1, value.part2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOTestimonialsContent2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : {};
  const titleObject = isRecord(data.title) ? data.title : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof badge.label === "string" && badge.label) ||
    "Testimonials";
  const line1 =
    (typeof data.line1 === "string" && data.line1.trim()) ||
    (typeof titleObject.line1 === "string" && titleObject.line1.trim()) ||
    "";
  const highlight =
    (typeof data.highlight === "string" && data.highlight.trim()) ||
    (typeof titleObject.highlight === "string" && titleObject.highlight.trim()) ||
    "";
  const pageTitle =
    typeof data.title === "string" ? data.title.trim() : toPlain(data.title);
  const isBannerTitle = pageTitle.toLowerCase() === "testimonial";
  const title =
    [line1, highlight].filter(Boolean).join(" ").trim() ||
    (!isBannerTitle ? pageTitle : "") ||
    "Don't Believe Us? See Review";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const testimonials = (
    Array.isArray(data.testimonials)
      ? data.testimonials
      : Array.isArray(data.items)
        ? data.items
        : []
  ) as TestimonialItem[];

  return (
    <section
      data-editor-section-label="Testimonial Content"
      data-editor-fields="pretitle title highlight desc testimonials"
      data-editor-card-fields="image name designation rating message"
      className="relative py-8 font-sans md:py-12"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-orange-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-orange-100/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            {line1 || (!highlight ? title : "")}{" "}
            {highlight ? (
              <span className="text-[#FF4500]">{highlight}</span>
            ) : null}
          </h2>
          {description ? (
            <p className="mx-auto mt-0 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {testimonials.length ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {testimonials.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100/50">
                      <FaQuoteLeft className="text-2xl text-[#FF4500]" />
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: STAR_COUNT }).map((_, i) =>
                        i < getStarRating(item.rating) ? (
                          <FaStar key={i} className="text-sm text-[#FF4500]" />
                        ) : (
                          <FaRegStar key={i} className="text-sm text-slate-300" />
                        ),
                      )}
                    </div>
                  </div>
                  {item.message ? (
                    <p className="mt-6 text-sm font-normal leading-relaxed text-slate-600">
                      {item.message}
                    </p>
                  ) : null}
                </div>
                <div className="mt-8 flex items-center gap-3.5 pt-2">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || "Reviewer"}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={isUnoptimizedImageSrc(item.image)}
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-1 h-[2px] w-6 bg-orange-200" />
                    <h3 className="line-clamp-1 text-base font-bold text-[#0F172A]">
                      {item.name}
                    </h3>
                    {item.designation ? (
                      <p className="line-clamp-1 text-sm font-medium text-slate-500">
                        {item.designation}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
