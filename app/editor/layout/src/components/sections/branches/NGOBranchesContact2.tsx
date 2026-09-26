"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type ContactItem = {
  icon?: string;
  label?: string;
  value?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBranchesContact2({ data = {} }: SectionProps) {
  const contactBar = isRecord(data.contactBar) ? data.contactBar : undefined;
  const contactItems = (
    Array.isArray(data.contactItems)
      ? data.contactItems
      : Array.isArray(contactBar?.items)
        ? contactBar.items
        : []
  ) as ContactItem[];

  if (!contactItems.length) return null;

  return (
    <section
      data-editor-section-label="Branches Contact"
      data-editor-fields="contactItems"
      data-editor-card-fields="icon label value"
      className="mx-auto max-w-6xl px-4 pb-16 font-sans text-gray-800"
    >
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-100 bg-orange-50/50 p-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-orange-100">
        {contactItems.map((item, index) => (
          <div
            key={item.label ?? index}
            className="flex items-center gap-4 px-4 py-2"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
              {renderNgoIcon(item.icon || "mail", "h-5 w-5 text-orange-600")}
            </div>

            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-semibold text-orange-600">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
