import type { SectionItem } from "../types/section";

const pageComponentPattern = /Page-?\d+$/i;

const PAGE_ROUTE_ALIASES: Record<string, string[]> = {
  testimonial: ["testimonials"],
  testimonials: ["testimonial"],
  "case-details": ["casedetails", "case-detail"],
  casedetails: ["case-details", "case-detail"],
  "case-detail": ["case-details", "casedetails"],
  frenchise: ["franchise"],
  franchise: ["frenchise"],
  enquiry: ["enquiry-now", "enquirynow"],
  "enquiry-now": ["enquiry", "enquirynow"],
  refund: ["refund-policy", "refundpolicy"],
  "refund-policy": ["refund", "refundpolicy"],
  refundpolicy: ["refund", "refund-policy"],
  privacy: ["privacy-policy", "privacypolicy"],
  "privacy-policy": ["privacy", "privacypolicy"],
  privacypolicy: ["privacy", "privacy-policy"],
  terms: ["terms-conditions", "termsconditions", "terms-and-conditions"],
  "terms-conditions": ["terms", "termsconditions", "terms-and-conditions"],
  termsconditions: ["terms", "terms-conditions"],
  cookie: ["cookie-policy", "cookiepolicy"],
  "cookie-policy": ["cookie", "cookiepolicy"],
  cookiepolicy: ["cookie", "cookie-policy"],
};

export const getPageRouteAliases = (pageSlug: string) => {
  const slug = pageSlug.trim().toLowerCase();
  if (!slug) return [];
  return [slug, ...(PAGE_ROUTE_ALIASES[slug] ?? [])];
};

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
  getPageRouteAliases(pageSlug).some(
    (alias) =>
      section.page?.toLowerCase() === alias ||
      Boolean(getPageVariantForSlug(section, alias)),
  );
