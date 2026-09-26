"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, Target, MapPin } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type PopularPost = {
  id?: string | number;
  slug?: string;
  href?: string;
  link?: string;
  date?: string;
  title?: string;
  image?: { src?: string; alt?: string } | string;
};

export default function NGOEventDetailContent2({ data = {} }: SectionProps) {
  const mainContent = (
    isRecord(data.mainContent) ? data.mainContent : data
  ) as Record<string, unknown>;
  const sidebar = isRecord(data.sidebar) ? data.sidebar : undefined;
  const mainImage = isRecord(mainContent.mainImage)
    ? mainContent.mainImage
    : undefined;
  const meta = isRecord(mainContent.meta) ? mainContent.meta : undefined;
  const mission = isRecord(mainContent.mission)
    ? mainContent.mission
    : undefined;
  const location = isRecord(mainContent.location)
    ? mainContent.location
    : undefined;
  const map = isRecord(location?.map) ? location.map : undefined;

  const intro = Array.isArray(mainContent.introParagraphs)
    ? (mainContent.introParagraphs as string[])
    : typeof mainContent.description === "string"
      ? [mainContent.description]
      : typeof data.description === "string"
        ? [data.description]
        : [];
  const middle = Array.isArray(mainContent.middleParagraphs)
    ? (mainContent.middleParagraphs as string[])
    : [];

  const imageSrc =
    (typeof mainImage?.src === "string" && mainImage.src) ||
    (typeof mainContent.image === "string" ? mainContent.image : "") ||
    (typeof data.image === "string" ? data.image : "") ||
    "";
  const title =
    (typeof mainContent.title === "string" && mainContent.title) ||
    (typeof data.title === "string" && data.title) ||
    (typeof data.eventTitle === "string" && data.eventTitle) ||
    "";

  const popularPosts = (
    Array.isArray(sidebar?.popularPosts)
      ? sidebar.popularPosts
      : Array.isArray(data.popularPosts)
        ? data.popularPosts
        : []
  ) as PopularPost[];

  return (
    <section
      data-editor-section-label="Event Detail"
      data-editor-fields="mainContent sidebar title description image meta"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="w-full lg:col-span-8">
          <div className="flex flex-col">
            {imageSrc ? (
              <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm sm:aspect-[2/1]">
                <Image
                  src={imageSrc}
                  alt={(mainImage?.alt as string) || title || "Event"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized={isUnoptimizedImageSrc(imageSrc)}
                />
              </div>
            ) : null}

            {typeof meta?.publishedDate === "string" ||
            typeof meta?.date === "string" ? (
              <div className="mb-4 flex items-center gap-2 pb-1 text-sm text-slate-500">
                <Calendar className="h-4 w-4 text-[#ff541b]" />
                <span className="font-medium text-slate-500">
                  Posted On:{" "}
                  {(meta.publishedDate as string) || (meta.date as string)}
                </span>
              </div>
            ) : null}

            {title ? (
              <h1 className="mb-6 text-2xl font-extrabold leading-tight text-[#0B132A] sm:text-3xl lg:text-4xl">
                {title}
              </h1>
            ) : null}

            {intro.map((paragraph, index) => (
              <p
                key={`intro-${index}`}
                className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            {middle.map((paragraph, index) => (
              <p
                key={`mid-${index}`}
                className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            {mission ? (
              <div className="mb-8 flex flex-col items-start gap-5 rounded-2xl border border-orange-100/60 bg-[#fff8f5] p-6 sm:flex-row sm:p-8">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#ffece5] text-[#ff541b]">
                  <Target className="h-7 w-7 stroke-[2]" />
                </div>
                <div>
                  {typeof mission.title === "string" ? (
                    <h3 className="mb-3 text-lg font-bold text-[#0B132A] sm:text-xl">
                      {mission.title}
                    </h3>
                  ) : null}
                  {typeof mission.description === "string" ? (
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {mission.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {location ? (
              <div className="mb-8 flex flex-col items-start gap-5 rounded-2xl border border-orange-100/60 bg-[#fff8f5] p-6 sm:flex-row sm:p-8">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#ffece5] text-[#ff541b]">
                  <MapPin className="h-7 w-7 stroke-[2]" />
                </div>
                <div>
                  {typeof location.title === "string" ? (
                    <h3 className="mb-3 text-lg font-bold text-[#0B132A] sm:text-xl">
                      {location.title}
                    </h3>
                  ) : null}
                  {typeof location.description === "string" ? (
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {location.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {typeof map?.address === "string" ? (
              <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:h-96">
                <iframe
                  title="Event Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    map.address,
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full lg:col-span-4">
          <aside className="flex flex-col gap-8">
            <div className="rounded-2xl border border-slate-100 bg-[#f8f9fa] p-4 shadow-sm">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder={
                    (typeof sidebar?.searchPlaceholder === "string" &&
                      sidebar.searchPlaceholder) ||
                    "Search..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm transition-colors focus:border-[#ff541b] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 rounded-lg bg-[#ff541b] p-2.5 text-white transition-colors hover:bg-[#e0450e]"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {popularPosts.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-[#f8f9fa] p-6 shadow-sm">
                <h3 className="relative mb-6 border-b border-slate-200 pb-2 text-lg font-bold text-[#0B132A]">
                  {(typeof sidebar?.popularPostsTitle === "string" &&
                    sidebar.popularPostsTitle) ||
                    "Popular Posts"}
                  <span className="absolute bottom-0 left-0 h-[2px] w-12 bg-[#ff541b]" />
                </h3>

                <div className="flex flex-col gap-5">
                  {popularPosts.map((post, idx) => {
                    const href = post.slug || post.href || post.link || "#";
                    const img =
                      typeof post.image === "string"
                        ? post.image
                        : post.image?.src || "";
                    const alt =
                      typeof post.image === "object"
                        ? post.image?.alt || post.title || "Post"
                        : post.title || "Post";
                    return (
                      <Link
                        key={post.id ?? `${post.title}-${idx}`}
                        href={href}
                        className="group flex items-center gap-4 transition-opacity hover:opacity-90"
                      >
                        {img ? (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                            <Image
                              src={img}
                              alt={alt}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="64px"
                              unoptimized={isUnoptimizedImageSrc(img)}
                            />
                          </div>
                        ) : null}
                        <div className="flex flex-col">
                          {post.date ? (
                            <span className="mb-1 text-sm font-medium text-slate-400">
                              {post.date}
                            </span>
                          ) : null}
                          <h4 className="line-clamp-2 text-sm font-bold leading-snug text-[#0B132A] transition-colors group-hover:text-[#ff541b]">
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
