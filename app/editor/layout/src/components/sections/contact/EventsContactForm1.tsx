"use client";

import type { EventsContactFormData, SectionProps } from "../../../types/section";

export default function EventsContactForm1({ data = {} }: SectionProps) {
  const form = (data.form ?? {}) as EventsContactFormData;

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)]">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            type="text"
            placeholder={form.namePlaceholder ?? "Your Name"}
            className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
          />
          <input
            type="email"
            placeholder={form.emailPlaceholder ?? "Email Address"}
            className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
          />
        </div>

        <input
          type="text"
          placeholder={form.subjectPlaceholder ?? "Subject"}
          className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
        />

        <textarea
          rows={5}
          placeholder={form.messagePlaceholder ?? "Message"}
          className="w-full rounded-[1.5rem] border border-[#f3d2df] bg-[#fff5f9] px-4 py-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
        />

        <button
          type="button"
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-3xl bg-[#d61b58] px-8 text-sm font-semibold text-white transition hover:bg-[#b01648]"
        >
          {form.buttonLabel ?? "Send Message"}
          {form.buttonIcon === "send" && (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9 22 2Z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
