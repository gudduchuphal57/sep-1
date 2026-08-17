"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles, Waves } from "lucide-react";
import type { SectionProps } from "../../../types/section";

const defaultPrinciples = [
  {
    title: "Exceptional materials",
    desc: "Silks selected for their texture, movement, and enduring finish.",
  },
  {
    title: "Precise craftsmanship",
    desc: "Every seam, fastening, and silhouette is considered by hand.",
  },
  {
    title: "Modern elegance",
    desc: "Heritage techniques shaped into pieces made for life today.",
  },
];

const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

export default function BusinessAboutPage1({ data = {} }: SectionProps) {
  const sideImage = data.sideImage;
  const primaryButton = data.buttons?.[0];
  const principles = Array.isArray(data.principles)
    ? data.principles.flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return [];
        const principle = item as Record<string, unknown>;
        return typeof principle.title === "string" && typeof principle.desc === "string"
          ? [{ title: principle.title, desc: principle.desc }]
          : [];
      })
    : defaultPrinciples;
  const principleIcons = [Waves, Scissors, Sparkles];

  return (
    <main className="bg-[#fbfaf6] text-[#1c1a17]">
    <section data-editor-section-label="Brand Story" className="px-5 py-14 md:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a7147]">
              {data.pretitle ?? "Our heritage"}
            </p>
            <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {data.title ?? "A Century of Silk"}
            </h1>
            {data.desc && (
              <p className="mt-7 max-w-xl text-base leading-8 text-[#1c1a17]/68">
                {data.desc}
              </p>
            )}
            {data.desc2 && (
              <p className="mt-4 max-w-xl text-base leading-8 text-[#1c1a17]/68">
                {data.desc2}
              </p>
            )}

            {primaryButton && (
              <Link
                href={primaryButton.href === "#" ? "/contact" : primaryButton.href}
                className="mt-9 inline-flex items-center gap-2 border-b border-[#1c1a17] pb-1 text-sm font-semibold uppercase tracking-[0.12em] transition hover:text-[#9a7147]"
              >
                {primaryButton.label}
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <div className="order-1 lg:order-2">
            {sideImage ? (
              <div className="relative min-h-[420px] overflow-hidden bg-[#e8e1d7] sm:min-h-[560px] lg:min-h-[680px]">
                <Image
                  src={sideImage}
                  alt={data.sideImageTitle ?? data.title ?? "Our heritage"}
                  fill
                  priority
                  unoptimized={isRemoteImage(sideImage)}
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            ) : (
              <div className="min-h-[420px] bg-[#e8e1d7] sm:min-h-[560px]" />
            )}
          </div>
        </div>
      </section>

      <section data-editor-section-label="Brand Principles" className="border-y border-[#1c1a17]/10 bg-white px-5 py-14 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {principles.map(({ title, desc }, index) => {
              const Icon = principleIcons[index % principleIcons.length];
              return (
              <article
                key={title}
                className={`px-2 md:px-8 ${
                  index > 0 ? "md:border-l md:border-[#1c1a17]/10" : ""
                }`}
              >
                <Icon size={24} strokeWidth={1.4} className="text-[#9a7147]" />
                <h2 className="mt-5 font-serif text-2xl">{title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#1c1a17]/60">
                  {desc}
                </p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section data-editor-section-label="Collection CTA" className="px-5 py-14 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 bg-[#211e1a] px-7 py-10 text-white md:flex-row md:items-center md:px-12 md:py-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d6b58f]">
              {typeof data.ctaPretitle === "string" ? data.ctaPretitle : "Private consultation"}
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight md:text-4xl">
              {typeof data.ctaTitle === "string" ? data.ctaTitle : "Discover a piece shaped around you."}
            </h2>
          </div>
          <Link
            href={typeof data.ctaHref === "string" ? data.ctaHref : "/contact"}
            className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-white hover:text-[#211e1a]"
          >
            {typeof data.ctaLabel === "string" ? data.ctaLabel : "Book a consultation"} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
