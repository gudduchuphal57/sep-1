"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { CsrIcon } from "./CsrIcon";

type FocusItem = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  iconName?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCsrFocus2({ data = {} }: SectionProps) {
  const focusAreas = isRecord(data.focusAreas) ? data.focusAreas : {};
  const title =
    (typeof data.focusPretitle === "string" && data.focusPretitle) ||
    (typeof focusAreas.topBadge === "string" && focusAreas.topBadge) ||
    "OUR FOCUS AREAS";
  const items = (
    Array.isArray(data.focusItems)
      ? data.focusItems
      : Array.isArray(focusAreas.items)
        ? focusAreas.items
        : []
  ) as FocusItem[];

  if (!items.length && !title) return null;

  return (
    <section
      data-editor-section-label="Focus Areas"
      data-editor-fields="focusPretitle focusItems"
      data-editor-card-fields="image icon title description"
      className="w-full bg-slate-50 px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => (
            <div
              key={item.id ?? `${item.title}-${index}`}
              className="flex flex-col rounded-xl border border-slate-100 bg-white text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-40 w-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title || "Focus area"}
                    fill
                    className="object-cover"
                    unoptimized={isUnoptimizedImageSrc(item.image)}
                  />
                ) : null}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                  <CsrIcon name={item.icon || item.iconName} />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-5 pt-8">
                <div>
                  <h3 className="mb-2 font-serif text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
