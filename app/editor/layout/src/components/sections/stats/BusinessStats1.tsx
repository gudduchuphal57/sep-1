"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SectionProps, StatItemData } from "../../../types/section";

const parseStatValue = (value: string) => {
  const match = value.trim().match(/^([\d,.]+)(.*)$/);

  if (!match) {
    return { target: 0, suffix: value, decimals: 0 };
  }

  const numericValue = match[1].replace(/,/g, "");
  const decimals = numericValue.includes(".")
    ? numericValue.split(".")[1].length
    : 0;

  return {
    target: Number(numericValue),
    suffix: match[2],
    decimals,
  };
};

function AnimatedStat({
  stat,
  shouldAnimate,
}: {
  stat: StatItemData;
  shouldAnimate: boolean;
}) {
  const { target, suffix, decimals } = parseStatValue(stat.value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldAnimate || !Number.isFinite(target)) return;

    let animationFrame = 0;
    const duration = 1800;
    const startedAt = performance.now();

    const updateValue = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(target * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    animationFrame = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(animationFrame);
  }, [shouldAnimate, target]);

  const formattedValue = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div>
      <div className="mb-2 flex items-center text-3xl font-light text-[#cfa94e] md:text-4xl">
        {formattedValue}
        {suffix}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">
        {stat.label}
      </div>
    </div>
  );
}

export default function BusinessStats1({ data = {} }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[600px] w-full items-center overflow-hidden px-8 py-20 md:min-h-[700px] md:px-24"
    >
      {data.backgroundImage && (
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={data.backgroundImage}
            alt={data.backgroundImageTitle ?? data.title ?? "Business results"}
            fill
            sizes="100vw"
            className="object-cover"
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={data.backgroundImage}
          />
        </motion.div>
      )}

      <div className="absolute inset-0 z-10 bg-black/50" />

      <div className="relative z-20 mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-white"
        >
          {data.pretitle && (
            <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-gray-300">
              {data.pretitle}
            </span>
          )}

          {data.title && (
            <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
              {data.title}
            </h2>
          )}

          {data.desc && (
            <p className="mb-12 max-w-lg text-sm leading-relaxed text-gray-200 md:text-base">
              {data.desc}
            </p>
          )}

          {data.stats?.length ? (
            <div className="grid gap-8 border-t border-white/20 pt-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.stats.map((stat) => (
                <AnimatedStat
                  key={`${stat.label}-${stat.value}`}
                  stat={stat}
                  shouldAnimate={isInView}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
