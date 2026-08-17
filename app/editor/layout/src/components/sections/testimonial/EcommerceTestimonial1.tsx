"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SectionProps, TestimonialItemData } from "../../../types/section";

const fallbackItems: TestimonialItemData[] = [
  {
    name: "Aarav Mehta",
    role: "Founder, Studio North",
    quote: "The site made our work easier to understand and brought in better leads within the first week.",
    image: "/bg1.jpg",
    rating: "5.0",
  },
  {
    name: "Neha Kapoor",
    role: "Marketing Lead",
    quote: "Clean sections, fast pages, and the editor keeps the content simple for our whole team.",
    image: "/bg2.jpg",
    rating: "4.9",
  },
  {
    name: "Rahul Verma",
    role: "Operations Head",
    quote: "We finally have a website that looks premium and still feels practical to update.",
    image: "/blackbay.png",
    rating: "5.0",
  },
];

const getItems = (data: SectionProps["data"]) =>
  data?.testimonialItems ?? [];
void fallbackItems;
const getRating = (rating?: string) =>
  Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

export default function EcommerceTestimonial1({ data = {} }: SectionProps) {
  const items = getItems(data);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollClients = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const interval = window.setInterval(() => scrollClients(1), 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          {data.pretitle}
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-slate-950 sm:text-4xl">
          {data.title}
        </h2>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Scroll clients left"
            onClick={() => scrollClients(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll clients right"
            onClick={() => scrollClients(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div ref={scrollerRef} className="mt-6 flex snap-x gap-5 overflow-x-auto scroll-smooth pb-4">
          {items.map((item, index) => (
            <article key={`${item.name}-${index}`} className="min-w-[min(280px,82vw)] snap-start rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:min-w-[340px]">
              <Quote size={26} className="text-blue-600" />
              <p className="mt-5 text-sm leading-6 text-slate-600">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                  {item.image && <Image src={item.image} alt={item.name} data-editor-media data-editor-media-type="image" data-editor-media-src={item.image} fill className="object-cover" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{item.name}</h3>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    fill={starIndex < getRating(item.rating) ? "currentColor" : "none"}
                  />
                ))}
                {item.rating && <span className="ml-2 text-xs font-semibold text-slate-500">{item.rating}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
