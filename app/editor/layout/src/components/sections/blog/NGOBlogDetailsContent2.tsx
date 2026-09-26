"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Search, Check, Heart } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type GalleryImg = { src?: string; alt?: string };
type KeyElement = { id?: string | number; label?: string };
type SubSection = { title?: string; paragraphs?: string[] };
type PopularPost = {
  id?: string | number;
  slug?: string;
  href?: string;
  link?: string;
  date?: string;
  title?: string;
  image?: { src?: string; alt?: string } | string;
};

export default function NGOBlogDetailsContent2({ data = {} }: SectionProps) {
  const main = (isRecord(data.mainContent) ? data.mainContent : data) as Record<
    string,
    unknown
  >;
  const sidebar = isRecord(data.sidebar) ? data.sidebar : undefined;
  const mainImage = isRecord(main.mainImage) ? main.mainImage : undefined;
  const meta = isRecord(main.meta) ? main.meta : undefined;
  const quote = isRecord(main.quote) ? main.quote : undefined;
  const keyElements = isRecord(main.keyElements) ? main.keyElements : undefined;
  const intro = Array.isArray(main.introParagraphs)
    ? (main.introParagraphs as string[])
    : typeof main.description === "string"
      ? [main.description]
      : [];
  const middle = Array.isArray(main.middleParagraphs)
    ? (main.middleParagraphs as string[])
    : [];
  const galleryImages = Array.isArray(main.galleryImages)
    ? (main.galleryImages as GalleryImg[])
    : [];
  const subSections = Array.isArray(main.subSections)
    ? (main.subSections as SubSection[])
    : [];
  const keyItems = Array.isArray(keyElements?.items)
    ? (keyElements.items as KeyElement[])
    : [];
  const popularPosts = (
    Array.isArray(sidebar?.popularPosts)
      ? sidebar.popularPosts
      : Array.isArray(sidebar?.recentPosts)
        ? sidebar.recentPosts
        : []
  ) as PopularPost[];
  const ctaWidget = isRecord(sidebar?.ctaWidget) ? sidebar.ctaWidget : undefined;

  const imageSrc =
    (typeof mainImage?.src === "string" && mainImage.src) ||
    (typeof main.image === "string" ? main.image : "") ||
    "";

  return (
    <section
      data-editor-section-label="Article Content"
      data-editor-fields="mainContent sidebar title description image"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="w-full lg:col-span-8">
          <div className="flex flex-col">
            {imageSrc ? (
              <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm sm:aspect-[2/1]">
                <Image
                  src={imageSrc}
                  alt={
                    (mainImage?.alt as string) ||
                    (main.title as string) ||
                    "Article"
                  }
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized={isUnoptimizedImageSrc(imageSrc)}
                />
                {typeof main.category === "string" ? (
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="rounded-md bg-[#ff541b] px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md">
                      {main.category}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {meta ? (
              <div className="mb-4 flex flex-wrap items-center gap-6 pb-1 text-sm text-slate-500">
                {typeof meta.publishedDate === "string" ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#ff541b]" />
                    <span>{meta.publishedDate}</span>
                  </div>
                ) : null}
                {typeof meta.author === "string" ? (
                  <>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#ff541b]" />
                      <span>By {meta.author}</span>
                    </div>
                  </>
                ) : null}
                {typeof meta.readTime === "string" ? (
                  <>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#ff541b]" />
                      <span>{meta.readTime}</span>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {typeof main.title === "string" ? (
              <h1 className="mb-6 text-2xl font-extrabold leading-tight text-[#0B132A] sm:text-3xl lg:text-4xl">
                {main.title}
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

            {quote && typeof quote.quoteText === "string" ? (
              <div className="relative my-6 rounded-r-2xl border-l-4 border-[#ff541b] bg-[#faf7f5] p-6 sm:p-8">
                <p className="text-base font-semibold italic leading-relaxed text-slate-800 sm:text-lg">
                  &ldquo;{quote.quoteText}&rdquo;
                </p>
              </div>
            ) : null}

            {middle.map((paragraph, index) => (
              <p
                key={`mid-${index}`}
                className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            {galleryImages.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative h-48 overflow-hidden rounded-xl shadow-sm sm:h-40 md:h-48"
                  >
                    {img.src ? (
                      <Image
                        src={img.src}
                        alt={img.alt || "Gallery"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized={isUnoptimizedImageSrc(img.src)}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {keyElements ? (
              <div className="my-6 rounded-2xl border border-orange-100/50 bg-[#faf7f5] p-6 sm:p-8">
                {typeof keyElements.title === "string" ? (
                  <h3 className="mb-6 text-lg font-bold text-[#0B132A] sm:text-xl">
                    {keyElements.title}
                  </h3>
                ) : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {keyItems.map((element, idx) => (
                    <div
                      key={element.id ?? idx}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                        <Check className="h-3.5 w-3.5 stroke-[3] text-[#ff541b]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {element.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {subSections.map((section, index) => (
              <div key={index} className="mt-8">
                {section.title ? (
                  <h2 className="mb-3 text-xl font-bold text-[#0B132A] sm:text-2xl">
                    {section.title}
                  </h2>
                ) : null}
                {(section.paragraphs || []).map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
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
                    "Search here..."
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
                    (typeof sidebar?.recentTitle === "string" &&
                      sidebar.recentTitle) ||
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

            {ctaWidget ? (
              <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-[#faf0eb] to-[#fcebe3] p-8 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ff541b_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />

                <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-orange-100 bg-white text-[#ff541b] shadow-md">
                  <Heart className="h-7 w-7 fill-[#ff541b]/10 stroke-[2]" />
                </div>

                {typeof ctaWidget.title === "string" ? (
                  <h3 className="relative z-10 mb-3 text-xl font-extrabold text-[#0B132A]">
                    {ctaWidget.title}
                  </h3>
                ) : null}

                {typeof ctaWidget.description === "string" ? (
                  <p className="relative z-10 mb-6 max-w-xs text-sm leading-relaxed text-slate-600">
                    {ctaWidget.description}
                  </p>
                ) : null}

                {typeof ctaWidget.buttonHref === "string" ? (
                  <Link
                    href={ctaWidget.buttonHref}
                    className="relative z-10 inline-flex items-center justify-center rounded-xl bg-[#ff541b] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e0450e] hover:shadow-orange-500/30"
                  >
                    {(typeof ctaWidget.buttonLabel === "string" &&
                      ctaWidget.buttonLabel) ||
                      "Donate"}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
