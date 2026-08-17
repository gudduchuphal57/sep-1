"use client";

import Image from "next/image";
import { BadgeCheck, Handshake, Home, Scale } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";

type TextItem = { title: string; desc: string; image?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getTextItems = (value: unknown): TextItem[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
      isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.desc === "string"
        ? [{
          title: item.title,
          desc: item.desc,
          image: typeof item.image === "string" ? item.image : undefined,
        }]
        : [],
    )
    : [];

const valueIcons = [Scale, BadgeCheck, Handshake, Home];
const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

export default function RealEstateMissionVision1({ data = {} }: SectionProps) {
  const pillars = getTextItems(data.pillars);
  const values = getTextItems(data.values);
  const sideImage = typeof data.sideImage === "string" ? data.sideImage : undefined;

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        editorFields={["pretitle", "title", "desc", "desc2"]}
        pretitle={data.pretitle ?? "Our mission"}
        title={data.title ?? "Help every family move with confidence."}
        desc={(data.desc || data.desc2) ? (
          <>
            {data.desc && <p>{data.desc}</p>}
            {data.desc2 && <p className="mt-3 text-sm md:text-base">{data.desc2}</p>}
          </>
        ) : undefined}
      />

      <section
        data-editor-section-label="Mission Pillars"
        data-editor-fields="sideImage sideImageTitle pillarsPretitle pillarsTitle pillars"
        className="bg-[#14251f] px-5 py-14 text-white md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {sideImage && (
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.25rem] bg-white/5 md:min-h-[540px]">
              <Image src={sideImage} alt={typeof data.sideImageTitle === "string" ? data.sideImageTitle : "HAUS Group mission"} fill unoptimized={isRemoteImage(sideImage)} className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e9ad91]">{typeof data.pillarsPretitle === "string" ? data.pillarsPretitle : "How we work"}</p>
            <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">{typeof data.pillarsTitle === "string" ? data.pillarsTitle : "Promises behind every shortlist."}</h2>
            <div className="mt-9 space-y-6">
              {pillars.map((item, index) => (
                <article key={item.title} className="border-t border-white/15 pt-6">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-[#e9ad91]">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-editor-section-label="Company Values"
        data-editor-fields="valuesPretitle valuesTitle values"
        className="px-5 py-14 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a4472f]">{typeof data.valuesPretitle === "string" ? data.valuesPretitle : "What we stand for"}</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-[-0.03em] md:text-4xl">{typeof data.valuesTitle === "string" ? data.valuesTitle : "Principles that shape every conversation."}</h2>
          <div data-box-layout-grid="grid" className="mt-10 grid gap-px overflow-hidden rounded-[1.25rem] border border-[#141414]/10 bg-[#141414]/10 sm:grid-cols-2">
            {values.map((item, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <article key={item.title} className="bg-[#f8f6f1] p-7 md:p-9">
                  <span className="relative mx-auto grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white text-[#a4472f]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized={item.image.startsWith("data:") || isRemoteImage(item.image)}
                        className="object-contain p-2.5"
                        sizes="44px"
                        data-editor-media
                        data-editor-media-type="image"
                        data-editor-media-src={item.image}
                      />
                    ) : (
                      <Icon size={20} />
                    )}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#141414]/60">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
