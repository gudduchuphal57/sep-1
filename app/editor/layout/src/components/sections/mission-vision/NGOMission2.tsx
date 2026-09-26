"use client";

import { useState } from "react";
import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type MissionFeature = {
  icon?: string;
  title?: string;
  desc?: string;
  description?: string;
};

type MissionTabContent = {
  primary?: string;
  secondary?: string;
  features?: MissionFeature[];
};

type MissionTab = {
  id?: string;
  label?: string;
  icon?: string;
  active?: boolean;
  title?: string;
  description?: string;
  desc?: string;
  features?: MissionFeature[];
  content?: MissionTabContent;
};

type TitleShape = { line1?: string; highlight?: string; line2?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getTabFeatures = (tab?: MissionTab): MissionFeature[] => {
  if (Array.isArray(tab?.content?.features) && tab.content.features.length) {
    return tab.content.features;
  }
  return Array.isArray(tab?.features) ? tab.features : [];
};

const getTabPrimary = (tab?: MissionTab) =>
  tab?.content?.primary || tab?.description || tab?.desc || "";

const getTabSecondary = (tab?: MissionTab) =>
  tab?.content?.secondary || "";

export const ngoMissionEditorFields = [
  "badge",
  "title",
  "tabs",
  "imageSection",
];

export default function NGOMission2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const title = (isRecord(data.title) ? data.title : {}) as TitleShape;
  const tabs = (Array.isArray(data.tabs) ? data.tabs : []) as MissionTab[];
  const imageSection = isRecord(data.imageSection) ? data.imageSection : {};
  const mainImage = isRecord(imageSection.mainImage)
    ? imageSection.mainImage
    : {};
  const purposeCard = isRecord(imageSection.purposeCard)
    ? imageSection.purposeCard
    : {};
  const imageSrc =
    (typeof mainImage.src === "string" && mainImage.src) ||
    (typeof imageSection.image === "string" && imageSection.image) ||
    (typeof imageSection.src === "string" && imageSection.src) ||
    (typeof data.image === "string" ? data.image : "") ||
    "";
  const imageAlt =
    (typeof mainImage.alt === "string" && mainImage.alt) ||
    (typeof imageSection.alt === "string" && imageSection.alt) ||
    "Mission image";

  const initialTab =
    tabs.find((tab) => tab.active)?.id ?? tabs[0]?.id ?? "mission";
  const [activeTab, setActiveTab] = useState(initialTab);
  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const activeFeatures = getTabFeatures(activeTabData);
  const showBrushTop = imageSection.showBrushTop !== false;
  const showRings = imageSection.showRings !== false;

  return (
    <section
      data-editor-section-label="Mission Vision"
      data-editor-fields={ngoMissionEditorFields.join(" ")}
      className="relative w-full bg-white"
    >
      <div className="relative min-h-[660px] w-full overflow-hidden bg-[#0c0f1d] p-0 sm:p-8 lg:p-12">
        {showBrushTop ? (
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-16 w-full overflow-hidden">
            <svg
              className="relative block h-16 w-full text-white"
              viewBox="0 0 1200 160"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L1200,0 L1200,48 C1165,40 1150,62 1118,48 C1085,34 1060,72 1028,52 C995,30 970,65 938,48 C900,30 875,75 838,50 C805,28 780,67 748,46 C710,25 685,73 650,48 C615,27 590,68 555,45 C520,25 495,75 458,48 C420,25 395,66 360,45 C325,25 300,72 265,48 C230,27 205,68 170,46 C135,27 105,67 75,48 C45,32 25,60 0,45 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ) : null}

        <div className="absolute inset-0 z-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-left md:object-center"
              sizes="100vw"
              unoptimized={isUnoptimizedImageSrc(imageSrc)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0c0f1d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/75 to-black/90 lg:from-transparent lg:via-black/60 lg:to-black/90" />
          {showRings ? (
            <div className="pointer-events-none absolute -bottom-28 -right-28 opacity-40">
              <div className="h-96 w-96 rounded-full border border-[#ff5e14]/40" />
              <div className="absolute inset-8 rounded-full border border-[#ff5e14]/30" />
              <div className="absolute inset-16 rounded-full border border-[#ff5e14]/20" />
              <div className="absolute inset-24 rounded-full border border-[#ff5e14]/10" />
            </div>
          ) : null}
        </div>

        <div className="relative z-10 flex w-full items-center justify-center lg:justify-end">
          <div className="w-full md:w-[85%] lg:w-[65%]">
            <div className="relative mx-auto w-full rounded-2xl border border-white/10 bg-[#101426]/95 p-4 text-white shadow-2xl backdrop-blur-lg sm:p-10 lg:p-12">
              <div className="absolute right-6 top-6 grid grid-cols-6 gap-1.5 opacity-20">
                {Array.from({ length: 30 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-1 w-1 rounded-full bg-slate-300"
                  />
                ))}
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ff5e14]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ff5e14]/30 bg-[#ff5e14]/10">
                  {renderNgoIcon(
                    (typeof badge?.icon === "string" && badge.icon) || "target",
                    "text-sm text-[#ff5e14]",
                  )}
                </span>
                <span>
                  {(typeof badge?.label === "string" && badge.label) ||
                    (typeof data.pretitle === "string"
                      ? data.pretitle
                      : "Our Purpose")}
                </span>
              </div>

              <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[48px] lg:leading-[1.15]">
                {title.line1 ||
                  (typeof data.title === "string" ? data.title : "Mission")}{" "}
                {title.highlight ? (
                  <span className="text-[#ff5e14]">{title.highlight}</span>
                ) : null}{" "}
                {title.line2}
              </h2>

              <div className="mt-4 flex items-center gap-1.5">
                <div className="h-0.5 w-10 bg-[#ff5e14]" />
                <div className="h-0.5 w-3 bg-slate-600" />
              </div>

              {tabs.length > 0 ? (
                <div className="mt-4 flex items-center gap-2 border-b border-slate-800 pb-3 md:mt-8 md:gap-6">
                  {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id ?? tab.label}
                        type="button"
                        onClick={() => tab.id && setActiveTab(tab.id)}
                        className={`relative flex cursor-pointer items-center gap-2 pb-1 text-sm font-semibold transition-colors md:text-lg ${
                          isActive
                            ? "text-[#ff5e14]"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {renderNgoIcon(
                          tab.icon || "target",
                          `text-base ${isActive ? "text-[#ff5e14]" : "text-slate-400"}`,
                        )}
                        <span>{tab.label || tab.title}</span>
                        {isActive ? (
                          <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[#ff5e14]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {activeTabData ? (
                <div className="mt-6 h-[300px] space-y-3 overflow-y-auto text-sm leading-relaxed text-slate-300 sm:h-[220px] sm:text-base">
                  {getTabPrimary(activeTabData) ? (
                    <p>{getTabPrimary(activeTabData)}</p>
                  ) : null}
                  {getTabSecondary(activeTabData) ? (
                    <p>{getTabSecondary(activeTabData)}</p>
                  ) : null}
                </div>
              ) : null}

              {activeFeatures.length > 0 ? (
                <div className="mt-0 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {activeFeatures.map((feature, index) => (
                    <div
                      key={`${feature.title}-${index}`}
                      className="flex flex-col rounded-xl border border-slate-800/80 bg-[#161b30] p-4 transition-all hover:border-[#ff5e14]/40"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#ff5e14]/20 bg-[#ff5e14]/10">
                        {renderNgoIcon(
                          feature.icon || "target",
                          "text-xl text-[#ff5e14]",
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white md:text-lg">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-slate-300">
                        {feature.description || feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {purposeCard.badge || purposeCard.title ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#121627]/90 p-5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ff5e14]/30 bg-[#ff5e14]/10 sm:h-14 sm:w-14">
                      {renderNgoIcon(
                        (typeof purposeCard.icon === "string" &&
                          purposeCard.icon) ||
                          "target",
                        "text-3xl text-[#ff5e14]",
                      )}
                    </div>
                    <div>
                      {typeof purposeCard.badge === "string" ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e14] sm:text-sm">
                          {purposeCard.badge}
                        </span>
                      ) : null}
                      {typeof purposeCard.title === "string" ? (
                        <h4 className="mt-0.5 text-sm font-bold text-white sm:text-lg">
                          {purposeCard.title}
                        </h4>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
