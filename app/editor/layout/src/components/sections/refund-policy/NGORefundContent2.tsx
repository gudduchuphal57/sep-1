"use client";

import type { SectionProps } from "../../../types/section";

type RefundCondition = {
  id?: string | number;
  title?: string;
  content?: string | string[];
  desc?: string;
};

export default function NGORefundContent2({ data = {} }: SectionProps) {
  const conditions = (Array.isArray(data.conditions)
    ? data.conditions
    : Array.isArray(data.sections)
      ? data.sections
      : []) as RefundCondition[];

  if (!conditions.length) return null;

  return (
    <section
      data-editor-section-label="Refund Content"
      data-editor-fields="conditions"
      className="bg-[#fafafa] py-12 md:py-16"
    >
      <div className="mx-auto px-4 md:px-10">
        <div className="flex flex-col">
          {conditions.map((section, index) => {
            const content = Array.isArray(section.content)
              ? section.content.filter(
                  (item): item is string => typeof item === "string",
                )
              : typeof section.content === "string"
                ? [section.content]
                : typeof section.desc === "string"
                  ? [section.desc]
                  : [];

            return (
              <div
                key={section.id ?? `${section.title}-${index}`}
                className="group"
              >
                <div className="relative pb-2">
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                    {section.title}
                  </h2>
                </div>
                {content.map((item, itemIndex) => (
                  <p
                    key={`${index}-${itemIndex}`}
                    className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    {item}
                  </p>
                ))}
                {index < conditions.length - 1 ? (
                  <hr className="my-8 border-t border-gray-200/60 sm:my-10" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
