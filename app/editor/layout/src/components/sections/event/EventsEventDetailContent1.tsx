"use client";

import Image from "next/image";
import type {
  EventsEventCategoryItemData,
  EventsFeatureItemData,
  SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderEventsIcon as renderIcon } from "../../../lib/eventsIcons";

export default function EventsEventDetailContent1({ data = {} }: SectionProps) {
  const item = data as EventsEventCategoryItemData;
  const heroImage = item.heroImage ?? item.image;
  const intro = item.introDescription;
  const features = (item.features ?? []) as EventsFeatureItemData[];

  return (
    <section
      data-editor-section-label="Event Detail"
      data-editor-fields="heroImage introDescription features"
      className="mx-auto mt-8 max-w-7xl bg-zinc-50 px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {heroImage && (
            <div className="relative h-[300px] w-full overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white p-3 shadow-[0_24px_80px_-40px_rgba(214,27,88,0.25)] sm:h-[450px]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src={heroImage}
                  alt={item.imageAlt ?? item.title ?? "Event category"}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized={isUnoptimizedImageSrc(heroImage)}
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {intro && (
              <p className="text-base leading-6 text-slate-600">{intro}</p>
            )}

            {features.length > 0 && (
              <div className="grid gap-4 pt-6 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={`${feature.title}-${index}`}
                    className="flex gap-4 rounded-2xl border border-[#f4d4e1] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fee4ee] text-[#d61b58]">
                      {renderIcon(feature.icon, "h-5 w-5")}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {feature.title}
                      </h5>
                      <p className="mt-1 text-xs leading-snug text-slate-500 sm:text-sm">
                        {feature.description ?? feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </section>
  );
}
