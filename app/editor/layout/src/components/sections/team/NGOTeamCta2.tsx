"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOTeamCta2({ data = {} }: SectionProps) {
  const cta = isRecord(data.cta)
    ? (data.cta as Record<string, unknown>)
    : undefined;
  if (!cta) return null;

  const button = isRecord(cta.button) ? cta.button : undefined;
  const buttonLabel =
    (typeof button?.label === "string" && button.label) ||
    (typeof cta.label === "string" && cta.label) ||
    (typeof cta.text === "string" && cta.text) ||
    "Donate Now";
  const buttonHref =
    (typeof button?.href === "string" && button.href) ||
    (typeof cta.href === "string" && cta.href) ||
    (typeof cta.link === "string" && cta.link) ||
    "/donate";
  const title =
    (typeof cta.title === "string" && cta.title) || "";
  const description =
    (typeof cta.description === "string" && cta.description) ||
    (typeof cta.desc === "string" && cta.desc) ||
    "";

  if (!title && !description && !buttonLabel) return null;

  return (
    <section
      data-editor-section-label="Team CTA"
      data-editor-fields="cta"
      className="relative bg-[#fafafa] px-4 pb-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-[#fff4ef] px-6 py-8 sm:flex-row sm:px-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#ff541b] shadow-sm">
            <HiOutlineHeart className="h-7 w-7" />
          </div>
          <div>
            {title ? (
              <h3 className="font-serif text-xl font-extrabold text-[#0F172A] sm:text-2xl">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <Link
          href={buttonHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ff541b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64c10]"
        >
          {buttonLabel}
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}
