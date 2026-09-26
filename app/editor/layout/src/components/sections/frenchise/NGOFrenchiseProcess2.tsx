"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type ProcessStep = {
  number?: number | string;
  icon?: string;
  title?: string;
  description?: string;
};

export default function NGOFrenchiseProcess2({ data = {} }: SectionProps) {
  const processSection = isRecord(data.processSection) ? data.processSection : {};
  const processPretitle =
    (typeof data.processPretitle === "string" && data.processPretitle) ||
    (typeof processSection.label === "string" && processSection.label) ||
    "OUR FRANCHISE PROCESS";
  const processTitle =
    (typeof data.processTitle === "string" && data.processTitle) ||
    (typeof processSection.title === "string" && processSection.title) ||
    "";
  const steps = (
    Array.isArray(data.steps)
      ? data.steps
      : Array.isArray(processSection.steps)
        ? processSection.steps
        : []
  ) as ProcessStep[];

  return (
    <section
      data-editor-section-label="Franchise Process"
      data-editor-fields="processPretitle processTitle steps"
      data-editor-card-fields="icon title description"
      className="mx-auto max-w-6xl bg-white px-4 pb-16"
    >
      <div className="mb-10 text-center">
        <div className="mb-0 flex items-center justify-center gap-1">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="text-sm font-semibold tracking-widest text-orange-600">
            {processPretitle}
          </p>
        </div>
        {processTitle ? (
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {processTitle}
          </h2>
        ) : null}
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-orange-200 lg:block" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-200 bg-white text-orange-600 shadow-sm">
                {renderNgoIcon(step.icon || "handshake", "h-7 w-7")}
              </div>
              <p className="mb-1 text-sm font-bold text-gray-900">
                {step.number ?? index + 1}. {step.title}
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
