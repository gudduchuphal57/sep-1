import { selectedConfig } from "./selectedConfig";
import categoryContentJson from "./categoryContent.json";
import type { SectionData, SectionItem, SelectedConfig } from "../types/section";
import {
  getCategoryComponentPrefix,
  getCategorySectionVariant,
} from "../lib/categorySectionVariant";
import {
  getHiddenSubsectionsForAdapter,
  pageComponentAdapters,
} from "../lib/pageComponentAdapters";

export type BuilderTemplate = {
  id: string;
  title: string;
  image: string;
  componentCount: number;
};

type SectionContentMap = Partial<Record<string, Record<string, unknown>>>;
type TemplateComponentMap = Record<string, string | null>;
type TemplatePageComponent = {
  key: string;
  component: string;
  enabled?: boolean;
};
type TemplatePageDefinition = {
  components: TemplatePageComponent[];
  expand?: "blogItems" | "propertyListings" | "projectItems" | "items" | "roles" | "members";
  expandSection?: string;
  expandVariant?: string;
};
type TemplateComposition = {
  shared: TemplateComponentMap;
  pages: Record<string, TemplatePageDefinition>;
};
type TemplateDefinition = TemplateComponentMap | TemplateComposition;

type CategoryContentRecord = {
  common: SectionContentMap;
  categories: Record<
    string,
    {
      templateComponents: Record<string, TemplateDefinition>;
      sections: SectionContentMap;
    }
  >;
};

const categoryContent =
  categoryContentJson as unknown as CategoryContentRecord;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

const isTemplateComposition = (
  value: TemplateDefinition | undefined,
): value is TemplateComposition =>
  Boolean(
    value &&
      isRecord(value) &&
      isRecord(value.shared) &&
      isRecord(value.pages),
  );

export const normalizeTemplatePageComponents = (
  value: unknown,
): TemplatePageComponent[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.key !== "string" ||
      !entry.key.trim() ||
      typeof entry.component !== "string" ||
      !entry.component.trim() ||
      entry.enabled === false
    ) {
      return [];
    }

    return [
      {
        key: entry.key.trim(),
        component: entry.component.trim(),
        enabled: entry.enabled !== false,
      },
    ];
  });
};

export const getCategoryNamesWithContent = () =>
  Object.keys(categoryContent.categories);

export type CategoryLayoutOption = {
  id: string;
  name: string;
  componentVariant: string;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getCategorySectionVariants = (
  category: string,
  sectionType: string,
): Record<string, unknown> => {
  const categorySection =
    categoryContent.categories[category]?.sections?.[sectionType];

  return isRecord(categorySection) && isRecord(categorySection.variants)
    ? categorySection.variants
    : {};
};

type CategoryVariantEntry = {
  componentVariant: string;
  data: Record<string, unknown>;
  layoutIndex: number;
  sectionKey: string;
  sectionType: string;
};

const normalizeSectionName = (value: string) =>
  value.replace(/[^a-z0-9]/gi, "").toLowerCase();

const getCategoryPageVariantEntries = (
  category: string,
  sectionType: string,
): CategoryVariantEntry[] => {
  const prefix = getCategoryComponentPrefix(category);
  const pageComponentPattern = new RegExp(
    `^${escapeRegExp(prefix)}(.+)Page(\\d+)$`,
  );
  const targetSectionName = normalizeSectionName(sectionType);
  const categorySections =
    categoryContent.categories[category]?.sections ?? {};
  const entries = Object.entries(categorySections).flatMap(
    ([sectionKey, sectionValue]) => {
      if (!isRecord(sectionValue) || !isRecord(sectionValue.variants)) {
        return [];
      }

      return Object.entries(sectionValue.variants).flatMap(
        ([componentVariant, variantData]) => {
          const match = componentVariant.match(pageComponentPattern);

          if (
            !match ||
            normalizeSectionName(match[1]) !== targetSectionName ||
            !isRecord(variantData)
          ) {
            return [];
          }

          return [
            {
              componentVariant,
              data: variantData,
              layoutIndex: Number(match[2]),
              sectionKey,
              sectionType: match[1],
            },
          ];
        },
      );
    },
  );

  return Array.from(
    new Map(entries.map((entry) => [entry.componentVariant, entry])).values(),
  ).sort((left, right) => left.layoutIndex - right.layoutIndex);
};

const isCategoryPageComponent = (
  category: string,
  sectionType: string,
  componentVariant: string,
) => {
  const prefix = getCategoryComponentPrefix(category);
  const pattern = new RegExp(
    `^${escapeRegExp(prefix)}${escapeRegExp(sectionType)}Page\\d+$`,
  );

  return pattern.test(componentVariant);
};

const getCategoryVariantTitle = (
  variantData: Record<string, unknown>,
  fallback: string,
) => {
  const preferredFields = [
    "title",
    "productSectionTitle",
    "logo",
    "pretitle",
    "desc",
  ];

  for (const field of preferredFields) {
    if (typeof variantData[field] === "string" && variantData[field].trim()) {
      return variantData[field];
    }
  }

  const text = variantData.text;

  return Array.isArray(text) && typeof text[0] === "string" && text[0].trim()
    ? text[0]
    : fallback;
};

export const getCategoryLayoutOptions = (
  category: string,
  sectionType: string,
): CategoryLayoutOption[] => {
  const categorySectionType =
    sectionType === "MarqueeSlide" ? "Marquee" : sectionType;
  const variants = getCategorySectionVariants(category, categorySectionType);

  if (!Object.keys(variants).length) return [];

  return Object.entries(variants)
    .filter(
      ([componentVariant]) =>
        !isCategoryPageComponent(
          category,
          categorySectionType,
          componentVariant,
        ),
    )
    .map(
    ([componentVariant, variantData], index) => {
      const match = componentVariant.match(/(\d+)$/);
      const layoutNumber = match ? Number(match[1]) : index + 1;
      const content = isRecord(variantData) ? variantData : {};

      return {
        id: `${sectionType}-${layoutNumber}`,
        name: getCategoryVariantTitle(content, componentVariant),
        componentVariant,
      };
    },
  );
};

export const getCategoryPageLayoutOptions = (
  category: string,
  sectionType: string,
): CategoryLayoutOption[] =>
  getCategoryPageVariantEntries(category, sectionType).map(
    ({ componentVariant, data }) => ({
      id: componentVariant,
      name: getCategoryVariantTitle(
        data,
        componentVariant,
      ),
      componentVariant,
    }),
  );

export const hasCategoryContent = (category: string) =>
  Boolean(categoryContent.categories[category]);

export const getTemplateIdsForCategory = (category: string) =>
  Object.keys(
    categoryContent.categories[category]?.templateComponents ?? {},
  );

export const getTemplatesForCategory = (category: string) => {
  const categoryRecord = categoryContent.categories[category];

  if (!categoryRecord) return [];

  return Object.entries(categoryRecord.templateComponents).map(
    ([id, definition]) => {
      const components = isTemplateComposition(definition)
        ? Object.fromEntries(
            normalizeTemplatePageComponents(
              definition.pages.home?.components,
            ).map(({ key, component }) => [key, component]),
          )
        : definition;
      const bannerComponent = components.Banner;
      const bannerSection = categoryRecord.sections.Banner;
      const bannerVariants =
        isRecord(bannerSection) && isRecord(bannerSection.variants)
          ? bannerSection.variants
          : {};
      const bannerData =
        bannerComponent && isRecord(bannerVariants[bannerComponent])
          ? bannerVariants[bannerComponent]
          : {};
      const bannerSlides = Array.isArray(bannerData.bannerSlides)
        ? bannerData.bannerSlides
        : [];
      const firstSlide = isRecord(bannerSlides[0]) ? bannerSlides[0] : {}; 
      const image =
        (typeof bannerData.backgroundImage === "string" &&
          bannerData.backgroundImage) ||
        (typeof firstSlide.image === "string" && firstSlide.image) ||
        "/bg1.jpg";

      return {
        id,
        title: getCategoryVariantTitle(
          bannerData,
          bannerComponent ?? `${category} ${id}`,
        ),
        image,
        componentCount: isTemplateComposition(definition)
          ? Object.values(definition.shared).filter(Boolean).length +
            normalizeTemplatePageComponents(
              definition.pages.home?.components,
            ).length
          : Object.values(components).filter(
              (component) => component !== null,
            ).length,
      };
    },
  );
};

export const getTemplateComponentVariant = (
  category: string,
  templateId: string,
  sectionType: string,
): string | null => {
  const sectionKey = sectionType === "MarqueeSlide" ? "Marquee" : sectionType;
  const templateComponents =
    categoryContent.categories[category]?.templateComponents?.[templateId];

  if (!templateComponents) return null;

  if (isTemplateComposition(templateComponents)) {
    const sharedVariant = templateComponents.shared[sectionKey];
    if (sharedVariant !== undefined) return sharedVariant;

    return (
      normalizeTemplatePageComponents(
        templateComponents.pages.home?.components,
      ).find(({ key }) => key === sectionKey)?.component ?? null
    );
  }

  return templateComponents[sectionKey] ?? null;
};

const innerPageKeyBySectionType: Record<string, string> = {
  BlogDetail: "blog-detail",
  Listing: "buy-a-property",
  PropertyDetail: "property-detail",
};

export const getTemplateInnerPageVariant = (
  category: string,
  templateId: string,
  pageKey: string,
): string | null => {
  const definition =
    categoryContent.categories[category]?.templateComponents?.[templateId];

  if (!isTemplateComposition(definition)) return null;

  return (
    normalizeTemplatePageComponents(
      definition.pages[pageKey]?.components,
    )[0]?.component ?? null
  );
};

export const applyTemplateInnerPageComponent = (
  section: SectionItem,
  category: string,
  templateId: string,
): SectionItem => {
  if (!section.page) return section;
  const definition =
    categoryContent.categories[category]?.templateComponents?.[templateId];
  if (isTemplateComposition(definition)) {
    return section;
  }

  const pageKey =
    innerPageKeyBySectionType[section.type] ?? section.page.toLowerCase();
  const componentVariant = getTemplateInnerPageVariant(
    category,
    templateId,
    pageKey,
  );

  if (!componentVariant || componentVariant === section.variant) return section;

  const currentData =
    section.data[componentVariant] ??
    section.data[section.variant] ??
    Object.values(section.data)[0] ??
    {};

  return {
    ...section,
    variant: componentVariant,
    data: {
      ...section.data,
      [componentVariant]: currentData,
    },
  };
};

const getTemplateDataVariant = (
  sectionType: string,
  componentVariant: string,
) => {
  const match = componentVariant.match(/(\d+)$/);

  return match ? `${sectionType}-${match[1]}` : `${sectionType}-1`;
};

export const addableSectionCards = [
  {
    type: "Banner",
    variant: "Banner-1",
    title: "Banner",
    description: "Image hero section",
  },
  {
    type: "About",
    variant: "About-1",
    title: "About",
    description: "Company intro section",
  },
  {
    type: "Product",
    variant: "Product-2",
    title: "Services",
    description: "Service cards section",
  },
  {
    type: "WhyChooseUs",
    variant: "WhyChooseUs-1",
    title: "Why choose us",
    description: "Trust points section",
  },
  {
    type: "Gallery",
    variant: "Gallery-1",
    title: "Gallery",
    description: "Image showcase section",
  },
  {
    type: "FormDetail",
    variant: "FormDetail-1",
    title: "Form",
    description: "Lead detail section",
  },
  {
    type: "FAQ",
    variant: "FAQ-1",
    title: "FAQ",
    description: "Question answer section",
  },
  {
    type: "Testimonial",
    variant: "Testimonial-1",
    title: "Our Clients",
    description: "Client reviews section",
  },
] as const;

const cloneSections = (sections: SectionItem[]) =>
  structuredClone(sections) as SectionItem[];

const applyBannerVariantDefaults = (
  variant: string,
  data: Record<string, unknown>,
) => {
  const sourceImage =
    typeof data.backgroundImage === "string" ? data.backgroundImage : "/bg1.jpg";
  const sourceVideo =
    typeof data.backgroundVideo === "string"
      ? data.backgroundVideo
      : "/video.mp4";
  const sourceSlides = Array.isArray(data.bannerSlides)
    ? data.bannerSlides
    : [];

  if (variant === "Banner-1") {
    return {
      ...data,
      bannerBackgroundMode: data.bannerBackgroundMode ?? "image",
      backgroundImage: sourceImage,
    };
  }

  if (variant === "Banner-2") {
    return {
      ...data,
      bannerBackgroundMode: data.bannerBackgroundMode ?? "video",
      backgroundVideo: sourceVideo,
      backgroundImage: sourceImage,
    };
  }

  if (variant === "Banner-3") {
    return {
      ...data,
      bannerSlides: sourceSlides,
    };
  }

  if (variant === "Banner-4") {
    return {
      ...data,
      bannerSlides: sourceSlides.length
        ? sourceSlides.map((slide) =>
            typeof slide === "object" && slide !== null && !Array.isArray(slide)
              ? {
                  ...slide,
                  image:
                    typeof (slide as { image?: unknown }).image === "string"
                      ? (slide as { image: string }).image
                      : sourceImage,
                  video:
                    typeof (slide as { video?: unknown }).video === "string"
                      ? (slide as { video: string }).video
                      : sourceVideo,
                }
              : slide,
          )
        : [],
    };
  }

  return data;
};

const mergeCategoryData = (
  section: SectionItem,
  category: string,
): SectionItem => {
  const categorySectionType =
    section.type === "MarqueeSlide" ? "Marquee" : section.type;
  const contentSectionType =
    category === "Realestate" && section.type === "City"
      ? "CitiesWeServe"
      : category === "Realestate" &&
          (section.type === "Highlight" || section.type === "Featured")
        ? "Properties"
        : categorySectionType;
  const categorySection =
    categoryContent.categories[category]?.sections?.[contentSectionType] ?? {};
  const nestedVariants = isRecord(categorySection.variants)
    ? categorySection.variants
    : undefined;
  const categorySectionData = Object.fromEntries(
    Object.entries(categorySection).filter(
      ([key]) => key !== "variants",
    ),
  );
  const sectionContent = {
    ...categoryContent.common[section.type],
    ...categorySectionData,
  };

  if (!Object.keys(sectionContent).length && !nestedVariants) {
    return section;
  }

  const categoryVariantKeys = nestedVariants
    ? Object.keys(nestedVariants)
        .filter(
          (categoryVariant) =>
            !isCategoryPageComponent(
              category,
              categorySectionType,
              categoryVariant,
            ),
        )
        .map((categoryVariant, index) => {
          const match = categoryVariant.match(/(\d+)$/);
          const layoutNumber = match ? Number(match[1]) : index + 1;

          return `${section.type}-${layoutNumber}`;
        })
    : [];
  const availableDataVariants = Array.from(
    new Set([...Object.keys(section.data), ...categoryVariantKeys]),
  );
  const nextData = Object.fromEntries(
    availableDataVariants.map((variant) => {
      const baseVariantData =
        section.data[variant] ??
        section.data[section.variant] ??
        Object.values(section.data)[0] ??
        {};
      const categoryVariant = getCategorySectionVariant(
        category,
        contentSectionType,
        variant,
      );
      const variantContent =
        nestedVariants && isRecord(nestedVariants[categoryVariant])
          ? nestedVariants[categoryVariant]
          : {};
      const mergedContent = {
        ...baseVariantData,
        ...sectionContent,
        ...variantContent,
      };

      return [
        variant,
        section.type === "Banner"
          ? applyBannerVariantDefaults(variant, mergedContent)
          : mergedContent,
      ];
    }),
  );

  return { ...section, data: nextData };
};

const createDefaultSectionData = (sectionType: string): Record<string, SectionData> => {
  if (sectionType === "WhyChooseUs") {
    const data: SectionData = {
      pretitle: "Why choose us",
      title: "A better experience from first click.",
      desc: "Use category-specific proof points to help visitors trust your business faster.",
      whyChooseUsItems: [
        {
          title: "Clear guidance",
          desc: "Helpful details and simple next steps for every visitor.",
          stat: "01",
        },
        {
          title: "Trusted process",
          desc: "A focused flow designed around the user decision journey.",
          stat: "02",
        },
        {
          title: "Fast response",
          desc: "Make it easy for people to enquire, compare, and act.",
          stat: "03",
        },
      ],
    };

    return {
      "WhyChooseUs-1": data,
      "WhyChooseUs-2": data,
      "WhyChooseUs-3": data,
      "WhyChooseUs-4": data,
    };
  }

  if (sectionType === "Gallery") {
    const data: SectionData = {
      pretitle: "Gallery",
      title: "Explore the experience",
      desc: "A visual section powered by the selected category media.",
      galleryItems: [
        { image: "/bg1.jpg", alt: "Gallery image one", title: "View one" },
        { image: "/bg2.jpg", alt: "Gallery image two", title: "View two" },
        { image: "/blackbay.png", alt: "Gallery image three", title: "View three" },
        { image: "/shaye.png", alt: "Gallery image four", title: "View four" },
      ],
    };

    return {
      "Gallery-1": data,
      "Gallery-2": data,
      "Gallery-3": data,
      "Gallery-4": data,
      "Gallery-5": data,
      "Gallery-6": data,
    };
  }

  if (sectionType === "FormDetail") {
    const data: SectionData = {
      pretitle: "Contact",
      title: "Tell us what you need.",
      desc: "Capture enquiries with a simple editable form section.",
      formSubmitLabel: "Send enquiry",
      formFields: [
        { label: "Name", type: "text", placeholder: "Your name" },
        { label: "Email", type: "email", placeholder: "you@example.com" },
        { label: "Message", type: "textarea", placeholder: "Tell us what you need" },
      ],
    };

    return {
      "FormDetail-1": data,
      "FormDetail-2": data,
      "FormDetail-3": data,
      "FormDetail-4": data,
    };
  }

  if (sectionType === "FAQ") {
    const data: SectionData = {
      pretitle: "FAQ",
      title: "Frequently asked questions",
      faqItems: [
        {
          question: "How quickly can we start?",
          answer: "You can start as soon as the basic details are ready.",
        },
        {
          question: "Can this content be changed?",
          answer: "Yes, text and media can be customized from the editor data.",
        },
        {
          question: "Does this match the selected category?",
          answer: "Yes, inserted sections merge with the active category JSON.",
        },
      ],
    };

    return {
      "FAQ-1": data,
      "FAQ-2": data,
      "FAQ-3": data,
      "FAQ-4": data,
    };
  }

  if (sectionType === "Testimonial") {
    const data: SectionData = {
      pretitle: "Our clients",
      title: "Trusted by people who care about results.",
      desc: "Use real customer feedback to build trust with new visitors.",
      testimonialItems: [
        {
          name: "Aarav Mehta",
          role: "Founder, Studio North",
          quote:
            "The site made our work easier to understand and brought in better leads within the first week.",
          image: "/bg1.jpg",
          rating: "5.0",
        },
        {
          name: "Neha Kapoor",
          role: "Marketing Lead",
          quote:
            "Clean sections, fast pages, and the editor keeps the content simple for our whole team.",
          image: "/bg2.jpg",
          rating: "4.9",
        },
        {
          name: "Rahul Verma",
          role: "Operations Head",
          quote:
            "We finally have a website that looks premium and still feels practical to update.",
          image: "/blackbay.png",
          rating: "5.0",
        },
        {
          name: "Isha Malhotra",
          role: "Creative Director",
          quote:
            "The layouts gave our brand a sharper story and made every service easier to browse.",
          image: "/shaye.png",
          rating: "4.8",
        },
        {
          name: "Kabir Anand",
          role: "Product Manager",
          quote:
            "We could test different sections quickly without losing the polished look of the page.",
          image: "/stylam.png",
          rating: "4.7",
        },
        {
          name: "Sara Khan",
          role: "Business Owner",
          quote:
            "Visitors understand what we offer faster, and enquiries feel more relevant now.",
          image: "/prod2.jpg",
          rating: "5.0",
        },
      ],
    };

    return {
      "Testimonial-1": data,
      "Testimonial-2": data,
      "Testimonial-3": data,
    };
  }

  return {};
};

export const createAddableSection = (
  sectionType: string,
  category: string,
): SectionItem | null => {
  // Events library cards reuse shared names; map to Events homepage sections.
  const eventsTypeAliases: Record<string, string> = {
    Product: "PopularEvents",
    FormDetail: "Contact",
  };
  const resolvedType =
    category === "Events"
      ? eventsTypeAliases[sectionType] ?? sectionType
      : sectionType;

  const libraryCard = addableSectionCards.find(
    (item) => item.type === sectionType || item.type === resolvedType,
  );
  const categoryVariants = getCategorySectionVariants(category, resolvedType);
  const categoryVariantName = Object.keys(categoryVariants).find(
    (componentVariant) =>
      !isCategoryPageComponent(category, resolvedType, componentVariant),
  );

  if (categoryVariantName) {
    const layoutNumber = categoryVariantName.match(/(\d+)$/)?.[1] ?? "1";
    const variant = `${resolvedType}-${layoutNumber}`;
    const selectedBase = cloneSections(selectedConfig.sections).find(
      (section) => section.type === resolvedType,
    );
    const defaultData = createDefaultSectionData(resolvedType);
    const data =
      selectedBase?.data && Object.keys(selectedBase.data).length
        ? selectedBase.data
        : Object.keys(defaultData).length
          ? defaultData
          : { [variant]: {} };

    return mergeCategoryData(
      {
        type: resolvedType,
        id: `${resolvedType}-${Date.now()}`,
        variant,
        data,
      },
      category,
    );
  }

  const baseSection =
    cloneSections(selectedConfig.sections).find(
      (section) => section.type === resolvedType,
    ) ??
    (libraryCard
      ? {
          type: libraryCard.type,
          variant: libraryCard.variant,
          data: createDefaultSectionData(libraryCard.type),
        }
      : null);

  if (!baseSection || !libraryCard) return null;

  return mergeCategoryData(
    {
      ...baseSection,
      type: resolvedType,
      id: `${resolvedType}-${Date.now()}`,
      variant: libraryCard.variant.startsWith(`${resolvedType}-`)
        ? libraryCard.variant
        : `${resolvedType}-1`,
    },
    category,
  );
};

const withoutVariants = (value: unknown): Record<string, unknown> =>
  isRecord(value)
    ? Object.fromEntries(
        Object.entries(value).filter(([field]) => field !== "variants"),
      )
    : {};

const createCategoryPageSection = ({
  category,
  sectionType,
  pageSlug,
  commonDataKey,
  legacyVariants,
}: {
  category: string;
  sectionType: string;
  pageSlug: string;
  commonDataKey: string;
  legacyVariants: string[];
}): SectionItem => {
  const categorySections =
    categoryContent.categories[category]?.sections ?? {};
  const categorySection = categorySections[sectionType];
  const categoryPageSection = categorySections[`${sectionType}Page`];
  const pageVariantEntries = getCategoryPageVariantEntries(
    category,
    sectionType,
  );
  const pageVariants = Object.fromEntries(
    pageVariantEntries.map(({ componentVariant, data }) => [
      componentVariant,
      data,
    ]),
  );
  const pageLayoutOptions = getCategoryPageLayoutOptions(
    category,
    sectionType,
  );
  const baseData = {
    ...categoryContent.common[commonDataKey],
    ...withoutVariants(categorySection),
    ...withoutVariants(categoryPageSection),
  } as SectionData;
  const categoryPageData = Object.fromEntries(
    pageLayoutOptions.map(({ id }) => {
      const variantData = pageVariants[id];

      return [
        id,
        {
          ...baseData,
          ...(isRecord(variantData) ? variantData : {}),
        } as SectionData,
      ];
    }),
  );
  const legacyData = Object.fromEntries(
    legacyVariants.map((variant) => [variant, baseData]),
  );
  const defaultVariant = pageLayoutOptions[0]?.id ?? legacyVariants[0];

  return {
    id: `${sectionType}Page`,
    page: pageSlug,
    type: sectionType,
    variant: defaultVariant,
    data: {
      ...legacyData,
      ...categoryPageData,
    },
  };
};

export const createAboutPageSection = (category: string): SectionItem =>
  createCategoryPageSection({
    category,
    sectionType: "About",
    pageSlug: "about",
    commonDataKey: "AboutPage",
    legacyVariants: ["AboutPage-1", "AboutPage-2", "AboutPage-3"],
  });

export const createGalleryPageSection = (category: string): SectionItem => {
  const section = createCategoryPageSection({
    category,
    sectionType: "Gallery",
    pageSlug: "gallery",
    commonDataKey: "Gallery",
    legacyVariants: ["GalleryPage-1"],
  });

  if (category !== "Realestate") return section;

  const gallerySection = categoryContent.categories.Realestate?.sections?.Gallery;
  const galleryVariants = isRecord(gallerySection?.variants)
    ? gallerySection.variants
    : {};
  const galleryData = galleryVariants.RealEstateGallery1;
  const baseData = section.data[section.variant] ?? {};

  return {
    ...section,
    variant: "RealEstateGalleryPage1",
    data: {
      ...section.data,
      RealEstateGalleryPage1: {
        ...baseData,
        ...(isRecord(galleryData) ? galleryData : {}),
      },
    },
  };
};

export const createServicePageSection = (category: string): SectionItem =>
  createCategoryPageSection({
    category,
    sectionType: "Service",
    pageSlug: "service",
    commonDataKey: "ServicePage",
    legacyVariants: ["ServicePage-1"],
  });

export const createContactPageSection = (category: string): SectionItem =>
  createCategoryPageSection({
    category,
    sectionType: "Contact",
    pageSlug: "contact",
    commonDataKey: "ContactPage",
    legacyVariants: ["ContactPage-1", "ContactPage-2"],
  });

export const createPrivacyPolicyPageSection = (): SectionItem => ({
  id: "RealEstatePrivacyPolicyPage",
  page: "privacy",
  type: "PrivacyPolicy",
  variant: "RealEstatePrivacyPolicy1",
  data: {
    RealEstatePrivacyPolicy1: {
      ...categoryContent.common.PrivacyPage,
    } as SectionData,
  },
});

export const createTermsConditionsPageSection = (): SectionItem => ({
  id: "RealEstateTermsConditionsPage",
  page: "terms",
  type: "TermsConditions",
  variant: "RealEstateTermsConditions1",
  data: {
    RealEstateTermsConditions1: {
      ...categoryContent.common.TermsPage,
    } as SectionData,
  },
});

export const createDisclaimerPageSection = (): SectionItem => ({
  id: "RealEstateDisclaimerPage",
  page: "disclaimer",
  type: "Disclaimer",
  variant: "RealEstateDisclaimer1",
  data: {
    RealEstateDisclaimer1: {
      ...categoryContent.common.DisclaimerPage,
    } as SectionData,
  },
});

export const createAwardsPageSection = (): SectionItem => ({
  id: "RealEstateAwardsPage",
  page: "awards",
  type: "AwardsPage",
  variant: "RealEstateAwardsPage1",
  data: {
    RealEstateAwardsPage1: {
      ...categoryContent.common.AwardsPage,
    } as SectionData,
  },
});

export const createMissionVisionPageSection = (): SectionItem => ({
  id: "RealEstateMissionVisionPage",
  page: "mission",
  type: "MissionVision",
  variant: "RealEstateMissionVision1",
  data: {
    RealEstateMissionVision1: {
      ...categoryContent.common.MissionPage,
    } as SectionData,
  },
});

export const createCareerPageSection = (): SectionItem => ({
  id: "RealEstateCareerPage",
  page: "careers",
  type: "CareerPage",
  variant: "RealEstateCareerPage1",
  data: {
    RealEstateCareerPage1: {
      ...categoryContent.common.CareerPage,
    } as SectionData,
  },
});

export const createBlogPageSection = (): SectionItem => {
  const blogSection = categoryContent.categories.Realestate?.sections?.Blog;
  const blogVariants = isRecord(blogSection?.variants)
    ? blogSection.variants
    : {};
  const blogData = blogVariants.RealEstateBlog1;

  return {
    id: "RealEstateBlogPage",
    page: "blog",
    type: "BlogPage",
    variant: "RealEstateBlogPage1",
    data: {
      RealEstateBlogPage1: {
        ...(isRecord(blogData) ? blogData : {}),
      } as SectionData,
    },
  };
};

export const createBlogDetailPageSections = (): SectionItem[] => {
  const blogSection = categoryContent.categories.Realestate?.sections?.Blog;
  const blogVariants = isRecord(blogSection?.variants)
    ? blogSection.variants
    : {};
  const blogData = blogVariants.RealEstateBlog1;
  const blogItems = isRecord(blogData) && Array.isArray(blogData.blogItems)
    ? blogData.blogItems
    : [];

  return blogItems.flatMap((item, index) => {
    if (!isRecord(item) || typeof item.href !== "string") return [];
    const pageSlug = item.href
      .split(/[?#]/, 1)[0]
      .replace(/\/+$/, "")
      .split("/")
      .pop();

    if (!pageSlug) return [];

    return [{
      id: `RealEstateBlogDetail-${index + 1}`,
      page: pageSlug,
      type: "BlogDetail",
      variant: "RealEstateBlogDetail1",
      data: {
        RealEstateBlogDetail1: {
          pretitle: "Blog",
          ...item,
          primaryButtonLabel: "Talk to an advisor",
          primaryButtonHref: "/contact",
          secondaryButtonLabel: "All articles",
          secondaryButtonHref: "/blog",
        } as SectionData,
      },
    }];
  });
};

export const createCSRPageSection = (): SectionItem => ({
  id: "RealEstateCSRPage",
  page: "community",
  type: "CSRPage",
  variant: "RealEstateCSRPage1",
  data: {
    RealEstateCSRPage1: {
      ...categoryContent.common.CsrPage,
    } as SectionData,
  },
});

export const createRealEstateContactPageSection = (): SectionItem => {
  const contactSection = categoryContent.categories.Realestate?.sections?.Contact;
  const contactVariants = isRecord(contactSection?.variants)
    ? contactSection.variants
    : {};
  const contactData = contactVariants.RealEstateContact1;
  const footerSection = categoryContent.categories.Realestate?.sections?.Footer;
  const footerVariants = isRecord(footerSection?.variants)
    ? footerSection.variants
    : {};
  const footerData = footerVariants.RealEstateFooter1;
  const footerContact = isRecord(footerData) ? footerData.footerContact : undefined;

  return {
    id: "ContactPage",
    page: "contact",
    type: "ContactPage",
    variant: "RealEstateContactPage1",
    data: {
      RealEstateContactPage1: {
        ...categoryContent.common.ContactPage,
        ...(isRecord(contactData) ? contactData : {}),
        ...(isRecord(footerContact) ? { footerContact } : {}),
      } as SectionData,
    },
  };
};

export const createSitemapPageSection = (): SectionItem => ({
  id: "RealEstateSitemapPage",
  page: "sitemap",
  type: "Sitemap",
  variant: "RealEstateSitemap1",
  data: {
    RealEstateSitemap1: {
      ...categoryContent.common.SitemapPage,
    } as SectionData,
  },
});

export const createCookiePolicyPageSection = (): SectionItem => ({
  id: "RealEstateCookiePolicyPage",
  page: "cookie-policy",
  type: "CookiePolicy",
  variant: "RealEstateCookiePolicy1",
  data: {
    RealEstateCookiePolicy1: {
      ...categoryContent.common.CookiePolicyPage,
    } as SectionData,
  },
});

export const createRefundPolicyPageSection = (): SectionItem => ({
  id: "RealEstateRefundPolicyPage",
  page: "refund-policy",
  type: "RefundPolicy",
  variant: "RealEstateRefundPolicy1",
  data: {
    RealEstateRefundPolicy1: {
      ...categoryContent.common.RefundPolicyPage,
    } as SectionData,
  },
});

export const createAllPropertiesPageSection = (): SectionItem => {
  const propertiesSection =
    categoryContent.categories.Realestate?.sections?.Properties;
  const propertiesVariants = isRecord(propertiesSection?.variants)
    ? propertiesSection.variants
    : {};
  const propertiesData = propertiesVariants.RealEstateProperties1;

  return {
    id: "RealEstateAllPropertiesPage",
    page: "properties",
    type: "Listing",
    variant: "RealEstateProperty1",
    data: {
      RealEstateProperty1: isRecord(propertiesData)
        ? (propertiesData as SectionData)
        : {},
    },
  };
};

export const createPropertyDetailPageSections = (): SectionItem[] => {
  const propertiesSection = categoryContent.categories.Realestate?.sections?.Properties;
  const propertyVariants = isRecord(propertiesSection?.variants)
    ? propertiesSection.variants
    : {};
  const propertiesData = propertyVariants.RealEstateProperties1;
  const listings = isRecord(propertiesData) && Array.isArray(propertiesData.listings)
    ? propertiesData.listings
    : [];

  return listings.flatMap((listing, index) => {
    if (!isRecord(listing)) return [];
    const slug = typeof listing.slug === "string"
      ? listing.slug.trim()
      : "";
    if (!slug) return [];

    return [{
      id: `RealEstatePropertyDetail-${index + 1}`,
      page: slug,
      type: "PropertyDetail",
      variant: "RealEstatePropertyDetail1",
      data: {
        RealEstatePropertyDetail1: {
          ...listing,
        } as SectionData,
      },
    }];
  });
};

export const createProjectDetailPageSections = (): SectionItem[] => {
  const projectsSection =
    categoryContent.categories.Realestate?.sections?.LatestProjects;
  const projectVariants = isRecord(projectsSection?.variants)
    ? projectsSection.variants
    : {};
  const projectsData = projectVariants.RealEstateLatestProjects1;
  const projects =
    isRecord(projectsData) && Array.isArray(projectsData.projectItems)
      ? projectsData.projectItems
      : [];

  return projects.flatMap((project, index) => {
    if (!isRecord(project)) return [];
    const slug = getRecordPageSlug(project, `project-${index + 1}`);
    if (!slug) return [];

    return [
      {
        id: `RealEstateProjectDetail-${index + 1}`,
        page: slug,
        type: "ProjectDetail",
        variant: "RealEstateProjectDetail1",
        data: {
          RealEstateProjectDetail1: {
            ...project,
          } as SectionData,
        },
      },
    ];
  });
};

const toComponentSectionType = (pageLabel: string) =>
  pageLabel
    .trim()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const createCategoryPageFromLabel = (
  category: string,
  pageLabel: string,
): SectionItem | null => {
  const pageSlug = pageLabel.trim().toLowerCase().replace(/\s+/g, "-");
  const requestedSectionType = toComponentSectionType(pageLabel);
  const pageVariantEntries = getCategoryPageVariantEntries(
    category,
    requestedSectionType,
  );

  if (!pageSlug || !requestedSectionType || !pageVariantEntries.length) {
    return null;
  }

  const sectionType = pageVariantEntries[0].sectionType;
  const categorySections =
    categoryContent.categories[category]?.sections ?? {};
  const data = Object.fromEntries(
    pageVariantEntries.map(({ componentVariant, data: variantData, sectionKey }) => [
      componentVariant,
      {
        ...categoryContent.common[`${sectionType}Page`],
        ...categoryContent.common[sectionType],
        ...withoutVariants(categorySections[sectionKey]),
        ...variantData,
      } as SectionData,
    ]),
  );

  return {
    id: `${sectionType}Page`,
    page: pageSlug,
    type: sectionType,
    variant: pageVariantEntries[0].componentVariant,
    data,
  };
};

export const createCategoryPageFromHref = (
  category: string,
  href: string,
): SectionItem | null => {
  const componentRoute = href
    .trim()
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .split(/[?#]/, 1)[0];

  if (
    category === "Realestate" &&
    ["buy-a-property", "rent", "projects", "services"].includes(
      componentRoute.toLowerCase(),
    )
  ) {
    const route = componentRoute.toLowerCase();
    if (route === "services") {
      const serviceSection =
        categoryContent.categories.Realestate?.sections?.Service;
      const serviceVariants = isRecord(serviceSection?.variants)
        ? serviceSection.variants
        : {};
      const serviceData = serviceVariants.RealEstateServicePage1;

      return {
        id: "RealEstateServicePage",
        page: "services",
        type: "Service",
        variant: "RealEstateServicePage1",
        data: {
          RealEstateServicePage1: {
            ...categoryContent.common.ServicePage,
            ...(isRecord(serviceData) ? serviceData : {}),
          } as SectionData,
        },
      };
    }

    const isProjectsPage = route === "projects";
    const isRentPage = componentRoute.toLowerCase() === "rent";
    const section = categoryContent.categories.Realestate?.sections?.[
      isProjectsPage ? "LatestProjects" : "Properties"
    ];
    const variants = isRecord(section?.variants) ? section.variants : {};
    const pageData = isProjectsPage
      ? variants.RealEstateLatestProjects1
      : variants.RealEstateProperties1;
    const variant = isProjectsPage
      ? "RealEstateProject1"
      : isRentPage
        ? "RealEstateRent1"
        : "RealEstateProperty1";

    return {
      id: isProjectsPage
        ? "RealEstateProjectPage"
        : isRentPage
          ? "RealEstateRentPage"
          : "RealEstatePropertyPage",
      page: isProjectsPage ? "projects" : isRentPage ? "rent" : "buy-a-property",
      type: isProjectsPage ? "Projects" : isRentPage ? "Rent" : "Listing",
      variant,
      data: {
        [variant]: isRecord(pageData)
          ? (pageData as SectionData)
          : {},
      },
    };
  }

  const prefix = getCategoryComponentPrefix(category);
  const match = componentRoute.match(
    new RegExp(`^${escapeRegExp(prefix)}(.+)Page\\d+$`, "i"),
  );

  if (!match) return null;

  const pageVariantEntries = getCategoryPageVariantEntries(category, match[1]);
  const targetEntry = pageVariantEntries.find(
    ({ componentVariant }) =>
      componentVariant.toLowerCase() === componentRoute.toLowerCase(),
  );

  if (!targetEntry) return null;

  const pageSection = createCategoryPageFromLabel(
    category,
    targetEntry.sectionType,
  );

  return pageSection
    ? { ...pageSection, variant: targetEntry.componentVariant }
    : null;
};

export const createCustomPageSection = (
  category: string,
  pageLabel: string,
): SectionItem => {
  const pageSlug = pageLabel.trim().toLowerCase().replace(/\s+/g, "-");
  const categoryAboutData = categoryContent.categories[category]?.sections?.About;
  const pageData = {
    ...categoryContent.common.CustomPage,
    ...categoryContent.categories[category]?.sections?.CustomPage,
    sideImage:
      categoryContent.categories[category]?.sections?.CustomPage?.sideImage ??
      categoryAboutData?.sideImage ??
      categoryAboutData?.backgroundImage ??
      categoryContent.common.CustomPage?.sideImage,
    sideImageTitle:
      categoryContent.categories[category]?.sections?.CustomPage?.sideImageTitle ??
      categoryAboutData?.sideImageTitle ??
      categoryAboutData?.backgroundImageTitle ??
      categoryContent.common.CustomPage?.sideImageTitle,
    title: pageLabel,
  } as SectionData;

  return {
    id: `CustomPage-${pageSlug}`,
    page: pageSlug,
    type: "About",
    variant: "AboutPage-2",
    data: {
      "AboutPage-1": pageData,
      "AboutPage-2": pageData,
      "AboutPage-3": pageData,
    },
  };
};

const buildLegacyTemplateSections = (
  category: string,
  templateComponents: TemplateComponentMap,
  idPrefix: string = "home",
) => {
  const baseSections = cloneSections(selectedConfig.sections);
  return Object.entries(templateComponents).flatMap(
    ([componentSectionType, componentVariant]) => {
      if (componentVariant === null) return [];

      const sectionType =
        componentSectionType === "Marquee"
          ? "MarqueeSlide"
          : componentSectionType;
      const section =
        baseSections.find((item) => item.type === sectionType) ?? {
          type: sectionType,
          variant: `${sectionType}-1`,
          data: createDefaultSectionData(sectionType),
        };
      const variant = getTemplateDataVariant(sectionType, componentVariant);

      return [
        mergeCategoryData(
          {
            ...section,
            id: section.id ?? `${idPrefix}-${sectionType}`,
            variant,
          },
          category,
        ),
      ];
    },
  );
};

const getRealEstateInnerPageSources = (): SectionItem[] => [
  createAboutPageSection("Realestate"),
  createPrivacyPolicyPageSection(),
  createTermsConditionsPageSection(),
  createDisclaimerPageSection(),
  createAwardsPageSection(),
  createMissionVisionPageSection(),
  createCareerPageSection(),
  createBlogPageSection(),
  ...createBlogDetailPageSections(),
  createCSRPageSection(),
  createRealEstateContactPageSection(),
  createSitemapPageSection(),
  createCookiePolicyPageSection(),
  createRefundPolicyPageSection(),
  createAllPropertiesPageSection(),
  ...createPropertyDetailPageSections(),
  ...createProjectDetailPageSections(),
  createGalleryPageSection("Realestate"),
  ...[
    "buy-a-property",
    "rent",
    "projects",
    "services",
  ].flatMap((href) => {
    const section = createCategoryPageFromHref("Realestate", href);
    return section ? [section] : [];
  }),
];

const composePageSection = (
  source: SectionItem,
  pageKey: string,
  component: TemplatePageComponent,
  duplicateIndex: number,
): SectionItem => {
  const sourceData =
    source.data[source.variant] ??
    Object.values(source.data)[0] ??
    {};
  const adapter = pageComponentAdapters[component.component];
  const data = adapter
    ? {
        ...sourceData,
        hiddenSubsections: getHiddenSubsectionsForAdapter(adapter),
      }
    : sourceData;

  return {
    ...source,
    id: `${source.id ?? source.type}-${component.key}-${duplicateIndex + 1}`,
    type: component.key,
    variant: component.component,
    data: {
      [component.component]: data,
    },
    page: source.page ?? (pageKey === "home" ? undefined : pageKey),
  };
};

const getStandalonePageComponentData = (
  category: string,
  component: TemplatePageComponent,
) => {
  const categorySections =
    categoryContent.categories[category]?.sections ?? {};
  const preferredSection = categorySections[component.key];
  const preferredVariants =
    isRecord(preferredSection) && isRecord(preferredSection.variants)
      ? preferredSection.variants
      : {};
  const preferredData = preferredVariants[component.component];
  if (isRecord(preferredData)) return preferredData;

  for (const section of Object.values(categorySections)) {
    if (!isRecord(section) || !isRecord(section.variants)) continue;
    const variantData = section.variants[component.component];
    if (isRecord(variantData)) return variantData;
  }

  return {
    ...categoryContent.common[component.key],
  };
};

const createStandalonePageSection = (
  category: string,
  pageKey: string,
  component: TemplatePageComponent,
  dataOverride?: Record<string, unknown>,
  expansionIndex: number = 0,
): SectionItem => {
  const reusableDefaults =
    component.component === "EventsSupportPage1"
      ? getSupportPageReusableDefaults(category)
      : {};

  return {
    id: `${pageKey}-${component.key}-${expansionIndex + 1}`,
    page: pageKey,
    type: component.key,
    variant: component.component,
    data: {
      [component.component]: {
        ...reusableDefaults,
        ...getStandalonePageComponentData(category, component),
        ...dataOverride,
      },
    },
  };
};

const getGenericExpansionRecords = (
  category: string,
  field: TemplatePageDefinition["expand"],
  sectionKey?: string,
  variantKey?: string,
) => {
  if (!field) return [];
  const sections = categoryContent.categories[category]?.sections ?? {};
  const sectionEntries =
    sectionKey && isRecord(sections[sectionKey])
      ? [[sectionKey, sections[sectionKey]] as const]
      : Object.entries(sections);

  for (const [, section] of sectionEntries) {
    if (!isRecord(section) || !isRecord(section.variants)) continue;
    const variantEntries =
      variantKey && isRecord(section.variants[variantKey])
        ? [[variantKey, section.variants[variantKey]] as const]
        : Object.entries(section.variants);
    for (const [, variantData] of variantEntries) {
      if (!isRecord(variantData) || !Array.isArray(variantData[field])) {
        continue;
      }

      return variantData[field].filter(isRecord);
    }
  }

  return [];
};

const getRecordPageSlug = (
  record: Record<string, unknown>,
  fallback: string,
) => {
  if (typeof record.slug === "string" && record.slug.trim()) {
    return record.slug.trim();
  }
  if (typeof record.id === "string" && record.id.trim()) {
    return record.id.trim();
  }
  const href =
    typeof record.href === "string"
      ? record.href
      : typeof record.link === "string"
        ? record.link
        : undefined;
  if (href) {
    const slug = href
      .split(/[?#]/, 1)[0]
      .replace(/\/+$/, "")
      .split("/")
      .pop();
    if (slug) return slug;
  }

  return fallback;
};

const getCareersRoleExpansionDefaults = (
  category: string,
  variantKey?: string,
) => {
  const careersSection = categoryContent.categories[category]?.sections?.Careers;
  const variants =
    isRecord(careersSection?.variants) ? careersSection.variants : {};
  const variantData =
    variantKey && isRecord(variants[variantKey])
      ? variants[variantKey]
      : Object.values(variants).find(isRecord);

  if (!isRecord(variantData)) return {};

  return {
    backgroundImage: variantData.backgroundImage,
    breadcrumb: variantData.breadcrumb,
    applyForm: variantData.applyForm,
    whyJoinUs: variantData.whyJoinUs,
  };
};

const getSupportPageReusableDefaults = (category: string) => {
  const sections = categoryContent.categories[category]?.sections ?? {};
  const contactVariants =
    isRecord(sections.Contact) && isRecord(sections.Contact.variants)
      ? sections.Contact.variants
      : {};
  const contactData =
    (isRecord(contactVariants.EventsContactPage1)
      ? contactVariants.EventsContactPage1
      : Object.values(contactVariants).find(isRecord)) ?? {};
  const faqVariants =
    isRecord(sections.FAQ) && isRecord(sections.FAQ.variants)
      ? sections.FAQ.variants
      : {};
  const faqData =
    (isRecord(faqVariants.EventsFAQ1)
      ? faqVariants.EventsFAQ1
      : Object.values(faqVariants).find(isRecord)) ?? {};

  return {
    ...(Array.isArray(contactData.contactItems)
      ? { contactItems: contactData.contactItems }
      : {}),
    ...(typeof contactData.description === "string"
      ? { contactDescription: contactData.description }
      : typeof contactData.desc === "string"
        ? { contactDescription: contactData.desc }
        : {}),
    ...(Array.isArray(faqData.faqItems) ? { faqItems: faqData.faqItems } : {}),
  };
};

export const resolveTemplateSections = (
  category: string,
  templateId: string,
): SectionItem[] => {
  const definition =
    categoryContent.categories[category]?.templateComponents?.[templateId];

  if (!definition) return [];

  if (!isTemplateComposition(definition)) {
    const sections = buildLegacyTemplateSections(category, definition);
    const contentSections = sections.filter(
      (section) => section.type !== "Footer",
    );
    const pageSections =
      category === "Realestate"
        ? [
            ...contentSections,
            ...getRealEstateInnerPageSources(),
          ]
        : contentSections;

    return [
      ...pageSections,
      ...sections.filter((section) => section.type === "Footer"),
    ];
  }

  const sharedSections = buildLegacyTemplateSections(
    category,
    definition.shared,
    "shared",
  );
  const headerSections = sharedSections.filter(
    (section) => section.type !== "Footer",
  );
  const footerSections = sharedSections.filter(
    (section) => section.type === "Footer",
  );
  const homeComponents = normalizeTemplatePageComponents(
    definition.pages.home?.components,
  );
  const homeSections = homeComponents.flatMap((component) => {
    const componentVariant = component.component;
    const sectionType =
      component.key === "Marquee" ? "MarqueeSlide" : component.key;
    const baseSection =
      cloneSections(selectedConfig.sections).find(
        (section) => section.type === sectionType,
      ) ?? {
        type: sectionType,
        variant: `${sectionType}-1`,
        data: createDefaultSectionData(sectionType),
      };
    const variant = getTemplateDataVariant(sectionType, componentVariant);

    return [
      mergeCategoryData(
        {
          ...baseSection,
          id: `home-${component.key}`,
          variant,
        },
        category,
      ),
    ];
  });
  const pageSources =
    category === "Realestate" ? getRealEstateInnerPageSources() : [];
  const innerPageSections = Object.entries(definition.pages).flatMap(
    ([pageKey, rawPage]) => {
      if (pageKey === "home" || !isRecord(rawPage)) return [];

      const components = normalizeTemplatePageComponents(rawPage.components);
      if (!components.length) return [];

      const matchingSources = pageSources.filter((source) => {
        if (rawPage.expand === "blogItems") {
          return source.type === "BlogDetail";
        }
        if (rawPage.expand === "propertyListings") {
          return source.type === "PropertyDetail";
        }
        return source.page === pageKey;
      });

      if (!matchingSources.length) {
        const expansionRecords = getGenericExpansionRecords(
          category,
          rawPage.expand,
          typeof rawPage.expandSection === "string"
            ? rawPage.expandSection
            : undefined,
          typeof rawPage.expandVariant === "string"
            ? rawPage.expandVariant
            : undefined,
        );
        if (rawPage.expand && expansionRecords.length) {
          const careersDefaults =
            rawPage.expand === "roles"
              ? getCareersRoleExpansionDefaults(
                  category,
                  typeof rawPage.expandVariant === "string"
                    ? rawPage.expandVariant
                    : undefined,
                )
              : undefined;

          return expansionRecords.flatMap((record, recordIndex) => {
            const expandedPage = getRecordPageSlug(
              record,
              `${pageKey}-${recordIndex + 1}`,
            );
            return components.map((component) =>
              createStandalonePageSection(
                category,
                expandedPage,
                component,
                {
                  ...(careersDefaults ?? {}),
                  ...record,
                },
                recordIndex,
              ),
            );
          });
        }

        return components.map((component) =>
          createStandalonePageSection(category, pageKey, component),
        );
      }

      return matchingSources.flatMap((source, sourceIndex) =>
        components.map((component) =>
          composePageSection(
            source,
            pageKey,
            component,
            sourceIndex,
          ),
        ),
      );
    },
  );

  return [
    ...headerSections,
    ...homeSections,
    ...innerPageSections,
    ...footerSections,
  ];
};

export const buildSelectedConfig = (
  templateId?: string | null,
  category: string = "Realestate",
): SelectedConfig => {
  const templateIds = getTemplateIdsForCategory(category);
  const selectedTemplateId =
    (templateId && templateIds.includes(templateId) && templateId) ||
    templateIds[0] ||
    "template-1";
  const orderedSections = resolveTemplateSections(
    category,
    selectedTemplateId,
  );

  return {
    templateId: selectedTemplateId,
    sections: orderedSections,
  };
};
