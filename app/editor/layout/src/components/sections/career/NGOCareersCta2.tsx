"use client";

import Link from "next/link";
import { FiArrowRight, FiMail, FiUsers } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCareersCta2({ data = {} }: SectionProps) {
  const cta = isRecord(data.cta)
    ? (data.cta as Record<string, unknown>)
    : undefined;
  const nestedButton = isRecord(cta?.button) ? cta.button : undefined;
  const ctaButton = isRecord(data.ctaButton) ? data.ctaButton : nestedButton;
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof cta?.title === "string" && cta.title) ||
    "";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof cta?.description === "string" && cta.description) ||
    "";
  const buttonLabel =
    (typeof ctaButton?.label === "string" && ctaButton.label) ||
    "Send Your Resume";
  const buttonHref =
    (typeof ctaButton?.href === "string" && ctaButton.href) || "/apply-form";

  if (!title && !description) return null;

  return (
    <section
      data-editor-section-label="Careers CTA"
      data-editor-fields="ctaTitle ctaDesc ctaButton"
      className="relative overflow-hidden bg-[#fafafa] px-4 py-8 font-sans text-slate-900 sm:px-6 md:py-12 lg:px-8"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#fff2eb] p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 text-[#ff541b]/10">
          <FiUsers className="h-44 w-44 lg:h-52 lg:w-52" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ff541b] text-white shadow-md sm:h-20 sm:w-20">
              <FiMail className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>

            <div className="max-w-lg">
              {title ? (
                <h2 className="text-2xl font-bold text-[#0d152e] sm:text-3xl">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-2 text-sm leading-relaxed text-[#525b70]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#ff541b] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#e0430e] hover:shadow-lg"
            >
              <span>{buttonLabel}</span>
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
