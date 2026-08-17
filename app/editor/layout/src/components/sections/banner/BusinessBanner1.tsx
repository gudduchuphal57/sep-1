import Image from "next/image";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function BusinessBanner1({ data = {} }: SectionProps) {
  return (
    <section
      className="relative flex w-full flex-col items-start justify-center overflow-hidden px-8 text-left md:px-24"
      style={{ minHeight: `${data.bannerHeight ?? 100}dvh` }}
    >
      {data.backgroundImage && (
        <Image
          src={data.backgroundImage}
          alt={data.backgroundImageTitle ?? data.title ?? ""}
          data-editor-media
          data-editor-media-type="image"
          data-editor-media-src={data.backgroundImage}
          fill
          priority
          sizes="100vw"
          unoptimized={data.backgroundImage.startsWith("data:")}
          className="z-0 object-cover"
        />
      )}

      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 mt-16 flex max-w-3xl flex-col items-start text-white">
        {data.pretitle && (
          <span className="mb-4 text-xs uppercase tracking-[0.2em] md:text-sm">
            {data.pretitle}
          </span>
        )}

        {data.title && (
          <h1 className="mb-6 font-serif text-4xl italic leading-tight tracking-wide text-[#cfa94e] md:text-6xl lg:text-7xl">
            {data.title}
          </h1>
        )}

        {data.desc && (
          <p className="mb-10 max-w-2xl text-sm font-light text-gray-200 md:text-lg">
            {data.desc}
          </p>
        )}

        {data.buttons && data.buttons.length > 0 && (
          <div className="flex flex-wrap justify-start gap-4">
            {data.buttons.map((btn, index) => (
              <Link
                key={`${btn.label}-${index}`}
                href={btn.href}
                className={
                  btn.variant === "primary"
                    ? "bg-[#c03a2b] px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#d95345]"
                    : "border border-white px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black"
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
