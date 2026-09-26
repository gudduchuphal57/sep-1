"use client";

import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOEnquiryCta2({ data = {} }: SectionProps) {
  const footerBanner = isRecord(data.footerBanner) ? data.footerBanner : {};
  const nestedButton = isRecord(footerBanner.button)
    ? footerBanner.button
    : {};
  const ctaIcon =
    (typeof data.ctaIcon === "string" && data.ctaIcon) ||
    (typeof footerBanner.icon === "string" && footerBanner.icon) ||
    "shield-check";
  const ctaText =
    (typeof data.ctaText === "string" && data.ctaText) ||
    (typeof footerBanner.text === "string" && footerBanner.text) ||
    "";
  const ctaSubtext =
    (typeof data.ctaSubtext === "string" && data.ctaSubtext) ||
    (typeof footerBanner.subtext === "string" && footerBanner.subtext) ||
    "";
  const ctaButtonLabel =
    (typeof data.ctaButtonLabel === "string" && data.ctaButtonLabel) ||
    (typeof nestedButton.label === "string" && nestedButton.label) ||
    "Learn More About Us";
  const ctaButtonHref =
    (typeof data.ctaButtonHref === "string" && data.ctaButtonHref) ||
    (typeof nestedButton.href === "string" && nestedButton.href) ||
    "/about";
  const ctaButtonIcon =
    (typeof data.ctaButtonIcon === "string" && data.ctaButtonIcon) ||
    (typeof nestedButton.icon === "string" && nestedButton.icon) ||
    "arrow-right";

  return (
    <section
      data-editor-section-label="Enquiry CTA"
      data-editor-fields="ctaIcon ctaText ctaSubtext ctaButtonLabel ctaButtonHref ctaButtonIcon"
      className="mx-auto max-w-6xl bg-white sm:px-4 md:mb-10"
    >
      <div className="flex flex-col items-center justify-between gap-6 bg-orange-600 px-3 py-3 text-white sm:flex-row sm:rounded-2xl sm:px-8 sm:py-7">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
            {renderNgoIcon(ctaIcon, "h-6 w-6")}
          </div>
          <div>
            {ctaText ? (
              <p className="text-lg font-semibold">{ctaText}</p>
            ) : null}
            {ctaSubtext ? (
              <p className="mt-0.5 text-sm text-white/85">{ctaSubtext}</p>
            ) : null}
          </div>
        </div>
        <Link
          href={ctaButtonHref}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          {ctaButtonLabel}
          {renderNgoIcon(ctaButtonIcon, "h-4 w-4")}
        </Link>
      </div>
    </section>
  );
}
