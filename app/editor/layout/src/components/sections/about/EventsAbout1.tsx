"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ButtonData, SectionProps, StatItemData } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsAbout1({ data = {} }: SectionProps) {
  const stats = (data.stats ?? []) as StatItemData[];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const extraDesc = (data as { extraDesc?: string }).extraDesc;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const buttons = (data.buttons ?? []) as ButtonData[];
  const primaryButton =
    buttons.find((button) => button.label?.toLowerCase().includes("consult")) ??
    buttons[0];
  const cardStat = stats[0];

  return (
    <section
      ref={sectionRef}
      className="relative mt-8 w-full overflow-hidden bg-white md:mt-10 lg:mt-12"
    >
      {data.backgroundImage && (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
          <Image
            src={data.backgroundImage}
            alt={data.backgroundImageTitle ?? "Background"}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={data.backgroundImage}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized={isUnoptimizedImageSrc(data.backgroundImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fff5f8]" />
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center lg:mb-12">
          {data.pretitle && (
            <p className="mt-0 inline-flex items-center rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#d61b58] sm:text-sm md:mt-4">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative">
            <div
              className={`relative h-[18rem] w-full overflow-hidden rounded-[2rem] bg-[#fdf2f7] shadow-xl shadow-[#d61b58]/10 transition-transform duration-1000 sm:h-[20rem] md:h-[22rem] lg:h-[24rem] ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              {data.sideImage ? (
                <Image
                  src={data.sideImage}
                  alt={data.sideImageTitle || "About image"}
                  data-editor-media
                  data-editor-media-type="image"
                  data-editor-media-src={data.sideImage}
                  fill
                  className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={isUnoptimizedImageSrc(data.sideImage)}
                />
              ) : null}
            </div>

            {cardStat && (
              <div
                className={`absolute bottom-4 left-4 w-44 rounded-[1rem] bg-[#d61b58] p-4 text-white shadow-2xl shadow-[#d61b58]/30 transition-transform duration-1000 sm:bottom-6 sm:left-6 sm:w-52 sm:p-5 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {cardStat.value}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#ffe4f0] sm:text-xs">
                  {cardStat.label}
                </p>
              </div>
            )}
          </div>

          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-5 text-slate-700">
              {data.desc && (
                <p className="text-justify text-sm leading-6 sm:text-base md:text-md md:leading-6 lg:leading-6">
                  {data.desc}
                </p>
              )}
              {data.desc2 && (
                <p className="text-justify text-sm leading-6 sm:text-base md:text-md md:leading-6 lg:leading-6">
                  {data.desc2}
                </p>
              )}
             
            </div>

            <div>
              {primaryButton ? (
                <Link
                  href={primaryButton.href ?? "#"}
                  className={`inline-flex items-center justify-center rounded-[20px] px-5 py-2 text-sm font-semibold transition sm:px-6 sm:py-3 sm:text-base md:px-7 md:py-3 md:text-base ${
                    primaryButton.variant === "secondary"
                      ? "border border-[#d61b58] bg-white text-[#d61b58] hover:bg-[#fdf2f6]"
                      : "bg-[#d61b58] text-white hover:bg-[#b01648]"
                  }`}
                >
                  {primaryButton.label ?? "Get consultation"}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
