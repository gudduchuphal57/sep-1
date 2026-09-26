"use client";

import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type PopularPost = {
  id?: string | number;
  title?: string;
  date?: string;
  category?: string;
  slug?: string;
  href?: string;
  image?: { src?: string; alt?: string } | string;
};

export default function NGOCaseDetailsSidebar2({ data = {} }: SectionProps) {
  const sidebar = isRecord(data.sidebar) ? data.sidebar : {};
  const popularPostsTitle =
    (typeof data.popularPostsTitle === "string" && data.popularPostsTitle) ||
    (typeof sidebar.popularPostsTitle === "string" && sidebar.popularPostsTitle) ||
    "Popular Posts";
  const popularPosts = (
    Array.isArray(data.popularPosts)
      ? data.popularPosts
      : Array.isArray(sidebar.popularPosts)
        ? sidebar.popularPosts
        : []
  ) as PopularPost[];

  return (
    <aside className="sticky top-6">
      <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm sm:p-6">
        <h3 className="relative pb-3 text-lg font-extrabold text-[#1a0c2e] sm:text-xl">
          {popularPostsTitle}
          <span className="absolute bottom-0 left-0 h-[2px] w-10 bg-[#ff5a36]" />
        </h3>
        <div className="mt-6 space-y-5">
          {popularPosts.map((post, index) => {
            const imageSrc =
              typeof post.image === "string"
                ? post.image
                : post.image?.src || "";
            const imageAlt =
              typeof post.image === "string"
                ? post.title || "Post"
                : post.image?.alt || post.title || "Post";
            const href = post.slug || post.href || "#";
            return (
              <div
                key={post.id ?? `${post.title}-${index}`}
                className="group flex items-center gap-4 transition-transform hover:-translate-y-0.5"
              >
                <Link
                  href={href}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="80px"
                      unoptimized={isUnoptimizedImageSrc(imageSrc)}
                    />
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    {post.date ? <span>{post.date}</span> : null}
                    {post.category ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#ff5a36]" />
                        <span className="text-[#ff5a36]">{post.category}</span>
                      </>
                    ) : null}
                  </div>
                  <Link
                    href={href}
                    className="mt-1 line-clamp-2 text-sm font-bold text-[#1a0c2e] transition-colors group-hover:text-[#ff5a36] sm:text-base"
                  >
                    {post.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
