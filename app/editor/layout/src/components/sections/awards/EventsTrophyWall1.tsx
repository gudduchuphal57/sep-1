import {
  Briefcase,
  Gem,
  HeartHandshake,
  Lightbulb,
  Music,
  Rocket,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type {
  EventsAwardItemData,
  SectionProps,
} from "../../../types/section";

const iconMap: Record<string, LucideIcon> = {
  IconTrophy: Trophy,
  IconBulb: Lightbulb,
  IconHeartHandshake: HeartHandshake,
  IconBriefcase: Briefcase,
  IconRings: Gem,
  IconStar: Star,
  IconRocket: Rocket,
  IconMusic: Music,
  IconAward: Trophy,
};

const renderIcon = (iconName: string | undefined, className: string) => {
  const IconComp = (iconName && iconMap[iconName]) || Trophy;
  return <IconComp className={className} aria-hidden />;
};

export default function EventsTrophyWall1({ data = {} }: SectionProps) {
  const awards = (data.awards ?? []) as EventsAwardItemData[];

  if (!awards.length) return null;

  return (
    <section
      data-editor-section-label="Trophy Wall"
      data-editor-fields="awardsPretitle awardsTitle awards"
      className="mt-8 bg-[#fff5f8] py-8 md:mt-10 md:py-10 lg:mt-14 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          {data.awardsPretitle && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
              {data.awardsPretitle}
            </p>
          )}
          {data.awardsTitle && (
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {data.awardsTitle}
            </h2>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award, index) => (
            <div
              key={`${award.year}-${award.title}-${index}`}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-[#f4d4e1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#f4d4e1] bg-[#fff1f5] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d61b58] text-white shadow-md shadow-[#d61b58]/30 transition-transform duration-300 group-hover:scale-110">
                    {renderIcon(award.icon, "h-5 w-5")}
                  </div>
                  {award.category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d61b58]">
                      {award.category}
                    </span>
                  )}
                </div>
                {award.year && (
                  <span className="rounded-full border border-[#f4d4e1] bg-white px-3 py-1 text-xs font-extrabold text-slate-400">
                    {award.year}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col space-y-1 p-5">
                <h3 className="text-base font-extrabold leading-snug text-slate-900">
                  {award.title}
                </h3>
                {award.body && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#d61b58]">
                    {award.body}
                  </p>
                )}
                {award.description && (
                  <p className="pt-1 text-sm leading-6 text-slate-500">
                    {award.description}
                  </p>
                )}
              </div>

              <div className="h-0.5 w-0 bg-[#d61b58] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
