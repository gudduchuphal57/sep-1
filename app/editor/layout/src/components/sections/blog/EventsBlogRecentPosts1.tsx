"use client";

import Image from "next/image";
import Link from "next/link";

import type { EventsBlogPostData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const getPostIdentifier = (post: EventsBlogPostData) => {
  if (post.slug?.trim()) return post.slug.trim();
  const href = post.link ?? post.href;
  if (!href) return undefined;
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  return params.get("id") ?? path.replace(/\/+$/, "").split("/").pop();
};

export default function EventsBlogRecentPosts1({ data = {} }: SectionProps) {
  const item = data as EventsBlogPostData;
  const currentId = getPostIdentifier(item);
  const relatedPosts = ((item.relatedPosts ?? []) as EventsBlogPostData[]).filter(
    (post) => {
      if (!currentId) return true;
      return getPostIdentifier(post) !== currentId;
    },
  );

  return (
    <section
      data-editor-section-label="Recent Posts"
      data-editor-fields="relatedTitle relatedPosts"
      className="lg:sticky lg:top-28"
    >
      <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-5 shadow-[0_24px_80px_-40px_rgba(214,27,88,0.28)] sm:p-6">
        <h3
          data-editor-field="relatedTitle"
          className="text-xl font-extrabold tracking-tight text-slate-900"
        >
          {item.relatedTitle ?? "Recent Posts"}
        </h3>
        <p className="mt-1 text-xs text-slate-500">Browse the latest blog posts.</p>

        <div className="mt-5 space-y-4">
          {relatedPosts.length > 0 ? (
            relatedPosts.map((post, index) => {
              const image =
                post.image ?? "/categories/events/template1/blog1.jpg";

              return (
                <Link
                  key={`${post.title}-${index}`}
                  href={post.link ?? post.href ?? "#"}
                  className="flex items-center gap-3.5 rounded-2xl border border-transparent p-3 transition hover:border-[#f4d4e1] hover:bg-[#fff7fa]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={image}
                      alt={post.alt ?? post.title ?? "Blog post"}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={isUnoptimizedImageSrc(image)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#d61b58]">
                      {post.label ?? "Blog"}
                    </p>
                    <h4 className="mt-1 line-clamp-2 text-sm font-bold leading-tight text-slate-800">
                      {post.title}
                    </h4>
                    {post.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {post.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="rounded-2xl bg-[#fff7fa] p-4 text-xs text-slate-600">
              No additional posts available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
