"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type ContactItem = {
  icon?: string;
  label?: string;
  value?: string;
};

export default function NGOEnquiryContact2({ data = {} }: SectionProps) {
  const contactSection = isRecord(data.contactSection)
    ? data.contactSection
    : {};
  const contactTitle =
    (typeof data.contactTitle === "string" && data.contactTitle) ||
    (typeof contactSection.title === "string" && contactSection.title) ||
    "Prefer to talk?";
  const contactPretitle =
    (typeof data.contactPretitle === "string" && data.contactPretitle) ||
    (typeof contactSection.pretitle === "string" && contactSection.pretitle) ||
    "";
  const contactDesc =
    (typeof data.contactDesc === "string" && data.contactDesc) ||
    (typeof contactSection.description === "string" &&
      contactSection.description) ||
    "";
  const contactItems = (
    Array.isArray(data.contactItems)
      ? data.contactItems
      : Array.isArray(contactSection.items)
        ? contactSection.items
        : []
  ).slice(0, 5) as ContactItem[];

  return (
    <section
      data-editor-section-label="Enquiry Contact"
      data-editor-fields="contactTitle contactPretitle contactDesc contactItems"
      data-editor-card-fields="icon label value"
      className="mx-auto max-w-6xl bg-white px-0 pb-12 sm:px-4"
    >
      <div className="flex flex-col items-start gap-8 rounded-2xl bg-orange-50 p-3 sm:p-6 md:flex-row md:items-center md:gap-12 md:p-10">
        <div className="flex shrink-0 items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            {renderNgoIcon(contactItems[0]?.icon || "phone", "h-7 w-7")}
          </div>
          <div>
            <p className="text-sm font-medium text-orange-600">{contactTitle}</p>
            {contactPretitle ? (
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {contactPretitle}
              </h3>
            ) : null}
            {contactDesc ? (
              <p className="mt-2 max-w-xs text-sm text-gray-600">
                {contactDesc}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-wrap gap-8 md:gap-12">
          {contactItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-start gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                {renderNgoIcon(item.icon || "phone", "h-5 w-5")}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="mt-0.5 whitespace-pre-line text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
