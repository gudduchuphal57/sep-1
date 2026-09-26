"use client";

import Link from "next/link";

import type { BreadcrumbItem, SectionData } from "../../../types/section";

export const eventsBreadcrumbEditorFields = [
  "breadcrumbBackgroundType",
  "breadcrumbColorBackgroundType",
  "backgroundImage",
  "title",
  "subtitle",
  "breadcrumb",
  "textColor",
  "backgroundColor",
  "breadcrumbGradientColor",
];

export type EventsPageBanner1Props = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  textColor?: string;
  backgroundColor?: string;
  breadcrumbBackgroundType?: "image" | "color";
  breadcrumbColorBackgroundType?: "solid" | "gradient";
  breadcrumbGradientColor?: string;
  editorFields?: string[];
};

export function getEventsPageBannerProps(
  data: SectionData = {},
  overrides: Partial<EventsPageBanner1Props> = {},
): EventsPageBanner1Props {
  return {
    title: data.title,
    subtitle: data.subtitle ?? data.desc ?? data.description,
    backgroundImage: data.backgroundImage,
    breadcrumb: data.breadcrumb,
    textColor: data.textColor,
    backgroundColor: data.backgroundColor,
    breadcrumbBackgroundType: data.breadcrumbBackgroundType,
    breadcrumbColorBackgroundType: data.breadcrumbColorBackgroundType,
    breadcrumbGradientColor: data.breadcrumbGradientColor,
    ...overrides,
  };
}

export default function EventsPageBanner1({
  title,
  subtitle,
  backgroundImage,
  breadcrumb = [],
  textColor,
  backgroundColor,
  breadcrumbBackgroundType = "image",
  breadcrumbColorBackgroundType = "solid",
  breadcrumbGradientColor,
  editorFields = eventsBreadcrumbEditorFields,
}: EventsPageBanner1Props) {
  const items = breadcrumb.filter((item) => item?.label);
  const usesColorBackground = breadcrumbBackgroundType === "color";
  const usesGradientBackground =
    usesColorBackground && breadcrumbColorBackgroundType === "gradient";
  const hasBackgroundImage =
    !usesColorBackground && Boolean(backgroundImage?.trim());
  const resolvedTextColor = textColor || "#ffffff";
  const mutedTextColor = textColor || "#e2e8f0";
  const resolvedBackgroundColor = backgroundColor || "#111827";
  const resolvedGradientColor = breadcrumbGradientColor || "#d61b58";

  return (
    <section
      data-editor-section-label="Breadcrumb"
      data-editor-fields={editorFields.join(" ")}
      className="relative w-full overflow-hidden py-[5.5rem]"
      style={
        usesGradientBackground
          ? {
              backgroundImage: `linear-gradient(90deg, ${resolvedBackgroundColor}, ${resolvedGradientColor})`,
            }
          : usesColorBackground
            ? {
                backgroundColor: resolvedBackgroundColor,
              }
            : hasBackgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundColor: resolvedBackgroundColor,
              }
      }
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
