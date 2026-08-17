"use client";

import Image from "next/image";

import type {
  EventsBlogContentBlockData,
  EventsBlogPostData,
  SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsBlogDetailsContent1({ data = {} }: SectionProps) {
  const item = data as EventsBlogPostData;
  const featuredImage =
    item.featuredImage ?? item.image ?? "/categories/events/template1/blog1.jpg";
  const content = (item.content ?? []) as EventsBlogContentBlockData[];

  return (
    <section
      data-editor-section-label="Article Content"
      data-editor-fields="featuredImage featuredImageAlt category label author date readTime title description content"
      className="space-y-6"
    >
      <div className="relative h-[24rem] overflow-hidden rounded-[2rem] border border-[#f4d4e1] shadow-[0_24px_80px_-40px_rgba(214,27,88,0.28)] sm:h-[28rem]">
        <Image
          src={featuredImage}
          alt={item.featuredImageAlt ?? item.alt ?? item.title ?? "Blog post"}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 70vw"
          unoptimized={isUnoptimizedImageSrc(featuredImage)}
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {(item.category ?? item.label) && (
            <span className="rounded-full px-3 py-1 font-semibold text-[#d61b58]">
              {item.category ?? item.label}
            </span>
          )}
          {item.author && <span>{item.author}</span>}
          {item.date && <span>• {item.date}</span>}
          {item.readTime && <span>• {item.readTime}</span>}
        </div>

        {item.title && (
          <h1
            data-editor-field="title"
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900"
          >
            {item.title}
          </h1>
        )}

        {item.description && (
          <p
            data-editor-field="description"
            className="mt-4 border-l-4 border-[#d61b58] pl-4 text-lg italic leading-relaxed text-slate-600"
          >
            {item.description}
          </p>
        )}

        {content.length > 0 && (
          <div className="mt-6 space-y-6 leading-relaxed text-slate-700">
            {content.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h3
                    key={`${block.type}-${index}`}
                    className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl"
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "quote") {
                return (
                  <blockquote
                    key={`${block.type}-${index}`}
                    className="rounded-2xl border border-[#f4d4e1] bg-[#fff7fa] p-4 text-lg font-semibold text-slate-700"
                  >
                    “{block.text}”
                  </blockquote>
                );
              }

              if (block.type === "list" && block.items?.length) {
                return (
                  <ul
                    key={`${block.type}-${index}`}
                    className="ml-5 list-disc space-y-2 text-base text-slate-700"
                  >
                    {block.items.map((listItem, itemIndex) => (
                      <li key={`${index}-${itemIndex}`}>{listItem}</li>
                    ))}
                  </ul>
                );
              }

              if (block.text) {
                return (
                  <p
                    key={`${block.type ?? "paragraph"}-${index}`}
                    className="text-base leading-6 sm:text-[17px]"
                  >
                    {block.text}
                  </p>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
