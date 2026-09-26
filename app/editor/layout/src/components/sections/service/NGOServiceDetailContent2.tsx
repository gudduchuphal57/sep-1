"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiBook,
  FiUsers,
  FiHome,
  FiAward,
  FiBookOpen,
  FiUser,
  FiArrowRight,
  FiUserCheck,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type FeatureItem = { id?: string | number; icon?: string; title?: string };
type CardItem = {
  id?: string | number;
  icon?: string;
  title?: string;
  description?: string;
};
type StatItem = {
  id?: string | number;
  icon?: string;
  value?: string;
  label?: string;
};

const iconMap: Record<string, React.ReactNode> = {
  FiGraduationCap: <RiGraduationCapFill className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiBook: <FiBook className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiUsers: <FiUsers className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiHome: <FiHome className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiAward: <FiAward className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiPresentation: <FaChalkboardTeacher className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiUserCheck: <FiUserCheck className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiBookOpen: <FiBookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
  FiUser: <FiUser className="h-5 w-5 sm:h-6 sm:w-6" />,
};

function AnimatedNumber({
  value,
  startAnimation,
}: {
  value: string;
  startAnimation: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9,.\s]/g, "");

  useEffect(() => {
    if (!startAnimation) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    const duration = 1800;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(numericValue * easeOut);
      setDisplayValue(currentNumber);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startAnimation, numericValue]);

  return (
    <span className="inline-flex items-center justify-center">
      <span
        key={displayValue}
        className="inline-block animate-[statNumber_0.12s_ease-out]"
      >
        {displayValue.toLocaleString()}
      </span>
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}

export default function NGOServiceDetailContent2({ data = {} }: SectionProps) {
  const aboutSection = isRecord(data.aboutSection)
    ? data.aboutSection
    : undefined;
  const whatWeDoSection = isRecord(data.whatWeDoSection)
    ? data.whatWeDoSection
    : undefined;
  const impactSection = isRecord(data.impactSection)
    ? data.impactSection
    : undefined;
  const getInvolvedSection = isRecord(data.getInvolvedSection)
    ? data.getInvolvedSection
    : undefined;

  const aboutParagraphs = Array.isArray(aboutSection?.paragraphs)
    ? (aboutSection.paragraphs as string[])
    : typeof data.description === "string"
      ? [data.description]
      : typeof data.desc === "string"
        ? [data.desc]
        : [];
  const aboutFeatures = Array.isArray(aboutSection?.features)
    ? (aboutSection.features as FeatureItem[])
    : [];
  const whatWeDoCards = Array.isArray(whatWeDoSection?.cards)
    ? (whatWeDoSection.cards as CardItem[])
    : [];
  const impactStats = Array.isArray(impactSection?.stats)
    ? (impactSection.stats as StatItem[])
    : [];
  const buttons = isRecord(getInvolvedSection?.buttons)
    ? getInvolvedSection.buttons
    : undefined;
  const primaryBtn = isRecord(buttons?.primary) ? buttons.primary : undefined;
  const secondaryBtn = isRecord(buttons?.secondary)
    ? buttons.secondary
    : undefined;

  const aboutTitle =
    (typeof aboutSection?.title === "string" && aboutSection.title) ||
    (typeof data.title === "string" && data.title) ||
    "";
  const aboutImage =
    (typeof aboutSection?.image === "string" && aboutSection.image) ||
    (typeof data.image === "string" && data.image) ||
    "";

  const impactRef = useRef<HTMLElement | null>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const section = impactRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-editor-section-label="Service Detail"
      data-editor-fields="aboutSection whatWeDoSection impactSection getInvolvedSection"
      className="mx-auto max-w-7xl px-3 py-8 text-[#1a1a1a] sm:px-6 lg:px-8"
    >
      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="text-center md:text-start lg:col-span-6">
          <div className="text-center md:text-start">
            {typeof aboutSection?.tag === "string" ? (
              <p className="text-center text-sm font-bold uppercase tracking-wider text-orange-400 md:text-left">
                {aboutSection.tag}
              </p>
            ) : null}
          </div>
          {aboutTitle ? (
            <h1 className="mt-1 font-serif text-2xl font-extrabold text-[#111111] sm:text-3xl lg:text-4xl">
              {aboutTitle}
            </h1>
          ) : null}
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:leading-normal">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {aboutFeatures.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {aboutFeatures.map((feature) => (
                <div
                  key={feature.id ?? feature.title}
                  className="flex items-center gap-3 rounded-2xl bg-[#fff5f5] p-3 text-left sm:p-3.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fde8e8] text-orange-400">
                    {(feature.icon && iconMap[feature.icon]) || (
                      <FiBook className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-sm font-bold leading-tight text-[#111111]">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="relative h-64 w-full overflow-hidden rounded-3xl sm:h-80 lg:col-span-6 lg:h-[400px]">
          {aboutImage ? (
            <Image
              src={aboutImage}
              alt={aboutTitle || "Service"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              unoptimized={isUnoptimizedImageSrc(aboutImage)}
            />
          ) : (
            <div className="h-full w-full bg-orange-50" />
          )}
        </div>
      </section>

      {whatWeDoSection ? (
        <section className="mt-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-400">
              <HiOutlineHeart className="text-base text-[#FF4500]" />
              <span>
                {(typeof whatWeDoSection.tag === "string" &&
                  whatWeDoSection.tag) ||
                  "What We Do"}
              </span>
            </div>
            {typeof whatWeDoSection.title === "string" ? (
              <h2 className="mt-0 font-serif text-2xl font-bold text-[#111111] sm:text-3xl lg:text-4xl">
                {whatWeDoSection.title}
              </h2>
            ) : null}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {whatWeDoCards.map((card) => (
              <div
                key={card.id ?? card.title}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-5 pt-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0] text-orange-400">
                    {(card.icon && iconMap[card.icon]) || (
                      <FiHome className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-base font-bold text-[#111111]">
                    {card.title}
                  </h3>
                  {card.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {impactSection ? (
        <section
          ref={impactRef}
          className="mt-10 overflow-hidden rounded-3xl bg-[#fdf2f2]"
        >
          <div className="relative w-full py-12">
            <div className="absolute inset-0" />
            <div className="relative flex items-center justify-center px-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-400">
                  <HiOutlineHeart className="text-base text-[#FF4500]" />
                  <span>
                    {(typeof impactSection.tag === "string" &&
                      impactSection.tag) ||
                      "Our Impact"}
                  </span>
                </div>
                {typeof impactSection.title === "string" ? (
                  <h2 className="mt-2 font-serif text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
                    {impactSection.title}
                  </h2>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-y divide-orange-200/60 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {impactStats.map((stat) => (
              <div
                key={stat.id ?? stat.label}
                className="flex flex-col items-center p-5 text-center sm:p-6"
              >
                <div className="text-orange-400">
                  {(stat.icon && iconMap[stat.icon]) || (
                    <FiUsers className="h-6 w-6 sm:h-7 sm:w-7" />
                  )}
                </div>
                <span className="mt-2 text-2xl font-extrabold text-orange-400 sm:text-3xl lg:text-4xl">
                  <AnimatedNumber
                    value={stat.value || "0"}
                    startAnimation={statsStarted}
                  />
                </span>
                <span className="mt-1 text-sm font-semibold text-slate-700">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {getInvolvedSection ? (
        <section className="mt-10 overflow-hidden rounded-3xl bg-[#fafafa] sm:mt-16">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">
            <div className="space-y-4 p-6 sm:p-10 lg:col-span-6 lg:p-12">
              {typeof getInvolvedSection.tag === "string" ? (
                <span className="text-sm font-bold uppercase tracking-wider text-orange-400">
                  {getInvolvedSection.tag}
                </span>
              ) : null}
              {typeof getInvolvedSection.title === "string" ? (
                <h2 className="font-serif text-xl font-bold text-[#111111] sm:text-3xl lg:text-4xl">
                  {getInvolvedSection.title}
                </h2>
              ) : null}
              {typeof getInvolvedSection.description === "string" ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  {getInvolvedSection.description}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                {primaryBtn ? (
                  <Link
                    href={
                      (typeof primaryBtn.href === "string" &&
                        primaryBtn.href) ||
                      "#"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-400 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-500"
                  >
                    <span>
                      {(typeof primaryBtn.label === "string" &&
                        primaryBtn.label) ||
                        "Donate"}
                    </span>
                    <FiArrowRight className="text-sm" />
                  </Link>
                ) : null}
                {secondaryBtn ? (
                  <Link
                    href={
                      (typeof secondaryBtn.href === "string" &&
                        secondaryBtn.href) ||
                      "#"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-600 bg-white px-6 py-3 text-sm font-bold text-orange-400 transition-all hover:bg-orange-500 hover:text-white"
                  >
                    <span>
                      {(typeof secondaryBtn.label === "string" &&
                        secondaryBtn.label) ||
                        "Volunteer"}
                    </span>
                    <FiArrowRight className="text-sm" />
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="relative h-64 w-full sm:h-80 lg:col-span-6 lg:h-full lg:min-h-[420px]">
              {typeof getInvolvedSection.image === "string" ? (
                <Image
                  src={getInvolvedSection.image}
                  alt={
                    (typeof getInvolvedSection.title === "string" &&
                      getInvolvedSection.title) ||
                    "Get involved"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized={isUnoptimizedImageSrc(getInvolvedSection.image)}
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
