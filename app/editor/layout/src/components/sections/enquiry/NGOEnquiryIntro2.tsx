"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOEnquiryIntro2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header.label === "string" && header.label) ||
    "ENQUIRY NOW";
  const heading =
    (typeof data.heading === "string" && data.heading) ||
    (typeof header.heading === "string" && header.heading) ||
    "";
  const rawTitle = typeof data.title === "string" ? data.title.trim() : "";
  const titleLooksLikeBanner =
    !rawTitle ||
    rawTitle.toLowerCase() === "enquiry" ||
    rawTitle.toLowerCase() === "enquiry now";
  const title = titleLooksLikeBanner
    ? heading || "We're Here to Help You"
    : rawTitle;
  const desc =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header.description === "string" && header.description) ||
    "";

  return (
    <section
      data-editor-section-label="Enquiry Intro"
      data-editor-fields="pretitle title desc"
      className="bg-white text-gray-800"
    >
      <div className="mx-auto max-w-4xl px-2 pb-10 pt-8 text-center sm:pt-12">
        <div className="flex justify-center gap-1">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="mb-0 text-sm font-semibold tracking-widest text-orange-600">
            {pretitle}
          </p>
        </div>
        <h2 className="mb-0 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h2>
        {desc ? (
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
            {desc}
          </p>
        ) : null}
      </div>
    </section>
  );
}
