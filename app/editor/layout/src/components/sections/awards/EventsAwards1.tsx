"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  HeartHandshake,
  Medal,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AwardStatItemData, SectionProps } from "../../../types/section";

type ParsedAward = AwardStatItemData & {
  target: number;
  suffix: string;
};

const iconMap: Record<string, LucideIcon> = {
  IconAward: Award,
  IconRibbon: Medal,
  IconStar: Star,
  IconUsers: Users,
  IconHeartHandshake: HeartHandshake,
  IconSparkles: Sparkles,
};

const renderIcon = (iconName?: string) => {
  const IconComp = (iconName && iconMap[iconName]) || Sparkles;
  return <IconComp className="h-6 w-6 text-[#d61b58] sm:h-7 sm:w-7" aria-hidden />;
};

const parseAwardValue = (value?: string) => {
  const safeValue = value ?? "";
  const match = safeValue.match(/^(\d+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: "" };
  }
  return { target: Number(match[1]), suffix: match[2] };
};

export default function EventsAwards1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const items = (data.items ?? []) as AwardStatItemData[];

  const parsedItems = useMemo<ParsedAward[]>(
    () =>
      items.map((item) => ({
        ...item,
        ...parseAwardValue(item.value),
      })),
    [items],
  );

  const [counts, setCounts] = useState<number[]>(() =>
    parsedItems.map(() => 0),
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    setCounts(parsedItems.map(() => 0));
    started.current = false;
  }, [parsedItems]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || started.current || parsedItems.length === 0) return;

    let interval: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;

        started.current = true;
        observer.disconnect();

        const duration = 900;
        const intervalTime = 20;
        const totalTicks = Math.ceil(duration / intervalTime);
        let tick = 0;

        interval = window.setInterval(() => {
          tick += 1;
          const nextCounts = parsedItems.map(({ target }) => {
            const progress = Math.min(tick / totalTicks, 1);
            return Math.round(target * progress);
          });
          setCounts(nextCounts);

          if (tick >= totalTicks) {
            if (interval) window.clearInterval(interval);
            setCounts(parsedItems.map(({ target }) => target));
          }
        }, intervalTime);
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (interval) window.clearInterval(interval);
    };
  }, [parsedItems]);

  return (
    <section
      ref={sectionRef}
      className="mt-8 w-full bg-[#fff0f5] md:mt-10 lg:mt-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d61b58] sm:text-sm">
              {data.pretitle}
            </p>
          )}
          {data.title && (
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              {data.title}
            </h2>
          )}
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {parsedItems.map((item, idx) => (
            <div
              key={`${item.title ?? "award"}-${idx}`}
              className="group flex flex-col items-center justify-between overflow-hidden rounded-4xl border border-[#f7d9e4] bg-white px-5 py-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#fde8ef] text-[#d61b58] shadow-sm sm:h-14 sm:w-14">
                {renderIcon(item.icon)}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-3xl">
                {counts[idx]?.toString().padStart(1, "0")}
                {item.suffix}
              </div>
              {item.title && (
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 sm:text-base">
                  {item.title}
                </h3>
              )}
              {(item.description ?? item.desc) && (
                <p className="mt-3 text-sm text-slate-600 sm:px-2 sm:text-sm">
                  {item.description ?? item.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
