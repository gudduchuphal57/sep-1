"use client";

import type { ComponentType } from "react";

import type { SectionData } from "../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../components/sections/breadcrumb/NGOPageBanner2";
import { sectionRegistry } from "./sectionRegistry";

export type NGOSubsectionLayoutOption = {
  id: string;
  name: string;
  componentVariant: string;
};

const ngoSubsectionLayoutByPage: Record<string, Record<string, string>> = {
  NGOAboutPage2: {
    breadcrumb: "NGOPageBanner2",
    "about content": "NGOAbout2",
    mission: "NGOMission2",
    "mission vision": "NGOMission2",
    "why choose us": "NGOWhyChooseUs2",
  },
  NGOGalleryPage2: {
    breadcrumb: "NGOPageBanner2",
    gallery: "NGOGallery2",
    "gallery grid": "NGOGallery2",
    "gallery content": "NGOGallery2",
  },
  NGOBlogPage2: {
    breadcrumb: "NGOPageBanner2",
    blog: "NGOBlog2",
    "blog posts": "NGOBlog2",
    "blog content": "NGOBlog2",
  },
  NGOBlogDetailsPage2: {
    breadcrumb: "NGOPageBanner2",
    "article content": "NGOBlogDetailsContent2",
  },
  NGOContactPage2: {
    breadcrumb: "NGOPageBanner2",
    "contact overview": "NGOContactOverview2",
    contact: "NGOContactOverview2",
    "contact features": "NGOContactFeatures2",
    map: "NGOContactMap2",
  },
  NGOFAQPage2: {
    breadcrumb: "NGOPageBanner2",
    faq: "NGOFAQ2",
    faqs: "NGOFAQ2",
    "faq content": "NGOFAQ2",
  },
  NGOTeamsPage2: {
    breadcrumb: "NGOPageBanner2",
    team: "NGOTeam2",
    "team members": "NGOTeam2",
    "team cta": "NGOTeamCta2",
  },
  NGOTeamDetailPage2: {
    breadcrumb: "NGOPageBanner2",
    "team profile": "NGOTeamDetailProfile2",
    "about & skills": "NGOTeamDetailAbout2",
    experience: "NGOTeamDetailExperience2",
    achievements: "NGOTeamDetailAchievements2",
  },
  NGOCareersPage2: {
    breadcrumb: "NGOPageBanner2",
    "careers overview": "NGOCareersOverview2",
    "open roles": "NGOCareersRoles2",
    "careers cta": "NGOCareersCta2",
  },
  NGOCareersApplyPage2: {
    breadcrumb: "NGOPageBanner2",
    "job details": "NGOCareersApplyJobDetails2",
    "application form": "NGOCareersApplyForm2",
  },
  NGOEventsPage2: {
    breadcrumb: "NGOPageBanner2",
    events: "NGOEvents2",
    "events list": "NGOEvents2",
    "events content": "NGOEvents2",
    testimonials: "NGOTestimonial2",
  },
  NGOEventDetailPage2: {
    breadcrumb: "NGOPageBanner2",
    "event detail": "NGOEventDetailContent2",
  },
  NGOAwardsPage2: {
    breadcrumb: "NGOPageBanner2",
    awards: "NGOAwardsContent2",
    "awards content": "NGOAwardsContent2",
    "awards grid": "NGOAwardsGrid2",
    "awards support": "NGOAwardsSupport2",
    "awards transparency": "NGOAwardsTransparency2",
  },
  NGOTestimonialsPage2: {
    breadcrumb: "NGOPageBanner2",
    "testimonial intro": "NGOTestimonialsContent2",
    "testimonial content": "NGOTestimonialsContent2",
    testimonials: "NGOTestimonialsContent2",
    "testimonials content": "NGOTestimonialsContent2",
  },
  NGOProjects2: {
    projects: "NGOProjects2",
    "projects grid": "NGOProjects2",
    "projects content": "NGOProjects2",
  },
  NGOProjectsPage2: {
    breadcrumb: "NGOPageBanner2",
    projects: "NGOProjects2",
    "projects grid": "NGOProjects2",
    "projects content": "NGOProjects2",
  },
  NGOProjectDetailPage2: {
    breadcrumb: "NGOPageBanner2",
    "project detail": "NGOProjectDetailContent2",
  },
  NGOServicesPage2: {
    breadcrumb: "NGOPageBanner2",
    services: "NGOServicesContent2",
    "services content": "NGOServicesContent2",
    "services cta": "NGOServicesCta2",
  },
  NGOServiceDetailPage2: {
    breadcrumb: "NGOPageBanner2",
    "service detail": "NGOServiceDetailContent2",
  },
  
  NGOSupportPage2: {
    breadcrumb: "NGOPageBanner2",
    "support intro": "NGOSupportIntro2",
    "support overview": "NGOSupportIntro2",
    "ways to support": "NGOSupportWays2",
    "impact stats": "NGOSupportImpact2",
    "support cta": "NGOSupportCta2",
    transparency: "NGOSupportTransparency2",
  },
  NGOPartnersPage2: {
    breadcrumb: "NGOPageBanner2",
    partners: "NGOPartners2",
    "partners content": "NGOPartners2",
    "partners list": "NGOPartners2",
  },
  NGOCsrPage2: {
    breadcrumb: "NGOPageBanner2",
    "csr intro": "NGOCsrIntro2",
    "csr overview": "NGOCsrIntro2",
    "focus areas": "NGOCsrFocus2",
    "our impact": "NGOCsrImpact2",
    "csr projects": "NGOCsrProjects2",
    "csr cta": "NGOCsrCta2",
    "core values": "NGOCsrValues2",
  },
  NGOBrochurePage2: {
    breadcrumb: "NGOPageBanner2",
    "brochure intro": "NGOBrochureIntro2",
    brochures: "NGOBrochureList2",
    "brochure list": "NGOBrochureList2",
    "together we can": "NGOBrochureCta2",
    "brochure cta": "NGOBrochureCta2",
  },
  NGOCaseStudyPage2: {
    breadcrumb: "NGOPageBanner2",
    "case study overview": "NGOCaseStudyContent2",
    "case studies": "NGOCaseStudyContent2",
    "case study cta": "NGOCaseStudyCta2",
  },
  NGOCaseDetailsPage2: {
    breadcrumb: "NGOPageBanner2",
    "article content": "NGOCaseDetailsContent2",
    article: "NGOCaseDetailsContent2",
    "popular posts": "NGOCaseDetailsContent2",
    sidebar: "NGOCaseDetailsContent2",
  },
  NGOFrenchisePage2: {
    breadcrumb: "NGOPageBanner2",
    "franchise intro": "NGOFrenchiseIntro2",
    "franchise form": "NGOFrenchiseForm2",
    "franchise process": "NGOFrenchiseProcess2",
    "franchise cta": "NGOFrenchiseCta2",
  },
  NGOEnquiryPage2: {
    breadcrumb: "NGOPageBanner2",
    "enquiry intro": "NGOEnquiryForm2",
    "enquiry form": "NGOEnquiryForm2",
    "enquiry contact": "NGOEnquiryContact2",
    "enquiry cta": "NGOEnquiryCta2",
  },
  NGOBranchesPage2: {
    breadcrumb: "NGOPageBanner2",
    branches: "NGOBranchesContent2",
    "branches content": "NGOBranchesContent2",
    "branch locations": "NGOBranchesLocations2",
    "branches cta": "NGOBranchesCta2",
    "branches contact": "NGOBranchesContact2",
  },
  NGOIndustryPage2: {
    breadcrumb: "NGOPageBanner2",
    industry: "NGOIndustryContent2",
    "industry content": "NGOIndustryContent2",
    "industry partner": "NGOIndustryPartner2",
  },
  NGOMediaPage2: {
    breadcrumb: "NGOPageBanner2",
    media: "NGOMediaContent2",
    "media content": "NGOMediaContent2",
  },
  NGOPrivacyPolicyPage2: {
    breadcrumb: "NGOPageBanner2",
    "privacy content": "NGOPrivacyContent2",
  },
  NGOTermsConditionPage2: {
    breadcrumb: "NGOPageBanner2",
    "terms content": "NGOTermsContent2",
  },
  NGOCookiePolicyPage2: {
    breadcrumb: "NGOPageBanner2",
    "cookie content": "NGOCookieContent2",
  },
  NGODisclaimerPage2: {
    breadcrumb: "NGOPageBanner2",
    "disclaimer content": "NGODisclaimerContent2",
  },
  NGORefundPolicyPage2: {
    breadcrumb: "NGOPageBanner2",
    "refund content": "NGORefundContent2",
  },
};

export const getNGOSubsectionLayouts = (
  pageVariant: string,
  label: string,
): NGOSubsectionLayoutOption[] => {
  const componentVariant =
    ngoSubsectionLayoutByPage[pageVariant]?.[label.trim().toLowerCase()];
  if (!componentVariant) return [];

  return [
    {
      id: componentVariant,
      name: `${label} 1`,
      componentVariant,
    },
  ];
};

type NGOSubsectionLayoutPreviewProps = {
  componentVariant: string;
  data?: SectionData;
  subsectionLabel: string;
};

export function NGOSubsectionLayoutPreview({
  componentVariant,
  data = {},
  subsectionLabel: _subsectionLabel,
}: NGOSubsectionLayoutPreviewProps) {
  if (componentVariant === "NGOPageBanner2") {
    return <NGOPageBanner2 {...getNGOPageBannerProps(data)} />;
  }

  const nestedPreviewData =
    componentVariant === "NGOMission2" &&
    data.mission &&
    typeof data.mission === "object" &&
    !Array.isArray(data.mission)
      ? (data.mission as SectionData)
      : componentVariant === "NGOWhyChooseUs2" &&
          data.whyChooseUs &&
          typeof data.whyChooseUs === "object" &&
          !Array.isArray(data.whyChooseUs)
        ? (data.whyChooseUs as SectionData)
        : componentVariant === "NGOAbout2" &&
            data.aboutContent &&
            typeof data.aboutContent === "object" &&
            !Array.isArray(data.aboutContent)
          ? (data.aboutContent as SectionData)
          : data;

  const Component = sectionRegistry[componentVariant] as
    | ComponentType<{ data?: SectionData }>
    | undefined;

  if (!Component) return null;

  return <Component data={nestedPreviewData} />;
}
