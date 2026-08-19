"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderEventsIcon as renderIcon } from "../../../lib/eventsIcons";

export default function EventsWhyChooseUs1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const cards = data.whyChooseUsItems ?? [];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mt-8 w-full md:mt-10 lg:mt-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-14">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div data-box-layout-grid="grid" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, idx) => (
            <div
              key={`${card.title ?? "card"}-${idx}`}
              className={`group relative overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white shadow-sm transition duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {card.image ? (
                <div className="group relative h-52 overflow-hidden bg-slate-100 sm:h-56">
                  <Image
                    src={card.image}
                    alt={card.title ?? ""}
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={card.image}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(card.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#d61b58] shadow-md transition-transform duration-500 group-hover:scale-110">
                    {renderIcon(card.icon, "h-6 w-6")}
                  </div>
                </div>
              ) : (
                <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ffe6f1] text-[#d61b58] shadow-sm sm:mt-8">
                  {renderIcon(card.icon, "h-8 w-8")}
                </div>
              )}

              <div className="p-4 text-center sm:p-5">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-sm">
                  {card.desc ?? card.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-200">
                <div className="h-full w-0 bg-pink-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
