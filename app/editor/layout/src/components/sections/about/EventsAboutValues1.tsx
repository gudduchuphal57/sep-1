import {
  ArrowRight,
  Calendar,
  HeartHandshake,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { SectionProps } from "../../../types/section";

const iconMap: Record<string, LucideIcon> = {
  IconSparkles: Sparkles,
  IconUsers: Users,
  IconHeartHandshake: HeartHandshake,
  IconCalendar: Calendar,
  IconArrowRight: ArrowRight,
};

const renderIcon = (iconName: string | undefined, className: string) => {
  const IconComp = (iconName && iconMap[iconName]) || Sparkles;
  return <IconComp className={className} aria-hidden />;
};

export default function EventsAboutValues1({ data = {} }: SectionProps) {
  const values = data.values ?? [];

  return (
    <>
      {values.length > 0 && (
        <section
          data-editor-section-label="Values"
          data-editor-fields="values"
          className="mt-8 bg-white md:mt-10 lg:mt-14"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
                  Why Choose Us
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-4xl">
                  The values behind every experience
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {values.map((value, index) => (
                  <div
                    key={`${value.title}-${index}`}
                    className="rounded-[1.5rem] border border-[#f4d4e1] bg-[#fff5f8] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#d61b58] text-white">
                      {renderIcon(value.icon, "h-6 w-6")}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {value.desc}
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
