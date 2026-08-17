"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";

const getGalleryItems = (data: SectionProps["data"]) =>
  (data?.galleryItems ?? []).slice(0, 9);

export default function GalleryPage({ data = {} }: SectionProps) {
  const items = getGalleryItems(data);

  return (
    <section className="bg-white px-5 py-16 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              {data.pretitle}
            </p>
          )}

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {data.title}
          </h1>

          {data.desc && (
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {data.desc}
            </p>
          )}
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={`${item.image}-${index}`}
              className={`group relative overflow-hidden rounded-lg bg-slate-100 ${
                index === 0 || index === 5 ? "sm:row-span-2" : ""
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt ?? item.title ?? ""}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={item.image}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-white">
                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>
                {item.alt && (
                  <p className="mt-1 line-clamp-2 text-sm text-white/80">
                    {item.alt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
