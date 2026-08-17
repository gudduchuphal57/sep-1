"use client";

import {
  Coins,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  EventsCareersApplyFormData,
  EventsWhyJoinUsItemData,
  SectionProps,
} from "../../../types/section";

const iconMap: Record<string, LucideIcon> = {
  IconTrendingUp: TrendingUp,
  IconUsers: Users,
  IconCoin: Coins,
  IconHeartHandshake: HeartHandshake,
};

const renderIcon = (iconName: string | undefined, className: string) => {
  const IconComp = (iconName && iconMap[iconName]) || Sparkles;
  return <IconComp className={className} aria-hidden />;
};

export default function EventsCareersApplyWhyJoinUs1({ data = {} }: SectionProps) {
  const items = (data.whyJoinUs ?? []) as EventsWhyJoinUsItemData[];
  const formConfig = (data.applyForm ?? {}) as EventsCareersApplyFormData;

  if (!items.length) return null;

  return (
    <section
      data-editor-section-label="Why Join Us"
      data-editor-fields="whyJoinUs"
      className="rounded-[2rem] border border-[#f4d4e1]/60 bg-white p-6 shadow-sm shadow-[#d61b58]/5"
    >
      <h3 className="mb-2 text-lg font-extrabold tracking-tight text-slate-900">
        {formConfig.whyJoinUsTitle ?? "Why Join Us?"}
      </h3>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fde8ef] bg-[#fff5f8] text-[#d61b58] shadow-sm">
              {renderIcon(item.icon, "h-5 w-5")}
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight text-slate-800">
                {item.title}
              </h4>
              {item.description && (
                <p className="mt-1 text-xs leading-normal text-slate-500">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
