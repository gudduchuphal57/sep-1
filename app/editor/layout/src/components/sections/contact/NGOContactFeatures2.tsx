"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type FeatureCard = {
  icon?: string;
  title?: string;
  description?: string;
};

export default function NGOContactFeatures2({ data = {} }: SectionProps) {
  const cards = (
    Array.isArray(data.cards)
      ? data.cards
      : Array.isArray(data.features)
        ? data.features
        : []
  ) as FeatureCard[];

  if (cards.length === 0) return null;

  return (
    <section
      data-editor-section-label="Contact Features"
      data-editor-fields="cards"
      data-editor-card-fields="icon title description"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex items-start gap-4 lg:px-6 first:lg:pl-0 last:lg:pr-0"
            >
              {/* Icon Circle Container */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f95738]/10">
                {renderNgoIcon(
                  card.icon || "headset",
                  "h-6 w-6 text-[#f95738]",
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
