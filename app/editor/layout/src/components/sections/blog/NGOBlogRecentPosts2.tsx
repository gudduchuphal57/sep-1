"use client";

import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type Post = {
  title?: string;
  date?: string;
  image?: string;
  href?: string;
  link?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBlogRecentPosts2({ data = {} }: SectionProps) {
  const sidebar = isRecord(data.sidebar) ? data.sidebar : undefined;
  const posts = (Array.isArray(sidebar?.recentPosts)
    ? sidebar?.recentPosts
    : Array.isArray(data.recentPosts)
      ? data.recentPosts
      : Array.isArray(data.posts)
        ? data.posts
        : []) as Post[];
  const heading =
    (typeof sidebar?.recentTitle === "string" && sidebar.recentTitle) ||
    (typeof data.recentTitle === "string" && data.recentTitle) ||
    "Recent Posts";

  if (!posts.length) return null;

  return (
    <section
      data-editor-section-label="Recent Posts"
      data-editor-fields="sidebar recentPosts posts"
      className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-[#faf7f5] p-6">
        <h2 className="text-xl font-bold text-[#0F172A]">{heading}</h2>
        <div className="mt-4 space-y-4">
          {posts.map((post, idx) => {
            const href = post.href ?? post.link ?? "#";
            return (
              <Link
                key={`${post.title}-${idx}`}
                href={href}
                className="flex gap-3 rounded-xl bg-white p-3 transition hover:shadow-md"
              >
                {post.image ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.image}
                      alt={post.title || "Post"}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={isUnoptimizedImageSrc(post.image)}
                    />
                  </div>
                ) : null}
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] hover:text-[#ff541b]">
                    {post.title}
                  </h3>
                  {post.date ? (
                    <p className="mt-1 text-xs text-slate-500">{post.date}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
