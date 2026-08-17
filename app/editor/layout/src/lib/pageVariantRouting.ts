import type { SectionItem } from "../types/section";

const pageComponentPattern = /Page-?\d+$/i;

export const getPageNameFromHref = (href: string) => {
  const normalizedHref = href.trim();

  if (!normalizedHref || normalizedHref === "#" || normalizedHref === "/") {
    return "Home";
  }

  const pagePath = normalizedHref
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .split(/[?#]/, 1)[0]
    .replace(/\/+$/, "")
    .split("/")
    .pop();

  return pagePath
    ? pagePath
        .replace(/-/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Home";
};

export const getPageVariantForSlug = (
  section: SectionItem,
  pageSlug: string,
) =>
  Object.keys(section.data ?? {}).find(
    (variant) =>
      pageComponentPattern.test(variant) &&
      variant.toLowerCase() === pageSlug,
  ) ??
  (pageComponentPattern.test(section.variant) &&
  section.variant.toLowerCase() === pageSlug
    ? section.variant
    : null);

export const sectionMatchesPageRoute = (
  section: SectionItem,
  pageSlug: string,
) =>
  section.page?.toLowerCase() === pageSlug ||
  Boolean(getPageVariantForSlug(section, pageSlug));
