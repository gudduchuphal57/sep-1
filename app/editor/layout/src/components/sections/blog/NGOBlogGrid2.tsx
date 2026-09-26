"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiUser } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

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

type TitleShape = { line1?: string; highlight?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBlogGrid2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const title = (isRecord(data.title) ? data.title : {}) as TitleShape;
  const articles = (Array.isArray(data.blogItems)
    ? data.blogItems
    : Array.isArray(data.articles)
      ? data.articles
      : Array.isArray(data.posts)
        ? data.posts
        : []) as BlogArticle[];
  const enablePagination = data.enablePagination !== false;
  const perPage =
    typeof data.blogsPerPage === "number" ? data.blogsPerPage : 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const start = (currentPage - 1) * perPage;
  const visible = enablePagination
    ? articles.slice(start, start + perPage)
    : articles;

  return (
    <section
      data-editor-section-label="Blog Posts"
      data-editor-fields="badge title articles blogItems posts enablePagination blogsPerPage"
      className="relative overflow-hidden bg-white px-0 py-8 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{(badge?.label as string) || "Our Blog"}</span>
          </div>
          <h2 className="mt-0 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            {title.line1 ||
              (typeof data.title === "string" ? data.title : "Latest")}{" "}
            <span>{title.highlight || "News"}</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article, index) => {
            const imgSrc = article.image ?? "";
            const href = article.href ?? article.link ?? "#";
            return (
              <article
                key={`${article.title}-${index}`}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={href} className="relative block h-52 overflow-hidden">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={article.title || "Blog"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      unoptimized={isUnoptimizedImageSrc(imgSrc)}
                    />
                  ) : (
                    <div className="h-full w-full bg-orange-50" />
                  )}
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#ff541b]">
                    <span>{article.category}</span>
                    {article.date ? <span className="text-slate-400">{article.date}</span> : null}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#0F172A] transition group-hover:text-[#ff541b]">
                    <Link href={href}>{article.title}</Link>
                  </h3>
                  {(article.description || article.desc) ? (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                      {article.description || article.desc}
                    </p>
                  ) : null}
                  {article.author ? (
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                      <FiUser /> {article.author}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {enablePagination && totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 text-[#ff541b] disabled:opacity-40"
            >
              <FiArrowLeft />
            </button>
            <span className="text-sm font-semibold text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 text-[#ff541b] disabled:opacity-40"
            >
              <FiArrowRight />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
