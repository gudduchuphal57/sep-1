"use client";

import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function EventsCaseStudyCta1({ data = {} }: SectionProps) {
  const ctaLabel =
    typeof data.ctaLabel === "string" ? data.ctaLabel : undefined;
  const ctaHref = typeof data.ctaHref === "string" ? data.ctaHref : undefined;
  const ctaTitle =
    typeof data.ctaTitle === "string" && data.ctaTitle.trim()
      ? data.ctaTitle
      : "Ready to create something unforgettable?";

  if (!ctaLabel || !ctaHref) return null;

  return (
    <section
      data-editor-section-label="Case Study CTA"
      data-editor-fields="ctaTitle ctaLabel ctaHref"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="rounded-[2rem] border border-[#f4d4e1] bg-gradient-to-r from-[#d61b58] to-[#b01648] p-8 text-center text-white shadow-[0_24px_80px_-40px_rgba(214,27,88,0.45)]">
        <h2 className="text-2xl font-semibold sm:text-3xl">{ctaTitle}</h2>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center rounded-[20px] bg-white px-6 py-3 text-sm font-semibold text-[#d61b58] transition hover:bg-[#fff5f8]"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
