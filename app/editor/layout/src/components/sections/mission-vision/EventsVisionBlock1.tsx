"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

import type {
  EventsVisionBlockData,
  EventsVisionPointData,
  SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

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

type VisionImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export const VisionImage = ({ src, alt, className = "" }: VisionImageProps) => (
  <div
    className={`relative h-80 overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 sm:h-[420px] lg:h-[500px] ${className}`}
  >
    {src && (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-105"
        sizes="(max-width:1024px) 100vw, 50vw"
        unoptimized={isUnoptimizedImageSrc(src)}
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
  </div>
);

type VisionPointsProps = {
  points?: EventsVisionPointData[];
};

const VisionPoints = ({ points = [] }: VisionPointsProps) => {
  if (!points.length) return null;

  return (
    <ul className="space-y-3 pt-2">
      {points.map((point, index) => (
        <li key={`${point.text}-${index}`} className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fde8ef] text-[#d61b58]">
            {renderIcon(point.icon, "h-4 w-4")}
          </span>
          <span className="text-sm font-medium text-slate-700">{point.text}</span>
        </li>
      ))}
    </ul>
  );
};

type VisionBlockContentProps = {
  block?: EventsVisionBlockData;
  isVisible?: boolean;
};

export const VisionBlockContent = ({
  block,
  isVisible = true,
}: VisionBlockContentProps) => {
  if (!block) return null;

  return (
    <div
      className={`space-y-6 transition-all duration-1000 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-10 opacity-0"
      }`}
    >
      {block.description && (
        <p className="border-l-4 border-[#d61b58] pl-5 text-base italic leading-8 text-slate-600 sm:text-lg">
          {block.description}
        </p>
      )}
      {block.detail && (
        <p className="text-sm leading-7 text-slate-500 sm:text-base">
          {block.detail}
        </p>
      )}
      <VisionPoints points={block.points} />
    </div>
  );
};

export default function EventsVisionBlock1({ data = {} }: SectionProps) {
  const vision = data.vision;

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {vision && (
        <section
          ref={sectionRef}
          data-editor-section-label="Vision"
          data-editor-fields="vision"
          className="mt-8 bg-white md:mt-10 lg:mt-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <VisionBlockContent block={vision} isVisible={isVisible} />
              <VisionImage
                src={vision.image}
                alt={vision.imageAlt ?? "Vision"}
                className={`transition-all delay-200 duration-1000 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
