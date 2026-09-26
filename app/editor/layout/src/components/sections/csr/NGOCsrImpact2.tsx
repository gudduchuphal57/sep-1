"use client";

import type { SectionProps } from "../../../types/section";
import { CsrIcon } from "./CsrIcon";

type Pillar = {
  id?: string | number;
  title?: string;
  description?: string;
  icon?: string;
  iconName?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCsrImpact2({ data = {} }: SectionProps) {
  const ourImpact = isRecord(data.ourImpact) ? data.ourImpact : {};
  const nestedButton = isRecord(ourImpact.ctaButton) ? ourImpact.ctaButton : {};
  const button = isRecord(data.impactButton) ? data.impactButton : nestedButton;
  const title =
    (typeof data.impactPretitle === "string" && data.impactPretitle) ||
    (typeof ourImpact.topBadge === "string" && ourImpact.topBadge) ||
    "OUR IMPACT";
  const description =
    (typeof data.impactDesc === "string" && data.impactDesc) ||
    (typeof ourImpact.description === "string" && ourImpact.description) ||
    "";
  const buttonLabel =
    (typeof button.label === "string" && button.label) ||
    (typeof button.text === "string" && button.text) ||
    "Learn More About Our Impact";
  const buttonHref =
    (typeof button.href === "string" && button.href) || "/about-us";
  const pillars = (
    Array.isArray(data.pillars)
      ? data.pillars
      : Array.isArray(ourImpact.pillars)
        ? ourImpact.pillars
        : []
  ) as Pillar[];

  return (
    <section
      data-editor-section-label="Our Impact"
      data-editor-fields="impactPretitle impactDesc impactButton pillars"
      data-editor-card-fields="icon title description"
      className="w-full bg-slate-50 px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 rounded-2xl border border-orange-100/60 bg-orange-50/50 p-6 md:p-10 lg:grid-cols-3">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          ) : null}
          <a
            href={buttonHref}
            className="mt-4 inline-flex items-center space-x-2 rounded-lg border border-orange-400 bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow-sm transition-colors hover:bg-orange-50"
          >
            <span>{buttonLabel}</span>
            <span>&rarr;</span>
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id ?? `${pillar.title}-${index}`}
              className="space-y-2 p-2 text-center"
            >
              <CsrIcon name={pillar.icon || pillar.iconName} />
              <h4 className="pt-2 font-serif text-sm font-bold text-slate-900">
                {pillar.title}
              </h4>
              {pillar.description ? (
                <p className="text-sm leading-relaxed text-slate-500">
                  {pillar.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
