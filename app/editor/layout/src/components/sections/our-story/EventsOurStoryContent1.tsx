"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsOurStoryContent1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const image = data.image ?? data.sideImage;

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

  return (
    <section
      ref={sectionRef}
      data-editor-section-label="Story"
      data-editor-fields="image imageAlt description description2 quote button"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div
          className={`relative h-80 overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 transition-all duration-1000 sm:h-96 lg:h-[480px] ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          {image && (
            <Image
              src={image}
              alt={data.imageAlt ?? "Our Story"}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
              unoptimized={isUnoptimizedImageSrc(image)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <div
          className={`space-y-6 transition-all delay-200 duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
          }`}
        >
          {description && (
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
          )}
          {data.description2 && (
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              {data.description2}
            </p>
          )}
          {data.quote && (
            <blockquote className="border-l-4 border-[#d61b58] pl-5 text-base italic text-slate-700 sm:text-lg">
              &ldquo;{data.quote}&rdquo;
            </blockquote>
          )}
          {data.button?.label && (
            <Link
              href={data.button.href ?? "#"}
              className="inline-flex items-center gap-2 rounded-[20px] bg-[#d61b58] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b01648] sm:text-base"
            >
              {data.button.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
