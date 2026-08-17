"use client";

import type { EventsContactItemData, SectionProps } from "../../../types/section";

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
              {item.icon === "location" && (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
              )}
              {item.icon === "phone" && (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d="M6.62 10.79a15.054 15.054 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24 11.05 11.05 0 0 0 3.47.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.19.2 2.35.56 3.47a1 1 0 0 1-.24 1.05l-2.2 2.27z" />
                </svg>
              )}
              {item.icon === "email" && (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.23l-8 4.99-8-4.99V6.5l8 4.99 8-4.99v1.73z" />
                </svg>
              )}
            </div>
            <div>
              {item.label && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d61b58]">
                  {item.label}
                </p>
              )}
              {item.value && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
