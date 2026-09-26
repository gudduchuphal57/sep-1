"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type SupportCard = {
  id?: string | number;
  icon?: string;
  iconName?: string;
  title?: string;
  description?: string;
  action?: { label?: string; url?: string; href?: string };
  button?: { label?: string; href?: string };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOSupportWays2({ data = {} }: SectionProps) {
  const waysToSupport = isRecord(data.waysToSupport) ? data.waysToSupport : {};
  const pretitle =
    (typeof data.waysPretitle === "string" && data.waysPretitle) ||
    (typeof waysToSupport.topBadge === "string" && waysToSupport.topBadge) ||
    "WAYS TO SUPPORT";
  const title =
    (typeof data.waysTitle === "string" && data.waysTitle) ||
    (typeof waysToSupport.heading === "string" && waysToSupport.heading) ||
    "Every Action Helps Us Bring Change";
  const supportCards = (
    Array.isArray(data.supportCards)
      ? data.supportCards
      : Array.isArray(waysToSupport.supportCards)
        ? waysToSupport.supportCards
        : Array.isArray(data.cards)
          ? data.cards
          : []
  ) as SupportCard[];

  if (!supportCards.length && !title && !pretitle) return null;

  return (
    <section
      data-editor-section-label="Ways to Support"
      data-editor-fields="waysPretitle waysTitle supportCards"
      data-editor-card-fields="icon title description button"
      className="w-full bg-[#FAF9F6] px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-xs sm:p-10">
        <div className="flex items-center justify-center gap-3">
          <HiOutlineHeart className="text-base text-orange-500 sm:text-lg" />
          <span className="text-sm font-bold uppercase tracking-widest text-[#EA580C]">
            {pretitle}
          </span>
        </div>
        {title ? (
          <h2 className="pt-0 font-serif text-2xl font-bold text-slate-900 sm:text-4xl">
            {title}
          </h2>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {supportCards.map((card, index) => {
            const action = isRecord(card.action) ? card.action : undefined;
            const button = isRecord(card.button) ? card.button : undefined;
            const href =
              (typeof button?.href === "string" && button.href) ||
              (typeof action?.href === "string" && action.href) ||
              (typeof action?.url === "string" && action.url) ||
              "#";
            const label =
              (typeof button?.label === "string" && button.label) ||
              (typeof action?.label === "string" && action.label) ||
              "Learn More";

            return (
              <div
                key={card.id ?? `${card.title}-${index}`}
                className="flex flex-col items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-5 text-center transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-orange-100 bg-orange-50 sm:h-24 sm:w-24">
                    {renderNgoIcon(
                      card.icon || card.iconName || "heart",
                      "h-8 w-8 text-[#EA580C] sm:h-10 sm:w-10",
                    )}
                  </div>
                  <h3 className="mb-2 font-serif text-sm font-bold text-slate-900 sm:text-base">
                    {card.title}
                  </h3>
                  {card.description ? (
                    <p className="text-sm leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6 w-full">
                  <a
                    href={href}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-orange-700"
                  >
                    {label}
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
