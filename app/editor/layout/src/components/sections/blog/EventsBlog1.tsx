"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { SectionProps, EventsBlogPostData } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsBlog1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const posts =
    data.blogItems ??
    ((data as { posts?: EventsBlogPostData[] }).posts ?? []);
  const buttonLabel = data.buttonLabel ?? "Read More";
  const buttonIcon = data.buttonIcon ?? "→";

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const showSection = () => setIsVisible(true);
    showSection();
    const fallbackTimer = window.setTimeout(showSection, 250);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showSection();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-8 w-full bg-[#fff0f5] md:mt-10 lg:mt-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div data-box-layout-grid="grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, idx) => {
            const image = post.image ?? "";
            const title = post.title ?? "";
            const body =
              post.description ?? post.desc ?? post.excerpt ?? "";
            const href = post.link ?? post.href ?? "#";

            return (
              <article
                key={`${title}-${idx}`}
                className={`w-full overflow-hidden rounded-[1.5rem] border border-[#f4d4e1] bg-white shadow-[0_20px_60px_-40px_rgba(214,27,88,0.25)] transition duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                } hover:-translate-y-1 hover:shadow-[0_25px_70px_-40px_rgba(214,27,88,0.35)]`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="group relative h-48 overflow-hidden bg-slate-100 sm:h-64">
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
                      <span className="h-6 w-20 rounded-full bg-[#fee4ee] px-3 py-1 text-[#d61b58]">
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

                  <h3 className="text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  {body && (
                    <p className="text-sm leading-5 text-slate-600">{body}</p>
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
      </div>
    </section>
  );
}
