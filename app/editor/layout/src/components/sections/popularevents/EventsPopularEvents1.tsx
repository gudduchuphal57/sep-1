"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { PopularEventItemData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsPopularEvents1({ data = {} }: SectionProps) {
  const categories = (
    (Array.isArray(data.tabs) && data.tabs.length > 0
      ? data.tabs
      : data.categories) ?? []
  ).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );
  const events = (data.events ?? []) as PopularEventItemData[];
  const description = data.desc ?? data.description;
  const buttonLabel = data.buttonLabel ?? "View Event";
  const buttonIcon = data.buttonIcon ?? "→";

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const transitionRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!categories.length) {
      setActiveCategory("");
      return;
    }

    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredEvents = useMemo(
    () => events.filter((event) => event.category === activeCategory),
    [events, activeCategory],
  );

  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        window.clearTimeout(transitionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const showSection = () => setIsVisible(true);
    showSection();
    const fallbackTimer = window.setTimeout(showSection, 250);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showSection();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    if (transitionRef.current) {
      window.clearTimeout(transitionRef.current);
    }
    transitionRef.current = window.setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <section ref={sectionRef} className="mt-8 w-full md:mt-10 lg:mt-14">
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
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {categories.map((category, idx) => (
            <button
              key={`${category}-${idx}`}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold uppercase transition sm:px-5 ${
                category === activeCategory
                  ? "border-[#d61b58] bg-[#fce7ef] text-[#b01648]"
                  : "border-[#d61b58] text-[#d61b58] hover:bg-[#fce7ef]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          data-box-layout-grid="grid"
          className={`grid gap-5 transition-opacity duration-300 md:grid-cols-2 xl:grid-cols-3 ${
            isTransitioning ? "opacity-30" : "opacity-100"
          }`}
        >
          {filteredEvents.map((event, idx) => {
            const eventId =
              event.id ||
              (event.title ?? "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            const eventDescription = event.desc ?? event.description;

            return (
              <article
                key={event.id ?? `${event.title ?? "event"}-${idx}`}
                className={`overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm transition duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                } hover:-translate-y-1 hover:shadow-xl`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-52 overflow-hidden bg-gray-100 sm:h-64">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title ?? "Popular event"}
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={event.image}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={isUnoptimizedImageSrc(event.image)}
                    />
                  ) : null}
                  {event.seats && (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#d61b58] px-3 py-1 text-xs font-bold text-white shadow-lg shadow-[#d61b58]/25">
                      <span>{event.seats}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-16 text-xs font-semibold text-slate-500">
                    {event.date && (
                      <span className="inline-flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.75 2.74 6.85 6.35 7.73V21h1.3v-4.27C16.26 15.84 19 12.75 19 9c0-3.87-3.13-7-7-7zm0 11.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 4.5 12 4.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                        </svg>
                        {event.date}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.75 2.74 6.85 6.35 7.73V21h1.3v-4.27C16.26 15.84 19 12.75 19 9c0-3.87-3.13-7-7-7zm0 11.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 4.5 12 4.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                        </svg>
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.title && (
                    <h3 className="text-base font-semibold text-slate-900">
                      {event.title}
                    </h3>
                  )}
                  {eventDescription && (
                    <p className="text-sm leading-5 text-slate-600">
                      {eventDescription}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href={
                        event.link && event.link !== "#"
                          ? event.link
                          : `/src/pages/eventdetails?id=${eventId}`
                      }
                      className="group inline-flex items-center gap-1 text-sm font-semibold text-[#d61b58] transition hover:text-[#b01648]"
                    >
                      {buttonLabel}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1.5"
                      >
                        {buttonIcon}
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
