export type PageComponentAdapter = {
  sourceVariant: string;
  subsectionIndex?: number;
  subsectionIndexes?: number[];
  subsectionCount: number;
};

export const pageComponentAdapters: Record<string, PageComponentAdapter> = {
  RealEstateAboutStory1: {
    sourceVariant: "RealEstateAboutPage1",
    subsectionIndex: 1,
    subsectionCount: 4,
  },
  RealEstateAboutStats1: {
    sourceVariant: "RealEstateAboutPage1",
    subsectionIndex: 2,
    subsectionCount: 4,
  },
  RealEstateAboutCTA1: {
    sourceVariant: "RealEstateAboutPage1",
    subsectionIndex: 3,
    subsectionCount: 4,
  },
  RealEstateAwardsListing1: {
    sourceVariant: "RealEstateAwardsPage1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateBlogListing1: {
    sourceVariant: "RealEstateBlogPage1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateCareerBenefits1: {
    sourceVariant: "RealEstateCareerPage1",
    subsectionIndex: 1,
    subsectionCount: 3,
  },
  RealEstateCareerJobs1: {
    sourceVariant: "RealEstateCareerPage1",
    subsectionIndex: 2,
    subsectionCount: 3,
  },
  RealEstateCSRImpactSection1: {
    sourceVariant: "RealEstateCSRPage1",
    subsectionIndex: 1,
    subsectionCount: 4,
  },
  RealEstateCSRPrograms1: {
    sourceVariant: "RealEstateCSRPage1",
    subsectionIndex: 2,
    subsectionCount: 4,
  },
  RealEstateCSRCTA1: {
    sourceVariant: "RealEstateCSRPage1",
    subsectionIndex: 3,
    subsectionCount: 4,
  },
  RealEstateContactDetails1: {
    sourceVariant: "RealEstateContactPage1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateCookieContent1: {
    sourceVariant: "RealEstateCookiePolicy1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateDisclaimerContent1: {
    sourceVariant: "RealEstateDisclaimer1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateGalleryCollection1: {
    sourceVariant: "RealEstateGalleryPage1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateMissionPillars1: {
    sourceVariant: "RealEstateMissionVision1",
    subsectionIndex: 1,
    subsectionCount: 3,
  },
  RealEstateCompanyValues1: {
    sourceVariant: "RealEstateMissionVision1",
    subsectionIndex: 2,
    subsectionCount: 3,
  },
  RealEstateProjectCatalog1: {
    sourceVariant: "RealEstateProject1",
    subsectionIndexes: [1, 2],
    subsectionCount: 3,
  },
  RealEstatePropertyOverview1: {
    sourceVariant: "RealEstatePropertyDetail1",
    subsectionIndex: 0,
    subsectionCount: 2,
  },
  RealEstatePropertyAmenities1: {
    sourceVariant: "RealEstatePropertyDetail1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstatePrivacyContent1: {
    sourceVariant: "RealEstatePrivacyPolicy1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstatePropertyCatalog1: {
    sourceVariant: "RealEstateProperty1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateRefundContent1: {
    sourceVariant: "RealEstateRefundPolicy1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateRentalListing1: {
    sourceVariant: "RealEstateRent1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateServicesOverview1: {
    sourceVariant: "RealEstateServicePage1",
    subsectionIndex: 1,
    subsectionCount: 4,
  },
  RealEstateServiceListing1: {
    sourceVariant: "RealEstateServicePage1",
    subsectionIndex: 2,
    subsectionCount: 4,
  },
  RealEstateServicesCTA1: {
    sourceVariant: "RealEstateServicePage1",
    subsectionIndex: 3,
    subsectionCount: 4,
  },
  RealEstateSitemapLinks1: {
    sourceVariant: "RealEstateSitemap1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
  RealEstateTermsContent1: {
    sourceVariant: "RealEstateTermsConditions1",
    subsectionIndex: 1,
    subsectionCount: 2,
  },
};

export const getHiddenSubsectionsForAdapter = (
  adapter: PageComponentAdapter,
) => {
  const visibleIndexes =
    adapter.subsectionIndexes ??
    (adapter.subsectionIndex === undefined ? [] : [adapter.subsectionIndex]);

  return Array.from(
    { length: adapter.subsectionCount },
    (_, index) => index,
  ).filter((index) => !visibleIndexes.includes(index));
};
