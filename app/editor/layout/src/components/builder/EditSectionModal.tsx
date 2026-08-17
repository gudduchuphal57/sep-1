"use client";

import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Menu, Plus, Trash, X } from "lucide-react";
import {
  BannerSlideData,
  ButtonData,
  FormFieldData,
  SectionData,
  SocialLinkData,
} from "../../types/section";
import { getSectionComponent } from "../../lib/sectionRegistry";
import {
  getCategoryLayoutOptions,
  getCategoryPageLayoutOptions,
} from "../../data/templateFlow";
import { PageLink, usePreview } from "../context/PreviewContext";

type MenuItem = {
  label: string;
  href: string;
  children?: MenuItem[];
};

type SectionItem = {
  id?: string;
  page?: string;
  type: string;
  variant: string;
  data: Record<string, SectionData>;
};

type HeaderBackgroundType = "solid" | "gradient";
type TopbarBackgroundType = "solid" | "gradient";
type FooterBackgroundType = "solid" | "gradient";
type StickySectionType = "scroll" | "sticky";
type BannerBackgroundMode = "image" | "video" | "solid" | "gradient";
const MAX_FOOTER_LINKS_PER_COLUMN = 10;
const MAX_PROPERTY_PROCESS_STEPS = 4;

type EditSectionModalProps = {
  category: string;
  sectionId: string;
  sectionType: string;
  subsectionScope?: {
    index: number;
    label: string;
    content: string;
    fields?: string[];
    formTabFields?: string[];
    cardFields?: string[];
    fieldValues?: Record<string, string>;
    hasCardLayout?: boolean;
  } | null;
  sections: SectionItem[];
  onClose: () => void;
  onSave: (sectionType: string) => void;
  onSelectVariant: (type: string, variant: string) => void;
  onUpdateSectionData: (
    type: string,
    newData: Record<string, SectionData>,
  ) => void;
  onDeleteSection?: () => void;
};

const normalizeScopeContent = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const getNextPropertySlug = (items: unknown[]) => {
  const existingSlugs = new Set(
    items.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return [];
      const slug = (item as Record<string, unknown>).slug;
      return typeof slug === "string" ? [slug] : [];
    }),
  );
  let suffix = 1;

  while (existingSlugs.has(`new-property-${suffix}`)) suffix += 1;

  return `new-property-${suffix}`;
};

const getNextProjectSlug = (items: unknown[]) => {
  const existingSlugs = new Set(
    items.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return [];
      const slug = (item as Record<string, unknown>).slug;
      return typeof slug === "string" ? [slug] : [];
    }),
  );
  let suffix = 1;

  while (existingSlugs.has(`new-project-${suffix}`)) suffix += 1;

  return `new-project-${suffix}`;
};

const valueAppearsInSubsection = (value: unknown, content: string): boolean => {
  if (typeof value === "string") {
    const normalizedValue = normalizeScopeContent(value);
    return normalizedValue.length > 0 && content.includes(normalizedValue);
  }

  if (Array.isArray(value)) {
    return value.some((item) => valueAppearsInSubsection(item, content));
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((item) =>
      valueAppearsInSubsection(item, content),
    );
  }

  return false;
};

const aboutPageLayouts = [
  { id: "AboutPage-1", name: "About Page" },
  { id: "AboutPage-2", name: "About Page Two" },
  { id: "AboutPage-3", name: "About Page Three" },
];

const galleryPageLayouts = [{ id: "GalleryPage-1", name: "Gallery Page" }];

const servicePageLayouts = [{ id: "ServicePage-1", name: "Service Page" }];

const contactPageLayouts = [
  { id: "ContactPage-1", name: "Contact Page" },
  { id: "ContactPage-2", name: "Contact Page Two" },
];

const pageLayoutsBySection: Record<string, { id: string; name: string }[]> = {
  About: aboutPageLayouts,
  Service: servicePageLayouts,
  Gallery: galleryPageLayouts,
  Contact: contactPageLayouts,
};

const MAX_MENU_LINKS = 7;
const MAX_DROPDOWN_LINKS = 10;
const MAX_TOPBAR_SOCIAL_LINKS = 5;
const MAX_HEADER_BUTTONS = 3;
const MAX_BANNER_BUTTONS = 3;
const MAX_FORM_FIELDS = 5;
const MAX_FEATURE_CARDS = 4;
const MAX_BLOG_CARDS = 20;
const MAX_LINK_TEXT_LENGTH = 20;
const DEFAULT_WHATSAPP_LINK = "https://api.whatsapp.com/send?phone=962786336414";
const DEFAULT_CALL_LINK = "tel:+919876543210";

const toPageLinks = (menu: MenuItem[], limit = MAX_MENU_LINKS): PageLink[] =>
  menu.slice(0, limit).map((item) => ({
    label: item.label,
    href: item.href,
    children: item.children
      ? toPageLinks(item.children, MAX_DROPDOWN_LINKS)
      : undefined,
  }));

const getPageNames = (links: PageLink[]): string[] =>
  links.flatMap((link) => [
    link.label,
    ...(link.children ? getPageNames(link.children) : []),
  ]);

const getMediaKindFromKey = (key: string): "image" | "video" | null => {
  const normalizedKey = key.toLowerCase();

  if (
    normalizedKey.includes("title") ||
    normalizedKey.includes("alt") ||
    normalizedKey.includes("label") ||
    normalizedKey.includes("href")
  ) {
    return null;
  }

  if (normalizedKey === "poster" || normalizedKey === "src") return "image";
  if (/image\d*$/.test(normalizedKey)) {
    return "image";
  }
  if (/video\d*$/.test(normalizedKey)) {
    return "video";
  }

  return null;
};

const getMediaUploadLabel = (value: string, mediaKind: "image" | "video") => {
  if (!value) return `Choose ${mediaKind}`;

  return value.startsWith("data:")
    ? "Selected from desktop"
    : `Current ${mediaKind}`;
};

const socialLinkLabels: SocialLinkData["label"][] = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
];

const MAX_FOOTER_SOCIAL_LINKS = 6;


const sidebarItemsBySection: Record<string, string[]> = {
  Topbar: ["Topbar Layout", "Topbar Content"],
  Header: ["Header Content", "Header Layout", "Navigation Menu"],
  Banner: ["Banner Content", "Banner Layout"],
  About: ["About Content", "About Layout"],
  Service: ["Service Content", "Service Layout"],
  Product: ["Product Content", "Product Layout"],
  WhyChooseUs: ["WhyChooseUs Content", "WhyChooseUs Layout"],
  Gallery: ["Gallery Content", "Gallery Layout"],
  Contact: ["Contact Content", "Contact Layout"],
  FAQ: ["FAQ Content", "FAQ Layout"],
  Testimonial: ["Our Clients Content", "Our Clients Layout"],
  Awards: ["Awards Content", "Awards Layout"],
  Blog: ["Blog Content", "Blog Layout"],
  CompanyStatistics: ["Statistics Content", "Statistics Layout"],
  CareerPage: ["CareerPage Content", "CareerPage Form"],
  FormDetail: ["Form Content", "Form Layout"],
  PopularEvents: ["PopularEvents Content"],
  Team: ["Team Content"],
  Footer: ["Footer Layout", "Footer Content", "External Link"],
};

const componentContentFieldsByVariant: Record<string, string[]> = {
  "Features-1": ["features"],
  "Highlight-1": ["categoriesPretitle", "categoriesTitle", "categoriesDesc", "categories"],
  "Featured-1": ["subtitle", "sectionTitle", "title", "description", "desc", "listings"],
  "LatestProjects-1": ["pretitle", "title", "desc", "projectItems", "button"],
  "CitiesWeServe-1": ["pretitle", "title", "desc", "cities", "tabs", "button"],
  "FeaturedDevelopers-1": ["pretitle", "title", "desc", "items"],
  "FeaturedDevelopers-2": ["pretitle", "title", "desc", "items"],
  "FeaturedDevelopers-3": ["pretitle", "title", "desc", "items"],
  "PropertyProcess-1": ["pretitle", "title", "desc", "steps", "button"],
  "InvestmentOpportunities-1": ["pretitle", "title", "desc", "items", "button"],
  "Contact-1": ["pretitle", "title", "desc", "backgroundImage", "backgroundImageTitle", "formFields", "formSubmitLabel", "successMessage"],
  "About-1": ["pretitle", "title", "desc", "backgroundImage", "backgroundImageTitle", "buttons"],
  "EventsAbout1": [
    "pretitle",
    "title",
    "subtitle",
    "desc",
    "desc2",
    "sideImage",
    "sideImageTitle",
    "buttons",
    "stats",
  ],
  "About-2": ["pretitle", "title", "subtitle", "desc", "backgroundImage", "backgroundImageTitle", "sideImage", "sideImageTitle", "philosophyTitle", "philosophyDesc", "buttons"],
  "AboutPage-1": ["pretitle", "title", "subtitle", "desc", "desc2", "sideImage", "sideImageTitle", "philosophyTitle", "philosophyDesc", "buttons"],
  "AboutPage-2": ["pretitle", "title", "desc", "desc2", "sideImage", "sideImageTitle"],
  "AboutPage-3": ["pretitle", "title", "subtitle", "desc", "desc2", "philosophyTitle", "philosophyDesc"],
  "ServicePage-1": ["pretitle", "title", "subtitle", "desc", "desc2", "sideImage", "sideImageTitle", "productSectionTitle", "productItems", "productSlides"],
  "Product-1": ["productSlides", "productFeatures", "productTotalPrice", "productShippingText"],
  "Product-2": ["productSectionTitle", "productItems"],
  "Product-3": ["pretitle", "title", "desc", "buttons", "productItems"],
  "WhyChooseUs-1": ["pretitle", "title", "desc", "whyChooseUsItems"],
  "WhyChooseUs-2": ["title", "whyChooseUsItems"],
  "WhyChooseUs-3": ["title", "whyChooseUsItems"],
  "WhyChooseUs-4": ["title", "whyChooseUsItems"],
  "PopularEvents-1": [
    "pretitle",
    "title",
    "desc",
    "description",
    "buttonLabel",
    "buttonIcon",
    "events",
    "tabs",
  ],
  "Gallery-1": ["title", "desc", "galleryItems"],
  "Gallery-2": ["title", "galleryItems"],
  "Gallery-3": ["title", "galleryItems"],
  "Gallery-4": ["pretitle", "title", "desc", "galleryItems"],
  "Gallery-5": ["title", "desc", "galleryItems"],
  "Gallery-6": ["title", "galleryItems"],
  "GalleryPage-1": ["pretitle", "title", "desc", "galleryItems"],
  "ContactPage-1": ["pretitle", "title", "desc", "sideImage", "sideImageTitle", "footerContact", "formFields", "formSubmitLabel"],
  "ContactPage-2": ["pretitle", "title", "desc", "footerContact", "formFields", "formSubmitLabel"],
  "FAQ-1": ["pretitle", "title", "desc", "faqItems"],
  "FAQ-2": ["title", "faqItems"],
  "FAQ-3": ["title", "faqItems"],
  "FAQ-4": ["title", "faqItems"],
  "Testimonial-1": ["pretitle", "title", "desc", "testimonialItems"],
  "Testimonial-2": ["pretitle", "title", "desc", "testimonialItems"],
  "Testimonial-3": ["pretitle", "title", "testimonialItems"],
  "Awards-1": ["pretitle", "title", "desc", "awardItems", "button"],
  "Awards-2": ["pretitle", "title", "desc", "awardItems", "button"],
  "Awards-3": ["pretitle", "title", "desc", "awardItems", "button"],
  "Blog-1": ["pretitle", "title", "desc", "blogItems", "buttons"],
  "CompanyStatistics-1": ["stats"],
  "CompanyStatistics-2": ["stats"],
  "CompanyStatistics-3": ["stats"],
  "FormDetail-1": ["pretitle", "title", "desc", "backgroundImage", "backgroundImageTitle", "sideImage", "galleryItems", "formFields", "formSubmitLabel"],
  "FormDetail-2": ["title", "formFields", "formSubmitLabel"],
  "FormDetail-3": ["title", "desc", "phone", "email", "location", "formFields", "formSubmitLabel"],
  "FormDetail-4": ["title", "desc", "formFields", "formSubmitLabel"],
  "RealEstateAboutPage1": ["pretitle", "title", "desc", "subtitle", "sideImage", "backgroundImage", "sideImageTitle", "desc2", "philosophyTitle", "philosophyDesc", "promises", "buttons", "stats"],
  "EventsAboutPage1": [
    "pretitle",
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "description",
    "description1",
    "description2",
    "description3",
    "quote",
    "quoteRole",
    "image",
    "imageAlt",
    "image2",
    "image2Alt",
    "stats",
    "values",
    "cta"
  ],
  "EventsBlogPage1": [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "blogItems",
    "buttonLabel",
    "buttonIcon",
  ],
  "EventsCareersPage1": [
    "pretitle",
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "description",
    "description2",
    "heroImage",
    "heroImageAlt",
    "stats",
    "rolesPretitle",
    "rolesTitle",
    "rolesApplyLabel",
    "roles",
    "benefits",
    "culture",
    "applyForm",
    "whyJoinUs",
    "quote",
    "quoteAuthor",
    "ctaLabel",
    "ctaHref",
  ],
  "EventsCareersApplyPage1": [
    "backgroundImage",
    "breadcrumb",
    "title",
    "department",
    "location",
    "type",
    "experience",
    "postedOn",
    "description",
    "applyForm",
    "whyJoinUs",
  ],
  "EventsContactPage1": [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "contactItems",
    "form",
    "mapEmbedUrl",
  ],
  "EventsCaseStudyPage1": [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "featuredImage",
    "featuredImageAlt",
    "stats",
    "highlightsTitle",
    "highlights",
    "projectTitle",
    "projectDescription",
    "projectPoints",
    "ctaTitle",
    "ctaLabel",
    "ctaHref",
  ],
  "EventsSupportPage1": [
    "title",
    "subtitle",
    "heroSubtitle",
    "backgroundImage",
    "breadcrumb",
    "contactPretitle",
    "contactTitle",
    "contactDescription",
    "contactItems",
    "faqPretitle",
    "faqTitle",
    "faqItems",
  ],
  "EventsPrivacyPolicyPage1": [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "sections",
  ],
  "EventsTermsConditionPage1": [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "sections",
  ],
  "RealEstateAwardsPage1": ["pretitle", "title", "desc", "awardItems"],
  "RealEstateBlogPage1": ["pretitle", "title", "desc", "blogItems", "galleryItems"],
  "RealEstateCareerPage1": ["pretitle", "title", "desc", "desc2", "benefits", "jobs", "formPretitle", "formTitle", "formFields", "applyLabel", "successTitle", "successDesc", "successButtonLabel"],
  "RealEstateContactPage1": ["pretitle", "title", "desc", "footerContact", "formFields", "formSubmitLabel", "successMessage"],
  "RealEstateCSRPage1": ["pretitle", "title", "desc", "sideImage", "sideImageTitle", "impactStats", "programs", "donateCta"],
  "RealEstateMissionVision1": ["pretitle", "title", "desc", "desc2", "sideImage", "sideImageTitle", "pillarsPretitle", "pillarsTitle", "pillars", "valuesPretitle", "valuesTitle", "values"],
  "RealEstateSitemap1": ["pretitle", "title", "desc", "groups"],
  "RealEstateServicePage1": ["pretitle", "title", "desc", "subtitle", "sideImage", "sideImageTitle", "productSectionTitle", "productSlides"],
  "RealEstateGalleryPage1": ["pretitle", "title", "desc", "galleryItems"],
  "RealEstateProject1": ["pretitle", "title", "desc", "projectItems", "tabs"],
  "RealEstateProjectDetail1": ["homeLabel", "projectsLabel", "title", "desc", "description", "body", "image", "alt", "category", "status", "statusText", "location", "ctaLabel", "ctaHref", "backLabel"],
  "RealEstateRent1": [
    "pretitle",
    "title",
    "desc",
    "allPropertiesLabel",
    "forSaleLabel",
    "forRentLabel",
    "cityLabel",
    "allCitiesLabel",
    "resultsLabel",
    "emptyMessage",
    "listings",
  ],
  "RealEstateProperty1": [
    "pretitle",
    "title",
    "desc",
    "searchPlaceholder",
    "propertyTypeAllLabel",
    "listingsPretitle",
    "listingsTitle",
    "resultsLabel",
    "emptyMessage",
    "listings",
  ],
  "RealEstateBlogDetail1": ["pretitle", "title", "date", "body", "excerpt", "image", "primaryButtonLabel", "primaryButtonHref", "secondaryButtonLabel", "secondaryButtonHref"],
  "RealEstatePropertyDetail1": ["title", "subtitle", "description", "body", "image", "alt", "category", "statusText", "price", "infoTitle", "features", "amenities", "button"],
  "RealEstatePrivacyPolicy1": ["pretitle", "title", "desc", "updatedAt", "sections"],
  "RealEstateTermsConditions1": ["pretitle", "title", "desc", "updatedAt", "sections"],
  "RealEstateDisclaimer1": ["pretitle", "title", "desc", "updatedAt", "sections"],
  "RealEstateCookiePolicy1": ["pretitle", "title", "desc", "updatedAt", "sections"],
  "RealEstateRefundPolicy1": ["pretitle", "title", "desc", "updatedAt", "sections"],
};

const innerPageContentDefaultsByVariant: Record<string, SectionData> = {
  BusinessAboutPage1: {
    principles: [
      { title: "Exceptional materials", desc: "Silks selected for their texture, movement, and enduring finish." },
      { title: "Precise craftsmanship", desc: "Every seam, fastening, and silhouette is considered by hand." },
      { title: "Modern elegance", desc: "Heritage techniques shaped into pieces made for life today." },
    ],
    ctaPretitle: "Private consultation",
    ctaTitle: "Discover a piece shaped around you.",
    ctaLabel: "Book a consultation",
    ctaHref: "/contact",
  },
  RealEstateAboutPage1: {
    promises: [
      "Verified property information",
      "Clear pricing and local context",
      "Guided visits with local advisors",
      "Support from shortlist to closing",
    ],
    ctaPretitle: "Start your search",
    ctaTitle: "Let us help you find the right next move.",
    ctaPrimaryLabel: "Browse properties",
    ctaPrimaryHref: "/buy-a-property",
    ctaSecondaryLabel: "Contact us",
    ctaSecondaryHref: "/contact",
  },
  RealEstateServicePage1: {
    ctaPretitle: "Personal guidance",
    ctaTitle: "Tell us what you are looking for.",
    ctaLabel: "Contact us",
    ctaHref: "/contact",
  },
  RealEstateAwardsPage1: {
    contentPretitle: "Our honours",
    contentTitle: "Awards that mark how we work",
  },
  RealEstateBlogPage1: {
    postsPretitle: "Market journal",
    postsTitle: "Stories to guide your next move.",
    readArticleLabel: "Read article",
  },
  RealEstateBlogDetail1: {
    homeLabel: "Home",
    blogLabel: "Blog",
  },
  RealEstateCareerPage1: {
    jobsPretitle: "Open positions",
    jobsTitle: "Find your next role at HAUS Group.",
  },
  RealEstateContactPage1: {
    contactPretitle: "Reach our advisors",
    contactTitle: "We are ready to help with your next move.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    officeLabel: "Office",
    successTitle: "Message received.",
    successMessage: "Thank you. A HAUS Group advisor will contact you shortly.",
    successButtonLabel: "Send another message",
    formPretitle: "Property enquiry",
    formTitle: "Tell us what you are looking for.",
    consentText: "I agree that HAUS Group may contact me about this enquiry. See our",
    privacyPolicyLabel: "Privacy Policy",
  },
  RealEstateCSRPage1: {
    programsPretitle: "Our initiatives",
    programsTitle: "Practical support for stronger communities.",
    ctaPretitle: "Get involved",
  },
  RealEstateProject1: {
    resultsTitle: "Our projects",
    resultsLabel: "results",
    viewProjectLabel: "View project",
    emptyMessage: "No projects are available in this category.",
  },
  RealEstateProjectDetail1: {
    homeLabel: "Home",
    projectsLabel: "Projects",
    ctaLabel: "Enquire about this project",
    ctaHref: "/contact",
    backLabel: "All projects",
  },
  RealEstateProperty1: {
    pretitle: "Verified homes",
    title: "Buy a property with confidence.",
    desc: "Explore verified apartments, villas, floors, and studios across Delhi NCR.",
    searchPlaceholder: "Search by property or location",
    propertyTypeAllLabel: "All property types",
    listingsPretitle: "Properties",
    listingsTitle: "Homes for sale",
    resultsLabel: "listings",
    emptyMessage: "No properties match your search.",
  },
  RealEstateRent1: {
    pretitle: "Properties",
    title: "Featured Properties",
    desc: "Browse verified homes for sale and rent across Delhi NCR.",
    allPropertiesLabel: "All properties",
    forSaleLabel: "For Sale",
    forRentLabel: "For Rent",
    cityLabel: "City",
    allCitiesLabel: "All cities",
    resultsLabel: "results",
    emptyMessage: "No properties match this selection.",
  },
  RealEstatePropertyDetail1: {
    homeLabel: "Home",
    propertiesLabel: "Properties",
    primaryButtonLabel: "Book a visit",
    primaryButtonHref: "/contact",
    backButtonLabel: "All properties",
    amenitiesPretitle: "Amenities",
    amenitiesTitle: "What this property offers.",
    amenitiesDesc: "Everyday comforts and lifestyle facilities included with this listing.",
    amenities: [
      "Swimming Pool",
      "Gym / Fitness",
      "Covered Parking",
      "24×7 Security",
      "Power Backup",
      "High-Speed Wi-Fi",
      "Kids Play Area",
      "Landscaped Garden",
      "Clubhouse",
      "Elevator",
      "Laundry",
      "Visitor Parking",
    ],
  },
  RealEstatePrivacyPolicy1: {
    contactTitle: "Have a privacy question?",
    contactDescription: "Contact our team to review, update, or request deletion of the personal information you have shared with HAUS Group.",
    contactButtonLabel: "Contact us",
  },
  RealEstateTermsConditions1: {
    contactTitle: "Need help understanding these terms?",
    contactDescription: "Contact our team if you have a question about property information, enquiries, appointments, or your use of the HAUS Group website.",
    contactButtonLabel: "Contact us",
  },
  RealEstateDisclaimer1: {
    contactTitle: "Need clarification?",
    contactDescription: "Contact a HAUS Group advisor to verify listing details, availability, pricing, documentation, or any information shown on this website.",
    contactButtonLabel: "Contact us",
  },
  RealEstateCookiePolicy1: {
    contactTitle: "Have a cookie question?",
    contactDescription: "Contact HAUS Group if you need more information about cookies, analytics, or managing your website preferences.",
    contactButtonLabel: "Contact us",
  },
  RealEstateRefundPolicy1: {
    contactTitle: "Have a payment or refund question?",
    contactDescription: "Contact HAUS Group with the relevant service, payment, and transaction details so our team can review your request.",
    contactButtonLabel: "Contact us",
  },
};

const featuredListingContentFields = new Set([
  "image",
  "alt",
  "title",
  "subtitle",
  "description",
  "desc",
  "price",
  "category",
  "href",
]);

const latestProjectCardFields = new Set([
  "image",
  "status",
  "statusText",
  "location",
  "title",
  "desc",
  "description",
  "href",
]);
const portfolioHiddenFields = new Set(["region", "listingsLabel"]);
const propertyListingContentFields = new Set([
  "image",
  "statusText",
  "propertyType",
  "price",
  "title",
  "location",
  "description",
  "features",
  "href",
]);
const isPropertyCatalogSection = (sectionType: string) =>
  sectionType === "Listing" ||
  sectionType === "Rent" ||
  sectionType === "PropertyCatalog";
const defaultCareerFormFields = [
  { label: "Full name", name: "fullName", type: "text", placeholder: "Your full name" },
  { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
  { label: "Phone", name: "phone", type: "tel", placeholder: "Your phone number" },
  { label: "Position", name: "position", type: "text", placeholder: "General application", readOnly: true },
  { label: "Why are you interested?", name: "message", type: "textarea", placeholder: "Tell us about your experience" },
];
const careerPageFormContentFields = new Set([
  "formPretitle",
  "formTitle",
  "formFields",
  "applyLabel",
  "successTitle",
  "successDesc",
  "successButtonLabel",
]);
const cardCollectionFields = new Set([
  "awardItems",
  "amenities",
  "benefits",
  "culture",
  "blogItems",
  "categories",
  "cities",
  "collectionItems",
  "features",
  "galleryItems",
  "groups",
  "impactStats",
  "items",
  "jobs",
  "listings",
  "productItems",
  "productSlides",
  "programs",
  "projectItems",
  "skills",
  "stats",
  "steps",
  "teamItems",
  "testimonialItems",
  "values",
  "whyChooseUsItems",
  "events",
  "images",
  "cards",
  "members",
  "milestones",
  "coreBeliefs",
  "points",
  "departments",
  "awards",
  "ctaItems",
  "content",
  "relatedPosts",
  "roles",
  "whyJoinUs",
  "contactItems",
  "highlights",
  "projectPoints",
  "sections",
]);

const visibleCardFieldsByCollection: Record<string, string[]> = {
  awardItems: ["image", "year", "title", "org", "desc", "description", "href"],
  benefits: ["image", "title", "desc", "description"],
  culture: ["title", "description"],
  blogItems: ["image", "alt", "label", "title", "description", "excerpt", "desc", "date", "link", "href"],
  categories: ["image", "name", "title", "label", "desc", "href"],
  cities: ["image", "name", "title", "category", "location", "desc", "href"],
  collectionItems: ["image", "eyebrow", "title", "desc", "description", "href"],
  features: ["image", "title", "label", "value", "desc", "description"],
  galleryItems: ["image", "title", "desc", "description"],
  cards: ["image", "badge"],
  content: ["type", "text", "items"],
  relatedPosts: ["image", "alt", "label", "title", "description", "link"],
  roles: ["title", "location", "type", "description", "applyHref"],
  whyJoinUs: ["icon", "title", "description"],
  contactItems: ["icon", "label", "value"],
  highlights: ["title", "description"],
  projectPoints: ["title", "description"],
  faqItems: ["question", "answer"],
  sections: ["title", "content"],
  impactStats: ["image", "stat", "value", "label", "desc"],
  jobs: ["title", "location", "type", "desc"],
  productItems: ["image", "productTitle", "productSubtitle", "productInfoDesc", "productFeatures", "price", "link"],
  productSlides: ["image", "productTitle", "productSubtitle", "productInfoDesc", "productFeatures", "price", "link"],
  programs: ["image", "amount", "title", "desc", "description", "href"],
  projectItems: ["image", "status", "statusText", "category", "listingsLabel", "title", "location", "desc", "description", "href"],
  stats: ["stat", "value", "number", "label", "desc"],
  steps: ["image", "title", "desc", "description"],
  teamItems: ["image", "name", "role", "title", "desc"],
  testimonialItems: ["image", "name", "role", "quote", "rating", "initials", "address"],
  values: ["image", "number", "title", "desc", "description", "icon"],
  whyChooseUsItems: ["image", "icon", "stat", "title", "desc", "description"],
  events: [
    "image",
    "seats",
    "date",
    "location",
    "title",
    "desc",
    "description",
    "category",
    "link",
  ],
  images: ["src"],
  items: ["icon", "value", "title", "description"],
  milestones: ["year", "title", "description"],
  coreBeliefs: ["icon", "title", "description", "desc"],
  points: ["icon", "text"],
  breadcrumb: ["label", "href"],
  departments: ["label", "value"],
  awards: ["year", "title", "body", "category", "icon", "description"],
  ctaItems: ["value", "label"],
  members: ["image", "name", "role", "department", "bio", "social"],
};

const visibleObjectFieldsByKey: Record<string, string[]> = {
  vision: ["description", "detail", "image", "imageAlt", "points"],
  mission: [
    "pretitle",
    "title",
    "description",
    "detail",
    "image",
    "imageAlt",
    "points",
  ],
  featuredAward: [
    "year",
    "title",
    "body",
    "description",
    "image",
    "imageAlt",
  ],
  ctaButton: ["label", "href"],
  detailCtaButton: ["label", "href"],
  applyForm: [
    "title",
    "subtitle",
    "locations",
    "noticePeriods",
    "submitLabel",
    "successTitle",
    "successDescription",
    "backToCareersLabel",
    "homeLabel",
    "jobDetailsTitle",
    "whyJoinUsTitle",
  ],
  form: [
    "namePlaceholder",
    "emailPlaceholder",
    "subjectPlaceholder",
    "messagePlaceholder",
    "buttonLabel",
    "buttonIcon",
  ],
};

const nonVisualContentFields = new Set([
  "breadcrumb",
  "detail",
  "filters",
  "intentMap",
  "pageIntent",
]);

const getComponentContentFields = (
  variant: string,
  sectionType: string,
  isPageSection: boolean,
) => {
  const exactFields = componentContentFieldsByVariant[variant];
  if (exactFields) return exactFields;

  const layoutNumber = variant.match(/(\d+)$/)?.[1] ?? "1";
  const baseSectionType = sectionType.replace(/Page$/i, "");
  const normalizedVariantKeys = isPageSection
    ? [`${baseSectionType}Page-${layoutNumber}`, `${baseSectionType}-${layoutNumber}`]
    : [`${baseSectionType}-${layoutNumber}`];

  return normalizedVariantKeys
    .map((key) => componentContentFieldsByVariant[key])
    .find(Boolean);
};

const normalizeSectionType = (sectionType: string) => {
  const normalized = sectionType.trim().toLowerCase();
  const aliases: Record<string, string> = {
    faq: "FAQ",
    formdetail: "FormDetail",
    testimonial: "Testimonial",
    whychooseus: "WhyChooseUs",
    latestprojects: "LatestProjects",
    citiesweserve: "CitiesWeServe",
    featureddevelopers: "FeaturedDevelopers",
    propertyprocess: "PropertyProcess",
    investmentopportunities: "InvestmentOpportunities",
    companystatistics: "CompanyStatistics",
    awardspage: "AwardsPage",
    aboutpage: "AboutPage",
    aboutuspage: "AboutUsPage",
    ourstory: "OurStory",
    visionmission: "VisionMission",
    teams: "Teams",
    teamdetail: "TeamDetail",
    globalpresence: "GlobalPresence",
    eventcategories: "EventCategories",
    eventdetail: "EventDetail",
    blogdetails: "BlogDetails",
    careers: "Careers",
    careersapply: "CareersApply",
    careerpage: "CareerPage",
    blogpage: "BlogPage",
    blogdetail: "BlogDetail",
    csrpage: "CSRPage",
    contactpage: "ContactPage",
    missionvision: "MissionVision",
    privacypolicy: "PrivacyPolicy",
    termsconditions: "TermsConditions",
    cookiepolicy: "CookiePolicy",
    refundpolicy: "RefundPolicy",
    propertydetail: "PropertyDetail",
    projectdetail: "ProjectDetail",
    propertycatalog: "PropertyCatalog",
  };

  if (aliases[normalized]) return aliases[normalized];

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getDefaultTab = (sectionType: string) =>
  sidebarItemsBySection[normalizeSectionType(sectionType)]?.[0] ??
  `${normalizeSectionType(sectionType)} Content`;

const formatSectionTitle = (sectionType: string) =>
  normalizeSectionType(sectionType);

const limitLinkText = (value: string) => value.slice(0, MAX_LINK_TEXT_LENGTH);

const clampBannerHeight = (height: number) => {
  if (!Number.isFinite(height)) return 70;

  return Math.min(100, Math.max(40, height));
};

const getDefaultBannerData = (
  variant: string,
  sourceData: SectionData = {},
): SectionData | undefined => {
  const sourceImage = sourceData.backgroundImage ?? "/bg1.jpg";
  const sourceVideo = sourceData.backgroundVideo ?? "/video.mp4";
  const sourceSlides = Array.isArray(sourceData.bannerSlides)
    ? sourceData.bannerSlides
    : [];

  if (variant === "Banner-4") {
    return {
      ...sourceData,
      bannerHeight: 70,
      bannerSlides: sourceSlides.length
        ? sourceSlides.map((slide) => ({
          ...slide,
          image: slide.image || sourceImage,
          video: slide.video || sourceVideo,
        }))
        : [
          {
            image: sourceImage,
            video: sourceVideo,
            alt: sourceData.backgroundImageTitle ?? "Category video slide",
            title: sourceData.title ?? "Category video banner",
            desc:
              sourceData.desc ??
              "Use category-specific motion behind every banner slide.",
            button: {
              label: "Explore",
              href: "#",
              variant: "primary",
            },
          },
        ],
    };
  }

  if (variant !== "Banner-3") return undefined;

  return {
    ...sourceData,
    bannerHeight: 70,
    bannerSlides: sourceSlides.length
      ? sourceSlides.map((slide) => ({
        ...slide,
        image: slide.image || sourceImage,
      }))
      : [
        {
          image: sourceImage,
          alt: sourceData.backgroundImageTitle ?? "Category slide",
          title: sourceData.title ?? "Category image slider",
          desc:
            sourceData.desc ??
            "Use category-specific images across every slider layout.",
          button: {
            label: "Explore",
            href: "#",
            variant: "primary",
          },
        },
      ],
  };
};

const getVisibleSocialLinks = (
  socialLinks: { label: SocialLinkData["label"]; href: string }[] = [],
) => socialLinks.slice(0, MAX_TOPBAR_SOCIAL_LINKS);

const SelectedLayoutBadge = ({
  active,
  title,
}: {
  active: boolean;
  title: string;
}) => (
  <>
    {active && (
      <span className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-lg">
        <Check size={16} strokeWidth={3} />
      </span>
    )}
    <span className="absolute bottom-2 left-2 right-2 z-20 truncate rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
      {title}
    </span>
  </>
);

const MediaUploadPreview = ({
  src,
  type,
}: {
  src: string;
  type: "image" | "video";
}) => (
  <div className="h-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:w-32">
    {src ? (
      type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <video src={src} className="h-full w-full object-cover" muted playsInline />
      )
    ) : (
      <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
        No {type}
      </div>
    )}
  </div>
);

type GenericFieldPath = Array<string | number>;

type HandledFieldObject = {
  [field: string]: HandledFieldSchema;
};

type HandledFieldSchema = true | HandledFieldObject;

type AutomaticContentField = {
  fieldName: string;
  value: unknown;
  path: GenericFieldPath;
};

const specializedContentFieldSchemas: Record<string, HandledFieldObject> = {
  Topbar: {
    topbarBackgroundType: true,
    topbarType: true,
    topbarBackgroundColor: true,
    topbarGradientColor: true,
    topbarTextColor: true,
    text: true,
    phone: true,
    email: true,
    location: true,
    hiddenContentFields: true,
    socialLinks: {
      $items: { label: true, href: true },
    },
  },
  Header: {
    logo: true,
    logoImage: true,
    logoImageTitle: true,
    headerBackgroundType: true,
    headerType: true,
    headerBackgroundColor: true,
    headerGradientColor: true,
    headerTextColor: true,
    menu: true,
    button: { label: true, href: true, variant: true },
    buttons: {
      $items: { label: true, href: true, variant: true },
    },
  },
  Banner: {
    backgroundImage: true,
    backgroundImageTitle: true,
    pretitle: true,
    title: true,
    desc: true,
    overlayColor: true,
    titleColor: true,
    bannerBackgroundMode: true,
    bannerBackgroundColor: true,
    bannerGradientColor: true,
    backgroundVideo: true,
    bannerHeight: true,
    buttons: {
      $items: { label: true, href: true, variant: true },
    },
    bannerSlides: {
      $items: {
        image: true,
        video: true,
        alt: true,
        title: true,
        desc: true,
        button: { label: true, href: true, variant: true },
      },
    },
  },
  FormDetail: {
    pretitle: true,
    title: true,
    desc: true,
    formSubmitLabel: true,
    backgroundImage: true,
    backgroundImageTitle: true,
    sideImage: true,
    galleryItems: true,
    phone: true,
    email: true,
    location: true,
    formFields: {
      $items: { label: true, type: true, placeholder: true },
    },
  },
  Footer: {
    logo: true,
    logoImage: true,
    logoImageTitle: true,
    desc: true,
    footerBackgroundType: true,
    footerBackgroundColor: true,
    footerGradientColor: true,
    footerTextColor: true,
    footerMutedTextColor: true,
    footerColumns: {
      $items: {
        title: true,
        links: { $items: { label: true, href: true } },
      },
    },
    footerContact: true,
    footerLegalLinks: true,
    socialLinks: true,
    footerSocialLinks: true,
    copyrightText: true,
    officeLabel: true,
    contactLabel: true,
    legalTitle: true,
    disclaimerTitle: true,
    disclaimerText: true,
    newsletterTitle: true,
    newsletterPlaceholder: true,
    newsletterButtonLabel: true,
    whatsappLink: true,
    callLink: true,
  },
};

const collectAutomaticContentFields = (
  value: unknown,
  schema: HandledFieldSchema | undefined,
  path: GenericFieldPath,
  fieldName: string,
): AutomaticContentField[] => {
  if (schema === true) return [];

  if (!schema) return [{ fieldName, value, path }];

  if (Array.isArray(value)) {
    const itemSchema = schema.$items;

    if (!itemSchema) return [{ fieldName, value, path }];

    return value.flatMap((item, index) =>
      collectAutomaticContentFields(
        item,
        itemSchema,
        [...path, index],
        `Item ${index + 1}`,
      ),
    );
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([childName, childValue]) =>
      collectAutomaticContentFields(
        childValue,
        schema[childName],
        [...path, childName],
        childName,
      ),
    );
  }

  return [{ fieldName, value, path }];
};

type GenericFieldEditorProps = {
  fieldName: string;
  value: unknown;
  path: GenericFieldPath;
  sectionType: string;
  onChange: (path: GenericFieldPath, value: unknown) => void;
  onMediaChange: (
    path: GenericFieldPath,
    fieldName: string,
    file: File,
  ) => void;
  onAddArrayItem?: (path: GenericFieldPath, items: unknown[]) => void;
  onDeleteArrayItem?: (
    path: GenericFieldPath,
    index: number,
    item: unknown,
    items: unknown[],
  ) => void;
  availablePageNames?: string[];
  cardFields?: string[];
};

const userManageableCollectionFields = new Set([
  "productItems",
  "productSlides",
  "testimonialItems",
  "faqItems",
  "galleryItems",
  "listings",
  "awardItems",
  "blogItems",
  "stats",
  "features",
  "whyChooseUsItems",
  "projectItems",
  "cities",
  "items",
  "steps",
  "programs",
  "values",
  "benefits",
  "culture",
  "jobs",
  "categories",
  "collectionItems",
  "impactStats",
  "groups",
  "events",
  "images",
  "cards",
  "members",
  "milestones",
  "coreBeliefs",
  "points",
  "departments",
  "awards",
  "ctaItems",
  "content",
  "relatedPosts",
  "roles",
  "whyJoinUs",
  "contactItems",
  "highlights",
  "projectPoints",
  "sections",
  "skills",
]);

const formatFieldLabel = (fieldName: string) =>
  fieldName === "href"
    ? "Link"
    : fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letter) => letter.toUpperCase());

const nestedContentFieldOrder = [
  "image",
  "video",
  "icon",
  "title",
  "name",
  "pretitle",
  "subtitle",
  "desc",
  "description",
  "detail",
  "body",
  "excerpt",
  "alt",
  "year",
  "org",
  "stat",
  "step",
  "number",
  "label",
  "value",
  "text",
  "items",
  "price",
  "status",
  "statusText",
  "type",
  "category",
  "location",
  "date",
  "phone",
  "email",
  "href",
  "link",
];

const headingContentFieldOrder = [
  "pretitle",
  "eyebrow",
  "sectionTitle",
  "title",
  "subtitle",
  "highlightedText",
  "desc",
  "description",
  "desc2",
  "excerpt",
  "body",
];

const propertyListingContentFieldOrder = [
  "image",
  "statusText",
  "propertyType",
  "price",
  "title",
  "href",
  "location",
  "description",
  "features",
];
const careerFormFieldOrder = ["label", "placeholder"];
const careerJobContentFields = new Set([
  "title",
  "location",
  "type",
  "desc",
]);
const careerBenefitContentFields = new Set(["title", "desc"]);

const isUploadedImageValue = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(data:image\/|blob:|https?:\/\/|\/)/i.test(value.trim());

const getEditableObjectEntries = (
  value: Record<string, unknown>,
): Array<[string, unknown]> => {
  const hasIcon = Object.prototype.hasOwnProperty.call(value, "icon");
  const iconValue = value.icon;

  // Only remap icon → image when the icon value is an uploaded/media URL.
  // Named icons like "IconAward" stay editable as text/select.
  if (hasIcon && !("image" in value) && isUploadedImageValue(iconValue)) {
    return [
      ["image", iconValue] as [string, unknown],
      ...(Object.entries(value).filter(
        ([field]) => field !== "icon",
      ) as Array<[string, unknown]>),
    ];
  }

  return Object.entries(value) as Array<[string, unknown]>;
};

const sortNestedContentEntries = (
  entries: Array<[string, unknown]>,
  fieldOrder = nestedContentFieldOrder,
) => entries.sort(([leftField], [rightField]) => {
  const leftIndex = fieldOrder.indexOf(leftField);
  const rightIndex = fieldOrder.indexOf(rightField);
  const leftOrder = leftIndex === -1 ? fieldOrder.length : leftIndex;
  const rightOrder = rightIndex === -1 ? fieldOrder.length : rightIndex;

  return leftOrder - rightOrder;
});

const GenericFieldEditor = ({
  fieldName,
  value,
  path,
  sectionType,
  onChange,
  onMediaChange,
  onAddArrayItem,
  onDeleteArrayItem,
  availablePageNames = [],
  cardFields,
}: GenericFieldEditorProps) => {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  if (Array.isArray(value)) {
    const isFeatureCollection =
      fieldName === "features" &&
      path.length === 3 &&
      path[0] === "listings" &&
      typeof path[1] === "number";
    const isVisionMissionPoints =
      fieldName === "points" &&
      path.length === 2 &&
      (path[0] === "vision" || path[0] === "mission");
    const isTopLevelFeaturesCollection =
      sectionType === "Features" &&
      fieldName === "features" &&
      path.length === 1;
    const isBlogCardCollection =
      (sectionType === "Blog" || sectionType === "BlogPage") &&
      (fieldName === "blogItems" || fieldName === "galleryItems") &&
      path.length === 1;
    const isPropertyProcessSteps =
      sectionType === "PropertyProcess" &&
      fieldName === "steps" &&
      path.length === 1;
    const isNestedStringList =
      path.length > 1 &&
      (value.length === 0
        ? fieldName === "content" || fieldName === "items" || fieldName === "text"
        : value.every((item) => typeof item === "string"));
    const canAddTopLevelItems =
      path.length === 1 &&
      userManageableCollectionFields.has(fieldName) &&
      Boolean(onAddArrayItem);
    const canAddItems =
      canAddTopLevelItems ||
      (isFeatureCollection && Boolean(onAddArrayItem)) ||
      (isVisionMissionPoints && Boolean(onAddArrayItem)) ||
      (isNestedStringList && Boolean(onAddArrayItem));
    const collectionLimitReached =
      (isFeatureCollection && value.length >= 5) ||
      (isTopLevelFeaturesCollection &&
        value.length >= MAX_FEATURE_CARDS) ||
      (isBlogCardCollection &&
        value.length >= MAX_BLOG_CARDS) ||
      (isPropertyProcessSteps &&
        value.length >= MAX_PROPERTY_PROCESS_STEPS) ||
      (sectionType === "About" &&
        fieldName === "stats" &&
        path.length === 1 &&
        value.length >= 1);
    const canDeleteItems =
      Boolean(onDeleteArrayItem) &&
      value.length > 0 &&
      (isNestedStringList ||
        ((path.length === 1 || isFeatureCollection || isVisionMissionPoints) &&
          value.some(
            (item) =>
              typeof item === "object" && item !== null && !Array.isArray(item),
          )));
    const pendingDeleteItem =
      pendingDeleteIndex === null ? undefined : value[pendingDeleteIndex];
    const pendingDeleteRecord =
      typeof pendingDeleteItem === "object" &&
        pendingDeleteItem !== null &&
        !Array.isArray(pendingDeleteItem)
        ? (pendingDeleteItem as Record<string, unknown>)
        : undefined;
    const pendingDeleteName =
      typeof pendingDeleteItem === "string" && pendingDeleteItem.trim()
        ? pendingDeleteItem.trim()
        : [
            pendingDeleteRecord?.title,
            pendingDeleteRecord?.productTitle,
            pendingDeleteRecord?.name,
            pendingDeleteRecord?.label,
            pendingDeleteRecord?.question,
          ].find((item): item is string => typeof item === "string" && Boolean(item.trim())) ??
          (pendingDeleteIndex === null ? "this card" : `Item ${pendingDeleteIndex + 1}`);
    const deleteItemNoun = isFeatureCollection
      ? "feature"
      : isNestedStringList
        ? "item"
        : "card";

    return (
      <section className="rounded-xl bg-[#f4f4f5] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-slate-900">
            {formatFieldLabel(fieldName)}
          </h4>
          {canAddItems && (
            <button
              type="button"
              disabled={collectionLimitReached}
              onClick={() => onAddArrayItem?.(path, value)}
              className={`flex items-center gap-1 rounded-md bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 ${isFeatureCollection
                ? "px-2.5 py-1.5 text-[10px]"
                : "px-3 py-2 text-xs"
                }`}
            >
              <Plus size={isFeatureCollection ? 11 : 14} />
              {collectionLimitReached
                ? isPropertyProcessSteps
                  ? `Maximum ${MAX_PROPERTY_PROCESS_STEPS} Cards`
                  : isBlogCardCollection
                    ? `Maximum ${MAX_BLOG_CARDS} Cards`
                    : isTopLevelFeaturesCollection
                      ? `Maximum ${MAX_FEATURE_CARDS} Cards`
                      : "Maximum 5 Features"
                : fieldName === "listings"
                  ? "Add Product"
                  : isFeatureCollection
                    ? "Add Feature"
                    : isNestedStringList
                      ? "Add Item"
                      : "Add New"}
            </button>
          )}
        </div>
        {value.length ? (
          <div className="space-y-3">
            {value.map((item, index) => {
  const record =
    item &&
    typeof item === "object" &&
    !Array.isArray(item)
      ? (item as Record<string, unknown>)
      : null;

  // Keys must not come from editable text, otherwise each keystroke remounts
  // the item block and the focused input loses the caret.
  const itemKey = record?.id ?? `${fieldName}-${index}`;

  return (
    <div
      key={String(itemKey)}
      className="relative rounded-xl border border-slate-200 bg-white p-3"
    >
      {canDeleteItems && (
        <button
          type="button"
          onClick={() => setPendingDeleteIndex(index)}
          className={`absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-red-200 bg-white font-semibold text-red-600 hover:bg-red-50 ${
            isFeatureCollection
              ? "h-7 px-2 text-[10px]"
              : "h-8 px-3 text-xs"
          }`}
          aria-label={`Delete ${formatFieldLabel(fieldName)} item ${index + 1}`}
        >
          <Trash size={isFeatureCollection ? 11 : 15} />
          Delete
        </button>
      )}

      <GenericFieldEditor
        fieldName={`Item ${index + 1}`}
        value={item}
        path={[...path, index]}
        sectionType={sectionType}
        onChange={onChange}
        onMediaChange={onMediaChange}
        onAddArrayItem={onAddArrayItem}
        onDeleteArrayItem={onDeleteArrayItem}
        availablePageNames={availablePageNames}
        cardFields={cardFields}
      />
    </div>
  );
})}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No items to edit.</p>
        )}
        {pendingDeleteIndex !== null &&
          createPortal(
            <div className="fixed inset-0 z-[10020] flex items-center justify-center bg-slate-950/45 px-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-card-title"
                className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Trash size={20} />
                </div>
                <h3
                  id="delete-card-title"
                  className="mt-4 text-xl font-semibold text-slate-950"
                >
                  Delete this {deleteItemNoun}?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  “{pendingDeleteName}” will be removed from this section.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPendingDeleteIndex(null)}
                    className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteArrayItem?.(
                        path,
                        pendingDeleteIndex,
                        value[pendingDeleteIndex],
                        value,
                      );
                      setPendingDeleteIndex(null);
                    }}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </section>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-3">
        {fieldName.startsWith("Item ") && (
          <h5 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {fieldName}
          </h5>
        )}
        {(() => {
          const isPropertyListingItem =
            path.length === 2 &&
            path[0] === "listings" &&
            isPropertyCatalogSection(sectionType);
          const isCareerFormItem =
            path.length === 2 &&
            path[0] === "formFields" &&
            sectionType === "CareerPage";
          const editableEntries = getEditableObjectEntries(
            value as Record<string, unknown>,
          );
          // Card whitelists describe a collection item, so they must only be
          // applied to the item itself, never to objects nested inside it.
          const isCollectionItem =
            typeof path[path.length - 1] === "number" &&
            (path.length === 2 || path.length === 3);
          const collectionKey = isCollectionItem
            ? typeof path[path.length - 2] === "string"
              ? (path[path.length - 2] as string)
              : undefined
            : undefined;
          const collectionCardFields = isCollectionItem
            ? (collectionKey === "breadcrumb"
              ? visibleCardFieldsByCollection.breadcrumb
              : cardFields?.length
                ? cardFields
                : collectionKey
                  ? visibleCardFieldsByCollection[collectionKey]
                  : undefined)
            : undefined;
          const objectFieldAllowlist =
            visibleObjectFieldsByKey[fieldName] ??
            (path.length === 1 && typeof path[0] === "string"
              ? visibleObjectFieldsByKey[path[0]]
              : undefined);
          const entries = sortNestedContentEntries(
            objectFieldAllowlist?.length
              ? editableEntries.filter(([field]) =>
                objectFieldAllowlist.includes(field),
              )
              : collectionCardFields?.length
                ? editableEntries.filter(([field]) =>
                  collectionCardFields.includes(field),
                )
                : editableEntries,
            isPropertyListingItem
              ? propertyListingContentFieldOrder
              : isCareerFormItem
                ? careerFormFieldOrder
                : nestedContentFieldOrder,
          );
          const isProductItem =
            path.length === 2 &&
            (path[0] === "productItems" || path[0] === "productSlides");

          if (isProductItem) {
            const existingLinkIndex = entries.findIndex(
              ([key]) => key === "link",
            );
            const linkEntry =
              existingLinkIndex >= 0
                ? entries.splice(existingLinkIndex, 1)[0]
                : (["link", ""] as [string, unknown]);
            const altIndex = entries.findIndex(([key]) => key === "alt");
            entries.splice(
              altIndex >= 0 ? altIndex + 1 : entries.length,
              0,
              linkEntry,
            );
          }

          return entries.map(([childName, childValue]) => (
            <GenericFieldEditor
              key={childName}
              fieldName={childName}
              value={childValue}
              path={[...path, childName]}
              sectionType={sectionType}
              onChange={onChange}
              onMediaChange={onMediaChange}
              onAddArrayItem={onAddArrayItem}
              onDeleteArrayItem={onDeleteArrayItem}
              availablePageNames={availablePageNames}
              cardFields={cardFields}
            />
          ));
        })()}
      </div>
    );
  }

  const label = formatFieldLabel(fieldName);
  const mediaKind =
    typeof value === "string" ? getMediaKindFromKey(fieldName) : null;

  if (mediaKind) {
    const stringValue = value as string;
    const hasMedia = Boolean(stringValue.trim());

    return (
      <div>
        <span className="mb-1 block text-xs font-semibold text-slate-600">
          {label}
        </span>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-start">
          <div className="space-y-2">
            <label className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 transition hover:border-blue-500 focus-within:border-blue-600">
              <span className="font-medium">
                {hasMedia ? `Change ${mediaKind}` : `Upload ${mediaKind}`}
              </span>
              <span className="max-w-[55%] truncate text-xs text-slate-500">
                {getMediaUploadLabel(stringValue, mediaKind)}
              </span>
              <input
                type="file"
                accept={mediaKind === "video" ? "video/*" : "image/*"}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onMediaChange(path, fieldName, file);
                  event.target.value = "";
                }}
                className="sr-only"
              />
            </label>
            {hasMedia && (
              <button
                type="button"
                onClick={() => onChange(path, "")}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash size={13} />
                Remove {mediaKind}
              </button>
            )}
          </div>
          <div className="relative">
            <MediaUploadPreview src={stringValue} type={mediaKind} />
            {hasMedia && (
              <button
                type="button"
                onClick={() => onChange(path, "")}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"
                aria-label={`Remove ${mediaKind}`}
              >
                <Trash size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
    );
  }

  const stringValue = value == null ? "" : String(value);
  if (/color$/i.test(fieldName)) {
    const colorValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(stringValue)
      ? stringValue
      : fieldName.toLowerCase().includes("background")
        ? "#111827"
        : "#ffffff";

    return (
      <ColorInput
        label={label}
        value={colorValue}
        onChange={(color) => onChange(path, color)}
      />
    );
  }
  const isRating = sectionType === "Testimonial" && fieldName === "rating";
  const isNumber = typeof value === "number" || isRating;
  const isLongText =
    stringValue.length > 80 ||
    /^(desc|desc2|description|answer|quote|copyrightText)$/i.test(fieldName);
  const isProductLink =
    fieldName === "link" &&
    path.length === 3 &&
    (path[0] === "productItems" || path[0] === "productSlides");
  const isAwardsIcon =
    fieldName === "icon" &&
    sectionType === "Awards" &&
    path[0] === "items";
  const awardsIconOptions = [
    { value: "IconAward", label: "Award" },
    { value: "IconRibbon", label: "Ribbon / Medal" },
    { value: "IconStar", label: "Star" },
    { value: "IconUsers", label: "Users" },
    { value: "IconHeartHandshake", label: "Heart Handshake" },
    { value: "IconSparkles", label: "Sparkles" },
  ];
  const pageExists = availablePageNames.some(
    (pageName) =>
      pageName.trim().toLowerCase() === stringValue.trim().toLowerCase(),
  );

  if (isAwardsIcon) {
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-600">
          Icon
        </span>
        <select
          value={stringValue}
          onChange={(event) => onChange(path, event.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
        >
          {!awardsIconOptions.some((option) => option.value === stringValue) &&
            stringValue && (
              <option value={stringValue}>{stringValue}</option>
            )}
          {awardsIconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {isLongText ? (
        <textarea
          value={stringValue}
          onChange={(event) => onChange(path, event.target.value)}
          className="h-24 w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
        />
      ) : (
        <input
          type={isNumber ? "number" : "text"}
          min={isRating ? 0 : undefined}
          max={isRating ? 5 : undefined}
          step={isRating ? 0.5 : undefined}
          value={stringValue}
          onChange={(event) => {
            if (typeof value === "number") {
              onChange(path, Number(event.target.value));
              return;
            }

            if (isRating) {
              onChange(
                path,
                String(
                  Math.max(0, Math.min(5, Number(event.target.value) || 0)),
                ),
              );
              return;
            }

            onChange(path, event.target.value);
          }}
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
        />
      )}
      {isProductLink && stringValue.trim() && !pageExists && (
        <span className="mt-1 block text-xs font-medium text-red-600">
          No page found.
        </span>
      )}
    </label>
  );
};

const setValueAtPath = (
  source: unknown,
  path: GenericFieldPath,
  value: unknown,
): unknown => {
  if (!path.length) return value;

  const [key, ...remainingPath] = path;

  if (Array.isArray(source)) {
    const copy = [...source];
    const index = Number(key);
    copy[index] = setValueAtPath(copy[index], remainingPath, value);
    return copy;
  }

  const record =
    typeof source === "object" && source !== null
      ? (source as Record<string, unknown>)
      : {};

  return {
    ...record,
    [String(key)]: setValueAtPath(record[String(key)], remainingPath, value),
  };
};

const VisibilityButton = ({ hidden, onClick }: { hidden: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md border px-3 py-1 text-xs font-semibold ${hidden
      ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      : "border-slate-300 text-slate-600 hover:bg-slate-50"
      }`}
  >
    {hidden ? "Show" : "Hide"}
  </button>
);

export default function EditSectionModal({
  category,
  sectionId,
  sectionType,
  subsectionScope,
  sections,
  onClose,
  onSave,
  onSelectVariant,
  onUpdateSectionData,
  onDeleteSection,
}: EditSectionModalProps) {
  const scopedContentTab = subsectionScope
    ? `${subsectionScope.label} Content`
    : null;
  const scopedFields = subsectionScope?.fields ?? [];
  const scopedFormFields = subsectionScope?.formTabFields?.filter((field) =>
    scopedFields.includes(field),
  ) ?? [];
  const hasScopedContentAndFormTabs =
    Boolean(subsectionScope) &&
    scopedFormFields.length > 0 &&
    scopedFields.some((field) => !scopedFormFields.includes(field));
  const [activeTab, setActiveTab] = useState(
    subsectionScope?.label.trim().toLowerCase() === "project categories"
      ? "Tabs"
      : hasScopedContentAndFormTabs
        ? scopedContentTab ?? getDefaultTab(sectionType)
        : getDefaultTab(sectionType),
  );
  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [galleryLayoutStart, setGalleryLayoutStart] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastChangedSection, setLastChangedSection] = useState(sectionType);
  const { currentPage, pageLinks, setCurrentPage, setPageLinks, activePortfolioFilter } = usePreview();
  const availablePageNames = getPageNames(pageLinks);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{
    pointerId: number;
    pointerX: number;
    pointerY: number;
    modalX: number;
    modalY: number;
  } | null>(null);
  const [bannerGenerationType, setBannerGenerationType] = useState<
    "image" | "video" | null
  >(null);
  const [layoutGenerationActive, setLayoutGenerationActive] = useState(false);
  const [boxLayoutMessage, setBoxLayoutMessage] = useState("");
  const [pendingFooterSectionDelete, setPendingFooterSectionDelete] = useState<{
    kind: "logo" | "column" | "contact" | "disclaimer" | "bottom";
    label: string;
    index?: number;
  } | null>(null);
  const [pendingBannerSlideDelete, setPendingBannerSlideDelete] = useState<{
    index: number;
    label: string;
  } | null>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);
  const bannerVideoInputRef = useRef<HTMLInputElement>(null);
  const activeSectionType = normalizeSectionType(sectionType);
  const currentSection = sections.find(
    (item) => (item.id ?? item.type) === sectionId,
  );
  const activeSectionKey = currentSection?.id ?? currentSection?.type ?? sectionId;
  const isPageSection = Boolean(currentSection?.page);
  const activeVariant = currentSection?.data?.[currentSection.variant]
    ? currentSection.variant
    : currentSection?.variant?.startsWith(`${activeSectionType}-`)
      ? currentSection.variant
      : `${activeSectionType}-1`;
  const fallbackVariantData =
    currentSection?.data?.[`${activeSectionType}-1`] ??
    Object.values(currentSection?.data ?? {})[0];
  const currentVariantData = currentSection?.data?.[activeVariant];
  const layoutVariantData = currentVariantData
    ? {
      ...(innerPageContentDefaultsByVariant[activeVariant] ?? {}),
      ...currentVariantData,
    }
    : currentVariantData;
  const layoutCardCollections = layoutVariantData
    ? Object.entries(layoutVariantData).filter(([field, value]) => {
      if (!Array.isArray(value) || !value.length) {
        return false;
      }

      if (subsectionScope) {
        if (!subsectionScope.hasCardLayout) return false;

        if (subsectionScope.fields?.length) {
          if (!subsectionScope.fields.includes(field)) return false;
        } else {
          const scopedContent = normalizeScopeContent(subsectionScope.content);
          if (!valueAppearsInSubsection(value, scopedContent)) return false;
        }
      } else if (!cardCollectionFields.has(field)) {
        return false;
      }

      if (field === "categories" && activeSectionType !== "Highlight") {
        return false;
      }

      if (activeSectionType === "PropertyDetail" && field === "features") {
        return false;
      }

      return true;
    })
    : [];
  const hasCardCollection = layoutCardCollections.length > 0;
  const availableCardCount = hasCardCollection
    ? Math.min(...layoutCardCollections.map(([, value]) => (value as unknown[]).length))
    : 0;
  const baseSidebarItems = sidebarItemsBySection[activeSectionType] ?? [
    `${activeSectionType} Content`,
  ];
  const editableTabsItem =
    activeSectionType === "CitiesWeServe" ||
    activeSectionType === "PopularEvents" ||
    activeVariant === "RealEstateProject1"
      ? ["Tabs"]
      : [];
  const visibleSidebarItems = subsectionScope
    ? hasScopedContentAndFormTabs
      ? [scopedContentTab ?? `${activeSectionType} Content`, "Form"]
      : [
        activeVariant === "RealEstateProject1" &&
          subsectionScope.label.trim().toLowerCase() === "project categories"
          ? "Tabs"
          : `${activeSectionType} Content`,
        ...(hasCardCollection ? ["Box Layout"] : []),
      ]
    : hasCardCollection
      ? [...baseSidebarItems, ...editableTabsItem, "Box Layout"]
      : [...baseSidebarItems, ...editableTabsItem];

  const activeTopbarData = currentSection?.data?.[activeVariant] as
    | {
      topbarBackgroundType?: TopbarBackgroundType;
      topbarType?: StickySectionType;
      topbarBackgroundColor?: string;
      topbarGradientColor?: string;
      topbarTextColor?: string;
      text?: string[];
      phone?: string;
      email?: string;
      location?: string;
      socialLinks?: {
        label: "facebook" | "instagram" | "twitter" | "linkedin";
        href: string;
      }[];
      hiddenContentFields?: string[];
    }
    | undefined;

  const activeHeaderData = currentSection?.data?.[activeVariant] as
    | {
      logo?: string;
      logoImage?: string;
      logoImageTitle?: string;
      headerBackgroundType?: HeaderBackgroundType;
      headerType?: StickySectionType;
      headerBackgroundColor?: string;
      headerGradientColor?: string;
      headerTextColor?: string;
      menu?: MenuItem[];
      buttons?: ButtonData[];
      button?: ButtonData;
    }
    | undefined;

  const activeBannerData = (currentSection?.data?.[activeVariant] ??
    (activeSectionType === "Banner"
      ? getDefaultBannerData(activeVariant, fallbackVariantData)
      : undefined)) as
    | {
      backgroundImage?: string;
      backgroundImageTitle?: string;
      pretitle?: string;
      title?: string;
      desc?: string;
      overlayColor?: string;
      titleColor?: string;
      bannerBackgroundMode?: BannerBackgroundMode;
      bannerBackgroundColor?: string;
      bannerGradientColor?: string;
      backgroundVideo?: string;
      bannerHeight?: number;
      bannerSlides?: BannerSlideData[];
      buttons?: ButtonData[];
    }
    | undefined;

  const activeFormDetailData = currentSection?.data?.[activeVariant] as
    | {
      pretitle?: string;
      title?: string;
      desc?: string;
      formSubmitLabel?: string;
      formFields?: FormFieldData[];
    }
    | undefined;
  const activeGenericData = currentSection?.data?.[activeVariant] as
    | SectionData
    | undefined;
  const activeGenericEditorData = (() => {
    if (!activeGenericData) {
      return subsectionScope?.fieldValues as SectionData | undefined;
    }
    const editorData = {
      ...(subsectionScope?.fieldValues ?? {}),
      ...(innerPageContentDefaultsByVariant[activeVariant] ?? {}),
      ...activeGenericData,
    } as SectionData;
    const breadcrumbScopeLabel =
      subsectionScope?.label.trim().toLowerCase() ?? "";
    if (
      breadcrumbScopeLabel === "breadcrumb" ||
      breadcrumbScopeLabel === "page banner" ||
      Array.isArray(editorData.breadcrumb)
    ) {
      editorData.textColor = editorData.textColor || "#ffffff";
      editorData.backgroundColor = editorData.backgroundColor || "#111827";
    }

    if (activeSectionType === "CitiesWeServe") {
      const categoryValues = Array.isArray(editorData.categories)
        ? editorData.categories.filter(
          (item): item is string => typeof item === "string",
        )
        : [];

      return {
        ...editorData,
        tabs: Array.isArray(editorData.tabs)
          ? editorData.tabs
          : categoryValues,
      };
    }

    if (activeSectionType === "PopularEvents") {
      const categoryValues = Array.isArray(editorData.categories)
        ? editorData.categories.filter(
          (item): item is string => typeof item === "string",
        )
        : [];

      return {
        ...editorData,
        tabs: Array.isArray(editorData.tabs)
          ? editorData.tabs.filter(
            (item): item is string => typeof item === "string",
          )
          : categoryValues,
      };
    }

    if (activeVariant === "RealEstateProject1") {
      const categoryValues = Array.isArray(editorData.projectItems)
        ? Array.from(
          new Set(
            editorData.projectItems.flatMap((item) => {
              if (!item || typeof item !== "object" || Array.isArray(item)) {
                return [];
              }
              const category = (item as Record<string, unknown>).category;
              return typeof category === "string" && category.trim()
                ? [category]
                : [];
            }),
          ),
        )
        : [];

      return {
        ...editorData,
        tabs: Array.isArray(editorData.tabs)
          ? editorData.tabs
          : ["All", ...categoryValues],
      };
    }

    if (activeVariant === "RealEstateBlogDetail1") {
      return {
        ...editorData,
        primaryButtonLabel:
          typeof editorData.primaryButtonLabel === "string"
            ? editorData.primaryButtonLabel
            : "Talk to an advisor",
        primaryButtonHref:
          typeof editorData.primaryButtonHref === "string"
            ? editorData.primaryButtonHref
            : "/contact",
        secondaryButtonLabel:
          typeof editorData.secondaryButtonLabel === "string"
            ? editorData.secondaryButtonLabel
            : "All articles",
        secondaryButtonHref:
          typeof editorData.secondaryButtonHref === "string"
            ? editorData.secondaryButtonHref
            : "/blog",
      };
    }

    if (activeVariant === "RealEstateCareerPage1") {
      return {
        ...editorData,
        formPretitle:
          typeof editorData.formPretitle === "string"
            ? editorData.formPretitle
            : "Application form",
        formTitle:
          typeof editorData.formTitle === "string"
            ? editorData.formTitle
            : "Apply for",
        formFields: Array.isArray(editorData.formFields)
          ? editorData.formFields
          : defaultCareerFormFields,
        applyLabel:
          typeof editorData.applyLabel === "string"
            ? editorData.applyLabel
            : "Submit application",
        successTitle:
          typeof editorData.successTitle === "string"
            ? editorData.successTitle
            : "Application received.",
        successDesc:
          typeof editorData.successDesc === "string"
            ? editorData.successDesc
            : "Thanks for your interest. Our team will review your details and contact you if the role is a match.",
        successButtonLabel:
          typeof editorData.successButtonLabel === "string"
            ? editorData.successButtonLabel
            : "Apply for another role",
      };
    }

    return editorData;
  })();
  const [scopedContentFields] = useState<Set<string> | null>(() => {
    if (!subsectionScope) return null;

    if (subsectionScope.fields?.length) {
      return new Set(subsectionScope.fields);
    }

    if (
      activeVariant === "RealEstateServicePage1" &&
      subsectionScope.label.trim().toLowerCase() === "services overview"
    ) {
      return new Set(["sideImage"]);
    }

    if (
      activeVariant === "RealEstateProject1" &&
      subsectionScope.label.trim().toLowerCase() === "project categories"
    ) {
      return new Set(["tabs"]);
    }

    const scopedContent = normalizeScopeContent(subsectionScope.content);
    return new Set(
      Object.entries(activeGenericEditorData ?? {})
        .filter(([, value]) => valueAppearsInSubsection(value, scopedContent))
        .map(([field]) => field),
    );
  });
  const mappedComponentContentFields = getComponentContentFields(
    activeVariant,
    activeSectionType,
    isPageSection,
  );
  const defaultInnerPageFields = Object.keys(
    innerPageContentDefaultsByVariant[activeVariant] ?? {},
  );
  const eventsGalleryContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "images",
    "cta",
  ];
  const eventsGalleryPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "tabs",
    "cards",
    "noImagesLabel",
  ];
  const eventsAwardsContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "items",
  ];
  const eventsTeamContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "members",
    "joinButton",
  ];
  const eventsTestimonialContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "testimonialItems",
  ];
  const eventsTestimonialCardFields = [
    "initials",
    "name",
    "role",
    "quote",
    "rating",
    "address",
  ];
  const eventsBlogContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "buttonLabel",
    "buttonIcon",
    "blogItems",
  ];
  const eventsBlogPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "blogItems",
    "buttonLabel",
    "buttonIcon",
  ];
  const eventsBlogDetailsBannerFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsBlogDetailsArticleFields = [
    "featuredImage",
    "featuredImageAlt",
    "category",
    "label",
    "author",
    "date",
    "readTime",
    "title",
    "description",
    "content",
  ];
  const eventsBlogDetailsRecentFields = ["relatedTitle", "relatedPosts"];
  const eventsBlogDetailsContentFields = [
    ...eventsBlogDetailsBannerFields,
    ...eventsBlogDetailsArticleFields,
    ...eventsBlogDetailsRecentFields,
  ];
  const eventsBlogDetailsArticleCardFields = ["type", "text", "items"];
  const eventsBlogDetailsRecentCardFields = [
    "image",
    "alt",
    "label",
    "title",
    "description",
    "link",
  ];
  const eventsBlogCardFields = [
    "image",
    "alt",
    "label",
    "title",
    "description",
    "date",
    "link",
  ];
  const eventsCareersBannerFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsCareersOverviewFields = [
    "description",
    "description2",
    "heroImage",
    "heroImageAlt",
    "stats",
  ];
  const eventsCareersRolesFields = [
    "rolesPretitle",
    "rolesTitle",
    "rolesApplyLabel",
    "roles",
  ];
  const eventsCareersQuoteFields = [
    "quote",
    "quoteAuthor",
    "ctaLabel",
    "ctaHref",
  ];
  const eventsCareersPageContentFields = [
    ...eventsCareersBannerFields,
    ...eventsCareersOverviewFields,
    ...eventsCareersRolesFields,
    "benefits",
    "culture",
    "applyForm",
    "whyJoinUs",
    ...eventsCareersQuoteFields,
  ];
  const eventsCareersStatsCardFields = ["value", "label"];
  const eventsCareersRolesCardFields = [
    "title",
    "location",
    "type",
    "description",
    "applyHref",
  ];
  const eventsCareersApplyBannerFields = [
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsCareersApplyFormFields = ["applyForm"];
  const eventsCareersApplyJobFields = [
    "title",
    "department",
    "location",
    "type",
    "experience",
    "postedOn",
    "description",
  ];
  const eventsCareersApplyWhyJoinFields = ["whyJoinUs"];
  const eventsCareersApplyPageContentFields = [
    ...eventsCareersApplyBannerFields,
    ...eventsCareersApplyJobFields,
    ...eventsCareersApplyFormFields,
    ...eventsCareersApplyWhyJoinFields,
  ];
  const eventsCareersApplyWhyJoinCardFields = ["icon", "title", "description"];
  const eventsFaqContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "faqItems",
  ];
  const eventsContactContentFields = [
    "pretitle",
    "title",
    "desc",
    "description",
    "leftContent",
    "form",
  ];
  const eventsContactPageBannerFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsContactOverviewFields = ["contactItems", "form"];
  const eventsContactMapFields = ["mapEmbedUrl"];
  const eventsContactPageContentFields = [
    ...eventsContactPageBannerFields,
    ...eventsContactOverviewFields,
    ...eventsContactMapFields,
  ];
  const eventsContactPageCardFields = ["icon", "label", "value"];
  const eventsCaseStudyBannerFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsCaseStudyOverviewFields = [
    "featuredImage",
    "featuredImageAlt",
    "stats",
    "highlightsTitle",
    "highlights",
  ];
  const eventsCaseStudyProjectFields = [
    "projectTitle",
    "projectDescription",
    "projectPoints",
  ];
  const eventsCaseStudyCtaFields = ["ctaTitle", "ctaLabel", "ctaHref"];
  const eventsCaseStudyPageContentFields = [
    ...eventsCaseStudyBannerFields,
    ...eventsCaseStudyOverviewFields,
    ...eventsCaseStudyProjectFields,
    ...eventsCaseStudyCtaFields,
  ];
  const eventsCaseStudyStatsCardFields = ["value", "label"];
  const eventsCaseStudyHighlightCardFields = ["title", "description"];
  const eventsCaseStudyProjectCardFields = ["title", "description"];
  const eventsSupportBannerFields = [
    "title",
    "subtitle",
    "heroSubtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsSupportOverviewFields = [
    "contactPretitle",
    "contactTitle",
    "contactDescription",
    "contactItems",
    "faqPretitle",
    "faqTitle",
    "faqItems",
  ];
  const eventsSupportPageContentFields = [
    ...eventsSupportBannerFields,
    ...eventsSupportOverviewFields,
  ];
  const eventsSupportContactCardFields = ["icon", "label", "value"];
  const eventsSupportFaqCardFields = ["question", "answer"];
  const eventsLegalBannerFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
  ];
  const eventsLegalContentFields = ["sections"];
  const eventsLegalPageContentFields = [
    ...eventsLegalBannerFields,
    ...eventsLegalContentFields,
  ];
  const eventsLegalSectionCardFields = ["title", "content"];
  const eventsAboutPageContentFields = [
    "pretitle",
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "description",
    "description1",
    "description2",
    "description3",
    "quote",
    "quoteRole",
    "image",
    "imageAlt",
    "image2",
    "image2Alt",
    "stats",
    "values",
    "cta",
  ];
  const eventsAboutContentFields = [
    "pretitle",
    "title",
    "subtitle",
    "desc",
    "desc2",
    "sideImage",
    "sideImageTitle",
    "buttons",
    "stats",
  ];
  const eventsAboutCardFields = ["value", "label"];
  const eventsAboutPageCardFields = [
    "icon",
    "value",
    "label",
    "title",
    "desc",
    "description",
  ];
  const eventsOurStoryContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "description",
    "description2",
    "quote",
    "image",
    "imageAlt",
    "button",
    "stats",
    "milestonesPretitle",
    "milestonesTitle",
    "milestonesDesc",
    "milestones",
  ];
  const eventsOurStoryCardFields = [
    "year",
    "value",
    "label",
    "title",
    "description",
  ];
  const eventsVisionPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "vision",
    "mission",
    "coreBeliefsPretitle",
    "coreBeliefsTitle",
    "coreBeliefs",
  ];
  const eventsVisionPageCardFields = [
    "icon",
    "title",
    "description",
    "text",
  ];
  const eventsTeamsPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "departments",
    "members",
    "joinTitle",
    "joinDescription",
    "joinButton1",
  ];
  const eventsTeamsPageCardFields = [
    "label",
    "value",
    "image",
    "name",
    "role",
    "department",
    "bio",
    "email",
    "phone",
    "longBio",
    "skills",
    "social",
  ];
  const eventsTeamDetailContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "image",
    "name",
    "role",
    "department",
    "email",
    "phone",
    "bio",
    "longBio",
    "skills",
    "social",
  ];
  const eventsTeamDetailCardFields = ["title", "description"];
  const eventsAwardsPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "featuredAward",
    "awardsPretitle",
    "awardsTitle",
    "awards",
    "stats",
  ];
  const eventsAwardsPageCardFields = [
    "year",
    "title",
    "body",
    "category",
    "icon",
    "description",
    "value",
    "label",
  ];
  const eventsGlobalPresenceContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "description",
    "stats",
    "worldImage",
    "worldImageAlt",
  ];
  const eventsGlobalPresenceCardFields = ["value", "label"];
  const eventsEventPageContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "items",
    "ctaPretitle",
    "ctaTitle",
    "ctaDescription",
    "ctaButton",
    "ctaItems",
  ];
  const eventsEventPageCardFields = [
    "badge",
    "title",
    "description",
    "image",
    "imageAlt",
    "href",
    "value",
    "label",
  ];
  const eventsEventDetailContentFields = [
    "title",
    "subtitle",
    "backgroundImage",
    "breadcrumb",
    "textColor",
    "backgroundColor",
    "heroImage",
    "introDescription",
    "features",
    "detailCtaTitle",
    "detailCtaDescription",
    "detailCtaButton",
  ];
  const eventsEventDetailCardFields = ["icon", "title", "description", "desc"];
  const subsectionLabel = subsectionScope?.label.trim().toLowerCase() ?? "";
  const isBreadcrumbSubsection =
    subsectionLabel === "breadcrumb" || subsectionLabel === "page banner";
  const resolvedComponentContentFields =
    category === "Events" &&
    activeSectionType === "Gallery" &&
    activeVariant === "EventsGalleryPage1"
      ? eventsGalleryPageContentFields
      : category === "Events" && activeSectionType === "Gallery"
        ? eventsGalleryContentFields
        : category === "Events" && activeSectionType === "Awards"
        ? eventsAwardsContentFields
        : category === "Events" && activeSectionType === "Team"
          ? eventsTeamContentFields
          : category === "Events" && activeSectionType === "Testimonial"
            ? eventsTestimonialContentFields
            : category === "Events" &&
                activeSectionType === "Blog" &&
                activeVariant === "EventsBlogPage1"
              ? eventsBlogPageContentFields
              : category === "Events" && activeSectionType === "Blog"
                ? eventsBlogContentFields
                : category === "Events" && activeSectionType === "BlogDetails"
                  ? subsectionScope?.label.trim().toLowerCase() ===
                      "recent posts"
                    ? eventsBlogDetailsRecentFields
                    : subsectionScope?.label.trim().toLowerCase() ===
                        "article content"
                      ? eventsBlogDetailsArticleFields
                      : isBreadcrumbSubsection
                        ? eventsBlogDetailsBannerFields
                        : eventsBlogDetailsContentFields
                : category === "Events" && activeSectionType === "Careers"
                  ? subsectionScope?.label.trim().toLowerCase() ===
                      "open roles"
                    ? eventsCareersRolesFields
                    : subsectionScope?.label.trim().toLowerCase() ===
                        "careers overview"
                      ? eventsCareersOverviewFields
                      : subsectionScope?.label.trim().toLowerCase() ===
                          "culture quote"
                        ? eventsCareersQuoteFields
                        : isBreadcrumbSubsection
                          ? eventsCareersBannerFields
                          : eventsCareersPageContentFields
                : category === "Events" && activeSectionType === "CareersApply"
                  ? subsectionScope?.label.trim().toLowerCase() ===
                      "application form"
                    ? eventsCareersApplyFormFields
                    : subsectionScope?.label.trim().toLowerCase() ===
                        "job details"
                      ? eventsCareersApplyJobFields
                      : subsectionScope?.label.trim().toLowerCase() ===
                          "why join us"
                        ? eventsCareersApplyWhyJoinFields
                        : isBreadcrumbSubsection
                          ? eventsCareersApplyBannerFields
                          : eventsCareersApplyPageContentFields
                : category === "Events" && activeSectionType === "FAQ"
                ? eventsFaqContentFields
                : category === "Events" && activeSectionType === "Contact"
                  ? activeVariant === "EventsContactPage1"
                    ? subsectionScope?.label.trim().toLowerCase() ===
                        "contact overview"
                      ? eventsContactOverviewFields
                      : subsectionScope?.label.trim().toLowerCase() === "map"
                        ? eventsContactMapFields
                        : isBreadcrumbSubsection
                          ? eventsContactPageBannerFields
                          : eventsContactPageContentFields
                    : eventsContactContentFields
                  : category === "Events" && activeSectionType === "CaseStudy"
                    ? subsectionScope?.label.trim().toLowerCase() ===
                        "case study overview"
                      ? eventsCaseStudyOverviewFields
                      : subsectionScope?.label.trim().toLowerCase() ===
                          "project details"
                        ? eventsCaseStudyProjectFields
                        : subsectionScope?.label.trim().toLowerCase() ===
                            "case study cta"
                          ? eventsCaseStudyCtaFields
                          : isBreadcrumbSubsection
                            ? eventsCaseStudyBannerFields
                            : eventsCaseStudyPageContentFields
                  : category === "Events" && activeSectionType === "Support"
                    ? subsectionScope?.label.trim().toLowerCase() ===
                        "support overview"
                      ? eventsSupportOverviewFields
                      : isBreadcrumbSubsection
                        ? eventsSupportBannerFields
                        : eventsSupportPageContentFields
                  : category === "Events" &&
                      (activeSectionType === "PrivacyPolicy" ||
                        activeSectionType === "TermsCondition")
                    ? (() => {
                        const label =
                          subsectionScope?.label.trim().toLowerCase() ?? "";
                        if (
                          label === "privacy policy content" ||
                          label === "terms content"
                        ) {
                          return eventsLegalContentFields;
                        }
                        if (label === "page banner" || label === "breadcrumb") {
                          return eventsLegalBannerFields;
                        }
                        return eventsLegalPageContentFields;
                      })()
                  : category === "Events" &&
                      (activeSectionType === "AboutPage" ||
                        activeSectionType === "AboutUsPage")
                    ? eventsAboutPageContentFields
                    : category === "Events" && activeSectionType === "About"
                      ? eventsAboutContentFields
                    : category === "Events" && activeSectionType === "OurStory"
                      ? eventsOurStoryContentFields
                      : category === "Events" &&
                          activeSectionType === "VisionMission"
                        ? eventsVisionPageContentFields
                        : category === "Events" && activeSectionType === "Teams"
                          ? eventsTeamsPageContentFields
                          : category === "Events" &&
                              activeSectionType === "TeamDetail"
                            ? eventsTeamDetailContentFields
                          : category === "Events" &&
                              activeSectionType === "AwardsPage"
                            ? eventsAwardsPageContentFields
                            : category === "Events" &&
                                activeSectionType === "GlobalPresence"
                              ? eventsGlobalPresenceContentFields
                              : category === "Events" &&
                                  activeSectionType === "EventCategories"
                                ? eventsEventPageContentFields
                                : category === "Events" &&
                                    activeSectionType === "EventDetail"
                                  ? eventsEventDetailContentFields
      : isPageSection &&
          (mappedComponentContentFields || defaultInnerPageFields.length)
        ? Array.from(
          new Set([
            ...(mappedComponentContentFields ??
              Object.keys(activeGenericData ?? {})),
            ...defaultInnerPageFields,
          ]),
        )
        : mappedComponentContentFields;
  const activeComponentContentFields =
    category === "Events" &&
    resolvedComponentContentFields &&
    (resolvedComponentContentFields.includes("breadcrumb") ||
      isBreadcrumbSubsection)
      ? Array.from(
          new Set([
            ...resolvedComponentContentFields,
            "textColor",
            "backgroundColor",
          ]),
        )
      : resolvedComponentContentFields;
  const activeCardFields =
    subsectionScope?.cardFields ??
    (category === "Events" && activeSectionType === "About"
      ? eventsAboutCardFields
      : category === "Events" && activeSectionType === "Testimonial"
      ? eventsTestimonialCardFields
      : category === "Events" && activeSectionType === "Blog"
        ? eventsBlogCardFields
        : category === "Events" &&
            (activeSectionType === "AboutPage" ||
              activeSectionType === "AboutUsPage")
          ? eventsAboutPageCardFields
          : category === "Events" && activeSectionType === "OurStory"
            ? eventsOurStoryCardFields
            : category === "Events" && activeSectionType === "VisionMission"
              ? eventsVisionPageCardFields
              : category === "Events" && activeSectionType === "Teams"
                ? eventsTeamsPageCardFields
                : category === "Events" && activeSectionType === "TeamDetail"
                  ? eventsTeamDetailCardFields
                : category === "Events" && activeSectionType === "AwardsPage"
                  ? eventsAwardsPageCardFields
                  : category === "Events" &&
                      activeSectionType === "GlobalPresence"
                    ? eventsGlobalPresenceCardFields
                    : category === "Events" &&
                        activeSectionType === "EventCategories"
                      ? eventsEventPageCardFields
                      : category === "Events" &&
                          activeSectionType === "EventDetail"
                        ? eventsEventDetailCardFields
                        : category === "Events" &&
                            activeSectionType === "BlogDetails"
                          ? subsectionScope?.label.trim().toLowerCase() ===
                              "recent posts"
                            ? eventsBlogDetailsRecentCardFields
                            : subsectionScope?.label.trim().toLowerCase() ===
                                "article content"
                              ? eventsBlogDetailsArticleCardFields
                              : [
                                  ...eventsBlogDetailsArticleCardFields,
                                  ...eventsBlogDetailsRecentCardFields,
                                ]
                        : category === "Events" &&
                            activeSectionType === "Careers"
                          ? subsectionScope?.label.trim().toLowerCase() ===
                              "open roles"
                            ? eventsCareersRolesCardFields
                            : subsectionScope?.label.trim().toLowerCase() ===
                                "careers overview"
                              ? eventsCareersStatsCardFields
                              : [
                                  ...eventsCareersStatsCardFields,
                                  ...eventsCareersRolesCardFields,
                                ]
                        : category === "Events" &&
                            activeSectionType === "CareersApply"
                          ? subsectionScope?.label.trim().toLowerCase() ===
                              "why join us"
                            ? eventsCareersApplyWhyJoinCardFields
                            : undefined
                        : category === "Events" &&
                            activeSectionType === "Contact" &&
                            activeVariant === "EventsContactPage1"
                          ? subsectionScope?.label.trim().toLowerCase() ===
                              "contact overview"
                            ? eventsContactPageCardFields
                            : undefined
                        : category === "Events" &&
                            activeSectionType === "CaseStudy"
                          ? subsectionScope?.label.trim().toLowerCase() ===
                              "case study overview"
                            ? [
                                ...eventsCaseStudyStatsCardFields,
                                ...eventsCaseStudyHighlightCardFields,
                              ]
                            : subsectionScope?.label.trim().toLowerCase() ===
                                "project details"
                              ? eventsCaseStudyProjectCardFields
                              : [
                                  ...eventsCaseStudyStatsCardFields,
                                  ...eventsCaseStudyHighlightCardFields,
                                  ...eventsCaseStudyProjectCardFields,
                                ]
                        : category === "Events" &&
                            activeSectionType === "Support"
                          ? [
                              ...eventsSupportContactCardFields,
                              ...eventsSupportFaqCardFields,
                            ]
                        : category === "Events" &&
                            (activeSectionType === "PrivacyPolicy" ||
                              activeSectionType === "TermsCondition")
                          ? eventsLegalSectionCardFields
            : undefined);
  const isContentFieldVisible = (field: string) => {
    const allowEventsBreadcrumb =
      category === "Events" && field === "breadcrumb" && isPageSection;

    if (
      (nonVisualContentFields.has(field) && !allowEventsBreadcrumb) ||
      field === "boxesPerRow" ||
      field === "hiddenSubsections" ||
      field === "subsectionOrder" ||
      field === "type" ||
      field === "icon"
    ) {
      return false;
    }

    if (
      category === "Events" &&
      activeVariant === "EventsGalleryPage1" &&
      (field === "images" ||
        field === "cta" ||
        field === "pretitle" ||
        field === "desc" ||
        field === "description")
    ) {
      return false;
    }

    if (subsectionScope && !scopedContentFields?.has(field)) {
      return false;
    }

    if (
      activeSectionType === "CitiesWeServe" ||
      activeSectionType === "PopularEvents" ||
      activeVariant === "RealEstateProject1"
    ) {
      if (activeTab === "Tabs") return field === "tabs";
      if (field === "tabs" || field === "categories") return false;
    }

    if (
      activeSectionType === "PopularEvents" &&
      [
        "aboutTitle",
        "highlightsTitle",
        "summaryTitle",
        "dateLabel",
        "timeLabel",
        "locationLabel",
        "seatsLabel",
        "priceLabel",
        "organizerLabel",
        "bookButtonLabel",
        "bookButtonHref",
      ].includes(field)
    ) {
      return false;
    }

    if (
      activeSectionType === "Featured" &&
      ((field === "title" && activeGenericData?.sectionTitle != null) ||
        (field === "desc" && activeGenericData?.description != null))
    ) {
      return false;
    }

    if (
      activeSectionType === "BlogDetail" &&
      field === "excerpt" &&
      typeof activeGenericData?.body === "string" &&
      activeGenericData.body.trim()
    ) {
      return false;
    }

    if (activeSectionType === "CareerPage" && !subsectionScope) {
      const isFormField = careerPageFormContentFields.has(field);

      if (activeTab === "CareerPage Form" && !isFormField) return false;
      if (activeTab === "CareerPage Content" && isFormField) return false;
    }

    if (hasScopedContentAndFormTabs) {
      const isFormField = scopedFormFields.includes(field);

      if (activeTab === "Form" && !isFormField) return false;
      if (activeTab === scopedContentTab && isFormField) return false;
    }

    return (
      !activeComponentContentFields ||
      activeComponentContentFields.includes(field)
    );
  };
  const visibleGenericContentEntries = Object.entries(
  activeGenericEditorData ?? {},
)
  .map(([field, value]) => {
    const storedValue =
      activeGenericData?.[field as keyof SectionData];

    // IMPORTANT:
    // Collections must always use actual saved section data,
    // never defaults / subsection fieldValues.
    if (Array.isArray(storedValue)) {
      return [field, storedValue] as const;
    }

    return [field, value] as const;
  })
    .filter(([field]) => isContentFieldVisible(field))
    .sort(([leftField, leftValue], [rightField, rightValue]) => {
      const getGroup = (field: string, value: unknown) => {
        const headingIndex = headingContentFieldOrder.indexOf(field);
        if (headingIndex >= 0) return headingIndex;
        if (Array.isArray(value)) return 200;
        return 100;
      };
      const groupDifference =
        getGroup(leftField, leftValue) - getGroup(rightField, rightValue);

      if (groupDifference !== 0) return groupDifference;
      if (!activeComponentContentFields) return 0;

      const leftIndex = activeComponentContentFields.indexOf(leftField);
      const rightIndex = activeComponentContentFields.indexOf(rightField);
      const leftOrder =
        leftIndex >= 0 ? leftIndex : activeComponentContentFields.length;
      const rightOrder =
        rightIndex >= 0 ? rightIndex : activeComponentContentFields.length;

      return leftOrder - rightOrder;
    })
    .map(([field, value]) => [
      field,
      activeSectionType === "Features" &&
        field === "features" &&
        Array.isArray(value)
        ? value.slice(0, MAX_FEATURE_CARDS)
        : activeSectionType === "Highlight" && field === "categories" && Array.isArray(value)
          ? value.slice(0, 3)
          : activeSectionType === "CareerPage" &&
            field === "jobs" &&
            Array.isArray(value)
            ? value.map((item) =>
              item && typeof item === "object" && !Array.isArray(item)
                ? Object.fromEntries(
                  Object.entries(item).filter(([jobField]) =>
                    careerJobContentFields.has(jobField),
                  ),
                )
                : item,
            )
            : activeSectionType === "CareerPage" &&
              field === "benefits" &&
              Array.isArray(value)
              ? value.map((item) =>
                item && typeof item === "object" && !Array.isArray(item)
                  ? Object.fromEntries(
                    Object.entries(item).filter(([benefitField]) =>
                      careerBenefitContentFields.has(benefitField),
                    ),
                  )
                  : item,
              )
              : activeSectionType === "CareerPage" &&
                field === "formFields" &&
                Array.isArray(value)
                ? value.map((item) => {
                  if (!item || typeof item !== "object" || Array.isArray(item)) {
                    return item;
                  }

                  const formField = item as Record<string, unknown>;
                  return {
                    label: typeof formField.label === "string" ? formField.label : "",
                    placeholder:
                      typeof formField.placeholder === "string"
                        ? formField.placeholder
                        : "",
                  };
                })
                : isPropertyCatalogSection(activeSectionType) &&
                  field === "listings" &&
                  Array.isArray(value)
                  ? value
                    .filter((item) => {
                      if (!item || typeof item !== "object" || Array.isArray(item)) {
                        return false;
                      }

                      const categoryValue = (item as Record<string, unknown>).category;
                      const itemCategory =
                        typeof categoryValue === "string"
                          ? categoryValue.toLowerCase()
                          : "";

                      return activeSectionType === "Rent"
                        ? itemCategory.includes("rent")
                        : itemCategory.includes("sale");
                    })
                    .map((item) => {
                      const listing = item as Record<string, unknown>;
                      const visibleListing = Object.fromEntries(
                        Object.entries(item as Record<string, unknown>).filter(
                          ([listingField]) =>
                            propertyListingContentFields.has(listingField),
                        ),
                      );

                      if (!("href" in visibleListing)) {
                        const slug = typeof listing.slug === "string" ? listing.slug : "";
                        visibleListing.href = slug ? `/properties/${slug}` : "";
                      }

                      return visibleListing;
                    })
                  : activeSectionType === "Featured" && field === "listings" && Array.isArray(value)
                    ? value.map((item) => {
                      if (!item || typeof item !== "object" || Array.isArray(item)) {
                        return item;
                      }

                      const listing = item as Record<string, unknown>;
                      const visibleListing = Object.fromEntries(
                        Object.entries(listing).filter(([listingField]) =>
                          featuredListingContentFields.has(listingField) &&
                          !(listingField === "desc" && listing.description != null),
                        ),
                      );

                      if (!("href" in visibleListing)) {
                        const slug = typeof listing.slug === "string" ? listing.slug : "";
                        visibleListing.href = slug ? `/properties/${slug}` : "";
                      }

                      return visibleListing;
                    })
                    : activeSectionType === "LatestProjects" &&
                      field === "projectItems" &&
                      Array.isArray(value)
                      ? value.map((item) => {
                        if (!item || typeof item !== "object" || Array.isArray(item)) {
                          return item;
                        }

                        return Object.fromEntries(
                          Object.entries(item).filter(
                            ([projectField]) => latestProjectCardFields.has(projectField),
                          ),
                        );
                      })
                      : activeSectionType === "CitiesWeServe" &&
                        field === "cities" &&
                        Array.isArray(value)
                        ? value
                          .filter((item) => {
                            if (
                              !item ||
                              typeof item !== "object" ||
                              Array.isArray(item)
                            ) {
                              return false;
                            }

                            if (activePortfolioFilter === "All") {
                              return true;
                            }

                            const city = item as Record<string, unknown>;

                            const itemCategory =
                              typeof city.category === "string"
                                ? city.category
                                : typeof city.listingsLabel === "string"
                                  ? city.listingsLabel
                                  : "";

                            return (
                              itemCategory.trim().toLowerCase() ===
                              activePortfolioFilter.trim().toLowerCase()
                            );
                          })
                          .map((item) => {
                            const city = item as Record<string, unknown>;

                            return Object.fromEntries(
                              Object.entries(city).filter(
                                ([cityField]) =>
                                  !portfolioHiddenFields.has(cityField),
                              ),
                            );
                          })
                        : category === "Realestate" &&
                          activeSectionType === "WhyChooseUs" &&
                          field === "whyChooseUsItems" &&
                          Array.isArray(value)
                          ? value.map((item) =>
                            item && typeof item === "object" && !Array.isArray(item)
                              ? {
                                image:
                                  typeof (item as Record<string, unknown>).image === "string"
                                    ? (item as Record<string, unknown>).image
                                    : "",
                                ...item,
                              }
                              : item,
                          )
                          : activeSectionType === "MissionVision" &&
                            field === "values" &&
                            Array.isArray(value)
                            ? value.map((item) =>
                              item && typeof item === "object" && !Array.isArray(item)
                                ? {
                                  image:
                                    typeof (item as Record<string, unknown>).image === "string"
                                      ? (item as Record<string, unknown>).image
                                      : "",
                                  ...item,
                                }
                                : item,
                            )
                            : activeSectionType === "FeaturedDevelopers" &&
                              field === "items" &&
                              Array.isArray(value)
                              ? value.map((item) => {
                                if (!item || typeof item !== "object" || Array.isArray(item)) {
                                  return item;
                                }

                                const developer = item as Record<string, unknown>;
                                return {
                                  name:
                                    typeof developer.name === "string"
                                      ? developer.name
                                      : typeof developer.title === "string"
                                        ? developer.title
                                        : "",
                                  image:
                                    typeof developer.image === "string" ? developer.image : "",
                                  alt:
                                    typeof developer.alt === "string" ? developer.alt : "",
                                };
                              })
                              : category === "Realestate" &&
                                activeSectionType === "PropertyProcess" &&
                                field === "steps" &&
                                Array.isArray(value)
                                ? value.map((item) =>
                                  item && typeof item === "object" && !Array.isArray(item)
                                    ? {
                                      image:
                                        typeof (item as Record<string, unknown>).image === "string"
                                          ? (item as Record<string, unknown>).image
                                          : "",
                                      ...item,
                                    }
                                    : item,
                                )
                                : value,
    ] as const);
  const specializedContentSchema =
    specializedContentFieldSchemas[activeSectionType];
  const automaticContentFields = specializedContentSchema
    ? Object.entries(activeGenericData ?? {})
      .filter(([fieldName]) => isContentFieldVisible(fieldName))
      .flatMap(([fieldName, value]) =>
        collectAutomaticContentFields(
          value,
          specializedContentSchema[fieldName],
          [fieldName],
          fieldName,
        ),
      )
    : [];

  const menuItems = activeHeaderData?.menu ?? [];
  const topbarBackgroundType =
    activeTopbarData?.topbarBackgroundType ?? "solid";
  const topbarType = activeTopbarData?.topbarType ?? "scroll";
  const topbarSolidColor = activeTopbarData?.topbarBackgroundColor ?? "#245c6e";
  const topbarGradientColor =
    activeTopbarData?.topbarGradientColor ?? "#0668ff";
  const topbarTextColor = activeTopbarData?.topbarTextColor ?? "#ffffff";
  const topbarPreviewBackground =
    topbarBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${topbarSolidColor}, ${topbarGradientColor})`
      : topbarSolidColor;
  const headerBackgroundType =
    activeHeaderData?.headerBackgroundType ?? "solid";
  const headerType = activeHeaderData?.headerType ?? "scroll";
  const headerSolidColor = activeHeaderData?.headerBackgroundColor ?? "#245c6e";
  const headerGradientColor =
    activeHeaderData?.headerGradientColor ?? "#0668ff";
  const headerTextColor = activeHeaderData?.headerTextColor ?? "#ffffff";
  const headerPreviewBackground =
    headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${headerSolidColor}, ${headerGradientColor})`
      : headerSolidColor;
  const explicitBannerBackgroundMode = activeBannerData?.bannerBackgroundMode;
  const bannerBackgroundMode = explicitBannerBackgroundMode ?? "image";
  const bannerSolidColor = activeBannerData?.bannerBackgroundColor ?? "#0f172a";
  const bannerGradientColor =
    activeBannerData?.bannerGradientColor ?? "#0ea5e9";
  const hasBannerHeightField =
    activeSectionType === "Banner" ||
    "bannerHeight" in (activeBannerData ?? {});
  const bannerHeight = clampBannerHeight(
    Number(activeBannerData?.bannerHeight ?? 70),
  );
  const hasBannerImageField = bannerBackgroundMode === "image";
  const hasBannerVideoField = bannerBackgroundMode === "video";
  const hasBannerColorField =
    bannerBackgroundMode === "solid" || bannerBackgroundMode === "gradient";
  const hasBannerButtonsField = "buttons" in (activeBannerData ?? {});
  const hasBannerMediaField =
    hasBannerImageField || hasBannerVideoField || hasBannerColorField;
  const hasBannerSlidesField = Array.isArray(activeBannerData?.bannerSlides);
  const isSliderBanner = hasBannerSlidesField;
  const isVideoSliderBanner = activeVariant === "Banner-4";
  const visibleBannerButtons = (activeBannerData?.buttons ?? [])
    .map((button, index) => ({ button, index }))
    .filter(({ index }) => !isSliderBanner || index === 1);

  const activeFooterData = currentSection?.data?.[activeVariant] as
    | {
      logo?: string;
      logoImage?: string;
      logoImageTitle?: string;
      footerColumns?: { title: string; links: { label: string; href: string }[] }[];
      footerBackgroundType?: FooterBackgroundType;
      footerBackgroundColor?: string;
      footerGradientColor?: string;
      footerTextColor?: string;
      copyrightText?: string;
      legalTitle?: string;

      footerLegalLinks?: {
        label: string;
        href: string;
      }[];

      socialLinks?: {
        label: SocialLinkData["label"];
        href: string;
      }[];

      footerSocialLinks?: {
        label: SocialLinkData["label"];
        href: string;
      }[];
      whatsappLink?: string;
      callLink?: string;
    }
    | undefined;
  const visibleFooterColumns = (activeFooterData?.footerColumns ?? []).map(
    (column) =>
      column.title.trim().toLowerCase() === "tools & help"
        ? {
          ...column,
          links: column.links.filter(
            (link) => link.label.trim().toLowerCase() !== "sitemap",
          ),
        }
        : column,
  );
  const footerBackgroundType =
    activeFooterData?.footerBackgroundType ?? "solid";
  const footerSolidColor = activeFooterData?.footerBackgroundColor ?? "#0d1f2a";
  const footerGradientColor =
    activeFooterData?.footerGradientColor ?? "#1d4ed8";
  const footerTextColor = activeFooterData?.footerTextColor ?? "#ffffff";
  const footerPreviewBackground =
    footerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${footerSolidColor}, ${footerGradientColor})`
      : footerSolidColor;
  // Footer designs that render no disclaimer block and no legal links heading.
  const footerVariantsWithoutLegalExtras = ["EventsFooter1"];
  const showFooterLegalExtras =
    category !== "Events" &&
    !footerVariantsWithoutLegalExtras.includes(activeVariant);
  const isEventsHeader =
    category === "Events" &&
    (activeVariant === "EventsHeader1" || activeSectionType === "Header");
  const topbarSocialLinks = getVisibleSocialLinks(
    activeTopbarData?.socialLinks,
  );
  const usesSectionColorPanel =
    (activeSectionType === "Topbar" && activeTab === "Topbar Layout") ||
    (activeSectionType === "Header" && activeTab === "Header Layout") ||
    (activeSectionType === "Footer" && activeTab === "Footer Layout");
  const categoryLayoutOptions = getCategoryLayoutOptions(
    category,
    activeSectionType,
  );
  const discoveredPageLayoutOptions = getCategoryPageLayoutOptions(
    category,
    activeSectionType,
  );
  const pageLayoutOptions = discoveredPageLayoutOptions.length
    ? discoveredPageLayoutOptions
    : pageLayoutsBySection[activeSectionType] ?? [];
  const sectionLayoutOptions = isPageSection
    ? pageLayoutOptions
    : categoryLayoutOptions;
  const layoutOptions = sectionLayoutOptions;
  const visibleLayoutOptions =
    activeSectionType === "Gallery" && layoutOptions.length > 4
      ? Array.from(
        { length: 4 },
        (_, index) =>
          layoutOptions[(galleryLayoutStart + index) % layoutOptions.length],
      )
      : layoutOptions;
  const activeAboutLayouts = isPageSection
    ? pageLayoutOptions
    : categoryLayoutOptions;
  const generationText = bannerGenerationType
    ? `generating ${bannerGenerationType}`
    : layoutGenerationActive
      ? "generating layout"
      : "";

  const handleModalPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    const interactiveLabel = target.closest("label")?.querySelector("input");

    if (
      interactiveLabel ||
      target.closest(
        "button,input,textarea,select,a,[role='button'],[data-editor-no-drag]",
      )
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    setDragStart({
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      modalX: modalPosition.x,
      modalY: modalPosition.y,
    });
  };

  const handleModalPointerUp = () => {
    setDragStart(null);
  };

  useEffect(() => {
    if (!dragStart) return;

    const handleWindowPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== dragStart.pointerId) return;

      setModalPosition({
        x: dragStart.modalX + event.clientX - dragStart.pointerX,
        y: dragStart.modalY + event.clientY - dragStart.pointerY,
      });
    };
    const handleWindowPointerEnd = (event: globalThis.PointerEvent) => {
      if (event.pointerId === dragStart.pointerId) setDragStart(null);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerEnd);
    window.addEventListener("pointercancel", handleWindowPointerEnd);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerEnd);
      window.removeEventListener("pointercancel", handleWindowPointerEnd);
    };
  }, [dragStart]);

  const updateActiveTopbarData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeTopbarData) return;

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeTopbarData,
        ...newData,
      },
    });
  };

  const updateActiveHeaderData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeHeaderData) return;

    if (Array.isArray(newData.menu)) {
      const nextPageLinks = toPageLinks(newData.menu as MenuItem[]);

      setPageLinks(nextPageLinks);
      setCurrentPage(
        nextPageLinks.some((item) => item.label === currentPage)
          ? currentPage
          : (nextPageLinks[0]?.label ?? ""),
      );
    }

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeHeaderData,
        ...newData,
      },
    });
  };

  const updateActiveBannerData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeBannerData) return;

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeBannerData,
        ...newData,
      },
    });
  };

  const updateActiveFooterData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeFooterData) return;

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeFooterData,
        ...newData,
      },
    });
  };

  const updateActiveFormDetailData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeFormDetailData) return;

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeFormDetailData,
        ...newData,
      },
    });
  };

  const updateFormField = (
    index: number,
    field: keyof FormFieldData,
    value: string,
  ) => {
    const updatedFields = (activeFormDetailData?.formFields ?? []).map(
      (item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
    );

    updateActiveFormDetailData({ formFields: updatedFields });
  };

  const addFormField = () => {
    if ((activeFormDetailData?.formFields ?? []).length >= MAX_FORM_FIELDS) {
      return;
    }

    updateActiveFormDetailData({
      formFields: [
        ...(activeFormDetailData?.formFields ?? []),
        {
          label: "New Field",
          type: "text",
          placeholder: "Enter value",
        },
      ],
    });
  };

  const deleteFormField = (index: number) => {
    updateActiveFormDetailData({
      formFields: (activeFormDetailData?.formFields ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  };

  const updateActiveGenericData = (newData: Record<string, unknown>) => {
    if (!currentSection || !activeGenericData) return;

    setHasChanges(true);
    setLastChangedSection(activeSectionKey);
    onUpdateSectionData(activeSectionKey, {
      ...currentSection.data,
      [activeVariant]: {
        ...activeGenericData,
        ...newData,
      },
    });
  };

  const updateGenericField = (path: GenericFieldPath, value: unknown) => {
    let sourcePath = path;

    if (
      path[0] === "cities" &&
      typeof path[1] === "number" &&
      activeSectionType === "CitiesWeServe" &&
      activePortfolioFilter !== "All" &&
      Array.isArray(activeGenericData?.cities)
    ) {
      const matchingSourceIndices =
        activeGenericData.cities.flatMap(
          (item, sourceIndex) => {
            if (
              !item ||
              typeof item !== "object" ||
              Array.isArray(item)
            ) {
              return [];
            }

            const city =
              item as Record<string, unknown>;

            const itemCategory =
              typeof city.category === "string"
                ? city.category
                : typeof city.listingsLabel === "string"
                  ? city.listingsLabel
                  : "";

            return (
              itemCategory.trim().toLowerCase() ===
              activePortfolioFilter.trim().toLowerCase()
            )
              ? [sourceIndex]
              : [];
          },
        );

      const realSourceIndex =
        matchingSourceIndices[path[1]];

      if (typeof realSourceIndex === "number") {
        sourcePath = [
          path[0],
          realSourceIndex,
          ...path.slice(2),
        ];
      }
    }

    if (
      path[0] === "listings" &&
      typeof path[1] === "number" &&
      isPropertyCatalogSection(activeSectionType) &&
      Array.isArray(activeGenericData?.listings)
    ) {
      const matchingSourceIndices = activeGenericData.listings.flatMap(
        (item, sourceIndex) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            return [];
          }

          const categoryValue = (item as Record<string, unknown>).category;
          const itemCategory =
            typeof categoryValue === "string"
              ? categoryValue.toLowerCase()
              : "";
          const matchesPage =
            activeSectionType === "Rent"
              ? itemCategory.includes("rent")
              : itemCategory.includes("sale");

          return matchesPage ? [sourceIndex] : [];
        },
      );
      const sourceIndex = matchingSourceIndices[path[1]];

      if (typeof sourceIndex === "number") {
        sourcePath = [path[0], sourceIndex, ...path.slice(2)];
      }
    }

    const [field, ...nestedPath] = sourcePath;
    if (typeof field !== "string" || !activeGenericData) return;

    const storedSourceValue = activeGenericData[field as keyof SectionData];
    const sourceValue =
      activeSectionType === "CareerPage" &&
        field === "formFields" &&
        !Array.isArray(storedSourceValue)
        ? defaultCareerFormFields
        : (activeSectionType === "CitiesWeServe" ||
          activeSectionType === "PopularEvents" ||
          activeVariant === "RealEstateProject1") &&
          field === "tabs" &&
          !Array.isArray(storedSourceValue)
          ? (activeGenericEditorData as Record<string, unknown>).tabs
          : storedSourceValue === undefined
            ? (activeGenericEditorData as Record<string, unknown>)[field]
            : storedSourceValue;
    const nextValue = setValueAtPath(
      sourceValue,
      nestedPath,
      value,
    );

    if (
      activeSectionType === "Header" &&
      field === "menu" &&
      Array.isArray(nextValue)
    ) {
      updateActiveHeaderData({ menu: nextValue });
      return;
    }

    if (
      activeSectionType === "PopularEvents" &&
      field === "tabs" &&
      Array.isArray(nextValue)
    ) {
      const previousTabs = Array.isArray(sourceValue)
        ? sourceValue.filter(
          (item): item is string => typeof item === "string",
        )
        : [];
      const nextTabs = nextValue.filter(
        (item): item is string => typeof item === "string",
      );
      const renamedIndex =
        typeof nestedPath[0] === "number" ? nestedPath[0] : -1;
      const oldCategoryName =
        renamedIndex >= 0 && typeof previousTabs[renamedIndex] === "string"
          ? previousTabs[renamedIndex]
          : null;
      const newCategoryName =
        renamedIndex >= 0 && typeof nextTabs[renamedIndex] === "string"
          ? nextTabs[renamedIndex]
          : null;
      const nextEvents = Array.isArray(activeGenericData.events)
        ? activeGenericData.events.map((item) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            return item;
          }

          const event = item as Record<string, unknown>;
          if (
            oldCategoryName &&
            newCategoryName &&
            oldCategoryName !== newCategoryName &&
            event.category === oldCategoryName
          ) {
            return {
              ...event,
              category: newCategoryName,
            };
          }

          return event;
        })
        : activeGenericData.events;

      updateActiveGenericData({
        tabs: nextTabs,
        categories: nextTabs,
        events: nextEvents,
      });
      return;
    }

    updateActiveGenericData({
      [field]: nextValue,
    });
  };

  const updateGenericMedia = (
    path: GenericFieldPath,
    fieldName: string,
    file: File,
  ) => {
    const mediaKind = getMediaKindFromKey(fieldName) ?? "image";

    showBannerGenerationLoader(mediaKind);
    readBannerBackgroundFile(file, (dataUrl) => {
      updateGenericField(path, dataUrl);
    });
  };

  const renderFooterContentField = (fieldName: string) => {
    if (
      !activeGenericData ||
      !Object.prototype.hasOwnProperty.call(activeGenericData, fieldName)
    ) {
      return null;
    }

    return (
      <GenericFieldEditor
        key={fieldName}
        fieldName={fieldName}
        value={activeGenericData[fieldName as keyof SectionData]}
        path={[fieldName]}
        sectionType="Footer"
        onChange={updateGenericField}
        onMediaChange={updateGenericMedia}
        availablePageNames={availablePageNames}
      />
    );
  };

  const addGenericCollectionItem = (
    path: GenericFieldPath,
    visibleItems: unknown[],
  ) => {
    const [field] = path;
    if (typeof field !== "string") return;

    if (
      path.length === 3 &&
      path[0] === "listings" &&
      path[2] === "features"
    ) {
      if (visibleItems.length >= 5) return;
      updateGenericField(path, [
        ...visibleItems,
        { label: "New feature", value: "Value" },
      ]);
      return;
    }

    if (
      path.length === 2 &&
      (path[0] === "vision" || path[0] === "mission") &&
      path[1] === "points"
    ) {
      updateGenericField(path, [
        ...visibleItems,
        { icon: "IconSparkles", text: "New point" },
      ]);
      return;
    }

    // Nested string lists inside a card (e.g. sections[0].content)
    if (
      path.length > 1 &&
      (visibleItems.length === 0 ||
        visibleItems.every((item) => typeof item === "string"))
    ) {
      updateGenericField(path, [...visibleItems, "New item"]);
      return;
    }

    const items = (activeGenericData as
      | Record<string, unknown>
      | undefined)?.[field];

    if (!Array.isArray(items)) return;
    if (
      activeSectionType === "PropertyProcess" &&
      field === "steps" &&
      items.length >= MAX_PROPERTY_PROCESS_STEPS
    ) {
      return;
    }
    if (
      activeSectionType === "Features" &&
      field === "features" &&
      items.length >= MAX_FEATURE_CARDS
    ) {
      return;
    }
    if (
      (activeSectionType === "Blog" || activeSectionType === "BlogPage") &&
      (field === "blogItems" || field === "galleryItems") &&
      items.length >= MAX_BLOG_CARDS
    ) {
      return;
    }
    if (
      category === "Events" &&
      activeSectionType === "About" &&
      field === "stats" &&
      items.length >= 1
    ) {
      return;
    }

    const newItems: Record<string, unknown> = {
      productItems: {
        title: "New Product",
        category: "Product Category",
        desc: "Add the product description here.",
        image: "",
        alt: "Product image",
        link: "",
      },
      productSlides: {
        image: "",
        alt: "Product image",
        link: "",
        productTitle: "New Product",
        productSubtitle: "Product Category",
        productInfoTitle: "Product Details",
        productInfoDesc: "Add the product description here.",
        productFeatures: [
          { label: "Feature", price: "Price" },
        ],
        productTotalPrice: "Price",
        productShippingText: "Add delivery information",
        button: {
          label: "View details",
          href: "#",
          variant: "primary",
        },
      },
      testimonialItems: {
        name: "New Customer",
        role: "Customer",
        quote: "Add the customer testimonial here.",
        image: "",
        rating: "5",
      },
      faqItems: {
        question: "New question",
        answer: "Add the answer here.",
      },
      sections: {
        title: "New section",
        content: ["Add section details here."],
      },
      galleryItems: {
        image: "",
        alt: "Gallery image",
        title: "New gallery image",
      },
      awardItems: {
        year: String(new Date().getFullYear()),
        title: "New Award",
        org: "Award organization",
        image: "",
        alt: "Award badge",
      },
      blogItems: {
        title: "New Article",
        excerpt: "Add a short article summary.",
        date: "Today",
        image: "",
        alt: "Article image",
        href: "/blog",
      },
      stats: {
        stat: "100+",
        label: "New statistic",
        desc: "Add a short description.",
      },
      skills: {
        title: "New skill",
        description: "A key part of the experience I bring to every project.",
      },
      listings: {
        image: "",
        statusText: "New listing",
        propertyType: "Apartment",
        price: "Price",
        title: "New Property",
        subtitle: "Property highlight",
        infoTitle: "Property overview",
        location: "Location",
        description: "Add the property description here.",
        body: "Add detailed property information here.",
        alt: "Property image",
        features: [
          { label: "Bedrooms", value: "3" },
          { label: "Area", value: "1,500 sq.ft" },
        ],
        category: currentSection?.page?.toLowerCase() === "rent" ? "For Rent" : "For Sale",
        button: { label: "Book a visit", href: "/contact" },
        slug: getNextPropertySlug(items),
        href: `/properties/${getNextPropertySlug(items)}`,
      },
      features: {
        title: "New feature",
        desc: "Add a short feature description.",
        icon: "location",
        image: "",
      },
      whyChooseUsItems: {
        title: "New reason",
        desc: "Explain why visitors should choose you.",
        image: "",
        stat: "01",
      },
      projectItems: {
        title: "New project",
        location: "Location",
        category: "Residential",
        image: "",
        alt: "Project image",
        status: "Ongoing",
        desc: "Add a short project description.",
        body: "Add detailed project information here.",
        slug: getNextProjectSlug(items),
        href: `/projects/${getNextProjectSlug(items)}`,
      },
      cities: {
        title: "New city",
        image: "",
        alt: "City image",
        category: "NCR",
        listingsLabel: "Homes",
      },
      items: {
        name: "New item",
        title: "New item",
        desc: "Add a short description.",
        image: "",
        alt: "Item image",
      },
      steps: {
        title: "New step",
        desc: "Describe this process step.",
        image: "",
      },
      programs: {
        title: "New program",
        desc: "Describe this program.",
        image: "",
        amount: "New initiative",
      },
      values: {
        title: "New value",
        desc: "Describe this value.",
        image: "",
      },
      benefits: {
        title: "New benefit",
        desc: "Describe this benefit.",
      },
      culture: {
        title: "New culture value",
        description: "Describe this culture value.",
      },
      jobs: {
        title: "New role",
        location: "Location",
        type: "Full-time",
        desc: "Describe this role.",
      },
      roles: {
        id: `role-${Date.now()}`,
        title: "New role",
        location: "Location",
        type: "Full-time",
        description: "Describe this role.",
        applyHref: "/contact",
      },
      categories: {
        title: "New category",
        desc: "Describe this category.",
        image: "",
      },
      collectionItems: {
        brand: "Brand",
        title: "New collection",
        desc: "Describe this collection.",
        image: "",
      },
      impactStats: {
        stat: "100+",
        label: "Impact",
      },
      groups: {
        title: "New group",
        links: [{ label: "Link", href: "#" }],
      },
      events: {
        image: "",
        seats: "100",
        date: "Date",
        location: "Location",
        title: "New event",
        description: "Add a short event description.",
        link: "#",
        category: "Wedding Events",
        id: `event-${Date.now()}`,
      },
      images: {
        src: "",
        alt: "Gallery image",
      },
      cards: {
        image: "",
        title: "New gallery image",
        subtitle: "Weddings",
        badge: "Weddings",
      },
      content: {
        type: "paragraph",
        text: "Add paragraph text.",
      },
      relatedPosts: {
        image: "",
        alt: "Blog image",
        label: "Trends",
        title: "New related post",
        description: "Add a short blog summary.",
        link: "/blog",
      },
      milestones: {
        year: "2026",
        title: "New milestone",
        description: "Describe this milestone.",
      },
      coreBeliefs: {
        icon: "IconSparkles",
        title: "New belief",
        description: "Describe this core belief.",
      },
      points: {
        icon: "IconSparkles",
        text: "New point",
      },
      departments: {
        label: "New department",
        value: "new-department",
      },
      awards: {
        year: "2026",
        title: "New award",
        body: "Award body",
        category: "Excellence",
        icon: "IconTrophy",
        description: "Describe this award.",
      },
      ctaItems: {
        value: "100+",
        label: "New highlight",
      },
      members: {
        id: `member-${Date.now()}`,
        image: "",
        name: "New member",
        role: "Role",
        department: "management",
        bio: "Add a short bio.",
        social: {
          linkedin: "#",
          twitter: "#",
          instagram: "#",
        },
      },
    };
    const templateItem = newItems[field];
    const lastItem = items[items.length - 1];
    const clonedItem =
      lastItem && typeof lastItem === "object" && !Array.isArray(lastItem)
        ? {
          ...(lastItem as Record<string, unknown>),
          ...(typeof (lastItem as Record<string, unknown>).title === "string"
            ? { title: `New ${(lastItem as Record<string, unknown>).title}` }
            : {}),
          ...(typeof (lastItem as Record<string, unknown>).name === "string"
            ? { name: `New ${(lastItem as Record<string, unknown>).name}` }
            : {}),
        }
        : undefined;
    const baseNewItem = templateItem ?? clonedItem;

    if (!baseNewItem) return;

    const categoryValues = Array.isArray(activeGenericData?.categories)
      ? activeGenericData.categories.filter(
        (item): item is string => typeof item === "string" && Boolean(item.trim()),
      )
      : [];
    const newItem =
      field === "events" &&
      baseNewItem &&
      typeof baseNewItem === "object" &&
      !Array.isArray(baseNewItem)
        ? {
          ...(baseNewItem as Record<string, unknown>),
          category:
            categoryValues[0] ??
            (typeof (baseNewItem as Record<string, unknown>).category === "string"
              ? (baseNewItem as Record<string, unknown>).category
              : "Wedding Events"),
          id: `event-${Date.now()}`,
        }
        : field === "items" &&
            activeSectionType === "Awards"
          ? {
            icon: "IconAward",
            value: "10+",
            title: "NEW AWARD",
            description: "Add a short award description.",
          }
        : field === "items" &&
            category === "Events" &&
            activeSectionType === "EventCategories"
          ? {
            badge: "New",
            title: "New Event Category",
            description: "Add a short category description.",
            image: "",
            imageAlt: "Event category",
            href: "/events",
          }
        : field === "testimonialItems" &&
            category === "Events" &&
            activeSectionType === "Testimonial"
          ? {
            initials: "NC",
            name: "New Customer",
            role: "Customer",
            quote: "Add the customer testimonial here.",
            rating: "5",
          }
        : field === "stats" && category === "Events"
          ? activeSectionType === "OurStory"
            ? { value: "100+", label: "New statistic" }
            : {
              value: "100+",
              label: "New statistic",
              desc: "Add a short description.",
            }
        : field === "blogItems" &&
            category === "Events" &&
            activeSectionType === "Blog"
          ? {
            image: "",
            alt: "Blog image",
            label: "Trends",
            title: "New Blog Post",
            description: "Add a short blog summary.",
            date: "Today",
            slug: "new-blog-post",
            link: "/blog/new-blog-post",
          }
        : field === "roles" &&
            category === "Events" &&
            (activeSectionType === "Careers" || activeSectionType === "CareersApply")
          ? {
            id: `role-${Date.now()}`,
            title: "New role",
            location: "Location",
            type: "Full-time",
            description: "Describe this open role.",
            applyHref: "/careers/apply/new-role",
          }
        : field === "whyJoinUs" &&
            category === "Events" &&
            activeSectionType === "CareersApply"
          ? {
            icon: "IconSparkles",
            title: "New benefit",
            description: "Describe why candidates should join.",
          }
        : field === "members" &&
            category === "Events" &&
            (activeSectionType === "Teams" || activeSectionType === "Team")
          ? {
            image: "",
            name: "New member",
            role: "Role",
            department: "management",
            bio: "Add a short bio.",
            social: {
              linkedin: "#",
              twitter: "#",
              instagram: "#",
            },
          }
        : baseNewItem;

    updateActiveGenericData({
      [field]: [...items, newItem],
    });
  };

  const deleteGenericCollectionItem = (
    path: GenericFieldPath,
    index: number,
    visibleItem: unknown,
    visibleItems: unknown[],
  ) => {
    const [field] = path;
    if (typeof field !== "string") return;

    if (
      path.length === 3 &&
      path[0] === "listings" &&
      path[2] === "features"
    ) {
      updateGenericField(
        path,
        visibleItems.filter((_, itemIndex) => itemIndex !== index),
      );
      return;
    }

    if (
      path.length === 2 &&
      (path[0] === "vision" || path[0] === "mission") &&
      path[1] === "points"
    ) {
      updateGenericField(
        path,
        visibleItems.filter((_, itemIndex) => itemIndex !== index),
      );
      return;
    }

    // Nested string lists inside a card (e.g. sections[0].content)
    if (
      path.length > 1 &&
      (visibleItems.length === 0 ||
        visibleItems.every((item) => typeof item === "string"))
    ) {
      updateGenericField(
        path,
        visibleItems.filter((_, itemIndex) => itemIndex !== index),
      );
      return;
    }

    const items = (activeGenericData as
      | Record<string, unknown>
      | undefined)?.[field];

    if (!Array.isArray(items)) return;

    let sourceIndex = index;

    if (
      visibleItem &&
      typeof visibleItem === "object" &&
      !Array.isArray(visibleItem)
    ) {
      const visibleEntries = Object.entries(
        visibleItem as Record<string, unknown>,
      );

      const matchedIndex = items.findIndex((candidate) => {
        if (
          !candidate ||
          typeof candidate !== "object" ||
          Array.isArray(candidate)
        ) {
          return false;
        }

        const candidateRecord =
          candidate as Record<string, unknown>;

        return visibleEntries.every(
          ([key, value]) =>
            JSON.stringify(candidateRecord[key]) ===
            JSON.stringify(value),
        );
      });

      if (matchedIndex >= 0) {
        sourceIndex = matchedIndex;
      }
    }

    const nextItems = items.filter(
      (_, itemIndex) => itemIndex !== sourceIndex,
    );
    updateActiveGenericData({
      [field]: nextItems,
    });
  };

  const handleSidebarTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const selectSectionVariant = (variant: string) => {
    const isAllowedVariant =
      Boolean(currentSection?.data?.[variant]) ||
      variant.startsWith(`${activeSectionType}-`) ||
      (isPageSection && variant.startsWith(`${activeSectionType}Page-`));

    if (!isAllowedVariant) return;

    setLayoutGenerationActive(true);
    window.setTimeout(() => {
      setLayoutGenerationActive(false);
      onClose();
    }, 1600);

    if (activeSectionType === "Banner" && currentSection) {
      const currentVariantData = currentSection.data[variant];
      const sourceVariantData =
        currentVariantData ??
        currentSection.data[activeVariant] ??
        currentSection.data["Banner-1"] ??
        Object.values(currentSection.data)[0];
      const nextVariantData =
        variant === "Banner-1"
          ? {
            ...sourceVariantData,
            bannerBackgroundMode: "image" as const,
            backgroundImage: sourceVariantData?.backgroundImage ?? "/bg1.jpg",
          }
          : variant === "Banner-2"
            ? {
              ...sourceVariantData,
              bannerBackgroundMode: "video" as const,
              backgroundVideo:
                sourceVariantData?.backgroundVideo ?? "/video.mp4",
            }
            : undefined;

      if (nextVariantData) {
        onUpdateSectionData(activeSectionKey, {
          ...currentSection.data,
          [variant]: nextVariantData,
        });
      }
    }

    if (
      activeSectionType === "Banner" &&
      currentSection &&
      !currentSection.data[variant]
    ) {
      const defaultBannerData = getDefaultBannerData(
        variant,
        currentSection.data[activeVariant] ??
        currentSection.data["Banner-1"] ??
        Object.values(currentSection.data)[0],
      );

      if (defaultBannerData) {
        onUpdateSectionData(activeSectionKey, {
          ...currentSection.data,
          [variant]: defaultBannerData,
        });
      }
    }

    if (currentSection?.variant !== variant) {
      if (currentSection && !currentSection.data[variant]) {
        const sourceData =
          currentSection.data[activeVariant] ?? Object.values(currentSection.data)[0];

        onUpdateSectionData(activeSectionKey, {
          ...currentSection.data,
          [variant]: sourceData,
        });
      }

      setHasChanges(true);
      setLastChangedSection(activeSectionKey);
    }

    onSelectVariant(activeSectionKey, variant);
  };

  const handleDone = () => {
    if (hasChanges) {
      onSave(lastChangedSection);
      return;
    }

    onClose();
  };
  const updateMenuItem = (
    index: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const updatedMenu = menuItems.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: nextValue } : item,
    );

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const addMenuItem = () => {
    if (menuItems.length >= MAX_MENU_LINKS) return;

    const updatedMenu = [
      ...menuItems,
      {
        label: "New Item",
        href: "/new-item",
      },
    ];

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const updateTopbarBackgroundType = (type: TopbarBackgroundType) => {
    updateActiveTopbarData({ topbarBackgroundType: type });
  };

  const updateTopbarType = (type: StickySectionType) => {
    updateActiveTopbarData({ topbarType: type });
  };

  const updateTopbarSolidColor = (color: string) => {
    updateActiveTopbarData({ topbarBackgroundColor: color });
  };

  const updateTopbarGradientColor = (color: string) => {
    updateActiveTopbarData({ topbarGradientColor: color });
  };

  const updateTopbarTextColor = (color: string) => {
    updateActiveTopbarData({ topbarTextColor: color });
  };

  const updateTopbarText = (value: string) => {
    updateActiveTopbarData({ text: [value] });
  };

  const isTopbarFieldHidden = (field: string) =>
    activeTopbarData?.hiddenContentFields?.includes(field) ?? false;

  const toggleTopbarFieldVisibility = (field: string) => {
    const hiddenFields = activeTopbarData?.hiddenContentFields ?? [];
    updateActiveTopbarData({
      hiddenContentFields: hiddenFields.includes(field)
        ? hiddenFields.filter((item) => item !== field)
        : [...hiddenFields, field],
    });
  };

  const updateTopbarField = (
    field: "phone" | "email" | "location",
    value: string,
  ) => {
    updateActiveTopbarData({ [field]: value });
  };

  const updateTopbarSocialLink = (
    index: number,
    field: "label" | "href",
    value: string,
  ) => {
    const updatedSocialLinks = topbarSocialLinks.map(
      (socialLink, socialIndex) =>
        socialIndex === index
          ? field === "label"
            ? {
              ...socialLink,
              label: value as SocialLinkData["label"],
            }
            : {
              ...socialLink,
              href: value,
            }
          : socialLink,
    );

    updateActiveTopbarData({
      socialLinks: getVisibleSocialLinks(updatedSocialLinks),
    });
  };

  const addTopbarSocialLink = () => {
    const currentSocialLinks = getVisibleSocialLinks(
      activeTopbarData?.socialLinks,
    );

    if (currentSocialLinks.length >= MAX_TOPBAR_SOCIAL_LINKS) {
      return;
    }

    const updatedSocialLinks = [
      ...currentSocialLinks,
      { label: "instagram" as const, href: "#" },
    ];

    updateActiveTopbarData({ socialLinks: updatedSocialLinks });
  };

  const deleteTopbarSocialLink = (index: number) => {
    const updatedSocialLinks = topbarSocialLinks.filter(
      (_, socialIndex) => socialIndex !== index,
    );

    updateActiveTopbarData({ socialLinks: updatedSocialLinks });
  };

  const updateHeaderBackgroundType = (type: HeaderBackgroundType) => {
    updateActiveHeaderData({ headerBackgroundType: type });
  };

  const updateHeaderType = (type: StickySectionType) => {
    updateActiveHeaderData({ headerType: type });
  };

  const updateHeaderSolidColor = (color: string) => {
    updateActiveHeaderData({ headerBackgroundColor: color });
  };

  const updateHeaderGradientColor = (color: string) => {
    updateActiveHeaderData({ headerGradientColor: color });
  };

  const updateHeaderTextColor = (color: string) => {
    updateActiveHeaderData({ headerTextColor: color });
  };

  const updateHeaderLogo = (logo: string) => {
    updateActiveHeaderData({ logo });
  };

  const updateHeaderLogoImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    showBannerGenerationLoader("image");
    readBannerBackgroundFile(file, (dataUrl) => {
      updateActiveHeaderData({
        logoImage: dataUrl,
        logoImageTitle: file.name,
      });
    });
    event.target.value = "";
  };

  const deleteHeaderLogoImage = () => {
    updateActiveHeaderData({ logoImage: "", logoImageTitle: "" });
  };

  const updateHeaderButton = (
    index: number,
    field: "label" | "href" | "variant",
    value: string,
  ) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const updatedButtons = (activeHeaderData?.buttons ?? []).map(
      (button, buttonIndex) =>
        buttonIndex === index ? { ...button, [field]: nextValue } : button,
    );

    updateActiveHeaderData({ buttons: updatedButtons });
  };

  const addHeaderButton = () => {
    if ((activeHeaderData?.buttons ?? []).length >= MAX_HEADER_BUTTONS) return;

    const updatedButtons = [
      ...(activeHeaderData?.buttons ?? []),
      { label: "New Button", href: "#", variant: "primary" },
    ];

    updateActiveHeaderData({ buttons: updatedButtons });
  };

  const deleteHeaderButton = (index: number) => {
    const updatedButtons = (activeHeaderData?.buttons ?? []).filter(
      (_, buttonIndex) => buttonIndex !== index,
    );

    updateActiveHeaderData({ buttons: updatedButtons });
  };

  const updateEventsHeaderCta = (field: "label" | "href", value: string) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const currentButton =
      activeHeaderData?.button &&
      typeof activeHeaderData.button === "object" &&
      !Array.isArray(activeHeaderData.button)
        ? activeHeaderData.button
        : { label: "", href: "/contact" };

    updateActiveHeaderData({
      button: {
        ...currentButton,
        [field]: nextValue,
      },
    });
  };

  const updateBannerField = (field: string, value: string) => {
    updateActiveBannerData({ [field]: value });
  };

  const readBannerBackgroundFile = (
    file: File,
    onLoad: (dataUrl: string) => void,
  ) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoad(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const showBannerGenerationLoader = (type: "image" | "video") => {
    setBannerGenerationType(type);
    window.setTimeout(() => {
      setBannerGenerationType(null);
      onClose();
    }, 1800);
  };

  const handleBannerImageFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    showBannerGenerationLoader("image");
    readBannerBackgroundFile(file, (dataUrl) => {
      updateActiveBannerData({
        bannerBackgroundMode: "image",
        backgroundImage: dataUrl,
        backgroundImageTitle:
          activeBannerData?.backgroundImageTitle || file.name,
      });
    });
    event.target.value = "";
  };

  const handleBannerVideoFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    showBannerGenerationLoader("video");
    readBannerBackgroundFile(file, (dataUrl) => {
      updateActiveBannerData({
        bannerBackgroundMode: "video",
        backgroundVideo: dataUrl,
      });
    });
    event.target.value = "";
  };

  const handleBannerSlideImageFileChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    showBannerGenerationLoader("image");
    readBannerBackgroundFile(file, (dataUrl) => {
      updateBannerSlideFields(index, {
        image: dataUrl,
        alt: file.name,
      });
    });
    event.target.value = "";
  };

  const handleBannerSlideVideoFileChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    showBannerGenerationLoader("video");
    readBannerBackgroundFile(file, (dataUrl) => {
      updateBannerSlideFields(index, {
        video: dataUrl,
        alt: file.name,
      });
    });
    event.target.value = "";
  };

  const deleteBannerSlideVideo = (index: number) => {
    updateBannerSlide(index, "video", "");
  };

  const updateBannerHeight = (height: number) => {
    updateActiveBannerData({ bannerHeight: clampBannerHeight(height) });
  };

  const updateBannerButton = (
    index: number,
    field: "label" | "href" | "variant",
    value: string,
  ) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const updatedButtons = (activeBannerData?.buttons ?? []).map(
      (button, buttonIndex) =>
        buttonIndex === index ? { ...button, [field]: nextValue } : button,
    );

    updateActiveBannerData({ buttons: updatedButtons });
  };

  const addBannerButton = () => {
    if ((activeBannerData?.buttons ?? []).length >= MAX_BANNER_BUTTONS) return;

    const updatedButtons = [
      ...(activeBannerData?.buttons ?? []),
      { label: "New Button", href: "#" },
    ];

    updateActiveBannerData({ buttons: updatedButtons });
  };

  const deleteBannerButton = (index: number) => {
    const updatedButtons = (activeBannerData?.buttons ?? []).filter(
      (_, buttonIndex) => buttonIndex !== index,
    );

    updateActiveBannerData({ buttons: updatedButtons });
  };

  const updateBannerSlide = (
    index: number,
    field: keyof Omit<BannerSlideData, "button">,
    value: string,
  ) => {
    updateBannerSlideFields(index, { [field]: value });
  };

  const updateBannerSlideFields = (
    index: number,
    fields: Partial<Omit<BannerSlideData, "button">>,
  ) => {
    const updatedSlides = (activeBannerData?.bannerSlides ?? []).map(
      (slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...fields } : slide,
    );

    updateActiveBannerData({ bannerSlides: updatedSlides });
  };

  const updateBannerSlideButton = (
    index: number,
    field: "label" | "href" | "variant",
    value: string,
  ) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const updatedSlides = (activeBannerData?.bannerSlides ?? []).map(
      (slide, slideIndex) => {
        if (slideIndex !== index) return slide;

        return {
          ...slide,
          button: {
            label: "Learn more",
            href: "#",
            ...slide.button,
            [field]: nextValue,
          },
        };
      },
    );

    updateActiveBannerData({ bannerSlides: updatedSlides });
  };

  const addBannerSlide = () => {
    const nextIndex = (activeBannerData?.bannerSlides ?? []).length + 1;
    const firstSlide = activeBannerData?.bannerSlides?.[0];
    const categoryImage =
      firstSlide?.image ?? activeBannerData?.backgroundImage ?? "/bg1.jpg";
    const categoryVideo =
      firstSlide?.video ?? activeBannerData?.backgroundVideo ?? "/video.mp4";
    const updatedSlides = [
      ...(activeBannerData?.bannerSlides ?? []),
      {
        image: categoryImage,
        ...(isVideoSliderBanner ? { video: categoryVideo } : {}),
        alt: `Banner slide ${nextIndex}`,
        title: "New banner slide",
        desc: "Update this slide text from Banner Content.",
        button: {
          label: "Learn more",
          href: "#",
          variant: "primary" as const,
        },
      },
    ];

    updateActiveBannerData({ bannerSlides: updatedSlides });
  };

  const deleteBannerSlide = (index: number) => {
    const slides = activeBannerData?.bannerSlides ?? [];
    const updatedSlides = slides.filter((_, slideIndex) => slideIndex !== index);

    // Keep at least one slide in the editor; removing the last one hides the Banner section.
    if (slides.length <= 1) {
      onDeleteSection?.();
      onClose();
      return;
    }

    updateActiveBannerData({ bannerSlides: updatedSlides });
  };

  const confirmPendingBannerSlideDelete = () => {
    if (pendingBannerSlideDelete === null) return;

    deleteBannerSlide(pendingBannerSlideDelete.index);
    setPendingBannerSlideDelete(null);
  };

  const updateFooterBackgroundType = (type: FooterBackgroundType) => {
    updateActiveFooterData({ footerBackgroundType: type });
  };

  const updateFooterSolidColor = (color: string) => {
    updateActiveFooterData({ footerBackgroundColor: color });
  };

  const updateFooterGradientColor = (color: string) => {
    updateActiveFooterData({ footerGradientColor: color });
  };

  const updateFooterTextColor = (color: string) => {
    updateActiveFooterData({ footerTextColor: color });
  };

  const updateFooterLogoImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateActiveFooterData({ logoImage: reader.result, logoImageTitle: file.name });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const updateFooterColumn = (columnIndex: number, field: "title", value: string) => {
    const columns = [...(activeFooterData?.footerColumns ?? [])];
    columns[columnIndex] = { ...columns[columnIndex], [field]: value };
    updateActiveFooterData({ footerColumns: columns });
  };

  const updateFooterLink = (columnIndex: number, linkIndex: number, field: "label" | "href", value: string) => {
    const columns = [...(activeFooterData?.footerColumns ?? [])];
    const column = columns[columnIndex];
    if (!column) return;
    const links = [...column.links];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    columns[columnIndex] = { ...column, links };
    updateActiveFooterData({ footerColumns: columns });
  };

  const addFooterLink = (columnIndex: number) => {
    const columns = [...(activeFooterData?.footerColumns ?? [])];
    const column = columns[columnIndex];
    if (!column || column.links.length >= MAX_FOOTER_LINKS_PER_COLUMN) return;
    columns[columnIndex] = { ...column, links: [...column.links, { label: "New link", href: "#" }] };
    updateActiveFooterData({ footerColumns: columns });
  };

  const addFooterColumn = () => {
    updateActiveFooterData({
      footerColumns: [
        ...(activeFooterData?.footerColumns ?? []),
        {
          title: "New column",
          links: [
            {
              label: "New link",
              href: "#",
            },
          ],
        },
      ],
    });
  };

  const removeFooterLink = (columnIndex: number, linkIndex: number) => {
    const columns = [...(activeFooterData?.footerColumns ?? [])];
    const column = columns[columnIndex];
    if (!column) return;
    columns[columnIndex] = { ...column, links: column.links.filter((_, index) => index !== linkIndex) };
    updateActiveFooterData({ footerColumns: columns });
  };

  const updateFooterLegalLink = (
    index: number,
    field: "label" | "href",
    value: string,
  ) => {
    const links = [...(activeFooterData?.footerLegalLinks ?? [])];

    links[index] = {
      ...links[index],
      [field]: value,
    };

    updateActiveFooterData({
      footerLegalLinks: links,
    });
  };

  const addFooterLegalLink = () => {
    updateActiveFooterData({
      footerLegalLinks: [
        ...(activeFooterData?.footerLegalLinks ?? []),
        {
          label: "New legal link",
          href: "#",
        },
      ],
    });
  };

  const removeFooterLegalLink = (index: number) => {
    updateActiveFooterData({
      footerLegalLinks: (activeFooterData?.footerLegalLinks ?? []).filter(
        (_, linkIndex) => linkIndex !== index,
      ),
    });
  };

  const updateFooterSocialLink = (
    index: number,
    field: "label" | "href",
    value: string,
  ) => {
    const links = [
      ...(activeFooterData?.socialLinks ??
        activeFooterData?.footerSocialLinks ??
        []),
    ];

    links[index] = {
      ...links[index],
      [field]:
        field === "label"
          ? (value as SocialLinkData["label"])
          : value,
    };

    updateActiveFooterData({
      socialLinks: links,
    });
  };

  const addFooterSocialLink = () => {
    const links =
      activeFooterData?.socialLinks ??
      activeFooterData?.footerSocialLinks ??
      [];

    // Maximum 7 social links
    if (links.length >= MAX_FOOTER_SOCIAL_LINKS) {
      return;
    }

    updateActiveFooterData({
      socialLinks: [
        ...links,
        {
          label: "facebook",
          href: "#",
        },
      ],
    });
  };

  const removeFooterSocialLink = (index: number) => {
    const links =
      activeFooterData?.socialLinks ??
      activeFooterData?.footerSocialLinks ??
      [];

    updateActiveFooterData({
      socialLinks: links.filter(
        (_, socialIndex) => socialIndex !== index,
      ),
    });
  };

  const deleteFooterSection = () => {
    if (!pendingFooterSectionDelete) return;

    if (pendingFooterSectionDelete.kind === "column") {
      const columns = [...(activeFooterData?.footerColumns ?? [])];
      const columnIndex = pendingFooterSectionDelete.index;
      if (
        typeof columnIndex !== "number" ||
        columnIndex < 0 ||
        columnIndex >= columns.length
      ) {
        setPendingFooterSectionDelete(null);
        return;
      }
      columns.splice(columnIndex, 1);
      updateActiveFooterData({ footerColumns: columns });
    } else if (pendingFooterSectionDelete.kind === "logo") {
      updateActiveFooterData({
        logo: "",
        logoImage: "",
        logoImageTitle: "",
        desc: "",
      });
    } else if (pendingFooterSectionDelete.kind === "contact") {
      updateActiveFooterData({
        contactLabel: undefined,
        officeLabel: undefined,
        footerContact: undefined,
      });
    } else if (pendingFooterSectionDelete.kind === "disclaimer") {
      updateActiveFooterData({
        disclaimerTitle: undefined,
        disclaimerText: undefined,
      });
    } else {
      updateActiveFooterData({
        copyrightText: undefined,
        legalTitle: undefined,
        footerLegalLinks: undefined,
        socialLinks: undefined,
        footerSocialLinks: undefined,
      });
    }

    setPendingFooterSectionDelete(null);
  };

  const updateFooterExternalLink = (
    field: "whatsappLink" | "callLink",
    value: string,
  ) => {
    updateActiveFooterData({ [field]: value });
  };

  const addDropdownItem = (menuIndex: number) => {
    const currentDropdowns = menuItems[menuIndex]?.children ?? [];

    if (currentDropdowns.length >= MAX_DROPDOWN_LINKS) return;

    const updatedMenu = menuItems.map((item, itemIndex) =>
      itemIndex === menuIndex
        ? {
          ...item,
          children: [
            ...(item.children ?? []),
            { label: "Dropdown Item", href: "" },
          ],
        }
        : item,
    );

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const updateDropdownItem = (
    menuIndex: number,
    childIndex: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    const nextValue = field === "label" ? limitLinkText(value) : value;
    const updatedMenu = menuItems.map((item, itemIndex) => {
      if (itemIndex !== menuIndex) return item;

      const updatedChildren = (item.children ?? []).map(
        (child, currentChildIndex) =>
          currentChildIndex === childIndex
            ? { ...child, [field]: nextValue }
            : child,
      );

      return { ...item, children: updatedChildren };
    });

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const deleteDropdownItem = (menuIndex: number, childIndex: number) => {
    const updatedMenu = menuItems.map((item, itemIndex) => {
      if (itemIndex !== menuIndex) return item;

      const updatedChildren = (item.children ?? []).filter(
        (_, currentChildIndex) => currentChildIndex !== childIndex,
      );

      return {
        ...item,
        children: updatedChildren.length ? updatedChildren : undefined,
      };
    });

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const deleteMenuItem = (index: number) => {
    const updatedMenu = menuItems.filter((_, itemIndex) => itemIndex !== index);

    updateActiveHeaderData({ menu: updatedMenu });
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveMenuItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const updatedMenu = [...menuItems];
    const [movedItem] = updatedMenu.splice(fromIndex, 1);
    updatedMenu.splice(toIndex, 0, movedItem);

    updateActiveHeaderData({ menu: updatedMenu });
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[10050]"
      onPointerUp={handleModalPointerUp}
      onPointerCancel={handleModalPointerUp}
    >
      <div
        className={`pointer-events-auto fixed h-[min(74vh,490px)] w-[min(calc(100vw-2rem),980px)] cursor-grab flex-col overflow-hidden rounded-3xl bg-[#f4f4f5] shadow-2xl animate-editor-pop active:cursor-grabbing ${generationText ? "hidden" : "flex"
          }`}
        style={{
          left: `calc((100vw - min(calc(100vw - 2rem), 880px)) / 2 + ${modalPosition.x}px)`,
          top: `calc(20vh + ${modalPosition.y}px)`,
          touchAction: dragStart ? "none" : "auto",
        }}
        onPointerDown={handleModalPointerDown}
      >
        <div
          className={`relative flex items-center justify-between border-b border-gray-400 px-5 py-3 ${dragStart ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
          <h3 className="text-2xl font-medium">
            {subsectionScope?.label ?? formatSectionTitle(sectionType)}
          </h3>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen((open) => !open)}
            className="rounded-md p-2 text-gray-950 lg:hidden"
            aria-label={
              mobileSidebarOpen ? "Close settings menu" : "Open settings menu"
            }
            aria-expanded={mobileSidebarOpen}
          >
            {mobileSidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1">
          {mobileSidebarOpen && (
            <aside className="absolute inset-y-0 left-0 z-30 flex w-56 flex-col rounded-r-2xl border-r border-gray-400 bg-white p-3 shadow-xl lg:hidden">
              <div className="mb-2 flex items-center justify-between underline">
                <h3 className="text-sm font-semibold">
                  Settings
                </h3>
              </div>

              <SidebarContent
                items={visibleSidebarItems}
                activeTab={activeTab}
                setActiveTab={handleSidebarTabChange}
              />
            </aside>
          )}

          <aside className="hidden h-full min-h-0 w-56 shrink-0 flex-col border-r border-gray-400 bg-white p-3 lg:flex">
            <div className="mb-2 flex items-center justify-between underline">
              <h3 className="text-sm font-semibold">
                Settings
              </h3>
            </div>

            <SidebarContent
              items={visibleSidebarItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
            {!usesSectionColorPanel && (
              <div className="mb-3 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activeTab}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Customize {activeTab.toLowerCase()} settings
                  </p>
                </div>

                {false &&
                  activeSectionType === "Header" &&
                  activeTab === "Header Layout" && (
                    <div className="relative flex w-full flex-wrap items-center gap-3 sm:w-auto sm:shrink-0 sm:gap-5">
                      {headerBackgroundType === "solid" ? (
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-950">
                          Change color
                          <span
                            className="h-5 w-5 rounded-full border-2 border-gray-400"
                            style={{ background: headerSolidColor }}
                          />
                          <input
                            type="color"
                            value={headerSolidColor}
                            onChange={(event) =>
                              updateHeaderSolidColor(event.target.value)
                            }
                            className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                            aria-label="Header solid color"
                          />
                        </label>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setColorPanelOpen((open) => !open)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-950"
                        >
                          Change color
                          <span
                            className="h-5 w-10 rounded-full border-2 border-gray-400"
                            style={{ background: headerPreviewBackground }}
                          />
                        </button>
                      )}

                      {(["solid", "gradient"] as const).map((type) => {
                        const isActive = headerBackgroundType === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateHeaderBackgroundType(type)}
                            className={`min-w-24 rounded-lg border px-5 py-1.5 text-sm font-semibold capitalize text-gray-950 transition ${isActive
                              ? "border-gray-300 bg-white shadow-sm"
                              : "border-gray-500 bg-transparent hover:bg-white"
                              }`}
                          >
                            {type}
                          </button>
                        );
                      })}

                      {headerBackgroundType === "gradient" &&
                        colorPanelOpen && (
                          <div className="absolute right-0 top-11 z-20 grid w-72 grid-cols-2 gap-6 rounded-xl border border-gray-300 bg-white p-4 pt-7 shadow-xl">
                            <button
                              type="button"
                              onClick={() => setColorPanelOpen(false)}
                              className="absolute right-3 top-2 rounded-full p-1 text-gray-950 hover:bg-gray-100"
                              aria-label="Close gradient color picker"
                            >
                              <X size={18} />
                            </button>

                            <label className="space-y-4 text-sm font-semibold text-gray-950">
                              <span className="underline">Left Side</span>
                              <span className="flex items-center justify-between gap-3">
                                Color
                                <input
                                  type="color"
                                  value={headerSolidColor}
                                  onChange={(event) =>
                                    updateHeaderSolidColor(event.target.value)
                                  }
                                  className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                                  aria-label="Header gradient left color"
                                />
                              </span>
                            </label>

                            <label className="space-y-4 text-sm font-semibold text-gray-950">
                              <span className="underline">Right Side</span>
                              <span className="flex items-center justify-between gap-3">
                                Color
                                <input
                                  type="color"
                                  value={headerGradientColor}
                                  onChange={(event) =>
                                    updateHeaderGradientColor(
                                      event.target.value,
                                    )
                                  }
                                  className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                                  aria-label="Header gradient right color"
                                />
                              </span>
                            </label>
                          </div>
                        )}
                    </div>
                  )}

                {false &&
                  activeSectionType === "Footer" &&
                  activeTab === "Footer Layout" && (
                    <div className="relative flex w-full flex-wrap items-center gap-3 sm:w-auto sm:shrink-0 sm:gap-5">
                      {footerBackgroundType === "solid" ? (
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-950">
                          Change color
                          <span
                            className="h-5 w-5 rounded-full border-2 border-gray-400"
                            style={{ background: footerSolidColor }}
                          />
                          <input
                            type="color"
                            value={footerSolidColor}
                            onChange={(event) =>
                              updateFooterSolidColor(event.target.value)
                            }
                            className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                            aria-label="Footer solid color"
                          />
                        </label>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setColorPanelOpen((open) => !open)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-950"
                        >
                          Change color
                          <span
                            className="h-5 w-10 rounded-full border-2 border-gray-400"
                            style={{ background: footerPreviewBackground }}
                          />
                        </button>
                      )}

                      {(["solid", "gradient"] as const).map((type) => {
                        const isActive = footerBackgroundType === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateFooterBackgroundType(type)}
                            className={`min-w-24 rounded-lg border px-5 py-1.5 text-sm font-semibold capitalize text-gray-950 transition ${isActive
                              ? "border-gray-300 bg-white shadow-sm"
                              : "border-gray-500 bg-transparent hover:bg-white"
                              }`}
                          >
                            {type}
                          </button>
                        );
                      })}

                      {footerBackgroundType === "gradient" &&
                        colorPanelOpen && (
                          <div className="absolute right-0 top-11 z-20 grid w-72 grid-cols-2 gap-6 rounded-xl border border-gray-300 bg-white p-4 pt-7 shadow-xl">
                            <button
                              type="button"
                              onClick={() => setColorPanelOpen(false)}
                              className="absolute right-3 top-2 rounded-full p-1 text-gray-950 hover:bg-gray-100"
                              aria-label="Close footer gradient color picker"
                            >
                              <X size={18} />
                            </button>

                            <label className="space-y-4 text-sm font-semibold text-gray-950">
                              <span className="underline">Left Side</span>
                              <span className="flex items-center justify-between gap-3">
                                Color
                                <input
                                  type="color"
                                  value={footerSolidColor}
                                  onChange={(event) =>
                                    updateFooterSolidColor(event.target.value)
                                  }
                                  className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                                  aria-label="Footer gradient left color"
                                />
                              </span>
                            </label>

                            <label className="space-y-4 text-sm font-semibold text-gray-950">
                              <span className="underline">Right Side</span>
                              <span className="flex items-center justify-between gap-3">
                                Color
                                <input
                                  type="color"
                                  value={footerGradientColor}
                                  onChange={(event) =>
                                    updateFooterGradientColor(
                                      event.target.value,
                                    )
                                  }
                                  className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                                  aria-label="Footer gradient right color"
                                />
                              </span>
                            </label>
                          </div>
                        )}
                    </div>
                  )}
              </div>
            )}

            {activeSectionType === "Topbar" &&
              activeTab === "Topbar Layout" && (
                <div className="space-y-4">
                  <SectionColorPanel
                    title="Topbar Layout"
                    sectionTypeLabel="Topbar Type"
                    stickyType={topbarType}
                    backgroundType={topbarBackgroundType}
                    backgroundColor={topbarSolidColor}
                    gradientColor={topbarGradientColor}
                    textColor={topbarTextColor}
                    onStickyTypeChange={updateTopbarType}
                    onBackgroundTypeChange={updateTopbarBackgroundType}
                    onBackgroundColorChange={updateTopbarSolidColor}
                    onGradientColorChange={updateTopbarGradientColor}
                    onTextColorChange={updateTopbarTextColor}
                  />

                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div
                          className="flex h-20 items-center justify-between px-5"
                          style={{
                            background: topbarPreviewBackground,
                            color: topbarTextColor,
                          }}
                        >
                          <div className="h-2 w-32 rounded bg-current opacity-80" />
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-20 rounded bg-current opacity-70" />
                            <div className="h-2 w-24 rounded bg-current opacity-70" />
                            <div className="flex gap-2">
                              <div className="h-4 w-4 rounded-full bg-current opacity-80" />
                              <div className="h-4 w-4 rounded-full bg-current opacity-80" />
                              <div className="h-4 w-4 rounded-full bg-current opacity-80" />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "Topbar" &&
              activeTab === "Topbar Content" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-gray-900">Topbar Text</label>
                      <VisibilityButton hidden={isTopbarFieldHidden("text")} onClick={() => toggleTopbarFieldVisibility("text")} />
                    </div>
                    <input
                      value={activeTopbarData?.text?.[0] ?? ""}
                      onChange={(event) => updateTopbarText(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                      placeholder="Enter topbar text"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {(["phone", "email", "location"] as const).map((field) => (
                      <div
                        key={field}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <label className="block text-sm font-semibold capitalize text-gray-900">{field}</label>
                          <VisibilityButton hidden={isTopbarFieldHidden(field)} onClick={() => toggleTopbarFieldVisibility(field)} />
                        </div>
                        <input
                          value={activeTopbarData?.[field] ?? ""}
                          onChange={(event) =>
                            updateTopbarField(field, event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          Social Icons
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          You can add up to {MAX_TOPBAR_SOCIAL_LINKS} social
                          icons.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addTopbarSocialLink}
                        disabled={
                          topbarSocialLinks.length >= MAX_TOPBAR_SOCIAL_LINKS
                        }
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <Plus size={14} />
                        Add Icon
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <VisibilityButton hidden={isTopbarFieldHidden("socialLinks")} onClick={() => toggleTopbarFieldVisibility("socialLinks")} />
                    </div>

                    <div className="space-y-3">
                      {topbarSocialLinks.map((socialLink, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm lg:grid-cols-[minmax(8rem,1fr)_minmax(8rem,1fr)_3.5rem]"
                        >
                          <select
                            value={socialLink.label}
                            onChange={(event) =>
                              updateTopbarSocialLink(
                                index,
                                "label",
                                event.target.value as SocialLinkData["label"],
                              )
                            }
                            className="h-11 rounded-lg border border-gray-300 px-4 text-sm capitalize outline-none focus:border-blue-600"
                          >
                            {socialLinkLabels.map((socialName) => (
                              <option key={socialName} value={socialName}>
                                {socialName}
                              </option>
                            ))}
                          </select>

                          <input
                            value={socialLink.href}
                            onChange={(event) =>
                              updateTopbarSocialLink(
                                index,
                                "href",
                                event.target.value,
                              )
                            }
                            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                            placeholder="Social link"
                          />

                          <button
                            type="button"
                            onClick={() => deleteTopbarSocialLink(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                            aria-label="Delete social icon"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {activeSectionType === "Header" &&
              activeTab === "Header Content" && (
                <div className="space-y-5">
                  <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      Logo
                    </h4>

                    <label className="block text-sm font-semibold text-gray-900">
                      Logo Text
                    </label>
                    <input
                      value={activeHeaderData?.logo ?? ""}
                      onChange={(event) => updateHeaderLogo(event.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                      placeholder="Enter logo text"
                    />

                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-gray-900">
                        Logo Image
                      </span>
                      <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 transition hover:border-blue-500">
                        <span className="font-medium">
                          {activeHeaderData?.logoImage
                            ? "Change logo image"
                            : "Upload logo image"}
                        </span>
                        <span className="max-w-[55%] truncate text-xs text-slate-500">
                          {getMediaUploadLabel(
                            activeHeaderData?.logoImage ?? "",
                            "image",
                          )}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={updateHeaderLogoImage}
                          className="sr-only"
                        />
                      </label>

                      {activeHeaderData?.logoImage && (
                        <button
                          type="button"
                          onClick={deleteHeaderLogoImage}
                          className="rounded-md border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove logo image
                        </button>
                      )}
                      <input
                        value={activeHeaderData?.logoImageTitle ?? ""}
                        onChange={(event) =>
                          updateActiveHeaderData({
                            logoImageTitle: event.target.value,
                          })
                        }
                        className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                        placeholder="Logo image alt text"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                    {isEventsHeader ? (
                      <>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            Header Button
                          </h4>
                          <p className="mt-1 text-xs text-gray-700 underline">
                            Edit the Book Now CTA shown in the header.
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm font-semibold text-gray-900">
                            Button Label
                            <input
                              value={activeHeaderData?.button?.label ?? ""}
                              onChange={(event) =>
                                updateEventsHeaderCta(
                                  "label",
                                  event.target.value,
                                )
                              }
                              className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                              placeholder="Book Now"
                            />
                          </label>
                          <label className="block text-sm font-semibold text-gray-900">
                            Button Link
                            <input
                              value={activeHeaderData?.button?.href ?? ""}
                              onChange={(event) =>
                                updateEventsHeaderCta(
                                  "href",
                                  event.target.value,
                                )
                              }
                              className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                              placeholder="/contact"
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Header Buttons
                        </h4>
                        <p className="mt-1 text-xs text-gray-700 underline">
                          Manage header action buttons.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addHeaderButton}
                        disabled={
                          (activeHeaderData?.buttons ?? []).length >=
                          MAX_HEADER_BUTTONS
                        }
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <Plus size={14} />
                        Add Button
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      {(activeHeaderData?.buttons ?? []).length}/
                      {MAX_HEADER_BUTTONS} header buttons added
                    </p>

                    <div className="space-y-3">
                      {(activeHeaderData?.buttons ?? []).map((button, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm lg:grid-cols-[minmax(8rem,1fr)_minmax(8rem,1fr)_8rem_3.5rem]"
                        >
                          <input
                            value={button.label}
                            onChange={(event) =>
                              updateHeaderButton(
                                index,
                                "label",
                                event.target.value,
                              )
                            }
                            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                            placeholder="Button label"
                          />

                          <input
                            value={button.href}
                            onChange={(event) =>
                              updateHeaderButton(
                                index,
                                "href",
                                event.target.value,
                              )
                            }
                            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                            placeholder="/link"
                          />

                          <select
                            value={button.variant ?? "primary"}
                            onChange={(event) =>
                              updateHeaderButton(
                                index,
                                "variant",
                                event.target.value,
                              )
                            }
                            className="h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                            aria-label="Header button style"
                          >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => deleteHeaderButton(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                            aria-label="Delete header button"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            {activeSectionType === "Header" &&
              activeTab === "Header Layout" && (
                <div className="space-y-4">
                  <SectionColorPanel
                    title="Header Layout"
                    sectionTypeLabel="Header Type"
                    stickyType={headerType}
                    backgroundType={headerBackgroundType}
                    backgroundColor={headerSolidColor}
                    gradientColor={headerGradientColor}
                    textColor={headerTextColor}
                    onStickyTypeChange={updateHeaderType}
                    onBackgroundTypeChange={updateHeaderBackgroundType}
                    onBackgroundColorChange={updateHeaderSolidColor}
                    onGradientColorChange={updateHeaderGradientColor}
                    onTextColorChange={updateHeaderTextColor}
                  />

                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div className="h-20 bg-gray-100">
                          {layout.id === "Header-1" && (
                            <div className="h-full">
                              <div
                                className="flex h-10 items-center justify-between px-4"
                                style={{
                                  background: headerPreviewBackground,
                                  color: headerTextColor,
                                }}
                              >
                                <div className="h-2 w-14 rounded bg-current" />
                                <div className="flex gap-3">
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                </div>
                                <div className="h-5 w-12 rounded-md bg-blue-600" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Header-2" && (
                            <div
                              className="flex h-full items-start justify-between px-4 py-4"
                              style={{
                                background: headerPreviewBackground,
                                color: headerTextColor,
                              }}
                            >
                              <div className="h-2 w-16 rounded bg-current" />
                              <div className="flex gap-3">
                                <div className="h-1.5 w-9 rounded bg-current" />
                                <div className="h-1.5 w-9 rounded bg-current" />
                                <div className="h-1.5 w-9 rounded bg-current" />
                              </div>
                              <div className="h-5 w-12 rounded-md bg-blue-600" />
                            </div>
                          )}

                          {layout.id !== "Header-1" &&
                            layout.id !== "Header-2" && (
                              <div
                                className="flex h-full items-center justify-between px-4"
                                style={{
                                  background: headerPreviewBackground,
                                  color: headerTextColor,
                                }}
                              >
                                <div className="h-2 w-14 rounded bg-current" />
                                <div className="flex gap-3">
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                  <div className="h-1.5 w-9 rounded bg-current" />
                                </div>
                                <div className="h-5 w-12 rounded-md bg-blue-600" />
                              </div>
                            )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "Banner" &&
              activeTab === "Banner Content" && (
                <div className="space-y-4">
                  <input
                    ref={bannerImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageFileChange}
                    className="hidden"
                    aria-label="Choose banner image"
                  />
                  <input
                    ref={bannerVideoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleBannerVideoFileChange}
                    className="hidden"
                    aria-label="Choose banner video"
                  />

                  {"pretitle" in (activeBannerData ?? {}) && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <label className="block text-sm font-semibold text-gray-900">
                        Pretitle
                      </label>
                      <input
                        value={activeBannerData?.pretitle ?? ""}
                        onChange={(event) =>
                          updateBannerField("pretitle", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                        placeholder="Enter banner pretitle"
                      />
                    </div>
                  )}

                  {!isSliderBanner && "title" in (activeBannerData ?? {}) && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <label className="block text-sm font-semibold text-gray-900">
                        Title
                      </label>
                      <input
                        value={activeBannerData?.title ?? ""}
                        onChange={(event) =>
                          updateBannerField("title", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                        placeholder="Enter banner title"
                      />
                    </div>
                  )}

                  {!isSliderBanner && "desc" in (activeBannerData ?? {}) && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <label className="block text-sm font-semibold text-gray-900">
                        Description
                      </label>
                      <textarea
                        value={activeBannerData?.desc ?? ""}
                        onChange={(event) =>
                          updateBannerField("desc", event.target.value)
                        }
                        className="mt-2 min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600"
                        placeholder="Enter banner description"
                      />
                    </div>
                  )}

                  {activeVariant === "Banner-2" &&
                    "overlayColor" in (activeBannerData ?? {}) && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <ColorInput
                          label="Overlay Color"
                          value={activeBannerData?.overlayColor ?? "#000000"}
                          onChange={(color) =>
                            updateBannerField("overlayColor", color)
                          }
                        />
                      </div>
                    )}

                  {isSliderBanner && hasBannerSlidesField && (
                    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Banner Slider
                        </h4>
                        <button
                          type="button"
                          onClick={addBannerSlide}
                          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white"
                        >
                          <Plus size={14} />
                          Add Slide
                        </button>
                      </div>

                      {(activeBannerData?.bannerSlides ?? []).map(
                        (slide, index) => (
                          <div
                            key={index}
                            className="space-y-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h5 className="text-sm font-semibold text-gray-900">
                                Slide {index + 1}
                              </h5>
                              <button
                                type="button"
                                onClick={() =>
                                  setPendingBannerSlideDelete({
                                    index,
                                    label:
                                      slide.title?.trim() ||
                                      `Slide ${index + 1}`,
                                  })
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                                aria-label="Delete banner slide"
                              >
                                <Trash size={18} />
                              </button>
                            </div>

                            {!isVideoSliderBanner && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-900">
                                  Slide Image
                                </label>
                                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
                                  <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-900 transition hover:border-blue-500 focus-within:border-blue-600">
                                    <span className="font-medium">
                                      {slide.image
                                        ? "Change image"
                                        : "Upload image"}
                                    </span>
                                    <span className="max-w-[55%] truncate text-xs text-gray-500">
                                      {getMediaUploadLabel(slide.image, "image")}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) =>
                                        handleBannerSlideImageFileChange(
                                          index,
                                          event,
                                        )
                                      }
                                      className="sr-only"
                                      aria-label={`Choose slide ${index + 1} image`}
                                    />
                                  </label>
                                  <MediaUploadPreview
                                    src={slide.image ?? ""}
                                    type="image"
                                  />
                                </div>
                              </div>
                            )}

                            {isVideoSliderBanner && (
                              <div>
                                <div className="flex items-center justify-between gap-3">
                                  <label className="block text-sm font-semibold text-gray-900">
                                    Slide Video
                                  </label>
                                  {slide.video && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteBannerSlideVideo(index)
                                      }
                                      className="rounded-md border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                    >
                                      Delete video
                                    </button>
                                  )}
                                </div>
                                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
                                  <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-900 transition hover:border-blue-500 focus-within:border-blue-600">
                                    <span className="font-medium">
                                      {slide.video
                                        ? "Change video"
                                        : "Upload video"}
                                    </span>
                                    <span className="max-w-[55%] truncate text-xs text-gray-500">
                                      {getMediaUploadLabel(
                                        slide.video ?? "",
                                        "video",
                                      )}
                                    </span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(event) =>
                                        handleBannerSlideVideoFileChange(
                                          index,
                                          event,
                                        )
                                      }
                                      className="sr-only"
                                      aria-label={`Choose slide ${index + 1} video`}
                                    />
                                  </label>
                                  <MediaUploadPreview
                                    src={slide.video ?? ""}
                                    type="video"
                                  />
                                </div>
                              </div>
                            )}

                            {isVideoSliderBanner && (
                              <div>
                                <span className="block text-sm font-semibold text-gray-900">
                                  Poster Image
                                </span>
                                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
                                  <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-900 transition hover:border-blue-500 focus-within:border-blue-600">
                                    <span className="font-medium">
                                      {slide.image ? "Change poster" : "Upload poster"}
                                    </span>
                                    <span className="max-w-[55%] truncate text-xs text-gray-500">
                                      {getMediaUploadLabel(slide.image, "image")}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) =>
                                        handleBannerSlideImageFileChange(index, event)
                                      }
                                      className="sr-only"
                                      aria-label={`Choose slide ${index + 1} poster image`}
                                    />
                                  </label>
                                  <MediaUploadPreview
                                    src={slide.image ?? ""}
                                    type="image"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-semibold text-gray-900">
                                Slide Image Alt Text
                              </label>
                              <input
                                value={slide.alt ?? ""}
                                onChange={(event) =>
                                  updateBannerSlide(
                                    index,
                                    "alt",
                                    event.target.value,
                                  )
                                }
                                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                                placeholder="Describe this slide image"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-900">
                                Slide Title
                              </label>
                              <input
                                value={slide.title}
                                onChange={(event) =>
                                  updateBannerSlide(
                                    index,
                                    "title",
                                    event.target.value,
                                  )
                                }
                                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                                placeholder="Enter slide title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-900">
                                Slide Description
                              </label>
                              <textarea
                                value={slide.desc ?? ""}
                                onChange={(event) =>
                                  updateBannerSlide(
                                    index,
                                    "desc",
                                    event.target.value,
                                  )
                                }
                                className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600"
                                placeholder="Enter slide description"
                              />
                            </div>

                            {slide.button && <div className="grid gap-3 lg:grid-cols-3">
                              <div>
                                <label className="block text-sm font-semibold text-gray-900">
                                  Button Label
                                </label>
                                <input
                                  value={slide.button?.label ?? ""}
                                  onChange={(event) =>
                                    updateBannerSlideButton(
                                      index,
                                      "label",
                                      event.target.value,
                                    )
                                  }
                                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                                  placeholder="Learn more"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-900">
                                  Button Link
                                </label>
                                <input
                                  value={slide.button?.href ?? ""}
                                  onChange={(event) =>
                                    updateBannerSlideButton(
                                      index,
                                      "href",
                                      event.target.value,
                                    )
                                  }
                                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                                  placeholder="#"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-900">
                                  Button Style
                                </label>
                                <select
                                  value={slide.button?.variant ?? "primary"}
                                  onChange={(event) =>
                                    updateBannerSlideButton(
                                      index,
                                      "variant",
                                      event.target.value,
                                    )
                                  }
                                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                                >
                                  <option value="primary">Primary</option>
                                  <option value="secondary">Secondary</option>
                                </select>
                              </div>
                            </div>}
                          </div>
                        ),
                      )}
                    </section>
                  )}

                  {!isSliderBanner && hasBannerMediaField && (
                    <section className="rounded-xl border border-gray-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Banner Media
                      </h4>

                      {hasBannerImageField && (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900">
                              Background Image
                            </label>
                            <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  bannerImageInputRef.current?.click()
                                }
                                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-900 transition hover:border-blue-500 focus:border-blue-600 focus:outline-none"
                              >
                                <span className="font-medium">
                                  {activeBannerData?.backgroundImage
                                    ? "Change image"
                                    : "Upload image"}
                                </span>
                                <span className="max-w-[55%] truncate text-xs text-gray-500">
                                  {getMediaUploadLabel(
                                    activeBannerData?.backgroundImage ?? "",
                                    "image",
                                  )}
                                </span>
                              </button>
                              <MediaUploadPreview
                                src={activeBannerData?.backgroundImage ?? ""}
                                type="image"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-900">
                              Image Alt Text
                            </label>
                            <input
                              value={
                                activeBannerData?.backgroundImageTitle ?? ""
                              }
                              onChange={(event) =>
                                updateBannerField(
                                  "backgroundImageTitle",
                                  event.target.value,
                                )
                              }
                              className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                              placeholder="Banner image"
                            />
                          </div>
                        </div>
                      )}

                      {hasBannerVideoField && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between gap-3">
                            <label className="block text-sm font-semibold text-gray-900">
                              Background Video
                            </label>
                            {activeBannerData?.backgroundVideo && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateBannerField("backgroundVideo", "")
                                }
                                className="rounded-md border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Delete video
                              </button>
                            )}
                          </div>
                          <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
                            <button
                              type="button"
                              onClick={() => bannerVideoInputRef.current?.click()}
                              className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-900 transition hover:border-blue-500 focus:border-blue-600 focus:outline-none"
                            >
                              <span className="font-medium">
                                {activeBannerData?.backgroundVideo
                                  ? "Change video"
                                  : "Upload video"}
                              </span>
                              <span className="max-w-[55%] truncate text-xs text-gray-500">
                                {getMediaUploadLabel(
                                  activeBannerData?.backgroundVideo ?? "",
                                  "video",
                                )}
                              </span>
                            </button>
                            <MediaUploadPreview
                              src={activeBannerData?.backgroundVideo ?? ""}
                              type="video"
                            />
                          </div>
                        </div>
                      )}

                      {hasBannerColorField && (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <ColorInput
                            label={
                              bannerBackgroundMode === "gradient"
                                ? "Background left"
                                : "Background color"
                            }
                            value={bannerSolidColor}
                            onChange={(color) =>
                              updateBannerField("bannerBackgroundColor", color)
                            }
                          />

                          {bannerBackgroundMode === "gradient" && (
                            <ColorInput
                              label="Background right"
                              value={bannerGradientColor}
                              onChange={(color) =>
                                updateBannerField("bannerGradientColor", color)
                              }
                            />
                          )}
                        </div>
                      )}
                    </section>
                  )}

                  {hasBannerHeightField && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-semibold text-gray-900">
                          Banner Height
                        </label>
                        <input
                          type="number"
                          min={40}
                          max={100}
                          value={bannerHeight}
                          onChange={(event) =>
                            updateBannerHeight(Number(event.target.value))
                          }
                          className="h-10 w-24 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <input
                        type="range"
                        min={40}
                        max={100}
                        value={bannerHeight}
                        onChange={(event) =>
                          updateBannerHeight(Number(event.target.value))
                        }
                        className="mt-4 w-full accent-blue-600"
                      />
                    </div>
                  )}

                  {hasBannerButtonsField &&
                    (!isSliderBanner || visibleBannerButtons.length > 0) && (
                      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {isSliderBanner ? "Secondary Banner Button" : "Banner Buttons"}
                          </h4>

                          {!isSliderBanner && <button
                            type="button"
                            onClick={addBannerButton}
                            disabled={
                              (activeBannerData?.buttons ?? []).length >=
                              MAX_BANNER_BUTTONS
                            }
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            <Plus size={14} />
                            Add Button
                          </button>}
                        </div>

                        {!isSliderBanner && <p className="text-xs text-gray-500">
                          {(activeBannerData?.buttons ?? []).length}/
                          {MAX_BANNER_BUTTONS} banner buttons added
                        </p>}

                        <div className="space-y-3">
                          {visibleBannerButtons.map(
                            ({ button, index }) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm lg:grid-cols-[minmax(8rem,1fr)_minmax(8rem,1fr)_8rem_3.5rem]"
                              >
                                <input
                                  value={button.label}
                                  onChange={(event) =>
                                    updateBannerButton(
                                      index,
                                      "label",
                                      event.target.value,
                                    )
                                  }
                                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                                  placeholder="Button label"
                                />

                                <input
                                  value={button.href}
                                  onChange={(event) =>
                                    updateBannerButton(
                                      index,
                                      "href",
                                      event.target.value,
                                    )
                                  }
                                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                                  placeholder="/link"
                                />

                                <select
                                  value={button.variant ?? "primary"}
                                  onChange={(event) =>
                                    updateBannerButton(
                                      index,
                                      "variant",
                                      event.target.value,
                                    )
                                  }
                                  className="h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                  aria-label="Banner button style"
                                >
                                  <option value="primary">Primary</option>
                                  <option value="secondary">Secondary</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => deleteBannerButton(index)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                                  aria-label="Delete banner button"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

            {activeSectionType === "Banner" &&
              activeTab === "Banner Layout" && (
                <div className="space-y-4">
                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div className="h-28 bg-gray-100">
                          {layout.id === "Banner-1" && (
                            <div className="relative flex h-full items-center overflow-hidden bg-slate-900 px-5">
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${activeBannerData?.backgroundImage ??
                                    "/bg1.jpg"
                                    })`,
                                }}
                              />
                              <div className="absolute inset-0 bg-black/45" />
                              <div className="relative z-10 w-2/3 space-y-2">
                                <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                  Image Banner
                                </span>
                                <div className="h-1.5 w-24 rounded bg-white/70" />
                                <div className="h-3 w-40 rounded bg-white" />
                                <div className="h-1.5 w-full rounded bg-white/60" />
                                <div className="h-1.5 w-4/5 rounded bg-white/60" />
                                <div className="h-5 w-16 rounded-md bg-blue-600" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Banner-2" && (
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950 px-5 text-center">
                              <video
                                className="absolute inset-0 h-full w-full object-cover opacity-70"
                                src={activeBannerData?.backgroundVideo || "/video.mp4"}
                                muted
                                loop
                                playsInline
                              />
                              <div className="absolute inset-0 bg-black/45" />
                              <div className="relative z-10 w-2/3 space-y-3">
                                <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                  Video Banner
                                </span>
                                <div className="mx-auto h-4 w-40 rounded bg-white" />
                                <div className="mx-auto h-2 w-full rounded bg-white/70" />
                                <div className="mx-auto h-2 w-4/5 rounded bg-white/70" />
                                <div className="mx-auto h-6 w-20 rounded-md bg-blue-600" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Banner-3" && (
                            <div className="relative flex h-full items-center overflow-hidden bg-slate-900 px-5">
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${activeBannerData?.bannerSlides?.[0]
                                    ?.image ?? "/bg2.jpg"
                                    })`,
                                }}
                              />
                              <div className="absolute inset-0 bg-black/45" />
                              <div className="relative z-10 w-2/3 space-y-2">
                                <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                  Image Slider
                                </span>
                                <div className="h-3 w-44 rounded bg-white" />
                                <div className="h-1.5 w-full rounded bg-white/60" />
                                <div className="h-1.5 w-4/5 rounded bg-white/60" />
                                <div className="h-5 w-20 rounded-md bg-blue-600" />
                              </div>
                              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                                <span className="h-1.5 w-6 rounded bg-white" />
                                <span className="h-1.5 w-1.5 rounded bg-white/50" />
                                <span className="h-1.5 w-1.5 rounded bg-white/50" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Banner-4" && (
                            <div className="relative flex h-full items-center overflow-hidden bg-slate-900 px-5">
                              <video
                                className="absolute inset-0 h-full w-full object-cover opacity-70"
                                src={
                                  activeBannerData?.bannerSlides?.[0]?.video ||
                                  "/video.mp4"
                                }
                                poster={
                                  activeBannerData?.bannerSlides?.[0]?.image ||
                                  "/bg1.jpg"
                                }
                                muted
                                loop
                                playsInline
                              />
                              <div className="absolute inset-0 bg-black/45" />
                              <div className="relative z-10 w-2/3 space-y-2">
                                <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                  Video Slider
                                </span>
                                <div className="h-3 w-44 rounded bg-white" />
                                <div className="h-1.5 w-full rounded bg-white/60" />
                                <div className="h-1.5 w-4/5 rounded bg-white/60" />
                                <div className="h-5 w-20 rounded-md bg-blue-600" />
                              </div>
                              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                                <span className="h-1.5 w-6 rounded bg-white" />
                                <span className="h-1.5 w-1.5 rounded bg-white/50" />
                                <span className="h-1.5 w-1.5 rounded bg-white/50" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "About" && activeTab === "About Layout" && (
              <div className="space-y-4">
                {activeAboutLayouts.map((layout) => {
                  const isActive = currentSection?.variant === layout.id;
                  const Component = getSectionComponent(
                    category,
                    activeSectionType,
                    layout.id,
                  );
                  const layoutData =
                    currentSection?.data?.[layout.id] ?? activeGenericData;
                  const usesGeneratedPagePreview =
                    isPageSection &&
                    !layout.id.startsWith(`${activeSectionType}Page-`);

                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => selectSectionVariant(layout.id)}
                      className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                        }`}
                    >
                      <SelectedLayoutBadge active={isActive} title={layout.name} />
                      <div className="h-32 bg-gray-100">
                        {usesGeneratedPagePreview && Component && (
                          <div className="h-[520px] w-[1200px] origin-top-left scale-[0.28] bg-white">
                            <Component data={layoutData} />
                          </div>
                        )}

                        {layout.id === "AboutPage-1" && (
                          <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3 bg-white p-4">
                            <div className="space-y-2">
                              <div className="h-2 w-20 rounded bg-blue-500" />
                              <div className="h-5 w-full rounded bg-slate-900" />
                              <div className="h-5 w-4/5 rounded bg-slate-900" />
                              <div className="mt-3 h-2 w-full rounded bg-slate-400" />
                              <div className="h-2 w-5/6 rounded bg-slate-400" />
                            </div>
                            <div className="rounded-2xl bg-slate-300" />
                          </div>
                        )}

                        {layout.id === "AboutPage-2" && (
                          <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3 bg-slate-50 p-4">
                            <div className="rounded-2xl bg-slate-300" />
                            <div className="space-y-2">
                              <div className="h-2 w-20 rounded bg-blue-500" />
                              <div className="h-5 w-full rounded bg-slate-900" />
                              <div className="h-5 w-4/5 rounded bg-slate-900" />
                              <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="h-8 rounded bg-white" />
                                <div className="h-8 rounded bg-white" />
                                <div className="h-8 rounded bg-white" />
                              </div>
                            </div>
                          </div>
                        )}

                        {layout.id === "AboutPage-3" && (
                          <div className="h-full bg-slate-950 p-4">
                            <div className="h-2 w-20 rounded bg-blue-300" />
                            <div className="mt-3 grid grid-cols-[1.1fr_0.9fr] gap-4">
                              <div className="space-y-2">
                                <div className="h-5 w-full rounded bg-white" />
                                <div className="h-5 w-4/5 rounded bg-white" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 w-full rounded bg-white/50" />
                                <div className="h-2 w-5/6 rounded bg-white/50" />
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <div className="h-7 rounded bg-white/10" />
                              <div className="h-7 rounded bg-white/10" />
                              <div className="h-7 rounded bg-white/10" />
                            </div>
                          </div>
                        )}

                        {layout.id === "About-1" && (
                          <div className="grid h-full grid-cols-2 overflow-hidden bg-[#fbfaf6]">
                            <div className="flex flex-col justify-center gap-2 px-5">
                              <div className="h-4 w-24 rounded bg-slate-900" />
                              <div className="h-2 w-full rounded bg-slate-400" />
                              <div className="h-2 w-4/5 rounded bg-slate-400" />
                              <div className="h-5 w-20 rounded-full bg-blue-600" />
                            </div>
                            <div className="bg-slate-300" />
                          </div>
                        )}

                        {layout.id === "About-2" && (
                          <div className="grid h-full grid-cols-[1fr_1.4fr_1fr] gap-3 bg-white p-4">
                            <div className="space-y-2">
                              <div className="h-5 w-16 rounded bg-slate-900" />
                              <div className="h-5 w-12 rounded bg-slate-900" />
                              <div className="mt-4 h-2 w-20 rounded bg-slate-500" />
                              <div className="h-2 w-24 rounded bg-slate-400" />
                            </div>
                            <div className="rounded-2xl bg-slate-300" />
                            <div className="space-y-3">
                              <div className="h-12 rounded-2xl bg-slate-300" />
                              <div className="h-3 w-20 rounded bg-slate-900" />
                              <div className="h-2 w-full rounded bg-slate-400" />
                              <div className="h-2 w-4/5 rounded bg-slate-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeSectionType === "Product" &&
              activeTab === "Product Layout" && (
                <div className="space-y-4">
                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div className="h-32 bg-gray-100">
                          {layout.id === "Product-1" && (
                            <div className="grid h-full grid-cols-[1fr_1.4fr_1fr] items-center gap-3 bg-blue-50 px-5">
                              <div className="space-y-2">
                                <div className="h-4 w-20 rounded bg-slate-900" />
                                <div className="h-2 w-16 rounded bg-slate-500" />
                                <div className="mt-4 h-16 rounded bg-white shadow-sm" />
                              </div>
                              <div className="mx-auto h-24 w-24 rounded-full bg-slate-300" />
                              <div className="space-y-2">
                                <div className="h-4 w-24 rounded bg-slate-900" />
                                <div className="h-2 w-full rounded bg-slate-400" />
                                <div className="h-2 w-4/5 rounded bg-slate-400" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Product-2" && (
                            <div className="h-full bg-sky-100 p-4">
                              <div className="mx-auto mb-3 h-4 w-32 rounded bg-slate-900" />
                              <div className="grid h-20 grid-cols-3 gap-3">
                                <div className="rounded-lg border border-slate-400 bg-sky-50" />
                                <div className="rounded-lg border border-slate-400 bg-sky-50" />
                                <div className="rounded-lg border border-slate-400 bg-sky-50" />
                              </div>
                            </div>
                          )}

                          {layout.id === "Product-3" && (
                            <div className="grid h-full grid-cols-[1fr_1.1fr] gap-4 bg-[#0d1f2a] p-4">
                              <div className="space-y-2">
                                <div className="h-2 w-16 rounded bg-blue-200" />
                                <div className="h-5 w-full rounded bg-white" />
                                <div className="h-5 w-4/5 rounded bg-white" />
                                <div className="mt-3 h-3 w-24 rounded bg-blue-600" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg bg-white/25" />
                                <div className="rounded-lg bg-white/25" />
                                <div className="rounded-lg bg-white/25" />
                                <div className="rounded-lg bg-white/25" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "FormDetail" &&
              activeTab === "Form Layout" && (
                <div className="space-y-4">
                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div className="grid h-32 grid-cols-[1fr_1fr] overflow-hidden bg-[#dfecea] p-3">
                          {layout.id === "FormDetail-1" ? (
                            <>
                              <div className="rounded-2xl bg-slate-900/85 p-4">
                                <div className="h-5 w-16 rounded-full bg-white/30" />
                                <div className="mt-8 h-3 w-24 rounded bg-white" />
                                <div className="mt-2 h-2 w-28 rounded bg-white/60" />
                              </div>
                              <div className="rounded-r-2xl bg-white p-4">
                                <div className="h-4 w-16 rounded bg-slate-900" />
                                <div className="mt-4 space-y-2">
                                  <div className="h-4 rounded-full bg-emerald-50" />
                                  <div className="h-4 rounded-full bg-emerald-50" />
                                  <div className="h-4 rounded-full bg-emerald-50" />
                                </div>
                                <div className="mt-3 h-5 rounded-full bg-emerald-800" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-slate-100 p-4">
                                <div className="h-4 w-24 rounded bg-slate-900" />
                                <div className="mt-3 h-2 w-full rounded bg-slate-400" />
                                <div className="mt-2 h-2 w-4/5 rounded bg-slate-400" />
                              </div>
                              <div className="bg-white p-4">
                                <div className="space-y-2">
                                  <div className="h-5 rounded bg-slate-100" />
                                  <div className="h-5 rounded bg-slate-100" />
                                  <div className="h-8 rounded bg-blue-600" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "FormDetail" &&
              activeTab === "Form Content" && (
                <div className="space-y-5">
                  <section className="rounded-xl bg-[#f4f4f5] p-4">
                    <div className="grid gap-3">
                      {isContentFieldVisible("pretitle") && (
                        <input
                          value={activeFormDetailData?.pretitle ?? ""}
                          onChange={(event) =>
                            updateActiveFormDetailData({
                              pretitle: event.target.value,
                            })
                          }
                          className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                          placeholder="Eyebrow text"
                        />
                      )}
                      {isContentFieldVisible("title") && (
                        <input
                          value={activeFormDetailData?.title ?? ""}
                          onChange={(event) =>
                            updateActiveFormDetailData({
                              title: event.target.value,
                            })
                          }
                          className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                          placeholder="Form title"
                        />
                      )}
                      {isContentFieldVisible("desc") && (
                        <textarea
                          value={activeFormDetailData?.desc ?? ""}
                          onChange={(event) =>
                            updateActiveFormDetailData({
                              desc: event.target.value,
                            })
                          }
                          className="h-24 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
                          placeholder="Form description"
                        />
                      )}
                      {isContentFieldVisible("formSubmitLabel") && (
                        <input
                          value={activeFormDetailData?.formSubmitLabel ?? ""}
                          onChange={(event) =>
                            updateActiveFormDetailData({
                              formSubmitLabel: event.target.value,
                            })
                          }
                          className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                          placeholder="Submit button label"
                        />
                      )}
                    </div>
                  </section>

                  {(
                    [
                      "backgroundImage",
                      "backgroundImageTitle",
                      "sideImage",
                      "galleryItems",
                      "phone",
                      "email",
                      "location",
                    ] as const
                  )
                    .filter(
                      (fieldName) =>
                        isContentFieldVisible(fieldName) &&
                        activeGenericEditorData &&
                        Object.prototype.hasOwnProperty.call(
                          activeGenericEditorData,
                          fieldName,
                        ),
                    )
                    .map((fieldName) => (
                      <GenericFieldEditor
                        key={fieldName}
                        fieldName={fieldName}
                        value={
                          (
                            activeGenericEditorData as
                            | Record<string, unknown>
                            | undefined
                          )?.[fieldName]
                        }
                        path={[fieldName]}
                        sectionType="FormDetail"
                        onChange={updateGenericField}
                        onMediaChange={updateGenericMedia}
                        onAddArrayItem={addGenericCollectionItem}
                        onDeleteArrayItem={deleteGenericCollectionItem}
                        availablePageNames={availablePageNames}
                      />
                    ))}

                  <section className="rounded-xl bg-[#f4f4f5] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">
                        Form Fields
                      </h4>
                      <button
                        type="button"
                        onClick={addFormField}
                        disabled={
                          (activeFormDetailData?.formFields ?? []).length >=
                          MAX_FORM_FIELDS
                        }
                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        Add Field
                      </button>
                    </div>
                    <p className="-mt-2 mb-4 text-xs font-medium text-slate-500">
                      {(activeFormDetailData?.formFields ?? []).length}/
                      {MAX_FORM_FIELDS} fields added
                    </p>

                    <div className="space-y-3">
                      {(activeFormDetailData?.formFields ?? []).map(
                        (field, index) => (
                          <div
                            key={`formField-${index}`}
                            className="grid gap-2 rounded-xl bg-white p-3"
                          >
                            <div className="grid gap-2 md:grid-cols-[1fr_1fr_130px_36px]">
                              <input
                                value={field.label}
                                onChange={(event) =>
                                  updateFormField(
                                    index,
                                    "label",
                                    event.target.value,
                                  )
                                }
                                className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                placeholder="Field label"
                              />
                              <input
                                value={field.placeholder ?? ""}
                                onChange={(event) =>
                                  updateFormField(
                                    index,
                                    "placeholder",
                                    event.target.value,
                                  )
                                }
                                className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                placeholder="Placeholder"
                              />
                              <select
                                value={field.type ?? "text"}
                                onChange={(event) =>
                                  updateFormField(
                                    index,
                                    "type",
                                    event.target.value,
                                  )
                                }
                                className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                              >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone</option>
                                <option value="textarea">Textarea</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => deleteFormField(index)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500 text-red-600"
                                aria-label="Delete form field"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                </div>
              )}

            {hasCardCollection && activeTab === "Box Layout" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    Boxes per row
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose how many cards appear in one desktop row.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[2, 3, 4, 5, 6]
                    .filter(
                      (count) =>
                        activeSectionType !== "Features" ||
                        count <= MAX_FEATURE_CARDS,
                    )
                    .map((count) => {
                      const configuredBoxes = activeGenericData?.boxesPerRow;
                      const isSelected =
                        configuredBoxes === count ||
                        (activeSectionType === "Features" &&
                          count === MAX_FEATURE_CARDS &&
                          typeof configuredBoxes === "number" &&
                          configuredBoxes > MAX_FEATURE_CARDS);

                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            if (availableCardCount < count) {
                              setBoxLayoutMessage("There are no other cards present.");
                              return;
                            }

                            setBoxLayoutMessage("");
                            updateActiveGenericData({ boxesPerRow: count });
                          }}
                          className={`rounded-xl border p-4 text-left transition ${isSelected
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/15"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                            }`}
                        >
                          <span className="text-sm font-semibold text-slate-900">
                            {count} boxes
                          </span>
                          <span
                            className="mt-3 grid gap-1.5"
                            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                            aria-hidden
                          >
                            {Array.from({ length: count }, (_, index) => (
                              <span
                                key={index}
                                className={`h-9 rounded-md ${isSelected ? "bg-blue-600" : "bg-slate-200"
                                  }`}
                              />
                            ))}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {!activeGenericData?.boxesPerRow && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                    The component&apos;s original card layout is currently active.
                  </p>
                )}
                {boxLayoutMessage && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                    {boxLayoutMessage}
                  </p>
                )}
              </div>
            )}

            {![
              "Topbar",
              "Header",
              "Banner",
              "FormDetail",
              "Footer",
            ].includes(activeSectionType) &&
              (activeTab.endsWith("Content") ||
                activeTab === "Tabs" ||
                (hasScopedContentAndFormTabs && activeTab === "Form") ||
                (activeSectionType === "CareerPage" &&
                  activeTab === "CareerPage Form")) && (
                <div className="space-y-5">
                  {visibleGenericContentEntries.map(([key, value]) => (
                    <GenericFieldEditor
                      key={key}
                      fieldName={key}
                      value={value}
                      path={[key]}
                      sectionType={activeSectionType}
                      onChange={updateGenericField}
                      onMediaChange={updateGenericMedia}
                      onAddArrayItem={addGenericCollectionItem}
                      onDeleteArrayItem={deleteGenericCollectionItem}
                      availablePageNames={availablePageNames}
                      cardFields={activeCardFields}
                    />
                  ))}
                </div>
              )}

            {["WhyChooseUs", "Service", "Gallery", "Contact", "FAQ", "Testimonial", "Awards", "Blog", "CompanyStatistics"].includes(activeSectionType) &&
              activeTab.endsWith("Layout") &&
              activeTab !== "Box Layout" && (
                <div className="space-y-4">
                  {activeSectionType === "Gallery" && layoutOptions.length > 4 && (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        aria-label="Previous gallery layouts"
                        onClick={() =>
                          setGalleryLayoutStart(
                            (prev) =>
                              (prev - 1 + layoutOptions.length) %
                              layoutOptions.length,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-slate-100"
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <button
                        type="button"
                        aria-label="Next gallery layouts"
                        onClick={() =>
                          setGalleryLayoutStart(
                            (prev) => (prev + 1) % layoutOptions.length,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-slate-100"
                      >
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  )}

                  {visibleLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;
                    const Component = getSectionComponent(
                      category,
                      activeSectionType,
                      layout.id,
                    );
                    const layoutData =
                      currentSection?.data?.[layout.id] ?? activeGenericData;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div className="h-36 overflow-hidden bg-white">
                          {Component ? (
                            <div className="h-[520px] w-[1200px] origin-top-left scale-[0.32]">
                              <Component data={layoutData} />
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm font-semibold">
                              {layout.name}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "Footer" &&
              activeTab === "Footer Layout" && (
                <div className="space-y-4">
                  <SectionColorPanel
                    title="Footer Layout"
                    backgroundType={footerBackgroundType}
                    backgroundColor={footerSolidColor}
                    gradientColor={footerGradientColor}
                    textColor={footerTextColor}
                    onBackgroundTypeChange={updateFooterBackgroundType}
                    onBackgroundColorChange={updateFooterSolidColor}
                    onGradientColorChange={updateFooterGradientColor}
                    onTextColorChange={updateFooterTextColor}
                  />

                  {sectionLayoutOptions.map((layout) => {
                    const isActive = currentSection?.variant === layout.id;

                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => selectSectionVariant(layout.id)}
                        className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left ${isActive ? "border-gray-400" : "border-gray-200"
                          }`}
                      >
                        <SelectedLayoutBadge active={isActive} title={layout.name} />
                        <div
                          className="grid h-32 grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 p-4"
                          style={{
                            background: footerPreviewBackground,
                            color: footerTextColor,
                          }}
                        >
                          <div className="space-y-2">
                            <div className="h-4 w-20 rounded bg-current" />
                            <div className="h-2 w-full rounded bg-current opacity-60" />
                            <div className="h-2 w-4/5 rounded bg-current opacity-60" />
                            <div className="mt-4 flex gap-2">
                              <div className="h-5 w-5 rounded-full bg-current opacity-25" />
                              <div className="h-5 w-5 rounded-full bg-current opacity-25" />
                              <div className="h-5 w-5 rounded-full bg-current opacity-25" />
                            </div>
                          </div>
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="space-y-2">
                              <div className="h-3 w-16 rounded bg-current" />
                              <div className="h-2 w-20 rounded bg-current opacity-50" />
                              <div className="h-2 w-24 rounded bg-current opacity-50" />
                              <div className="h-2 w-16 rounded bg-current opacity-50" />
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {activeSectionType === "Footer" &&
              activeTab === "Footer Content" && (
                <div className="space-y-5">
                  {activeGenericData?.logo ||
                    activeGenericData?.logoImage ||
                    activeGenericData?.desc ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Footer logo
                        </h3>

                        <button
                          type="button"
                          aria-label="Delete footer logo section"
                          onClick={() =>
                            setPendingFooterSectionDelete({
                              kind: "logo",
                              label: "Footer logo",
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash size={14} />
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Use a text logo or upload an image.
                      </p>

                      <label className="mt-4 block text-xs font-medium text-gray-700">
                        Logo text
                      </label>

                      <input
                        value={activeFooterData?.logo ?? ""}
                        onChange={(event) =>
                          updateActiveFooterData({
                            logo: event.target.value,
                          })
                        }
                        className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                        placeholder="Your site name"
                      />

                      {"logoImage" in (activeFooterData ?? {}) && (
                        <>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                              Upload logo
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={updateFooterLogoImage}
                              />
                            </label>

                            {activeFooterData?.logoImage && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateActiveFooterData({
                                    logoImage: "",
                                    logoImageTitle: "",
                                  })
                                }
                                className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Remove image
                              </button>
                            )}
                          </div>

                          <input
                            value={activeFooterData?.logoImageTitle ?? ""}
                            onChange={(event) =>
                              updateActiveFooterData({
                                logoImageTitle: event.target.value,
                              })
                            }
                            className="mt-3 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                            placeholder="Logo image alt text"
                          />
                        </>
                      )}

                      <div className="mt-4">
                        {renderFooterContentField("desc")}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveFooterData({
                          logo: "HAUS Group",
                          logoImage: "",
                          logoImageTitle: "",
                          desc: "Add your footer description here.",
                        })
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Plus size={16} />
                      Add Footer Logo
                    </button>
                  )}

                  {visibleFooterColumns.map((column, columnIndex) => (
                    <section
                      key={`footerColumn-${columnIndex}`}
                      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Link column {columnIndex + 1}
                        </h3>

                        <button
                          type="button"
                          aria-label={`Delete ${column.title || `link column ${columnIndex + 1}`}`}
                          onClick={() =>
                            setPendingFooterSectionDelete({
                              kind: "column",
                              label: column.title || `Link column ${columnIndex + 1}`,
                              index: columnIndex,
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash size={14} />
                        </button>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          Column title
                        </label>

                        <input
                          value={column.title}
                          onChange={(event) =>
                            updateFooterColumn(
                              columnIndex,
                              "title",
                              event.target.value,
                            )
                          }
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                          placeholder="Column title"
                        />
                      </div>

                      <div className="space-y-3">
                        {column.links.map((link, linkIndex) => (
                          <div
                            key={`${columnIndex}-${linkIndex}`}
                            className="grid gap-3 rounded-xl border border-gray-200 bg-[#f8f8f8] p-3 sm:grid-cols-[1fr_1fr_auto]"
                          >
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-slate-600">
                                Label
                              </label>

                              <input
                                value={link.label}
                                onChange={(event) =>
                                  updateFooterLink(
                                    columnIndex,
                                    linkIndex,
                                    "label",
                                    event.target.value,
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                placeholder="Link label"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-xs font-semibold text-slate-600">
                                Link
                              </label>

                              <input
                                value={link.href}
                                onChange={(event) =>
                                  updateFooterLink(
                                    columnIndex,
                                    linkIndex,
                                    "href",
                                    event.target.value,
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                placeholder="/page"
                              />
                            </div>

                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() =>
                                  removeFooterLink(columnIndex, linkIndex)
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                aria-label="Delete footer link"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addFooterLink(columnIndex)}
                        disabled={column.links.length >= MAX_FOOTER_LINKS_PER_COLUMN}
                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus size={14} />
                        Add Link
                      </button>
                    </section>
                  ))}

                  <button
                    type="button"
                    onClick={addFooterColumn}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    <Plus size={16} />
                    Add Footer Link Column
                  </button>

                  {activeGenericData?.footerContact ? (
                    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Contact details
                        </h3>

                        <button
                          type="button"
                          aria-label="Delete contact details section"
                          onClick={() =>
                            setPendingFooterSectionDelete({
                              kind: "contact",
                              label: "Contact details",
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash size={14} />
                        </button>
                      </div>

                      {renderFooterContentField("contactLabel")}
                      {renderFooterContentField("officeLabel")}
                      {renderFooterContentField("footerContact")}
                    </section>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveFooterData({
                          contactLabel: "Call an advisor",
                          footerContact: {
                            phone: "+91 98765 43210",
                            email: "hello@example.com",
                            location: "Your office address",
                          },
                          officeLabel: "Visit us",
                        })
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Plus size={16} />
                      Add Contact Details
                    </button>
                  )}

                  {showFooterLegalExtras &&
                    (activeGenericData?.disclaimerText ? (
                      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-gray-900">Disclaimer</h3>
                          <button type="button" aria-label="Delete disclaimer section" onClick={() => setPendingFooterSectionDelete({ kind: "disclaimer", label: "Disclaimer" })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash size={14} /></button>
                        </div>
                        {renderFooterContentField("disclaimerTitle")}
                        {renderFooterContentField("disclaimerText")}
                      </section>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveFooterData({
                            disclaimerTitle: "Disclaimer",
                            disclaimerText: "Add your disclaimer text here.",
                          })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <Plus size={16} />
                        Add Disclaimer
                      </button>
                    ))}

                  {activeGenericData?.copyrightText ||
                    activeGenericData?.footerLegalLinks ||
                    activeGenericData?.socialLinks ||
                    activeGenericData?.footerSocialLinks ? (
                    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Bottom bar
                        </h3>

                        <button
                          type="button"
                          aria-label="Delete bottom bar section"
                          onClick={() =>
                            setPendingFooterSectionDelete({
                              kind: "bottom",
                              label: "Bottom bar",
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash size={14} />
                        </button>
                      </div>

                      {/* Copyright */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                          Copyright text
                        </label>

                        <input
                          type="text"
                          value={activeFooterData?.copyrightText ?? ""}
                          onChange={(event) =>
                            updateActiveFooterData({
                              copyrightText: event.target.value,
                            })
                          }
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                          placeholder="© 2026 HAUS Group. All rights reserved."
                        />
                      </div>

                      {/* Legal Links */}
                      <div className="rounded-xl border border-gray-200 bg-[#f8f8f8] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Legal Links
                            </h4>

                            <p className="mt-1 text-xs text-gray-500">
                              Manage privacy, terms and other legal links.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={addFooterLegalLink}
                            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            <Plus size={14} />
                            Add Link
                          </button>
                        </div>

                        {showFooterLegalExtras && (
                          <div className="mb-3">
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Legal title
                            </label>

                            <input
                              value={activeFooterData?.legalTitle ?? ""}
                              onChange={(event) =>
                                updateActiveFooterData({
                                  legalTitle: event.target.value,
                                })
                              }
                              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                              placeholder="Legal"
                            />
                          </div>
                        )}

                        <div className="space-y-3">
                          {(activeFooterData?.footerLegalLinks ?? []).map(
                            (link, index) => (
                              <div
                                key={index}
                                className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto]"
                              >
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Label
                                  </label>

                                  <input
                                    value={link.label}
                                    onChange={(event) =>
                                      updateFooterLegalLink(
                                        index,
                                        "label",
                                        event.target.value,
                                      )
                                    }
                                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                    placeholder="Privacy Policy"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Link
                                  </label>

                                  <input
                                    value={link.href}
                                    onChange={(event) =>
                                      updateFooterLegalLink(
                                        index,
                                        "href",
                                        event.target.value,
                                      )
                                    }
                                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                    placeholder="/privacy-policy"
                                  />
                                </div>

                                <div className="flex items-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFooterLegalLink(index)
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                    aria-label="Delete legal link"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            ),
                          )}

                          {(activeFooterData?.footerLegalLinks ?? []).length === 0 && (
                            <p className="text-xs text-gray-500">
                              No legal links added.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="rounded-xl border border-gray-200 bg-[#f8f8f8] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Social Links
                            </h4>

                            <p className="mt-1 text-xs text-gray-500">
                              Add your social media links.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={addFooterSocialLink}
                            disabled={
                              (
                                activeFooterData?.socialLinks ??
                                activeFooterData?.footerSocialLinks ??
                                []
                              ).length >= MAX_FOOTER_SOCIAL_LINKS
                            }
                            className="
    flex items-center gap-1 rounded-md
    bg-blue-600 px-3 py-2
    text-xs font-semibold text-white
    transition-colors
    hover:bg-blue-700
    disabled:cursor-not-allowed
    disabled:bg-gray-200
    disabled:text-gray-400
    disabled:hover:bg-gray-200
  "
                          >
                            <Plus size={14} />

                            {(
                              activeFooterData?.socialLinks ??
                              activeFooterData?.footerSocialLinks ??
                              []
                            ).length >= MAX_FOOTER_SOCIAL_LINKS
                              ? `Maximum ${MAX_FOOTER_SOCIAL_LINKS} Added`
                              : "Add Social"}
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(
                            activeFooterData?.socialLinks ??
                            activeFooterData?.footerSocialLinks ??
                            []
                          ).map((social, index) => (
                            <div
                              key={index}
                              className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto]"
                            >
                              <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                  Platform
                                </label>

                                <select
                                  value={social.label}
                                  onChange={(event) =>
                                    updateFooterSocialLink(
                                      index,
                                      "label",
                                      event.target.value,
                                    )
                                  }
                                  className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm capitalize outline-none focus:border-blue-600"
                                >
                                  {socialLinkLabels.map((socialName) => (
                                    <option
                                      key={socialName}
                                      value={socialName}
                                    >
                                      {socialName}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                  Link
                                </label>

                                <input
                                  value={social.href}
                                  onChange={(event) =>
                                    updateFooterSocialLink(
                                      index,
                                      "href",
                                      event.target.value,
                                    )
                                  }
                                  className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
                                  placeholder="https://..."
                                />
                              </div>

                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFooterSocialLink(index)
                                  }
                                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                  aria-label="Delete social link"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {(
                            activeFooterData?.socialLinks ??
                            activeFooterData?.footerSocialLinks ??
                            []
                          ).length === 0 && (
                              <p className="text-xs text-gray-500">
                                No social links added.
                              </p>
                            )}
                        </div>
                      </div>
                    </section>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveFooterData({
                          copyrightText: `© ${new Date().getFullYear()} HAUS Group. All rights reserved.`,

                          ...(showFooterLegalExtras ? { legalTitle: "Legal" } : {}),

                          footerLegalLinks: [
                            {
                              label: "Privacy Policy",
                              href: "/privacy-policy",
                            },
                            {
                              label: "Terms & Conditions",
                              href: "/terms-and-conditions",
                            },
                          ],

                          socialLinks: [
                            {
                              label: "facebook",
                              href: "#",
                            },
                            {
                              label: "instagram",
                              href: "#",
                            },
                          ],
                        })
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Plus size={16} />
                      Add Bottom Bar
                    </button>
                  )}

                </div>
              )}

            {activeTab.endsWith("Content") &&
              automaticContentFields.length > 0 && (
                <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-bold text-slate-900">
                    Additional Content
                  </h4>
                  {automaticContentFields.map((field) => (
                    <GenericFieldEditor
                      key={field.path.join(".")}
                      fieldName={field.fieldName}
                      value={field.value}
                      path={field.path}
                      sectionType={activeSectionType}
                      onChange={updateGenericField}
                      onMediaChange={updateGenericMedia}
                      availablePageNames={availablePageNames}
                      cardFields={activeCardFields}
                    />
                  ))}
                </section>
              )}

            {pendingFooterSectionDelete &&
              createPortal(
                <div className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/45 px-4">
                  <div role="alertdialog" aria-modal="true" aria-labelledby="delete-footer-section-title" className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash size={20} /></div>
                    <h3 id="delete-footer-section-title" className="mt-4 text-xl font-semibold text-slate-950">Delete this footer section?</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">“{pendingFooterSectionDelete.label}” will be removed from the footer.</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <button type="button" onClick={() => setPendingFooterSectionDelete(null)} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                      <button type="button" onClick={deleteFooterSection} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                </div>,
                document.body,
              )}

            {pendingBannerSlideDelete &&
              createPortal(
                <div className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/45 px-4">
                  <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="delete-banner-slide-title"
                    className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Trash size={20} />
                    </div>
                    <h3
                      id="delete-banner-slide-title"
                      className="mt-4 text-xl font-semibold text-slate-950"
                    >
                      {(activeBannerData?.bannerSlides ?? []).length <= 1
                        ? "Hide banner section?"
                        : "Delete this slide?"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {(activeBannerData?.bannerSlides ?? []).length <= 1
                        ? `“${pendingBannerSlideDelete.label}” is the last slide. Deleting it will hide the Banner section.`
                        : `“${pendingBannerSlideDelete.label}” will be removed from this banner.`}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPendingBannerSlideDelete(null)}
                        className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmPendingBannerSlideDelete}
                        className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        {(activeBannerData?.bannerSlides ?? []).length <= 1
                          ? "Hide Banner"
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body,
              )}

            {activeSectionType === "Footer" &&
              activeTab === "External Link" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        WhatsApp Link
                      </label>
                      {activeFooterData?.whatsappLink ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateFooterExternalLink("whatsappLink", "")
                          }
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateFooterExternalLink(
                              "whatsappLink",
                              DEFAULT_WHATSAPP_LINK,
                            )
                          }
                          className="rounded-md border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          Add
                        </button>
                      )}
                    </div>
                    <input
                      value={activeFooterData?.whatsappLink ?? ""}
                      onChange={(event) =>
                        updateFooterExternalLink(
                          "whatsappLink",
                          event.target.value,
                        )
                      }
                      className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                      placeholder="https://api.whatsapp.com/send?phone=962786336414"
                    />
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        Call Link
                      </label>
                      {activeFooterData?.callLink ? (
                        <button
                          type="button"
                          onClick={() => updateFooterExternalLink("callLink", "")}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateFooterExternalLink(
                              "callLink",
                              DEFAULT_CALL_LINK,
                            )
                          }
                          className="rounded-md border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          Add
                        </button>
                      )}
                    </div>
                    <input
                      value={activeFooterData?.callLink ?? ""}
                      onChange={(event) =>
                        updateFooterExternalLink("callLink", event.target.value)
                      }
                      className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none focus:border-blue-600"
                      placeholder="tel:+919876543210"
                    />
                  </div>
                </div>
              )}

            {activeSectionType === "Header" &&
              activeTab === "Navigation Menu" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mt-1 text-xs text-gray-700 underline">
                        You can add up to {MAX_MENU_LINKS} menu links.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addMenuItem}
                      disabled={menuItems.length >= MAX_MENU_LINKS}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:bg-gray-300"
                    >
                      <Plus size={14} />
                      Add Nav Links
                    </button>
                  </div>

                  <div className="space-y-3">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        draggable={false}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedIndex !== null) {
                            moveMenuItem(draggedIndex, index);
                            setDraggedIndex(null);
                          }
                        }}
                        onDragEnd={() => setDraggedIndex(null)}
                        className={`cursor-grab rounded-xl border border-gray-300 bg-white p-2 shadow-sm ${draggedIndex === index ? "opacity-50" : ""
                          }`}
                      >
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[2.5rem_minmax(8rem,1fr)_minmax(8rem,1fr)_7rem_3.25rem] lg:items-center">
                          <button
                            type="button"
                            draggable
                            onDragStart={() => setDraggedIndex(index)}
                            onDragEnd={() => setDraggedIndex(null)}
                            className="h-9 w-9 cursor-grab rounded-lg border border-gray-400 bg-white bg-[radial-gradient(circle_at_35%_35%,#6b7280_2px,transparent_2.5px),radial-gradient(circle_at_65%_35%,#6b7280_2px,transparent_2.5px),radial-gradient(circle_at_35%_65%,#6b7280_2px,transparent_2.5px),radial-gradient(circle_at_65%_65%,#6b7280_2px,transparent_2.5px)] px-2 py-2 text-transparent active:cursor-grabbing"
                            title="Drag menu item"
                          >
                            ⋮⋮
                          </button>

                          <input
                            value={item.label}
                            onChange={(e) =>
                              updateMenuItem(index, "label", e.target.value)
                            }
                            className="h-11 rounded-lg border border-gray-400 px-4 text-sm text-blue-700 outline-none focus:border-blue-600"
                            placeholder="Menu label"
                          />

                          <input
                            value={item.href}
                            onChange={(e) =>
                              updateMenuItem(index, "href", e.target.value)
                            }
                            className="h-11 rounded-lg border border-gray-400 px-4 text-sm text-blue-700 outline-none focus:border-blue-600"
                            placeholder="/link"
                          />

                          <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => addDropdownItem(index)}
                            disabled={
                              (item.children?.length ?? 0) >= MAX_DROPDOWN_LINKS
                            }
                            className="h-11 whitespace-nowrap rounded-lg border border-blue-500 bg-white px-3 text-[10px] font-medium leading-tight text-blue-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            Add Dropdown
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteMenuItem(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                            aria-label="Delete menu item"
                          >
                            <Trash size={18} />
                          </button>
                        </div>

                        {!!item.children?.length && (
                          <div className="mt-2 space-y-2 lg:pl-[3.75rem]">
                            {item.children.map((child, childIndex) => (
                              <div
                                key={childIndex}
                                className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(10rem,1fr)_minmax(10rem,1fr)_3.5rem]"
                              >
                                <input
                                  value={child.label}
                                  onChange={(e) =>
                                    updateDropdownItem(
                                      index,
                                      childIndex,
                                      "label",
                                      e.target.value,
                                    )
                                  }
                                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                                  placeholder="Dropdown label"
                                />

                                <input
                                  value={child.href}
                                  onChange={(e) =>
                                    updateDropdownItem(
                                      index,
                                      childIndex,
                                      "href",
                                      e.target.value,
                                    )
                                  }
                                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
                                  placeholder="/dropdown-link"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteDropdownItem(index, childIndex)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500 bg-white text-red-600"
                                  aria-label="Delete dropdown item"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          {item.children?.length ?? 0}/{MAX_DROPDOWN_LINKS}{" "}
                          dropdown links added
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </main>
        </div>

        <div className="shrink-0 flex justify-end gap-3 border-t border-gray-400 bg-[#f4f4f5] p-2">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-400 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDone}
              className="rounded-full border bg-white px-5 py-2 text-sm font-semibold text-green-700 shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {generationText && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-white/35 backdrop-blur-sm">
          <style>
            {`
              @keyframes bannerLoaderSpin {
                to { transform: rotate(360deg); }
              }

              @keyframes bannerTextRoll {
                0%, 100% { transform: translateY(0); opacity: 0.65; }
                45% { transform: translateY(-0.22rem); opacity: 1; }
              }
            `}
          </style>
          <div className="relative overflow-hidden rounded-[1.35rem] p-[3px] shadow-2xl">
            <div className="absolute -inset-24 bg-[conic-gradient(from_0deg,#2563eb,#a855f7,#22c55e,#f59e0b,#ef4444,#2563eb)] animate-[bannerLoaderSpin_1.6s_linear_infinite]" />
            <div className="relative flex items-center gap-3 rounded-[1.2rem] bg-white/90 px-6 py-5 text-2xl font-medium text-slate-950 shadow-sm">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-xs text-white">
                AI
              </span>
              <span className="inline-flex overflow-hidden">
                {generationText.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block animate-[bannerTextRoll_1.1s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 0.045}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  items,
  activeTab,
  setActiveTab,
}: {
  items: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setActiveTab(item)}
          className={`w-full rounded-md px-3 py-2 text-left cursor-pointer ${activeTab === item
            ? "bg-blue-50 font-medium text-blue-700"
            : "hover:bg-gray-100"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function SectionColorPanel({
  title,
  sectionTypeLabel,
  stickyType,
  backgroundType,
  backgroundColor,
  gradientColor,
  textColor,
  onStickyTypeChange,
  onBackgroundTypeChange,
  onBackgroundColorChange,
  onGradientColorChange,
  onTextColorChange,
}: {
  title: string;
  sectionTypeLabel?: string;
  stickyType?: StickySectionType;
  backgroundType: "solid" | "gradient";
  backgroundColor: string;
  gradientColor: string;
  textColor: string;
  onStickyTypeChange?: (type: StickySectionType) => void;
  onBackgroundTypeChange: (type: "solid" | "gradient") => void;
  onBackgroundColorChange: (color: string) => void;
  onGradientColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
}) {
  return (
    <section className="rounded-xl bg-[#f4f4f5] px-4 py-3">
      <div className="grid gap-4 border-b border-gray-300 pb-3 lg:grid-cols-[minmax(150px,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-gray-950">{title}</h4>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Customize {title.toLowerCase()} settings
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[auto_auto_auto] sm:items-center">
          {sectionTypeLabel && stickyType && onStickyTypeChange && (
            <>
              <span className="text-sm font-semibold text-gray-950 sm:whitespace-nowrap">
                {sectionTypeLabel} :
              </span>

              {(["scroll", "sticky"] as const).map((type) => {
                const isActive = stickyType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onStickyTypeChange(type)}
                    className={`h-10 min-w-28 rounded-xl border px-5 text-sm font-semibold capitalize text-gray-950 shadow-sm transition ${isActive
                      ? "border-gray-300 bg-white"
                      : "border-transparent bg-slate-200 hover:bg-white"
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </>
          )}

          <span className="text-sm font-semibold text-gray-950 sm:whitespace-nowrap">
            Background Type :
          </span>

          {(["solid", "gradient"] as const).map((type) => {
            const isActive = backgroundType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => onBackgroundTypeChange(type)}
                className={`h-10 min-w-28 rounded-xl border px-5 text-sm font-semibold capitalize text-gray-950 shadow-sm transition ${isActive
                  ? "border-gray-300 bg-white"
                  : "border-gray-500 bg-transparent hover:bg-white"
                  }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <ColorInput
          label="Text color"
          value={textColor}
          onChange={onTextColorChange}
        />

        <ColorInput
          label={
            backgroundType === "gradient"
              ? "Background left"
              : "Background color"
          }
          value={backgroundColor}
          onChange={onBackgroundColorChange}
        />

        {backgroundType === "gradient" && (
          <ColorInput
            label="Background right"
            value={gradientColor}
            onChange={onGradientColorChange}
          />
        )}
      </div>
    </section>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-center gap-3 text-sm font-semibold text-gray-950">
      <span className="shrink-0">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className="h-5 w-5 rounded-full border-2 border-gray-400"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label={label}
        />
      </span>
    </label>
  );
}
