"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { SectionProps, TestimonialItemData } from "../../../types/section";

export default function EventsTestimonial1({ data = {} }: SectionProps) {
  const items = (data.testimonialItems ?? []) as TestimonialItemData[];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    if (!mobileQuery.matches) return;

    let direction = 1;
    const interval = window.setInterval(() => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextPosition = el.scrollLeft + el.clientWidth * 0.9 * direction;
      if (nextPosition >= maxScroll) {
        direction = -1;
      } else if (nextPosition <= 0) {
        direction = 1;
      }
      el.scrollBy({
        left: el.clientWidth * 0.9 * direction,
        behavior: "smooth",
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mt-8 w-full md:mt-10 lg:mt-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {data.desc && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
              {data.desc}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="z-10 hidden -translate-y-3/2 items-center gap-3 sm:absolute sm:right-12 sm:top-0 sm:flex">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#d61b58] text-white shadow-md hover:bg-[#b01648] md:h-10 md:w-10 lg:h-12 lg:w-12"
            >
              <ChevronLeft className="h-5 w-5 text-white" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#d61b58] text-white shadow-md hover:bg-[#b01648] md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5 text-white" aria-hidden />
            </button>
          </div>

          <div
            ref={scrollRef}
            data-box-layout-grid="carousel"
            data-box-layout-gap="wide"
            className="flex touch-pan-x snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, idx) => {
              const initials =
                item.initials ||
                item.name
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("") ||
                "";
              const rating = Math.round(Number(item.rating ?? "5"));

              return (
                <div
                  key={`${item.name}-${idx}`}
                  className={`w-full max-w-[95vw] flex-shrink-0 snap-center rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-[#d61b58]/10 transition duration-700 sm:w-[calc(50%-1.5rem)] sm:p-6 lg:w-[calc(33.333%-1.5rem)] lg:p-8 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  } hover:-translate-y-1 hover:shadow-xl`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d61b58] text-white md:text-md lg:h-12 lg:w-12 lg:text-lg font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">{item.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-[#d61b58]">
                      {Array.from({ length: Math.max(0, rating) }).map(
                        (_, starIdx) => (
                          <span key={starIdx}>★</span>
                        ),
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-700">{item.quote}</p>

                  {item.address && (
                    <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.address}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
