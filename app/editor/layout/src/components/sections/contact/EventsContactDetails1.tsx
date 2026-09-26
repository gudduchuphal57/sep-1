"use client";

import type { EventsContactItemData, SectionProps } from "../../../types/section";
import { renderEventsIcon } from "../../../lib/eventsIcons";

export default function EventsContactDetails1({ data = {} }: SectionProps) {
  const contactItems = (data.contactItems ?? []) as EventsContactItemData[];

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)]">
      <div className="space-y-6">
        {contactItems.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className={`flex gap-5 ${idx < contactItems.length - 1 ? "border-b border-[#fae0ec] pb-5" : ""}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8f2] text-[#d61b58]">
              {renderEventsIcon(item.icon, "h-6 w-6")}
            </div>
            <div>
              {item.label && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d61b58]">
                  {item.label}
                </p>
              )}
              {(item.value || item.value2) && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                  {[item.value, item.value2].filter(Boolean).join("\n")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
