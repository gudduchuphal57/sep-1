"use client";

import type { ComponentType } from "react";

import type { SectionData } from "../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../components/sections/breadcrumb/EventsPageBanner1";
import EventsLegalSections1 from "../components/sections/privacy-policy/EventsLegalSections1";
import { sectionRegistry } from "./sectionRegistry";

export type EventsSubsectionLayoutOption = {
  id: string;
  name: string;
  componentVariant: string;
};

const eventsSubsectionLayoutByPage: Record<string, Record<string, string>> = {
  EventsAboutPage1: {
    breadcrumb: "EventsPageBanner1",
    "about content": "EventsAboutContent1",
    stats: "EventsAboutStats1",
    values: "EventsAboutValues1",
    cta: "EventsAboutCta1",
  },
  EventsOurStoryPage1: {
    breadcrumb: "EventsPageBanner1",
    story: "EventsOurStoryContent1",
    stats: "EventsOurStoryStats1",
    milestones: "EventsOurStoryMilestones1",
  },
  EventsVisionPage1: {
    breadcrumb: "EventsPageBanner1",
    vision: "EventsVisionBlock1",
    mission: "EventsMissionBlock1",
    "core beliefs": "EventsCoreBeliefs1",
  },
  EventsTeamsPage1: {
    breadcrumb: "EventsPageBanner1",
    "team members": "EventsTeamMembers1",
    "join cta": "EventsTeamJoinCta1",
  },
  EventsTeamDetailPage1: {
    breadcrumb: "EventsPageBanner1",
    "team profile": "EventsTeamDetailContent1",
  },
  EventsAwardsPage1: {
    breadcrumb: "EventsPageBanner1",
    "featured award": "EventsFeaturedAward1",
    "trophy wall": "EventsTrophyWall1",
    stats: "EventsAwardsStats1",
  },
  EventsGalleryPage1: {
    breadcrumb: "EventsPageBanner1",
    "gallery grid": "EventsGalleryGrid1",
  },
  EventsBlogPage1: {
    breadcrumb: "EventsPageBanner1",
    "blog posts": "EventsBlogGrid1",
  },
  EventsBlogDetailsPage1: {
    breadcrumb: "EventsPageBanner1",
    "article content": "EventsBlogDetailsContent1",
    "recent posts": "EventsBlogRecentPosts1",
  },
  EventsContactPage1: {
    breadcrumb: "EventsPageBanner1",
    "contact overview": "EventsContactOverview1",
    map: "EventsContactMap1",
  },
  EventsCareersPage1: {
    breadcrumb: "EventsPageBanner1",
    "careers overview": "EventsCareersOverview1",
    "open roles": "EventsCareersRoles1",
    "culture quote": "EventsCareersQuoteCta1",
  },
  EventsCareersApplyPage1: {
    breadcrumb: "EventsPageBanner1",
    "application form": "EventsCareersApplyForm1",
    "job details": "EventsCareersApplyJobDetails1",
    "why join us": "EventsCareersApplyWhyJoinUs1",
  },
  EventsSupportPage1: {
    breadcrumb: "EventsPageBanner1",
    "support overview": "EventsSupportOverview1",
  },
  EventsPrivacyPolicyPage1: {
    breadcrumb: "EventsPageBanner1",
    "privacy policy content": "EventsLegalSections1",
  },
  EventsTermsConditionPage1: {
    breadcrumb: "EventsPageBanner1",
    "terms content": "EventsLegalSections1",
  },
  EventsGlobalPresencePage1: {
    breadcrumb: "EventsPageBanner1",
    presence: "EventsPresence1",
  },
  EventsEventPage1: {
    breadcrumb: "EventsPageBanner1",
    "event categories": "EventsEventCategories1",
    cta: "EventsEventCta1",
  },
  EventsEventDetailPage1: {
    breadcrumb: "EventsPageBanner1",
    "event detail": "EventsEventDetailContent1",
    "contact area": "EventsEventDetailCta1",
  },
  EventsCaseStudyPage1: {
    breadcrumb: "EventsPageBanner1",
    "case study overview": "EventsCaseStudyOverview1",
    "project details": "EventsCaseStudyProject1",
    "case study cta": "EventsCaseStudyCta1",
  },
};

export const getEventsSubsectionLayouts = (
  pageVariant: string,
  label: string,
): EventsSubsectionLayoutOption[] => {
  const componentVariant =
    eventsSubsectionLayoutByPage[pageVariant]?.[label.trim().toLowerCase()];
  if (!componentVariant) return [];

  return [
    {
      id: componentVariant,
      name: `${label} 1`,
      componentVariant,
    },
  ];
};

type EventsSubsectionLayoutPreviewProps = {
  componentVariant: string;
  data?: SectionData;
  subsectionLabel: string;
};

export function EventsSubsectionLayoutPreview({
  componentVariant,
  data = {},
  subsectionLabel,
}: EventsSubsectionLayoutPreviewProps) {
  if (componentVariant === "EventsPageBanner1") {
    return (
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />
    );
  }

  if (componentVariant === "EventsLegalSections1") {
    return (
      <EventsLegalSections1 data={data} editorLabel={subsectionLabel} />
    );
  }

  const Component = sectionRegistry[
    componentVariant
  ] as ComponentType<{ data?: SectionData }> | undefined;

  if (!Component) return null;

  return <Component data={data} />;
}
