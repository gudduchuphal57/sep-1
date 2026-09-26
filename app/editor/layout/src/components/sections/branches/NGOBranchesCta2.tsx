"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBranchesCta2({ data = {} }: SectionProps) {
  const ctaBanner = isRecord(data.ctaBanner) ? data.ctaBanner : undefined;
  const nestedImage = isRecord(ctaBanner?.image) ? ctaBanner.image : undefined;
  const nestedPrimary = isRecord(ctaBanner?.primaryButton)
    ? ctaBanner.primaryButton
    : undefined;
  const nestedSecondary = isRecord(ctaBanner?.secondaryButton)
    ? ctaBanner.secondaryButton
    : undefined;
  const primaryButton = isRecord(data.ctaPrimaryButton)
    ? data.ctaPrimaryButton
    : nestedPrimary;
  const secondaryButton = isRecord(data.ctaSecondaryButton)
    ? data.ctaSecondaryButton
    : nestedSecondary;
  const label =
    (typeof data.ctaLabel === "string" && data.ctaLabel) ||
    (typeof ctaBanner?.label === "string" && ctaBanner.label) ||
    "";
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof ctaBanner?.title === "string" && ctaBanner.title) ||
    "";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof ctaBanner?.description === "string" && ctaBanner.description) ||
    "";
  const imageSrc =
    (typeof data.ctaImage === "string" && data.ctaImage) ||
    (typeof nestedImage?.src === "string" && nestedImage.src) ||
    "";
  const imageAlt =
    (typeof nestedImage?.alt === "string" && nestedImage.alt) || "Branch CTA";

  if (!label && !title && !description && !imageSrc) return null;

  return (
    <section
      data-editor-section-label="Branches CTA"
      data-editor-fields="ctaLabel ctaTitle ctaDesc ctaPrimaryButton ctaSecondaryButton ctaImage"
      className="mx-auto max-w-6xl px-2 pb-10 font-sans text-gray-800 sm:px-4"
    >
      <div className="relative overflow-hidden rounded-2xl bg-orange-50">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          <div className="relative z-10 p-2 sm:p-8 md:p-10 lg:p-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-600 sm:h-20 sm:w-20">
                <Image
                  src="/heartImage.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-10 w-10 sm:h-16 sm:w-16"
                  unoptimized={isUnoptimizedImageSrc("/heartImage.png")}
                />
              </div>

              {label ? (
                <p className="text-sm font-semibold tracking-widest text-orange-600">
                  {label}
                </p>
              ) : null}
            </div>

            {title ? (
              <h2 className="mb-3 text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            ) : null}

            <div className="mb-2 flex flex-wrap justify-center gap-1 sm:justify-start sm:gap-3">
              {primaryButton ? (
                <Link
                  href={
                    (typeof primaryButton.href === "string" &&
                      primaryButton.href) ||
                    "#"
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 p-2 text-sm font-semibold text-white transition hover:bg-orange-700 sm:px-6 sm:py-2.5"
                >
                  {(typeof primaryButton.label === "string" &&
                    primaryButton.label) ||
                    "Donate Now"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}

              {secondaryButton ? (
                <Link
                  href={
                    (typeof secondaryButton.href === "string" &&
                      secondaryButton.href) ||
                    "#"
                  }
                  className="inline-flex items-center gap-2 rounded-full border-2 border-orange-600 p-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 sm:px-6 sm:py-2.5"
                >
                  {(typeof secondaryButton.label === "string" &&
                    secondaryButton.label) ||
                    "Contact Us"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="relative h-64 min-h-[280px] lg:h-full">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                unoptimized={isUnoptimizedImageSrc(imageSrc)}
              />
            ) : null}

            <svg
              className="absolute left-0 top-0 hidden h-full w-24 lg:block"
              viewBox="0 0 100 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M100 0 C40 80 40 320 100 400 L0 400 L0 0 Z"
                fill="#FFF7ED"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
