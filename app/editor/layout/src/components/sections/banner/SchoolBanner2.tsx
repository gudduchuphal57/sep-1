import Image from "next/image";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function SchoolBanner2({ data = {} }: SectionProps) {
  const background =
    data.bannerBackgroundMode === "gradient"
      ? `linear-gradient(135deg, ${data.bannerBackgroundColor ?? "#ffd84d"}, ${data.bannerGradientColor ?? "#ffd84d"})`
      : data.bannerBackgroundMode === "solid"
        ? (data.bannerBackgroundColor ?? "#ffd84d")
        : "#ffd84d";

  return (
    <section
      className="grid w-full overflow-hidden lg:grid-cols-[55%_45%]"
      style={{ minHeight: `${data.bannerHeight ?? 70}dvh`, background }}
    >
      <div className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-20 xl:px-28">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.3em] text-[#27528a]">
          {data.pretitle}
        </p>
        <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.045em] text-[#102f55] sm:text-6xl xl:text-7xl">
          {data.title}
        </h1>
        <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#324d68]">
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
                    ? "inline-flex rounded-xl border-2 border-[#102f55] px-6 py-3 text-sm font-bold text-[#102f55]"
                    : "inline-flex rounded-xl bg-[#102f55] px-6 py-3 text-sm font-bold text-white shadow-[5px_5px_0_#ef6b5b]"
                }
              >
                {button.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative min-h-[420px] overflow-hidden bg-[#102f55] lg:my-10 lg:mr-10 lg:rounded-[48%_48%_8px_8px]">
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
            sizes="(min-width: 1024px) 45vw, 100vw"
            unoptimized={data.backgroundImage.startsWith("data:")}
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102f55]/65 to-transparent" />
        <p className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold uppercase tracking-[0.22em] text-white">
          Learn · Create · Belong
        </p>
      </div>
    </section>
  );
}
