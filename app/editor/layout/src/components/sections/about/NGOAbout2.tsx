"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart, FiPlay, FiX } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type TrustBadge = {
  icon?: string;
  text?: string;
  desc?: string;
  bgColor?: string;
};

type AboutStat = { icon?: string; value?: string; label?: string };

type Gallery = {
  mainImage?: { src?: string; alt?: string };
  topImage?: { src?: string; alt?: string };
  sideImage?: { src?: string; alt?: string };
  playButton?: { videoUrl?: string };
  floatingCard?: {
    title?: string;
    pretitle?: string;
    highlight?: string;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/") + "?autoplay=1";
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  return url;
};

const getTrustBadgeIconClass = (icon?: string) => {
  switch (icon) {
    case "star":
      return "h-5 w-5 text-[#f59e0b] md:h-8 md:w-8";
    case "heart":
    case "users":
    case "people":
      return "h-5 w-5 text-[#8b5cf6] md:h-8 md:w-8";
    default:
      return "h-5 w-5 text-[#10b981] md:h-8 md:w-8";
  }
};

const getStatTheme = (index: number) => {
  const themes = [
    { bg: "bg-[#ffebe5]", icon: "h-7 w-7 text-[#ff5a36]" },
    { bg: "bg-[#e2f5d8]", icon: "h-7 w-7 text-[#10b981]" },
    { bg: "bg-[#e3effd]", icon: "h-7 w-7 text-[#2563eb]" },
    { bg: "bg-[#f3e5f5]", icon: "h-7 w-7 text-[#9333ea]" },
  ];
  return themes[index % themes.length];
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const number = Number(value.replace(/\D/g, "")) || 0;
  const prefix = value.match(/^[^\d]+/)?.[0] || "";
  const suffix = value.match(/[^\d]+$/)?.[0] || "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const increment = number / (duration / stepTime);
    const timer = setInterval(() => {
      start += increment;
      if (start >= number) {
        setCount(number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, number]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function NGOAbout2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const title = isRecord(data.title)
    ? data.title
    : { line1: typeof data.title === "string" ? data.title : undefined };
  const desc = isRecord(data.desc)
    ? data.desc
    : {
        primary:
          typeof data.desc === "string"
            ? data.desc
            : typeof data.description === "string"
              ? data.description
              : undefined,
        secondary: typeof data.desc2 === "string" ? data.desc2 : undefined,
      };
  const buttons = Array.isArray(data.buttons) ? data.buttons : [];
  const trustBadges = (Array.isArray(data.trustBadges)
    ? data.trustBadges
    : []) as TrustBadge[];
  const gallery = (isRecord(data.gallery) ? data.gallery : {}) as Gallery;
  const statistics = (Array.isArray(data.statistics)
    ? data.statistics
    : Array.isArray(data.statistics2)
      ? data.statistics2
      : []) as AboutStat[];
  const background = isRecord(data.background) ? data.background : undefined;

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVideoOpen]);

  const mainSrc = gallery.mainImage?.src ?? "";
  const topSrc = gallery.topImage?.src ?? mainSrc;
  const sideSrc = gallery.sideImage?.src ?? mainSrc;

  return (
    <section
      className="relative overflow-hidden bg-white py-8 font-sans sm:py-12"
      data-editor-section-label="About Content"
      data-editor-fields="badge title desc buttons trustBadges gallery statistics background"
    >
      {background?.showDecorations !== false && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -right-24 -top-12 h-[750px] w-[600px] rounded-[40%] bg-[#fff2ed]/80 md:-right-16 md:h-[850px] md:w-[700px] lg:-right-20 lg:h-[950px] lg:w-[800px]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="w-full lg:col-span-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#ff5a36]">
                <HiOutlineHeart className="text-base text-[#ff5a36]" />
                <span>
                  {(badge?.label as string) ??
                    (typeof data.pretitle === "string" ? data.pretitle : "About Us")}
                </span>
              </div>

              <h2 className="mt-1 text-3xl font-extrabold leading-tight text-[#1a0c2e] sm:text-4xl md:mt-3 md:text-[42px] lg:leading-[1.18]">
                {(title.line1 as string) ?? ""}
              </h2>

              {(desc.primary as string) && (
                <p className="mt-4 text-sm leading-relaxed text-[#666666] sm:text-base">
                  {desc.primary as string}
                </p>
              )}
              {(desc.secondary as string) && (
                <p className="mt-3 text-sm leading-relaxed text-[#666666] sm:text-base">
                  {desc.secondary as string}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 md:justify-start">
                {buttons.map((button, idx) => {
                  const primary = button.variant === "primary";
                  const icon =
                    typeof (button as { icon?: string }).icon === "string"
                      ? (button as { icon?: string }).icon
                      : undefined;
                  return (
                    <Link
                      key={`${button.label}-${idx}`}
                      href={button.href || "#"}
                      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 sm:px-7 sm:py-3.5 ${
                        primary
                          ? "bg-[#ff5a36] text-white shadow-md shadow-[#ff5a36]/20 hover:bg-[#1a0c2e]"
                          : "bg-[#1a0c2e] text-white shadow-md hover:bg-[#ff5a36]"
                      }`}
                    >
                      {icon
                        ? renderNgoIcon(icon, "text-sm sm:text-base")
                        : null}
                      <span>{button.label}</span>
                      <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1 sm:text-base" />
                    </Link>
                  );
                })}
              </div>

              {trustBadges.length > 0 && (
                <div className="mt-8 pt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-2 sm:divide-x sm:divide-slate-200">
                    {trustBadges.map((tb, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 md:justify-start ${
                          idx !== 0 ? "sm:pl-4" : ""
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            tb.bgColor || "bg-emerald-100"
                          }`}
                        >
                          {renderNgoIcon(
                            tb.icon || "check",
                            getTrustBadgeIconClass(tb.icon),
                          )}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-base font-bold leading-tight text-[#1a0c2e]">
                            {tb.text}
                          </span>
                          {tb.desc && (
                            <span className="mt-0.5 text-sm font-medium leading-tight text-gray-500">
                              {tb.desc}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:col-span-6">
            <div className="relative mt-4 lg:mt-0">
              <div className="relative mx-auto h-[380px] w-full max-w-lg sm:h-[460px] lg:max-w-none">
                {topSrc && (
                  <div className="absolute right-12 top-0 z-0 h-[170px] w-[65%] overflow-hidden rounded-2xl shadow-sm sm:h-[210px]">
                    <Image
                      src={topSrc}
                      alt={gallery.topImage?.alt || "Gallery top image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 65vw, 30vw"
                      priority
                      unoptimized={isUnoptimizedImageSrc(topSrc)}
                    />
                  </div>
                )}

                {gallery.floatingCard && (
                  <div className="absolute right-0 top-4 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:px-4 sm:py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#ff5a36]">
                      <FiHeart className="fill-current text-xl" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-medium text-gray-500 sm:text-sm">
                        {gallery.floatingCard.pretitle}
                      </span>
                      <span className="text-sm font-bold text-[#1a0c2e]">
                        {gallery.floatingCard.title}
                      </span>
                      <span className="text-sm font-bold text-[#ff5a36]">
                        {gallery.floatingCard.highlight}
                      </span>
                    </div>
                  </div>
                )}

                {sideSrc && (
                  <div className="absolute right-0 top-24 z-0 h-[280px] w-[30%] overflow-hidden rounded-2xl shadow-md sm:h-[330px]">
                    <Image
                      src={sideSrc}
                      alt={gallery.sideImage?.alt || "Gallery side image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 30vw, 15vw"
                      unoptimized={isUnoptimizedImageSrc(sideSrc)}
                    />
                  </div>
                )}

                {mainSrc && (
                  <div className="absolute bottom-2 left-0 z-10 h-[220px] w-[78%] overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:h-[280px] sm:w-[75%]">
                    <Image
                      src={mainSrc}
                      alt={gallery.mainImage?.alt || "Main program photo"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 35vw"
                      unoptimized={isUnoptimizedImageSrc(mainSrc)}
                    />
                    {gallery.playButton?.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setIsVideoOpen(true)}
                        aria-label="Play Video"
                        className="group absolute inset-0 m-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-white/80 bg-white/30 shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
                      >
                        <span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-40" />
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff5a36] text-white shadow-md transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
                          <FiPlay className="ml-0.5 fill-current text-lg sm:text-xl" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {statistics.length > 0 && (
          <div className="mt-6 sm:mt-16">
            <div className="rounded-3xl py-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] sm:border sm:border-slate-100/80 sm:bg-white sm:px-10 sm:py-8">
              <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
                {statistics.map((item, index) => {
                  const theme = getStatTheme(index);
                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className={`flex items-center gap-4 ${
                        index !== 0 ? "lg:pl-8" : ""
                      }`}
                    >
                      <div
                        className={`flex shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 ${theme.bg}`}
                      >
                        {renderNgoIcon(item.icon || "children", theme.icon)}
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-xl font-black text-[#1a0c2e] sm:text-3xl">
                          <AnimatedNumber value={item.value ?? "0"} />
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-gray-500">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {isVideoOpen && gallery.playButton?.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsVideoOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close modal"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:border-[#ff5a36] hover:bg-[#ff5a36]"
            >
              <FiX className="text-xl" />
            </button>
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={getEmbedUrl(gallery.playButton.videoUrl)}
                title="Video player"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
