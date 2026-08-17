import Image from "next/image";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function EcommerceBanner2({ data = {} }: SectionProps) {
  const background =
    data.bannerBackgroundMode === "gradient"
      ? `linear-gradient(135deg, ${data.bannerBackgroundColor ?? "#f7f4ef"}, ${data.bannerGradientColor ?? "#f7f4ef"})`
      : data.bannerBackgroundMode === "solid"
        ? (data.bannerBackgroundColor ?? "#f7f4ef")
        : "#f7f4ef";

  return (
    <section
      className="grid w-full overflow-hidden lg:grid-cols-[46%_54%]"
      style={{ minHeight: `${data.bannerHeight ?? 70}dvh`, background }}
    >
      <div className="relative order-2 flex flex-col justify-center px-6 py-16 sm:px-12 lg:order-1 lg:px-16 xl:px-24">
        <span className="absolute right-5 top-2 font-serif text-[9rem] leading-none text-[#281d18]/5">
          02
        </span>
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.38em] text-[#a05b43]">
          {data.pretitle}
        </p>
        <h1 className="max-w-2xl font-serif text-5xl leading-[0.98] text-[#281d18] sm:text-6xl xl:text-7xl">
          {data.title}
        </h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-[#74645d]">
          {data.desc}
        </p>
        {data.buttons?.length ? (
          <div className="mt-9 flex flex-wrap gap-3">
            {data.buttons.map((button, index) => (
              <Link
                key={`${button.label}-${index}`}
                href={button.href}
                className={
                  button.variant === "secondary"
                    ? "inline-flex rounded-full border border-[#281d18] px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#281d18]"
                    : "inline-flex rounded-full bg-[#a05b43] px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white"
                }
              >
                {button.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative order-1 min-h-[430px] lg:order-2 lg:m-6 lg:ml-0">
        {data.bannerBackgroundMode === "video" && data.backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={data.backgroundImage}
            data-editor-media
            data-editor-media-type="video"
            data-editor-media-src={data.backgroundVideo}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={data.backgroundVideo} />
          </video>
        ) : data.backgroundImage ? (
          <Image
            src={data.backgroundImage}
            alt={data.backgroundImageTitle ?? data.title ?? ""}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={data.backgroundImage}
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            unoptimized={data.backgroundImage.startsWith("data:")}
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
        <div className="absolute bottom-5 right-5 rounded-full bg-[#f7f4ef] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#281d18]">
          New collection
        </div>
      </div>
    </section>
  );
}
