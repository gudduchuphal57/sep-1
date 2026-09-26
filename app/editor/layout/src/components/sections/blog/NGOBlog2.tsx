"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiUser } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type BlogArticle = {
  category?: string;
  date?: string;
  title?: string;
  description?: string;
  desc?: string;
  image?: string;
  author?: string;
  href?: string;
  link?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  if (typeof value.title === "string") return value.title;
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOBlog2({ data = {} }: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Our Blog");
  const title = toTitleText(data.title);
  const description =
    typeof data.desc === "string"
      ? data.desc
      : typeof data.description === "string"
        ? data.description
        : undefined;
  const articles = (Array.isArray(data.articles)
    ? data.articles
    : Array.isArray(data.blogItems)
      ? data.blogItems
      : Array.isArray((data as { posts?: BlogArticle[] }).posts)
        ? (data as { posts: BlogArticle[] }).posts
        : []) as BlogArticle[];
  const exploreButton = isRecord(data.exploreButton)
    ? (data.exploreButton as { label?: string; href?: string })
    : { label: "Explore More Blogs", href: "/blog" };
  const showExplore = data.showExploreButton !== false;
  const boxesPerRow =
    collectionBoxesPerRow(data, "articles") ??
    collectionBoxesPerRow(data, "blogItems") ??
    sectionWrapperBoxesPerRow(data);
  const visibleArticles =
    boxesPerRow || !showExplore ? articles : articles.slice(0, 3);

  return (
    <section
      data-editor-section-label="Blog Content"
      data-editor-fields="pretitle title desc articles exploreButton showExploreButton"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="relative overflow-hidden bg-white px-0 py-8 font-sans md:py-12"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute right-12 top-8 hidden grid-cols-6 gap-1.5 opacity-20 sm:grid">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>

      <div className="relative mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          {title ? (
            <h2 className="mt-0 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div
          data-box-layout-grid="grid"
          className="mt-4 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 md:mt-12 lg:grid-cols-3 lg:px-8"
        >
          {visibleArticles.map((article, index) => {
            const imgSrc = article.image ?? "";
            const href = article.href ?? article.link ?? "#";

            return (
              <div
                key={`${article.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full bg-slate-100 sm:h-64">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={article.title ?? "Blog"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={isUnoptimizedImageSrc(imgSrc)}
                    />
                  ) : null}
                  <div className="absolute -bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1E1B4B] text-white shadow-md">
                    <FiUser className="text-md" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-[#FF4500]" />
                      <span>
                        {article.category ? `${article.category}, ` : ""}
                        {article.date}
                      </span>
                    </div>
                    <h3 className="mt-3 min-h-20 font-serif text-lg font-bold leading-snug text-[#1E1B4B] transition-colors duration-200 group-hover:text-[#FF4500] sm:text-xl">
                      <Link href={href}>{article.title}</Link>
                    </h3>
                    {article.description || article.desc ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {article.description || article.desc}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showExplore && exploreButton?.label ? (
          <div className="mb-4 mt-4 flex justify-center md:mb-0">
            <Link
              href={exploreButton.href || "#"}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <span>{exploreButton.label}</span>
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
