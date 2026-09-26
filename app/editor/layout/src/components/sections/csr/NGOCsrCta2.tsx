"use client";

import { FiHeart } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCsrCta2({ data = {} }: SectionProps) {
  const bannerCta = isRecord(data.bannerCta) ? data.bannerCta : {};
  const button = isRecord(data.ctaButton) ? data.ctaButton : {};
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof bannerCta.title === "string" && bannerCta.title) ||
    "Together, We Can Build a Better Tomorrow";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof bannerCta.description === "string" && bannerCta.description) ||
    "";
  const buttonLabel =
    (typeof button.label === "string" && button.label) ||
    (typeof bannerCta.buttonText === "string" && bannerCta.buttonText) ||
    "Partner With Us";
  const buttonHref =
    (typeof button.href === "string" && button.href) ||
    (typeof bannerCta.href === "string" && bannerCta.href) ||
    "/contact-us";

  return (
    <section
      data-editor-section-label="CSR CTA"
      data-editor-fields="ctaTitle ctaDesc ctaButton"
      className="w-full bg-slate-50 px-4 pb-8 font-sans sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-2xl bg-orange-700 p-8 text-white shadow-lg md:flex-row md:p-10">
        <div className="flex items-center space-x-6 text-center md:text-left">
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-orange-800 sm:flex">
            <FiHeart className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold md:text-2xl">{title}</h3>
            {description ? (
              <p className="text-sm text-red-100">{description}</p>
            ) : null}
          </div>
        </div>
        <a
          href={buttonHref}
          className="inline-flex items-center space-x-2 whitespace-nowrap rounded-lg bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-sm transition-colors hover:bg-orange-50"
        >
          <span>{buttonLabel}</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
}
