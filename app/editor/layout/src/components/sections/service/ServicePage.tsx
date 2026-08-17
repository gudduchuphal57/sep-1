"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ProductCardData,
  ProductSlideData,
  SectionProps,
} from "./../../../types/section";

type ServiceSlide = {
  title: string;
  category: string;
  desc: string;
  image: string;
  alt?: string;
};

const toServiceSlide = (
  item: ProductCardData | ProductSlideData,
): ServiceSlide => {
  const image = "image" in item ? item.image : "";
  const alt = "alt" in item ? item.alt : undefined;

  return {
    title: "productTitle" in item ? item.productTitle : item.title,
    category: "category" in item ? item.category : "Service",
    desc: "productInfoDesc" in item ? item.productInfoDesc : item.desc,
    image,
    alt,
  };
};

export default function ServicePage({ data = {} }: SectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const sideImage = data.sideImage;
  const sideImageTitle = data.sideImageTitle ?? "";
  const services = useMemo(
    () =>
      (data.productSlides?.length ? data.productSlides : data.productItems ?? [])
        .map(toServiceSlide)
        .filter((item) => item.title),
    [data.productItems, data.productSlides],
  );
  const visibleServices = services.length
    ? Array.from(
        { length: Math.min(3, services.length) },
        (_, index) => services[(startIndex + index) % services.length],
      )
    : [];
  const canSlide = services.length > 3;

  const moveSlider = (direction: -1 | 1) => {
    if (!services.length) return;

    setStartIndex((current) =>
      (current + direction + services.length) % services.length,
    );
  };

  return (
    <main className="bg-white text-slate-950">
      <section data-editor-section-label="Services Overview" className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:px-8 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            {data.pretitle}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
            {data.title}
          </h1>
          <div className="mt-5 space-y-4 text-base leading-8 text-slate-600">
            <p>{data.desc}</p>
            {data.desc2 && <p>{data.desc2}</p>}
          </div>
        </div>

        {sideImage && (
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-slate-100 shadow-xl">
            <Image
              src={sideImage}
              alt={sideImageTitle}
              data-editor-media
              data-editor-media-type="image"
              data-editor-media-src={sideImage}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </div>
        )}
      </section>

      <section data-editor-section-label="Service Listings" className="mx-auto max-w-7xl px-5 pb-16 md:px-8 lg:pb-24">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              {data.subtitle}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {data.productSectionTitle}
            </h2>
          </div>

          {canSlide && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveSlider(-1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
                aria-label="Previous services"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => moveSlider(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
                aria-label="Next services"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {visibleServices.map((service, index) => (
            <article
              key={`${service.title}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              {service.image && (
                <div className="relative h-56 bg-slate-200">
                  <Image
                    src={service.image}
                    alt={service.alt ?? service.title}
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={service.image}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  {service.category}
                </p>
                <h3 className="mt-3 text-xl font-black">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {service.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
