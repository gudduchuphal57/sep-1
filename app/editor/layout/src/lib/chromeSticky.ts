import type { SectionData, SectionItem } from "../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getChromeSectionData = (
  section: SectionItem,
  activeVariant: string,
): SectionData => {
  const defaultVariant = `${section.type}-1`;
  const variantData =
    section.data?.[activeVariant] ?? section.data?.[defaultVariant];

  return (isRecord(variantData) ? variantData : section.data) as SectionData;
};

export const getChromeStickyMode = (
  section: SectionItem,
  sectionData: SectionData,
  fallback: "scroll" | "sticky" = "scroll",
): "scroll" | "sticky" => {
  if (section.type === "Header") {
    return sectionData.headerType ?? fallback;
  }

  if (section.type === "Topbar") {
    return sectionData.topbarType ?? fallback;
  }

  return "scroll";
};

export const getChromeStickyOffset = (
  sectionType: string,
  stickyMode: "scroll" | "sticky",
  topbarIsSticky: boolean,
  topbarHeight: number,
) => {
  if (stickyMode !== "sticky" || sectionType !== "Header" || !topbarIsSticky) {
    return 0;
  }

  return Math.max(0, Math.round(topbarHeight));
};
