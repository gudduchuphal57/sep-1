"use client";

import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import NGOEvents2 from "./NGOEvents2";

type EventItem = {
  title?: string;
  date?: string;
  location?: string;
  image?: string;
  href?: string;
  link?: string;
  description?: string;
  desc?: string;
};

export default function NGOEventsList2({ data = {} }: SectionProps) {
  const events = (Array.isArray(data.events)
    ? data.events
    : Array.isArray(data.cards)
      ? data.cards
      : Array.isArray(data.eventItems)
        ? data.eventItems
        : null) as EventItem[] | null;

  if (!events) {
    return (
      <div data-editor-section-label="Events List">
        <NGOEvents2 data={{ ...data, showExploreButton: false }} />
      </div>
    );
  }

  return (
    <section
      data-editor-section-label="Events List"
      data-editor-fields="events cards eventItems title description"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, idx) => {
          const href = event.href ?? event.link ?? "#";
          return (
            <Link
              key={`${event.title}-${idx}`}
              href={href}
              className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden bg-orange-50">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title || "Event"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(event.image)}
                  />
                ) : null}
              </div>
              <div className="p-5">
                {event.date ? (
                  <p className="text-xs font-bold uppercase tracking-wide text-[#ff541b]">
                    {event.date}
                  </p>
                ) : null}
                <h3 className="mt-2 text-lg font-bold text-[#0F172A]">
                  {event.title}
                </h3>
                {event.location ? (
                  <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                ) : null}
                {(event.description || event.desc) ? (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {event.description || event.desc}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
