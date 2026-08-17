"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsPresence1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const stats = data.stats ?? [];
  const worldImage = data.worldImage;
  const worldImageAlt = data.worldImageAlt ?? "Global events gallery";

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
      data-editor-section-label="Presence"
      data-editor-fields="description stats worldImage worldImageAlt"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div
          className={`space-y-8 transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          {description && (
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              {description}
            </p>
          )}

          {stats.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-[2rem] border border-[#f4d4e1] bg-white p-6 shadow-sm"
                >
                  <p className="text-3xl font-extrabold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.1em] text-[#d61b58]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
          }`}
        >
          {worldImage && (
            <Image
              src={worldImage}
              alt={worldImageAlt}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              unoptimized={isUnoptimizedImageSrc(worldImage)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
