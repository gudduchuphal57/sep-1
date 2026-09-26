"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOSupportTransparency2({ data = {} }: SectionProps) {
  const transparencyBar = isRecord(data.transparencyBar)
    ? data.transparencyBar
    : {};
  const action = isRecord(transparencyBar.action)
    ? transparencyBar.action
    : isRecord(data.transparencyButton)
      ? data.transparencyButton
      : {};
  const icon =
    (typeof data.transparencyIcon === "string" && data.transparencyIcon) ||
    (typeof transparencyBar.iconName === "string" &&
      transparencyBar.iconName) ||
    "shield-check";
  const title =
    (typeof data.transparencyTitle === "string" && data.transparencyTitle) ||
    (typeof transparencyBar.title === "string" && transparencyBar.title) ||
    "We are committed to transparency and accountability.";
  const description =
    (typeof data.transparencyDesc === "string" && data.transparencyDesc) ||
    (typeof transparencyBar.pretitle === "string" &&
      transparencyBar.pretitle) ||
    "";
  const buttonLabel =
    (typeof action.label === "string" && action.label) ||
    "Learn More About Us";
  const buttonHref =
    (typeof action.href === "string" && action.href) ||
    (typeof action.url === "string" && action.url) ||
    "/about-us";

  return (
    <section
      data-editor-section-label="Transparency"
      data-editor-fields="transparencyIcon transparencyTitle transparencyDesc transparencyButton"
      className="w-full bg-[#FAF9F6] px-4 pb-16 font-sans sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl bg-white p-5 text-orange-500 shadow-md sm:p-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            {renderNgoIcon(icon, "h-7 w-7 text-orange-700")}
          </div>
          <div>
            <h4 className="pt-2 text-md font-semibold sm:text-base">{title}</h4>
            {description ? (
              <p className="mt-0.5 text-sm text-orange-600">{description}</p>
            ) : null}
          </div>
        </div>
        <a
          href={buttonHref}
          className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold text-orange-500 shadow-sm shadow-orange-500 transition-all hover:bg-white hover:text-[#EA580C] hover:shadow-md"
        >
          {buttonLabel} &rarr;
        </a>
      </div>
    </section>
  );
}
