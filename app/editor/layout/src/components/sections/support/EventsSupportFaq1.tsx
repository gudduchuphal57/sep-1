"use client";

import { useState } from "react";

import type { FaqItemData, SectionProps } from "../../../types/section";

export default function EventsSupportFaq1({ data = {} }: SectionProps) {
  const faqItems =
    (data.faqItems as FaqItemData[] | undefined) ??
    ((data as { items?: FaqItemData[] }).items ?? []);
  const faqPretitle =
    typeof data.faqPretitle === "string" && data.faqPretitle.trim()
      ? data.faqPretitle
      : "FAQ";
  const faqTitle =
    typeof data.faqTitle === "string" && data.faqTitle.trim()
      ? data.faqTitle
      : "Common questions";
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)] sm:p-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d61b58]">
          {faqPretitle}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
          {faqTitle}
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = index === activeFaq;
          return (
            <article
              key={`${item.question}-${index}`}
              className="overflow-hidden rounded-[1.25rem] border border-[#f4d4e1] bg-[#fffdfd]"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {item.question}
                </span>
                <span
                  className={`text-xl font-bold text-[#d61b58] transition ${
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
                <p className="px-5 pb-5 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
