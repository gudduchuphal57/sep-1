"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type AboutImageProps = {
  src?: string;
  alt: string;
  isVisible: boolean;
  overlayClassName: string;
};

const AboutImage = ({
  src,
  alt,
  isVisible,
  overlayClassName,
}: AboutImageProps) => (
  <div
    className={`relative h-80 overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 transition-all delay-200 duration-700 sm:h-[350px] ${
      isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
    }`}
  >
    {src && (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        unoptimized={isUnoptimizedImageSrc(src)}
      />
    )}
    <div className={`absolute inset-0 ${overlayClassName}`} />
  </div>
);

export default function EventsAboutContent1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const image = data.image ?? data.sideImage;
  const imageAlt = data.imageAlt ?? data.sideImageTitle ?? "About us";
  const image2Alt = data.image2Alt ?? "About us";

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
    <section
      ref={sectionRef}
      data-editor-section-label="About Content"
      data-editor-fields="pretitle description description1 quote image imageAlt description2 description3 quoteRole image2 image2Alt"
      className="bg-white"
    >
      <div className="mx-auto mt-8 grid max-w-7xl gap-12 px-4 sm:px-6 md:mt-10 lg:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }`}
        >
          {data.pretitle !== undefined && (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d61b58]">
              {data.pretitle || "Our Story"}
            </p>
          )}

          {description && (
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              {description}
            </p>
          )}
          {data.description1 && (
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              {data.description1}
            </p>
          )}
          {data.quote && (
            <blockquote className="rounded-2xl border-l-4 border-[#d61b58] bg-[#fff5f8] p-5 text-lg italic text-slate-700">
              “{data.quote}”
            </blockquote>
          )}
        </div>

        <AboutImage
          src={image}
          alt={imageAlt}
          isVisible={isVisible}
          overlayClassName="bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <AboutImage
          src={data.image2}
          alt={image2Alt}
          isVisible={isVisible}
          overlayClassName="bg-gradient-to-t from-black/20 via-transparent to-transparent"
        />

        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }`}
        >
          {data.description2 && (
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              {data.description2}
            </p>
          )}
          {data.description3 && (
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              {data.description3}
            </p>
          )}
          {data.quoteRole && (
            <blockquote className="rounded-2xl border-l-4 border-[#d61b58] bg-[#fff5f8] p-5 text-lg italic text-slate-700">
              “{data.quoteRole}”
            </blockquote>
          )}
        </div>
      </div>

    </section>
  );
}
