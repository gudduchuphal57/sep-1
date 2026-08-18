"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { EventsBlogPostData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import useCardPagination from "../types/useCardPagination";
import EventsPagination1 from "./EventsPagination1";

export default function EventsBlogGrid1({ data = {} }: SectionProps) {
  const posts =
    (data.blogItems as EventsBlogPostData[] | undefined) ??
    ((data as { posts?: EventsBlogPostData[] }).posts ?? []);
  const buttonLabel = data.buttonLabel ?? "Read More";
  const buttonIcon = data.buttonIcon ?? "→";

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
  } = useCardPagination({
    itemCount: posts.length,
    boxesPerRow: data.boxesPerRow,
    fallbackColumns: 3,
    rowsPerPage: 1,
  });

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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      const yOffset = -100;
      const y =
        sectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="events-blog-posts"
      data-editor-section-label="Blog Posts"
      data-editor-fields="blogItems buttonLabel buttonIcon"
      className="mx-auto mt-8 max-w-7xl scroll-mt-8 px-4 pb-16 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div data-box-layout-grid="grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post, idx) => {
          const image = post.image ?? "";
          const title = post.title ?? "";
          const body = post.description ?? post.desc ?? post.excerpt ?? "";
          const href = post.link ?? post.href ?? "#";

          return (
            <article
              key={`${title}-${idx}`}
              className={`w-full overflow-hidden rounded-[1.5rem] border border-[#f4d4e1] bg-white transition duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } hover:shadow-[0_25px_70px_-40px_rgba(214,27,88,0.35)]`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="group relative h-48 overflow-hidden sm:h-64">
                {image ? (
                  <Image
                    src={image}
                    alt={post.alt ?? title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(image)}
                  />
                ) : null}
              </div>

              <div className="space-y-2 p-4 sm:p-6">
                <div className="flex flex-col gap-3 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  {post.label && (
                    <span className="flex h-6 items-center justify-center rounded-full bg-[#fee4ee] px-3 py-1 text-center text-[#d61b58]">
                      {post.label}
                    </span>
                  )}
                  {post.date && (
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V8h14v11Zm0-13H5V5h14v1Z" />
                      </svg>
                      {post.date}
                    </span>
                  )}
                </div>

                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                {body && (
                  <p className="line-clamp-2 text-sm leading-5 text-slate-600">
                    {body}
                  </p>
                )}

                <Link
                  href={href}
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-[#d61b58] transition hover:text-[#b01648]"
                >
                  {buttonLabel}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1.5"
                  >
                    {buttonIcon}
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <EventsPagination1
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
