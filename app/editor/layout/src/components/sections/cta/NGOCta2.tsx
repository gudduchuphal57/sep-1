"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCta2({ data = {} }: SectionProps) {
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title
      : "Want You Know How Can Help?";
  const description =
    typeof data.desc === "string" && data.desc.trim()
      ? data.desc
      : typeof data.description === "string" && data.description.trim()
        ? data.description
        : "Join our mission by donating, volunteering, or partnering with us to create sustainable change for communities around the world.";
  const button = isRecord(data.button)
    ? (data.button as { label?: string; href?: string })
    : undefined;
  const buttonLabel = button?.label?.trim() || "Donate Now";
  const buttonHref = button?.href || "/donate";

  return (
    <section
      data-editor-section-label="CTA Content"
      data-editor-fields="title desc button"
      className="flex min-h-[260px] items-center justify-center bg-[#232042] py-10 text-center text-white sm:min-h-[280px]"
    >
      <div className="mx-auto max-w-xl px-4">
        <h2 className="font-serif text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-slate-300 opacity-90">
          {description}
        </p>
        <div className="mt-6">
          <Link
            href={buttonHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#463E75] px-7 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#524989] md:px-12"
          >
            <span>{buttonLabel}</span>
            <FiArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
