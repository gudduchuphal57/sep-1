"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { generalSansMedium } from "@/app/fonts";
import {
  buildSelectedConfig,
  createAddableSection,
  createCategoryPageFromLabel,
  createCategoryPageFromHref,
  createCustomPageSection,
} from "./src/data/templateFlow";
import {
  getPageVariantForSlug,
  sectionMatchesPageRoute,
} from "./src/lib/pageVariantRouting";
import { getSectionComponent } from "./src/lib/sectionRegistry";
import { toSubsectionOrder } from "./src/lib/subsectionOrder";

import EditableSection from "./src/components/builder/EditableSection";
import type { EditorSubsectionScope } from "./src/components/builder/EditableSection";
import EditSectionModal from "./src/components/builder/EditSectionModal";
import { usePreview } from "./src/components/context/PreviewContext";

import { SectionData, SectionItem } from "./src/types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const formatSectionName = (sectionType: string) =>
  sectionType.charAt(0).toUpperCase() + sectionType.slice(1);

const createPageSlug = (label: string) =>
  label.trim().toLowerCase().replace(/\s+/g, "-");

type EditorPageLink = {
  label: string;
  href: string;
  children?: EditorPageLink[];
};

const flattenPageLinks = (links: EditorPageLink[]) => {
  const flattened: EditorPageLink[] = [];

  links.forEach((link) => {
    flattened.push(link);

    if (link.children?.length) {
      flattened.push(...flattenPageLinks(link.children));
    }
  });

  return flattened;
};

const getPublishBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_PUBLISH_BASE_URL;

  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/$/, "");

  if (
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname)
  ) {
    return window.location.origin;
  }

  return "https://preview.cssfounder.com";
};

const lockedSectionTypes = new Set(["Topbar", "Header", "Footer"]);

const isLockedSection = (section?: SectionItem) =>
  Boolean(section && lockedSectionTypes.has(section.type));

const propertyCardSharedFields = new Set([
  "image",
  "alt",
  "title",
  "subtitle",
  "description",
  "price",
  "location",
  "category",
  "propertyType",
  "statusText",
  "features",
  "slug",
  "href",
]);

const getPropertyCardData = (listing: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(listing).filter(([field]) =>
      propertyCardSharedFields.has(field),
    ),
  ) as SectionData;

const projectCardSharedFields = new Set([
  "image",
  "alt",
  "title",
  "desc",
  "description",
  "location",
  "category",
  "status",
  "statusText",
  "slug",
  "href",
]);

const getProjectCardData = (project: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(project).filter(([field]) =>
      projectCardSharedFields.has(field),
    ),
  ) as SectionData;

const addCustomPageSectionsForLinks = (
  sections: SectionItem[],
  category: string,
  pageLinks: EditorPageLink[],
) => {
  const uniqueLinks = Array.from(
    new Map(flattenPageLinks(pageLinks).map((link) => [link.href, link])).values(),
  );

  return uniqueLinks.reduce((nextSections, link) => {
    const linkedPage = createCategoryPageFromHref(category, link.href);
    const pageSlug = linkedPage?.page ?? createPageSlug(link.label);

    if (
      !pageSlug ||
      pageSlug === "home" ||
      nextSections.some((section) => section.page?.toLowerCase() === pageSlug)
    ) {
      return nextSections;
    }

    const pageSection =
      linkedPage ??
      createCategoryPageFromLabel(category, link.label) ??
      createCustomPageSection(category, link.label);
    const footerIndex = nextSections.findIndex(
      (section) => section.type === "Footer",
    );

    if (footerIndex === -1) return [...nextSections, pageSection];

    return [
      ...nextSections.slice(0, footerIndex),
      pageSection,
      ...nextSections.slice(footerIndex),
    ];
  }, sections);
};

const areMenusEqual = (
  currentMenu: { label: string; href: string; children?: { label: string; href: string }[] }[] = [],
  nextMenu: { label: string; href: string; children?: { label: string; href: string }[] }[],
): boolean =>
  currentMenu.length === nextMenu.length &&
  currentMenu.every(
    (item, index) =>
      item.label === nextMenu[index]?.label &&
      item.href === nextMenu[index]?.href &&
      areMenusEqual(item.children, nextMenu[index]?.children ?? []),
  );

const replaceFirstTextValue = (
  value: unknown,
  oldText: string,
  newText: string,
): { value: unknown; replaced: boolean } => {
  if (typeof value === "string") {
    return value.trim() === oldText.trim()
      ? { value: newText, replaced: true }
      : { value, replaced: false };
  }

  if (Array.isArray(value)) {
    let replaced = false;
    const nextValue = value.map((item) => {
      if (replaced) return item;

      const result = replaceFirstTextValue(item, oldText, newText);
      replaced = result.replaced;

      return result.value;
    });

    return { value: nextValue, replaced };
  }

  if (isRecord(value)) {
    let replaced = false;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (replaced) return [key, item];

        const result = replaceFirstTextValue(item, oldText, newText);
        replaced = result.replaced;

        return [key, result.value];
      }),
    );

    return { value: nextValue, replaced };
  }

  return { value, replaced: false };
};

const replaceFirstMediaValue = (
  value: unknown,
  oldSrc: string,
  newSrc: string,
  mediaType: "image" | "video",
  fileName: string,
): { value: unknown; replaced: boolean } => {
  if (typeof value === "string") {
    return value === oldSrc
      ? { value: newSrc, replaced: true }
      : { value, replaced: false };
  }

  if (Array.isArray(value)) {
    let replaced = false;
    const nextValue = value.map((item) => {
      if (replaced) return item;

      const result = replaceFirstMediaValue(
        item,
        oldSrc,
        newSrc,
        mediaType,
        fileName,
      );
      replaced = result.replaced;

      return result.value;
    });

    return { value: nextValue, replaced };
  }

  if (isRecord(value)) {
    let replaced = false;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (replaced) return [key, item];

        const result = replaceFirstMediaValue(
          item,
          oldSrc,
          newSrc,
          mediaType,
          fileName,
        );
        replaced = result.replaced;

        return [key, result.value];
      }),
    );

    if (replaced && mediaType === "image") {
      if ("backgroundImageTitle" in nextValue) {
        nextValue.backgroundImageTitle = fileName;
      }
      if ("sideImageTitle" in nextValue) {
        nextValue.sideImageTitle = fileName;
      }
      if ("alt" in nextValue && !nextValue.alt) {
        nextValue.alt = fileName;
      }
    }

    return { value: nextValue, replaced };
  }

  return { value, replaced: false };
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EditorLayoutPage />
    </Suspense>
  );
}

function EditorLayoutPage() {
  const searchParams = useSearchParams();
  const { currentPage, pageLinks, setCurrentPage, setPageLinks } = usePreview();
  const templateId = searchParams.get("templateId") ?? "template-1";
  const category = searchParams.get("category") ?? "Realestate";
  const page = currentPage || searchParams.get("page") || "home";
  const initialConfig = useMemo(
    () => buildSelectedConfig(templateId, category),
    [templateId, category],
  );

  useEffect(() => {
    setCurrentPage("Home");
  }, [category, setCurrentPage, templateId]);

  useEffect(() => {
    const headerSection = initialConfig.sections.find(
      (section) => section.type === "Header",
    );
    const headerData = headerSection?.data?.[headerSection.variant];
    const categoryPageLinks = headerData?.menu;

    if (!Array.isArray(categoryPageLinks) || !categoryPageLinks.length) return;

    setPageLinks(categoryPageLinks);
  }, [initialConfig.sections, setPageLinks]);

  return (
    <EditorPage
      key={`${templateId}-${category}`}
      initialSections={initialConfig.sections}
      category={category}
      page={page}
      templateId={templateId}
      pageLinks={pageLinks}
    />
  );
}

function EditorPage({
  initialSections,
  category,
  page,
  templateId,
  pageLinks,
}: {
  initialSections: SectionItem[];
  category: string;
  page: string;
  templateId: string;
  pageLinks: EditorPageLink[];
}) {
  const [sections, setSections] = useState<SectionItem[]>(() =>
    addCustomPageSectionsForLinks(
      initialSections.map((section) => ({
        ...section,
        id: section.id ?? section.type,
      })),
      category,
      pageLinks,
    ),
  );

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSubsection, setEditingSubsection] =
    useState<EditorSubsectionScope | null>(null);
  const [savedToastSection, setSavedToastSection] = useState<string | null>(
    null,
  );
  const [inlineUpdateToast, setInlineUpdateToast] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!savedToastSection) return;

    const timeout = window.setTimeout(() => {
      setSavedToastSection(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [savedToastSection]);

  useEffect(() => {
    if (!inlineUpdateToast) return;

    const timeout = window.setTimeout(() => {
      setInlineUpdateToast(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [inlineUpdateToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSections((prevSections) =>
        addCustomPageSectionsForLinks(
          prevSections,
          category,
          pageLinks,
        ),
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [category, pageLinks]);

  useEffect(() => {
    const handlePageAdded = (event: Event) => {
      const detail = (event as CustomEvent<{ label?: string }>).detail;
      const label = detail?.label?.trim();

      if (!label) return;

      const pageSlug = createPageSlug(label);

      setSections((prevSections) => {
        if (
          prevSections.some(
            (section) => section.page?.toLowerCase() === pageSlug,
          )
        ) {
          return prevSections;
        }

        const customPageSection = createCustomPageSection(category, label);
        const footerIndex = prevSections.findIndex(
          (section) => section.type === "Footer",
        );

        if (footerIndex === -1) return [...prevSections, customPageSection];

        return [
          ...prevSections.slice(0, footerIndex),
          customPageSection,
          ...prevSections.slice(footerIndex),
        ];
      });
    };

    window.addEventListener("ai-builder-page-added", handlePageAdded);

    return () => {
      window.removeEventListener("ai-builder-page-added", handlePageAdded);
    };
  }, [category]);

  const updateSectionVariant = (sectionId: string, variant: string) => {
    setSections((prev) =>
      prev.map((section) =>
        (section.id ?? section.type) === sectionId
          ? { ...section, variant }
          : section,
      ),
    );
  };

  const updateSectionData = (
    sectionId: string,
    newData: Record<string, SectionData>,
  ) => {
    setSections((prev) => {
      const targetSection = prev.find(
        (section) => (section.id ?? section.type) === sectionId,
      );
      let nextSections = prev.map((section) =>
        (section.id ?? section.type) === sectionId
          ? { ...section, data: { ...section.data, ...newData } }
          : section,
      );

      const isPropertyCatalog = ["listing", "rent", "propertycatalog"].includes(
        targetSection?.type.toLowerCase() ?? "",
      );
      const isProjectCatalog = [
        "projects",
        "projectcatalog",
        "latestprojects",
      ].includes(targetSection?.type.toLowerCase() ?? "");

      if (isProjectCatalog && targetSection) {
        const updatedVariantData =
          newData[targetSection.variant] ??
          Object.values(newData).find(
            (value) => isRecord(value) && Array.isArray(value.projectItems),
          );
        const projects = updatedVariantData?.projectItems;

        if (Array.isArray(projects)) {
          projects.forEach((project, projectIndex) => {
            if (!isRecord(project)) return;
            const hrefSlug =
              typeof project.href === "string"
                ? project.href
                    .split(/[?#]/, 1)[0]
                    .replace(/\/+$/, "")
                    .split("/")
                    .pop() ?? ""
                : "";
            const slug =
              typeof project.slug === "string" && project.slug.trim()
                ? project.slug.trim()
                : hrefSlug || `project-${projectIndex + 1}`;
            const existingDetailIndex = nextSections.findIndex(
              (section) =>
                ["ProjectOverview", "ProjectDetail"].includes(section.type) &&
                section.page?.toLowerCase() === slug.toLowerCase(),
            );

            if (existingDetailIndex >= 0) {
              const detailSection = nextSections[existingDetailIndex];
              const detailData =
                detailSection.data[detailSection.variant] ??
                detailSection.data.RealEstateProjectDetail1 ??
                {};
              nextSections = nextSections.map((section, index) =>
                index === existingDetailIndex
                  ? {
                      ...detailSection,
                      data: {
                        ...detailSection.data,
                        [detailSection.variant]: {
                          ...detailData,
                          ...getProjectCardData(project),
                        },
                      },
                    }
                  : section,
              );
              return;
            }

            const detailSection: SectionItem = {
              id: `RealEstateProjectDetail-${slug}`,
              page: slug,
              type: "ProjectOverview",
              variant: "RealEstateProjectDetail1",
              data: {
                RealEstateProjectDetail1: {
                  ...project,
                  slug,
                } as SectionData,
              },
            };
            const footerIndex = nextSections.findIndex(
              (section) => section.type === "Footer",
            );
            nextSections =
              footerIndex < 0
                ? [...nextSections, detailSection]
                : [
                    ...nextSections.slice(0, footerIndex),
                    detailSection,
                    ...nextSections.slice(footerIndex),
                  ];
          });
        }

        return nextSections;
      }

      if (!isPropertyCatalog || !targetSection) return nextSections;

      const updatedVariantData =
        newData[targetSection.variant] ??
        Object.values(newData).find(
          (value) => isRecord(value) && Array.isArray(value.listings),
        );
      const listings = updatedVariantData?.listings;
      if (!Array.isArray(listings)) return nextSections;

      listings.forEach((listing) => {
        if (!isRecord(listing)) return;
        const slug =
          typeof listing.slug === "string" ? listing.slug.trim() : "";
        if (!slug) return;

        const existingDetailIndex = nextSections.findIndex(
          (section) =>
            section.type === "PropertyDetail" &&
            section.page?.toLowerCase() === slug.toLowerCase(),
        );

        if (existingDetailIndex >= 0) {
          const detailSection = nextSections[existingDetailIndex];
          const detailData =
            detailSection.data[detailSection.variant] ??
            detailSection.data.RealEstatePropertyDetail1 ??
            {};
          nextSections = nextSections.map((section, index) =>
            index === existingDetailIndex
              ? {
                  ...detailSection,
                  data: {
                    ...detailSection.data,
                    [detailSection.variant]: {
                      ...detailData,
                      ...getPropertyCardData(listing),
                    },
                  },
                }
              : section,
          );
          return;
        }

        const detailSection: SectionItem = {
          id: `RealEstatePropertyDetail-${slug}`,
          page: slug,
          type: "PropertyDetail",
          variant: "RealEstatePropertyDetail1",
          data: {
            RealEstatePropertyDetail1: { ...listing } as SectionData,
          },
        };
        const footerIndex = nextSections.findIndex(
          (section) => section.type === "Footer",
        );
        nextSections =
          footerIndex < 0
            ? [...nextSections, detailSection]
            : [
                ...nextSections.slice(0, footerIndex),
                detailSection,
                ...nextSections.slice(footerIndex),
              ];
      });

      return nextSections;
    });
  };

  const updateInlineText = (
    sectionId: string,
    variant: string,
    sectionType: string,
    oldText: string,
    newText: string,
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if ((section.id ?? section.type) !== sectionId) return section;

        const activeData = section.data[variant];
        if (!activeData) return section;

        const result = replaceFirstTextValue(activeData, oldText, newText);

        if (!result.replaced || !isRecord(result.value)) return section;

        return {
          ...section,
          data: {
            ...section.data,
            [variant]: result.value as SectionData,
          },
        };
      }),
    );
    setInlineUpdateToast(`${formatSectionName(sectionType)} Content - Updated`);
  };

  const updateInlineMedia = (
    sectionId: string,
    variant: string,
    sectionType: string,
    oldSrc: string,
    newSrc: string,
    mediaType: "image" | "video",
    fileName: string,
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if ((section.id ?? section.type) !== sectionId) return section;

        const activeData = section.data[variant];
        if (!activeData) return section;

        const result = replaceFirstMediaValue(
          activeData,
          oldSrc,
          newSrc,
          mediaType,
          fileName,
        );

        if (!result.replaced || !isRecord(result.value)) return section;

        return {
          ...section,
          data: {
            ...section.data,
            [variant]: result.value as SectionData,
          },
        };
      }),
    );
    setInlineUpdateToast(
      `${formatSectionName(sectionType)} ${mediaType === "video" ? "Video" : "Image"
      } - Updated`,
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.filter((section) => (section.id ?? section.type) !== sectionId)
    );

    setEditingSection(null);
  };

  const addSectionAfter = (afterSectionId: string, sectionType: string) => {
    const nextSection = createAddableSection(sectionType, category);
    if (!nextSection) return;
    const pageSlug = createPageSlug(page);
    const scopedNextSection =
      pageSlug && pageSlug !== "home"
        ? { ...nextSection, page: pageSlug }
        : nextSection;

    setSections((prevSections) => {
      const targetIndex = prevSections.findIndex(
        (section) => (section.id ?? section.type) === afterSectionId,
      );
      const footerIndex = prevSections.findIndex(
        (section) => section.type === "Footer",
      );

      let insertAt =
        targetIndex === -1 ? prevSections.length : targetIndex + 1;

      // Never place newly added sections below the footer.
      if (footerIndex !== -1 && insertAt > footerIndex) {
        insertAt = footerIndex;
      }

      return [
        ...prevSections.slice(0, insertAt),
        scopedNextSection,
        ...prevSections.slice(insertAt),
      ];
    });
  };

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    setSections((prevSections) => {
      const currentIndex = prevSections.findIndex(
        (section) => (section.id ?? section.type) === sectionId,
      );
      const targetIndex = currentIndex + direction;

      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= prevSections.length ||
        isLockedSection(prevSections[currentIndex]) ||
        isLockedSection(prevSections[targetIndex])
      ) {
        return prevSections;
      }

      const nextSections = [...prevSections];
      [nextSections[currentIndex], nextSections[targetIndex]] = [
        nextSections[targetIndex],
        nextSections[currentIndex],
      ];

      return nextSections;
    });
  };

  const handleSectionSave = (sectionType: string) => {
    setEditingSection(null);
    setSavedToastSection(sectionType);
  };
  const syncedSections = useMemo(
    () =>
      sections.map((section) => {
        if (section.type !== "Header") return section;

        const activeVariant = section.variant;
        const activeData = section.data[activeVariant];

        if (!activeData || areMenusEqual(activeData.menu, pageLinks)) {
          return section;
        }

        return {
          ...section,
          data: {
            ...section.data,
            [activeVariant]: {
              ...activeData,
              menu: pageLinks,
            },
          },
        };
      }),
    [pageLinks, sections],
  );

  useEffect(() => {
    const createFallbackPublishedId = () =>
      `${templateId}-${category}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const handlePublishRequest = async () => {
      const publishedPayload = {
        templateId,
        category,
        pageLinks,
        sections: syncedSections,
      };

      try {
        const response = await fetch("/api/publish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(publishedPayload),
        });

        if (!response.ok) {
          throw new Error("Publish request failed");
        }

        const result = (await response.json()) as {
          id?: string;
          path?: string;
          url?: string;
        };
        const publishedPath = result.path ?? `/published/${result.id}`;
        const publishedUrl =
          result.url ?? `${window.location.origin}${publishedPath}`;

        window.dispatchEvent(
          new CustomEvent("ai-builder-published", {
            detail: {
              id: result.id,
              url: publishedUrl,
            },
          }),
        );

        return;
      } catch (error) {
        console.error("Server publish failed, using local fallback", error);
      }

      const fallbackId = createFallbackPublishedId();

      window.localStorage.setItem(
        `ai-builder-published-site-${fallbackId}`,
        JSON.stringify({
          ...publishedPayload,
          id: fallbackId,
          publishedAt: new Date().toISOString(),
        }),
      );

      window.dispatchEvent(
        new CustomEvent("ai-builder-published", {
          detail: {
            id: fallbackId,
            url: `${getPublishBaseUrl()}/published/${fallbackId}`,
          },
        }),
      );
    };

    window.addEventListener("ai-builder-publish-request", handlePublishRequest);

    return () => {
      window.removeEventListener(
        "ai-builder-publish-request",
        handlePublishRequest,
      );
    };
  }, [category, pageLinks, syncedSections, templateId]);

  const editingSectionItem = syncedSections.find(
    (section) => (section.id ?? section.type) === editingSection,
  );
  const footerSection = syncedSections.find(
    (section) => section.type === "Footer",
  );
  const footerVariantData = footerSection
    ? footerSection.data?.[footerSection.variant] ??
    footerSection.data?.["Footer-1"]
    : undefined;
  const footerData = isRecord(footerVariantData)
    ? (footerVariantData as SectionData)
    : undefined;
  const whatsappLink = footerData?.whatsappLink;
  const callLink = footerData?.callLink;
  const currentPageSlug = createPageSlug(page);
  const pageShellSectionTypes = ["Topbar", "Header", "Footer"];
  const visibleSections =
    currentPageSlug && currentPageSlug !== "home"
      ? syncedSections.filter(
        (section) =>
          pageShellSectionTypes.includes(section.type) ||
          sectionMatchesPageRoute(section, currentPageSlug),
      )
      : syncedSections.filter((section) => !section.page);
  const scrollToTopbar = () => {
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-template-scroll]",
    );

    if (
      scrollContainer &&
      scrollContainer.scrollHeight > scrollContainer.clientHeight + 1
    ) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      data-template-navigation
      data-template-id={templateId}
      data-template-category={category}
      className={`${
        category === "Realestate" && templateId === "template-1"
          ? generalSansMedium.className
          : ""
      } editor-smooth-surface w-full max-w-full overflow-x-clip [overflow-wrap:anywhere]`}
    >
      {visibleSections.map((section) => {
        const activeVariant =
          getPageVariantForSlug(section, currentPageSlug) ?? section.variant;
        const sectionId = section.id ?? section.type;
        const sectionIndex = visibleSections.findIndex(
          (item) => (item.id ?? item.type) === sectionId,
        );
        const previousSection = visibleSections[sectionIndex - 1];
        const nextSection = visibleSections[sectionIndex + 1];
        const canMoveUp =
          Boolean(previousSection) &&
          !isLockedSection(section) &&
          !isLockedSection(previousSection);
        const canMoveDown =
          Boolean(nextSection) &&
          !isLockedSection(section) &&
          !isLockedSection(nextSection);
        const Component = getSectionComponent(
          category,
          section.type,
          activeVariant,
        );
        const defaultVariant = `${section.type}-1`;
        const variantData =
          section.data?.[activeVariant] ?? section.data?.[defaultVariant];

        const sectionData = (
          isRecord(variantData) ? variantData : section.data
        ) as SectionData;
        const stickyMode =
          section.type === "Header"
            ? (sectionData.headerType ?? "scroll")
            : section.type === "Topbar"
              ? (sectionData.topbarType ?? "scroll")
              : "scroll";

        if (!Component) return null;

        return (
          <EditableSection
            key={sectionId}
            label={section.type}
            onEdit={(scope) => {
              setEditingSubsection(scope ?? null);
              setEditingSection(sectionId);
            }}
            onDelete={() => deleteSection(sectionId)}
            onDeleteSubsection={(subsectionIndex) => {
              const hiddenSubsections = Array.isArray(sectionData.hiddenSubsections)
                ? sectionData.hiddenSubsections.filter(
                    (index): index is number => typeof index === "number",
                  )
                : [];

              updateSectionData(sectionId, {
                ...section.data,
                [activeVariant]: {
                  ...sectionData,
                  hiddenSubsections: Array.from(
                    new Set([...hiddenSubsections, subsectionIndex]),
                  ),
                },
              });
            }}
            onAddSection={(sectionType) => addSectionAfter(sectionId, sectionType)}
            stickyMode={stickyMode}
            boxesPerRow={
              typeof sectionData.boxesPerRow === "number"
                ? section.type === "Features"
                  ? Math.min(4, sectionData.boxesPerRow)
                  : sectionData.boxesPerRow
                : undefined
            }
            hiddenSubsections={
              Array.isArray(sectionData.hiddenSubsections)
                ? sectionData.hiddenSubsections.filter(
                    (index): index is number => typeof index === "number",
                  )
                : undefined
            }
            subsectionOrder={toSubsectionOrder(sectionData.subsectionOrder)}
            onReorderSubsections={(order) => {
              updateSectionData(sectionId, {
                ...section.data,
                [activeVariant]: {
                  ...sectionData,
                  subsectionOrder: order,
                },
              });
            }}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveSection(sectionId, -1)}
            onMoveDown={() => moveSection(sectionId, 1)}
            onInlineTextEdit={(oldText, newText) =>
              updateInlineText(
                sectionId,
                activeVariant,
                section.type,
                oldText,
                newText,
              )
            }
            onInlineMediaEdit={(oldSrc, newSrc, mediaType, fileName) =>
              updateInlineMedia(
                sectionId,
                activeVariant,
                section.type,
                oldSrc,
                newSrc,
                mediaType,
                fileName,
              )
            }
          >
            <Component data={sectionData} />
          </EditableSection>
        );
      })}

      {editingSectionItem && (
        <EditSectionModal
          key={`${editingSectionItem.id ?? editingSectionItem.type}-${editingSubsection?.label ?? "all"}`}
          category={category}
          sectionId={editingSectionItem.id ?? editingSectionItem.type}
          sectionType={editingSectionItem.type}
          subsectionScope={editingSubsection}
          sections={syncedSections}
          onClose={() => {
            setEditingSection(null);
            setEditingSubsection(null);
          }}
          onSave={handleSectionSave}
          onSelectVariant={updateSectionVariant}
          onUpdateSectionData={updateSectionData}
          onDeleteSection={() =>
            deleteSection(
              editingSectionItem.id ?? editingSectionItem.type,
            )
          }
        />
      )}

      {savedToastSection && (
        <div
          key={savedToastSection}
          className="fixed bottom-3 left-1/2 z-[10000] w-[min(92vw,300px)] -translate-x-1/2 rounded-[22px] border border-gray-500 bg-blue-600 px-1 py-3 text-center text-lg font-medium text-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
          role="status"
          aria-live="polite"
        >
          {formatSectionName(savedToastSection)} changes saved
        </div>
      )}

      {inlineUpdateToast && (
        <div
          key={inlineUpdateToast}
          className="fixed right-4 top-4 z-[10003] rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[0_12px_35px_rgba(15,23,42,0.16)]"
          role="status"
          aria-live="polite"
        >
          {inlineUpdateToast}
        </div>
      )}

      {(whatsappLink || callLink) && (
        <div className="fixed bottom-5 left-5 z-[9000] flex flex-col gap-3 md:left-[var(--template-floating-left,1.25rem)]">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_32px_rgba(16,185,129,0.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600"
              aria-label="Open WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          )}

          {callLink && (
            <a
              href={callLink}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_32px_rgba(37,99,235,0.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
              aria-label="Call now"
            >
              <Phone size={21} />
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={scrollToTopbar}
        className="fixed bottom-5 right-5 z-[9000] flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_12px_32px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800"
        aria-label="Scroll to topbar"
      >
        <ArrowUp size={22} />
      </button>
    </main>
  );
}
