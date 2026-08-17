import {
  Award,
  Globe,
  Heart,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { SectionProps, WhyChooseUsItemData } from "../../../types/section";

const iconMap: Record<string, LucideIcon> = {
  IconTarget: Target,
  IconStar: Star,
  IconWorld: Globe,
  IconHeart: Heart,
  IconShieldCheck: ShieldCheck,
  IconSparkles: Sparkles,
  IconBulb: Lightbulb,
  IconAward: Award,
  IconUsers: Users,
};

const renderIcon = (iconName: string | undefined, className: string) => {
  const IconComp = (iconName && iconMap[iconName]) || Sparkles;
  return <IconComp className={className} aria-hidden />;
};

export default function EventsCoreBeliefs1({ data = {} }: SectionProps) {
  const coreBeliefs = (data.coreBeliefs ?? []) as WhyChooseUsItemData[];

  return (
    <>
      {coreBeliefs.length > 0 && (
        <section
          data-editor-section-label="Core Beliefs"
          data-editor-fields="coreBeliefsPretitle coreBeliefsTitle coreBeliefs"
          className="mt-8 bg-white md:mt-10 lg:mt-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              {data.coreBeliefsPretitle && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
                  {data.coreBeliefsPretitle}
                </p>
              )}
              {data.coreBeliefsTitle && (
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-4xl">
                  {data.coreBeliefsTitle}
                </h2>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coreBeliefs.map((belief, index) => (
                <div
                  key={`${belief.title}-${index}`}
                  className="group relative flex flex-col items-center rounded-[2rem] border border-[#f4d4e1] bg-[#fff5f8] p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#d61b58] text-white shadow-lg shadow-[#d61b58]/30 transition-transform duration-300 group-hover:scale-110">
                    {renderIcon(belief.icon, "h-7 w-7")}
                  </div>
                  <h3 className="mb-3 text-base font-bold text-slate-900">
                    {belief.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {belief.description ?? belief.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
