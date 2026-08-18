"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { SectionProps, StatItemData } from "../../../types/section";

type ParsedStat = StatItemData & {
  target: number;
  suffix: string;
};

const parseStatValue = (value?: string) => {
  const match = (value ?? "").match(/^(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: "" };
  return { target: Number(match[1]), suffix: match[2] };
};

export default function EventsAwardsStats1({ data = {} }: SectionProps) {
  const stats = data.stats ?? [];
  const statsRef = useRef<HTMLElement | null>(null);
  const started = useRef(false);
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0));

  const parsed = useMemo<ParsedStat[]>(
    () =>
      stats.map((stat) => ({
        ...stat,
        ...parseStatValue(stat.value),
      })),
    [stats],
  );

  useEffect(() => {
    const el = statsRef.current;
    if (!el || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        started.current = true;
        observer.disconnect();

        const duration = 1200;
        const tick = 20;
        const steps = Math.ceil(duration / tick);
        let step = 0;

        const interval = window.setInterval(() => {
          step += 1;
          const progress = Math.min(step / steps, 1);
          setCounts(parsed.map((item) => Math.round(item.target * progress)));
          if (step >= steps) window.clearInterval(interval);
        }, tick);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed]);

  if (!stats.length) return null;

  return (
    <section
      ref={statsRef}
      data-editor-section-label="Stats"
      data-editor-fields="stats"
      className="mt-8 bg-[#d61b58] py-12 md:mt-10 lg:mt-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-box-layout-grid="grid" className="grid grid-cols-2 gap-6 text-center text-white lg:grid-cols-4">
          {parsed.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="space-y-1">
              <p className="text-3xl font-extrabold sm:text-4xl">
                {counts[index] ?? 0}
                {stat.suffix}
              </p>
              <p className="text-xs uppercase tracking-widest text-pink-200 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
