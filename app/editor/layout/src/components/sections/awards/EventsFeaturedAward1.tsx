"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";

import type {
  EventsFeaturedAwardData,
  SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsFeaturedAward1({ data = {} }: SectionProps) {
  const featuredAward = data.featuredAward as EventsFeaturedAwardData | undefined;

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

  if (!featuredAward) return null;

  return (
    <section
      ref={sectionRef}
      data-editor-section-label="Featured Award"
      data-editor-fields="featuredAward"
      className="mt-8 md:mt-10 lg:mt-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div
            className={`relative h-80 overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 transition-all duration-1000 sm:h-[420px] lg:h-[500px] ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {featuredAward.image && (
              <Image
                src={featuredAward.image}
                alt={featuredAward.imageAlt ?? "Featured Award"}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
                unoptimized={isUnoptimizedImageSrc(featuredAward.image)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {featuredAward.year && (
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#d61b58] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-[#d61b58]/30">
                <Trophy className="h-4 w-4" aria-hidden />
                {featuredAward.year}
              </span>
            )}
          </div>

          <div
            className={`space-y-5 transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {featuredAward.title && (
              <h3 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                {featuredAward.title}
              </h3>
            )}
            {featuredAward.body && (
              <p className="border-l-4 border-[#d61b58] pl-4 text-sm font-semibold uppercase tracking-widest text-[#d61b58]">
                {featuredAward.body}
              </p>
            )}
            {featuredAward.description && (
              <p className="text-sm leading-7 text-slate-500 sm:text-base">
                {featuredAward.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
