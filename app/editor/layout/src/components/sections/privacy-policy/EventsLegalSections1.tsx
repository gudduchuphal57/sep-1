"use client";

import type { EventsLegalSectionData, SectionProps } from "../../../types/section";

type EventsLegalSections1Props = SectionProps & {
  editorLabel?: string;
};

export default function EventsLegalSections1({
  data = {},
  editorLabel = "Policy Content",
}: EventsLegalSections1Props) {
  const sections = (data.sections ?? []) as EventsLegalSectionData[];

  if (!sections.length) return null;

  return (
    <section
      data-editor-section-label={editorLabel}
      data-editor-fields="sections"
      className="mx-auto mt-8 w-full max-w-7xl bg-white px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-10">
        {sections.map((section, index) => {
          const content = Array.isArray(section.content)
            ? section.content.filter((item): item is string => typeof item === "string")
            : typeof section.content === "string"
              ? [section.content]
              : typeof section.desc === "string"
                ? [section.desc]
                : [];

          return (
            <div
              key={`${section.title}-${index}`}
              className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-40px_rgba(214,27,88,0.35)]"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8f2] text-[#d61b58]">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>

              <ul>
                {content.map((item, itemIndex) => (
                  <li key={`${index}-${itemIndex}`} className="flex items-start gap-4">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d61b58]" />
                    <p className="text-sm text-slate-500 sm:text-base">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
