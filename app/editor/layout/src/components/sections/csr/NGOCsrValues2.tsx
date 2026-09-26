"use client";

import type { SectionProps } from "../../../types/section";
import { CsrIcon } from "./CsrIcon";

type ValueItem = {
  id?: string | number;
  title?: string;
  description?: string;
  icon?: string;
  iconName?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCsrValues2({ data = {} }: SectionProps) {
  const coreValues = isRecord(data.coreValues) ? data.coreValues : {};
  const items = (
    Array.isArray(data.coreValueItems)
      ? data.coreValueItems
      : Array.isArray(coreValues.items)
        ? coreValues.items
        : []
  ) as ValueItem[];

  if (!items.length) return null;

  return (
    <section
      data-editor-section-label="Core Values"
      data-editor-fields="coreValueItems"
      data-editor-card-fields="icon title description"
      className="w-full bg-slate-50 px-4 pb-16 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {items.map((value, index) => (
          <div
            key={value.id ?? `${value.title}-${index}`}
            className="flex items-center space-x-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="shrink-0">
              <CsrIcon name={value.icon || value.iconName} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-slate-900">
                {value.title}
              </h4>
              {value.description ? (
                <p className="mt-1 text-sm text-slate-500">{value.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
