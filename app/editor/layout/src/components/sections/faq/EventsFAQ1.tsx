"use client";

import { useState } from "react";

import type { FaqItemData, SectionProps } from "../../../types/section";

export default function EventsFAQ1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const items =
    data.faqItems ?? ((data as { items?: FaqItemData[] }).items ?? []);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!items.length && !data.title && !data.pretitle) return null;

  return (
    <section className="mt-8 w-full md:mt-10 lg:mt-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          {data.title && (
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              {data.title}
            </h2>
          )}
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = index === activeIndex;
            return (
              <article
                key={`${item.question}-${index}`}
                className={`overflow-hidden rounded-[1.75rem] border border-[#f4c5d4] bg-white shadow-sm transition duration-300 ${
                  isOpen
                    ? "shadow-lg"
                    : "hover:-translate-y-0.5 hover:shadow-xl"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-base font-semibold text-slate-900 sm:text-lg">
                    {item.question ?? "Untitled question"}
                  </span>

                  <span
                    className={`text-2xl font-bold text-[#d61b58] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▾
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-5 text-slate-600">
                      {item.answer}
                    </p>
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
