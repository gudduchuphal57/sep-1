"use client";

import Link from "next/link";

import type { BreadcrumbItem } from "../../../types/section";

export const eventsBreadcrumbEditorFields = [
  "backgroundImage",
  "title",
  "subtitle",
  "breadcrumb",
  "textColor",
  "backgroundColor",
];

export type EventsPageBanner1Props = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  textColor?: string;
  backgroundColor?: string;
  editorFields?: string[];
};

export default function EventsPageBanner1({
  title,
  subtitle,
  backgroundImage,
  breadcrumb = [],
  textColor,
  backgroundColor,
  editorFields = eventsBreadcrumbEditorFields,
}: EventsPageBanner1Props) {
  const items = breadcrumb.filter((item) => item?.label);
  const hasBackgroundImage = Boolean(backgroundImage?.trim());
  const resolvedTextColor = textColor || "#ffffff";
  const mutedTextColor = textColor || "#e2e8f0";
  const resolvedBackgroundColor =
    backgroundColor || (hasBackgroundImage ? undefined : "#111827");

  return (
    <section
      data-editor-section-label="Breadcrumb"
      data-editor-fields={editorFields.join(" ")}
      className="relative w-full overflow-hidden py-[5.5rem]"
      style={{
        backgroundColor: resolvedBackgroundColor,
        backgroundImage: hasBackgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: hasBackgroundImage ? "cover" : undefined,
        backgroundPosition: hasBackgroundImage ? "center center" : undefined,
        backgroundRepeat: hasBackgroundImage ? "no-repeat" : undefined,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1
          className="mt-4 text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
          style={{ color: resolvedTextColor }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-2 font-medium sm:text-xl md:text-2xl"
            style={{ color: mutedTextColor }}
          >
            {subtitle}
          </p>
        )}
        {items.length > 0 && (
          <nav aria-label="Breadcrumb" className="mt-4">
            <ol className="flex items-center justify-center text-sm">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex items-center"
                  >
                    {isLast ? (
                      <span
                        className="font-semibold"
                        style={{ color: resolvedTextColor }}
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href ?? "#"}
                        className="transition hover:opacity-80"
                        style={{ color: mutedTextColor }}
                      >
                        {item.label}
                      </Link>
                    )}

                    {!isLast && (
                      <span className="mx-2" style={{ color: mutedTextColor }}>
                        |
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
