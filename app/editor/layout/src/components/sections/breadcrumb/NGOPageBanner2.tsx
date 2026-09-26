"use client";

import Link from "next/link";

import type { BreadcrumbItem, SectionData } from "../../../types/section";
import { toDisplayText } from "../../../lib/ngoTitle";

export const ngoBreadcrumbEditorFields = [
  "breadcrumbBackgroundType",
  "breadcrumbColorBackgroundType",
  "backgroundImage",
  "breadcrumb",
  "textColor",
  "backgroundColor",
  "breadcrumbGradientColor",
];

type NGOBannerShape = {
  bgImageUrl?: string;
  breadcrumbHome?: string;
  breadcrumbCurrent?: string;
  title?: string;
  alt?: string;
};

export type NGOPageBanner2Props = {
  title?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  banner?: NGOBannerShape;
  textColor?: string;
  backgroundColor?: string;
  breadcrumbBackgroundType?: "image" | "color";
  breadcrumbColorBackgroundType?: "solid" | "gradient";
  breadcrumbGradientColor?: string;
  editorFields?: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asBanner = (value: unknown): NGOBannerShape =>
  isRecord(value) ? (value as NGOBannerShape) : {};

export function getNGOPageBannerProps(
  data: SectionData = {},
  overrides: Partial<NGOPageBanner2Props> = {},
): NGOPageBanner2Props {
  const banner = asBanner(data.banner);
  const title =
    toDisplayText(banner.breadcrumbCurrent) ||
    (typeof data.title === "string" ? toDisplayText(data.title) : undefined) ||
    toDisplayText(banner.title);

  return {
    title,
    backgroundImage:
      typeof data.backgroundImage === "string" && data.backgroundImage.trim()
        ? data.backgroundImage
        : banner.bgImageUrl,
    breadcrumb: data.breadcrumb,
    banner,
    textColor: data.textColor,
    backgroundColor: data.backgroundColor,
    breadcrumbBackgroundType: data.breadcrumbBackgroundType,
    breadcrumbColorBackgroundType: data.breadcrumbColorBackgroundType,
    breadcrumbGradientColor: data.breadcrumbGradientColor,
    ...overrides,
    ...(overrides.title !== undefined
      ? { title: toDisplayText(overrides.title) ?? String(overrides.title || "") }
      : {}),
  };
}

export default function NGOPageBanner2({
  title,
  backgroundImage,
  breadcrumb,
  banner = {},
  textColor,
  backgroundColor,
  breadcrumbBackgroundType = "image",
  breadcrumbColorBackgroundType = "solid",
  breadcrumbGradientColor,
  editorFields = ngoBreadcrumbEditorFields,
}: NGOPageBanner2Props) {
  const heading =
    toDisplayText(title) ||
    toDisplayText(banner.breadcrumbCurrent) ||
    toDisplayText(banner.title) ||
    "";
  const imageSrc = backgroundImage || banner.bgImageUrl || "";
  const usesColorBackground = breadcrumbBackgroundType === "color";
  const usesGradientBackground =
    usesColorBackground && breadcrumbColorBackgroundType === "gradient";
  const hasBackgroundImage = !usesColorBackground && Boolean(imageSrc.trim());
  const resolvedTextColor = textColor || "#ffffff";
  const mutedTextColor = textColor || "#ffffffcc";
  const resolvedBackgroundColor = backgroundColor || "#120a1a";
  const resolvedGradientColor = breadcrumbGradientColor || "#ff541b";

  const items =
    breadcrumb && breadcrumb.length > 0
      ? breadcrumb.filter((item) => item?.label)
      : [
          {
            label: banner.breadcrumbHome || "Home",
            href: "/",
          },
          {
            label: banner.breadcrumbCurrent || heading,
            href: undefined,
          },
        ].filter((item) => item.label);

  return (
    <section
      data-editor-section-label="Breadcrumb"
      data-editor-fields={editorFields.join(" ")}
      className="relative flex min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[330px] lg:min-h-[350px]"
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
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  backgroundColor: resolvedBackgroundColor,
                }
      }
    >
      {hasBackgroundImage ? (
        <div className="absolute inset-0 bg-[#120a1a]/70" aria-hidden="true" />
      ) : null}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1
          className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          style={{ color: resolvedTextColor }}
        >
          {heading}
        </h1>

        {items.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-sm"
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <span
                  key={`${item.label}-${index}`}
                  className="inline-flex items-center gap-2"
                >
                  {isLast || !item.href ? (
                    <span className="text-[#ff541b]">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[#ff541b]"
                      style={{ color: mutedTextColor }}
                    >
                      {item.label}
                    </Link>
                  )}
                  {!isLast ? (
                    <span style={{ color: mutedTextColor }}>/</span>
                  ) : null}
                </span>
              );
            })}
          </nav>
        ) : null}

        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#ff541b]" />
      </div>
    </section>
  );
}
