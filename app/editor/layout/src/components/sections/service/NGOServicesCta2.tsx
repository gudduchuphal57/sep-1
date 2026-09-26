"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOServicesCta2({ data = {} }: SectionProps) {
  const callToAction = isRecord(data.callToAction) ? data.callToAction : undefined;
  if (!callToAction) return null;

  return (
    <section
      data-editor-section-label="Services CTA"
      data-editor-fields="callToAction"
      className="mx-auto max-w-7xl bg-[#fdfcfc] px-3 pb-8 text-[#1a1a1a] sm:px-6 sm:pb-12 lg:px-8"
    >
      <div className="relative min-h-[280px] overflow-hidden rounded-2xl">
        {typeof callToAction.bannerImage === "string" ? (
          <Image
            src={callToAction.bannerImage}
            alt={
              (typeof callToAction.buttonText === "string" &&
                callToAction.buttonText) ||
              "CTA"
            }
            fill
            sizes="100vw"
            className="object-cover object-center"
            unoptimized={isUnoptimizedImageSrc(callToAction.bannerImage)}
          />
        ) : null}

        <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-white via-white/95 to-transparent" />

        <div className="relative z-10 grid min-h-[280px] grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-5 sm:p-8 lg:col-span-7 lg:p-12">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#111111] sm:text-3xl lg:text-4xl">
                {(typeof callToAction.titlePrefix === "string" &&
                  callToAction.titlePrefix) ||
                  ""}
                <span className="text-orange-500">
                  {(typeof callToAction.titleHighlight === "string" &&
                    callToAction.titleHighlight) ||
                    ""}
                </span>
              </h2>

              {typeof callToAction.description === "string" ? (
                <p className="max-w-xl text-sm leading-relaxed text-slate-600 lg:text-base">
                  {callToAction.description}
                </p>
              ) : null}

              <div className="pt-2">
                <Link
                  href={
                    (typeof callToAction.buttonLink === "string" &&
                      callToAction.buttonLink) ||
                    "#"
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 sm:px-7 sm:py-3"
                >
                  <span>
                    {(typeof callToAction.buttonText === "string" &&
                      callToAction.buttonText) ||
                      "Get Involved"}
                  </span>
                  <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
