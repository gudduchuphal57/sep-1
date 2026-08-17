"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type {
  EventsEventCategoryItemData,
  SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsEventCategories1({ data = {} }: SectionProps) {
  const items = (data.items ?? []) as EventsEventCategoryItemData[];
  const viewMoreLabel = data.buttonLabel ?? "View More";

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-editor-section-label="Event Categories"
      data-editor-fields="items"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div
        className={`space-y-10 transition-all duration-1000 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        {items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="grid items-start gap-8 rounded-[2rem] border border-[#f2dce3] bg-gradient-to-br from-white via-[#fffafc] to-[#fff3f7] p-5 shadow-sm shadow-[#f4d4e1] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-8"
          >
            <div
              className={`relative overflow-hidden rounded-[1.5rem] ${
                index % 2 === 0 ? "lg:order-1" : "lg:order-2"
              }`}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.imageAlt ?? item.title ?? "Event category"}
                  width={900}
                  height={670}
                  className="h-[300px] w-full object-cover sm:h-[340px]"
                  unoptimized={isUnoptimizedImageSrc(item.image)}
                />
              )}
            </div>

            <div
              className={`flex h-full flex-col justify-start gap-3 ${
                index % 2 === 0 ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {item.badge && (
                <p className="inline-flex h-6 w-50 justify-center rounded-full bg-[#fff1f5] px-3 py-1 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#d61b58]">
                  {item.badge}
                </p>
              )}
              {item.title && (
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {item.title}
                </h2>
              )}
              {item.description && (
                <p className="max-w-2xl text-base leading-6 text-slate-600">
                  {item.description}
                </p>
              )}
              <Link
                href={item.href ?? "#"}
                className="group mt-4 inline-flex w-fit items-center gap-1.5 rounded-[20px] bg-[#d61b58] px-5 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-[#b01648] hover:shadow-lg"
              >
                {viewMoreLabel}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
