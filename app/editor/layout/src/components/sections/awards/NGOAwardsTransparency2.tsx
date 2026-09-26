"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOAwardsTransparency2({ data = {} }: SectionProps) {
  const transparencyBanner = isRecord(data.transparencyBanner)
    ? data.transparencyBanner
    : undefined;
  const nestedCta = isRecord(transparencyBanner?.cta)
    ? transparencyBanner.cta
    : undefined;
  const transparencyButton = isRecord(data.transparencyButton)
    ? data.transparencyButton
    : undefined;
  const title =
    (typeof data.transparencyTitle === "string" && data.transparencyTitle) ||
    (typeof transparencyBanner?.title === "string" &&
      transparencyBanner.title) ||
    "We are committed to transparency and accountability.";
  const description =
    (typeof data.transparencyDesc === "string" && data.transparencyDesc) ||
    (typeof transparencyBanner?.pretitle === "string" &&
      transparencyBanner.pretitle) ||
    "";
  const ctaText =
    (typeof transparencyButton?.label === "string" &&
      transparencyButton.label) ||
    (typeof nestedCta?.text === "string" && nestedCta.text) ||
    "Learn More About Us";
  const ctaUrl =
    (typeof transparencyButton?.href === "string" &&
      transparencyButton.href) ||
    (typeof nestedCta?.url === "string" && nestedCta.url) ||
    "/about-us";
  const icon =
    (typeof data.transparencyIcon === "string" && data.transparencyIcon) ||
    (typeof transparencyBanner?.iconName === "string" &&
      transparencyBanner.iconName) ||
    "shield-check";

  if (!title && !description) return null;

  return (
    <section
      data-editor-section-label="Awards Transparency"
      data-editor-fields="transparencyTitle transparencyDesc transparencyButton"
      className="bg-white pb-10 font-sans text-[#0F172A]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#C2410C] p-5 text-white shadow-md sm:p-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
              {renderNgoIcon(icon, "h-6 w-6 text-white")}
            </div>
            <div>
              <h4 className="text-md font-semibold sm:text-base">{title}</h4>
              {description ? (
                <p className="mt-0.5 text-sm text-orange-100">{description}</p>
              ) : null}
            </div>
          </div>
          <a
            href={ctaUrl}
            className="whitespace-nowrap rounded-full border border-white/80 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#C2410C]"
          >
            {ctaText} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
