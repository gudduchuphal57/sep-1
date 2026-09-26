"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type TitleShape = { line1?: string; highlight?: string };
type ButtonShape = { label?: string; text?: string; href?: string; link?: string };
type FloatingCard = {
  title?: string;
  value?: string;
  label?: string;
  image?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGODonation2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const title = (isRecord(data.title) ? data.title : {}) as TitleShape;
  const description =
    (typeof data.description === "string" && data.description) ||
    (typeof data.desc === "string" && data.desc) ||
    "";
  const button = (isRecord(data.button) ? data.button : {}) as ButtonShape;
  const image =
    (typeof data.image === "string" && data.image) ||
    (isRecord(data.image) && typeof data.image.src === "string"
      ? data.image.src
      : "") ||
    "";
  const imageAlt =
    (isRecord(data.image) && typeof data.image.alt === "string"
      ? data.image.alt
      : "Donation") || "Donation";
  const floatingCard = (isRecord(data.floatingCard)
    ? data.floatingCard
    : undefined) as FloatingCard | undefined;
  const signature = isRecord(data.signature) ? data.signature : undefined;

  return (
    <section
      data-editor-section-label="Donation"
      data-editor-fields="badge title description button image floatingCard signature"
      className="relative overflow-hidden bg-[#fafafa] px-0 py-8 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-red-100">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">
            <div className="z-10 flex flex-col items-center px-3 py-10 text-center sm:px-10 lg:col-span-6 lg:items-start lg:py-14 lg:pl-14 lg:text-left">
              <div className="inline-flex items-center gap-2.5">
                <FiHeart className="text-[#FF4500]" />
                <span className="text-sm font-bold uppercase tracking-wider text-[#FF4500]">
                  {(badge?.label as string) ||
                    (typeof data.pretitle === "string"
                      ? data.pretitle
                      : "Support Us")}
                </span>
              </div>
              <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                {title.line1 ||
                  (typeof data.title === "string"
                    ? data.title
                    : "Help Us Make a")}{" "}
                <span className="text-[#FF4500]">
                  {title.highlight || "Change"}
                </span>
              </h2>
              <div className="mt-2 flex items-center gap-2 text-[#FF4500]">
                <span className="h-[2px] w-12 bg-[#FF4500]" />
                <FiHeart className="text-sm" />
                <span className="h-[2px] w-12 bg-[#FF4500]" />
              </div>
              {description ? (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              ) : null}
              {(button.label || button.text) ? (
                <div className="mt-6">
                  <Link
                    href={button.href || button.link || "/donate"}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff541b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64c10]"
                  >
                    {button.label || button.text}
                    <FiArrowRight />
                  </Link>
                </div>
              ) : null}
              {signature && (signature.name || signature.title) ? (
                <div className="mt-6 text-sm text-slate-500">
                  <p className="font-semibold text-slate-800">
                    {(signature.name as string) || ""}
                  </p>
                  <p>{(signature.title as string) || ""}</p>
                </div>
              ) : null}
            </div>

            <div className="relative lg:col-span-6">
              <div className="relative h-[320px] w-full sm:h-[420px] lg:h-full lg:min-h-[480px]">
                {image ? (
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={isUnoptimizedImageSrc(image)}
                  />
                ) : (
                  <div className="h-full w-full bg-orange-50" />
                )}
                {floatingCard ? (
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:left-auto sm:right-6 sm:w-64">
                    <p className="text-sm font-semibold text-slate-800">
                      {floatingCard.title || floatingCard.label}
                    </p>
                    {floatingCard.value ? (
                      <p className="mt-1 text-2xl font-extrabold text-[#ff541b]">
                        {floatingCard.value}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
