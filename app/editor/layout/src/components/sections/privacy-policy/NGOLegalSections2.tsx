"use client";

import type { SectionProps } from "../../../types/section";

type LegalSection = {
  id?: string | number;
  title?: string;
  content?: string | string[];
  desc?: string;
};

export default function NGOLegalSections2({
  data = {},
  editorLabel = "Policy Content",
}: SectionProps & { editorLabel?: string }) {
  const sections = (Array.isArray(data.sections)
    ? data.sections
    : Array.isArray(data.conditions)
      ? data.conditions
      : []) as LegalSection[];

  if (!sections.length) return null;

  return (
    <section
      data-editor-section-label={editorLabel}
      data-editor-fields="sections conditions"
      className="bg-[#fafafa] py-12 md:py-16"
    >
      <div className="mx-auto px-4 md:px-10">
        <div className="flex flex-col">
          {sections.map((section, index) => {
            const content = Array.isArray(section.content)
              ? section.content.filter((item): item is string => typeof item === "string")
              : typeof section.content === "string"
                ? [section.content]
                : typeof section.desc === "string"
                  ? [section.desc]
                  : [];

            return (
              <div key={section.id ?? `${section.title}-${index}`} className="group">
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
                {index < sections.length - 1 ? (
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
