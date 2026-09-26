"use client";

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";

type FAQItem = {
  question?: string;
  answer?: string;
  title?: string;
  desc?: string;
  description?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitle = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOFAQ2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof badge?.label === "string" && badge.label) ||
    "FAQs";
  const title = toTitle(data.title) || "Frequently Asked Questions";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const questions = (Array.isArray(data.questions)
    ? data.questions
    : Array.isArray(data.faqs)
      ? data.faqs
      : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.faqItems)
          ? data.faqItems
          : []) as FAQItem[];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      data-editor-section-label="FAQ"
      data-editor-fields="pretitle title desc questions"
      data-editor-card-fields="question answer"
      className="relative overflow-hidden bg-white py-8 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
            <HiOutlineHeart className="text-base sm:text-lg" />
            {pretitle}
          </div>
          <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-xl text-sm text-slate-500 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mx-auto mt-8 w-full max-w-7xl space-y-3 sm:space-y-4 px-3 sm:px-4 lg:px-8">
          {questions.map((item, index) => {
            const open = activeIndex === index;
            const question = item.question || item.title || "";
            const answer = item.answer || item.desc || item.description || "";
            return (
              <div
                key={`${question}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-orange-50 sm:px-6 sm:py-5"
                >
                  <h3 className="pr-2 text-sm font-bold leading-6 text-slate-900 sm:text-base md:text-lg">
                    {question}
                  </h3>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500 sm:h-10 sm:w-10">
                    {open ? <FiMinus /> : <FiPlus />}
                  </div>
                </button>
                {open ? (
                  <div className="border-t border-slate-100 px-4 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:px-6 sm:text-base">
                    {answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
