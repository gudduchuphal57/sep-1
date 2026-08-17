"use client";

import type {
  EventsCaseStudyHighlightData,
  SectionProps,
} from "../../../types/section";

export default function EventsCaseStudyHighlights1({ data = {} }: SectionProps) {
  const highlights = (data.highlights ?? []) as EventsCaseStudyHighlightData[];
  const highlightsTitle =
    typeof data.highlightsTitle === "string" && data.highlightsTitle.trim()
      ? data.highlightsTitle
      : "What made it special";

  if (!highlights.length) return null;

  return (
    <div className="rounded-[1.5rem] border border-[#f4d4e1] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{highlightsTitle}</h2>
      <div className="mt-5 space-y-4">
        {highlights.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="rounded-2xl border border-[#f4d4e1] bg-[#fff5f8] p-4"
          >
            {item.title && (
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
            )}
            {item.description && (
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
