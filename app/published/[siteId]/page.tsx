"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { generalSansMedium } from "@/app/fonts";
import {
  PreviewProvider,
  usePreview,
} from "../../editor/layout/src/components/context/PreviewContext";
import {
  getPageVariantForSlug,
  sectionMatchesPageRoute,
} from "../../editor/layout/src/lib/pageVariantRouting";
import { getSectionComponent } from "../../editor/layout/src/lib/sectionRegistry";
import {
  buildSubsectionOrderCss,
  buildSubsectionScopeId,
} from "../../editor/layout/src/lib/subsectionOrder";
import { SectionData, SectionItem } from "../../editor/layout/src/types/section";

type PublishedPageLink = {
  label: string;
  href: string;
  children?: PublishedPageLink[];
};

type PublishedSitePayload = {
  id: string;
  templateId: string;
  category: string;
  pageLinks: PublishedPageLink[];
  sections: SectionItem[];
  publishedAt: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const createPageSlug = (label: string) =>
  label.trim().toLowerCase().replace(/\s+/g, "-");

function PublishedSiteContent() {
  const params = useParams<{ siteId: string }>();
  const { currentPage, setCurrentPage } = usePreview();
  const [payload, setPayload] = useState<PublishedSitePayload | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPublishedSite = async () => {
      try {
        const response = await fetch(`/api/published/${params.siteId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Published site was not found on the server");
        }

        const publishedPayload =
          (await response.json()) as PublishedSitePayload;

        if (!isMounted) return;

        setPayload(publishedPayload);
        setCurrentPage("Home");
        setHasLoaded(true);
        return;
      } catch {
        const storedPayload = window.localStorage.getItem(
          `ai-builder-published-site-${params.siteId}`,
        );

        if (!isMounted) return;

        if (!storedPayload) {
          setHasLoaded(true);
          return;
        }

        try {
          const parsedPayload = JSON.parse(
            storedPayload,
          ) as PublishedSitePayload;

          setPayload(parsedPayload);
          setCurrentPage("Home");
        } catch {
          setPayload(null);
        } finally {
          setHasLoaded(true);
        }
      }
    };

    window.setTimeout(() => {
      void loadPublishedSite();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [params.siteId, setCurrentPage]);

  const currentPageSlug = createPageSlug(currentPage || "Home");
  const visibleSections = useMemo(() => {
    if (!payload) return [];

    const pageShellSectionTypes = ["Topbar", "Header", "Footer"];

    return currentPageSlug && currentPageSlug !== "home"
      ? payload.sections.filter(
          (section) =>
            pageShellSectionTypes.includes(section.type) ||
            sectionMatchesPageRoute(section, currentPageSlug),
        )
      : payload.sections.filter((section) => !section.page);
  }, [currentPageSlug, payload]);

  const footerSection = payload?.sections.find(
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

  const scrollToTopbar = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hasLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!payload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">
            Published site not found
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Publish this template again from the editor to generate a fresh URL.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      data-template-navigation
      className={`${
        payload.category === "Realestate" && payload.templateId === "template-1"
          ? generalSansMedium.className
          : ""
      } min-h-screen w-full overflow-x-hidden [overflow-wrap:anywhere]`}
    >
      {visibleSections.map((section) => {
        const activeVariant =
          getPageVariantForSlug(section, currentPageSlug) ?? section.variant;
        const Component = getSectionComponent(
          payload.category,
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
        const sectionStackClass =
          section.type === "Topbar"
            ? "z-[130]"
            : section.type === "Header"
              ? "z-[120]"
              : "z-0";

        if (!Component) return null;

        const scopeId = buildSubsectionScopeId(section.id ?? section.type);
        const subsectionOrderCss = buildSubsectionOrderCss(
          scopeId,
          sectionData.subsectionOrder,
        );

        return (
          <section
            key={section.id ?? section.type}
            id={scopeId}
            data-boxes-per-row={
              typeof sectionData.boxesPerRow === "number"
                ? section.type === "Features"
                  ? Math.min(4, sectionData.boxesPerRow)
                  : sectionData.boxesPerRow
                : undefined
            }
            data-hidden-subsections={
              Array.isArray(sectionData.hiddenSubsections)
                ? sectionData.hiddenSubsections.join(" ")
                : undefined
            }
            className={`${stickyMode === "sticky" ? "sticky top-0" : "relative"} ${sectionStackClass}`}
          >
            {subsectionOrderCss && <style>{subsectionOrderCss}</style>}
            <Component data={sectionData} />
          </section>
        );
      })}

      {(whatsappLink || callLink) && (
        <div className="fixed bottom-5 left-5 z-[9000] flex flex-col gap-3">
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
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} />
      </button>
    </main>
  );
}

export default function PublishedSitePage() {
  return (
    <PreviewProvider>
      <PublishedSiteContent />
    </PreviewProvider>
  );
}
