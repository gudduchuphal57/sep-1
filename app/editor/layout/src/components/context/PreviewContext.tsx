"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPageNameFromHref } from "../../lib/pageVariantRouting";

export type PageLink = {
  label: string;
  href: string;
  children?: PageLink[];
};

const defaultPageLinks: PageLink[] = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
const currentPageStorageKey = "ai-builder-current-page";
const pageLinksStorageKey = "ai-builder-page-links";

const getStoredCurrentPage = () => {
  if (typeof window === "undefined") return "Home";

  return "Home";
};

type PreviewContextType = {
  isPreview: boolean;
  viewportMode: "desktop" | "mobile";
  currentPage: string;
  pageLinks: PageLink[];

  activePortfolioFilter: string;

  setViewportMode: (mode: "desktop" | "mobile") => void;
  setCurrentPage: (page: string) => void;
  setPageLinks: (links: PageLink[]) => void;

  setActivePortfolioFilter: (filter: string) => void;

  togglePreview: () => void;
};

const PreviewContext = createContext<PreviewContextType | null>(null);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [isPreview, setIsPreview] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [currentPage, setCurrentPage] = useState(getStoredCurrentPage);
  const [pageLinks, setPageLinks] = useState<PageLink[]>(defaultPageLinks);
  const [activePortfolioFilter, setActivePortfolioFilter] = useState("All");
  // false = by default EyeOff icon + editable visible

  useEffect(() => {
    window.localStorage.setItem(currentPageStorageKey, currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.localStorage.setItem(pageLinksStorageKey, JSON.stringify(pageLinks));
  }, [pageLinks]);

  useEffect(() => {
    const handleTemplateLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element
          ? target.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (
        !anchor ||
        !anchor.closest("[data-template-navigation]") ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const href = anchor.getAttribute("href")?.trim() ?? "";
      const isTemplateRoute =
        href === "/" ||
        href === "#" ||
        href.startsWith("#") ||
        (href.startsWith("/") && !href.startsWith("//"));

      if (!isTemplateRoute) return;

      event.preventDefault();
      setCurrentPage(getPageNameFromHref(href));

      const scrollContainer = anchor.closest<HTMLElement>(
        "[data-template-scroll]",
      );

      if (
        scrollContainer &&
        scrollContainer.scrollHeight > scrollContainer.clientHeight + 1
      ) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleTemplateLinkClick, true);

    return () => {
      document.removeEventListener("click", handleTemplateLinkClick, true);
    };
  }, []);

  const togglePreview = () => {
    setIsPreview((prev) => !prev);
  };

  return (
    <PreviewContext.Provider
      value={{
        isPreview,
        viewportMode,
        currentPage,
        pageLinks,
        activePortfolioFilter,

        setViewportMode,
        setCurrentPage,
        setPageLinks,
        setActivePortfolioFilter,

        togglePreview,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);

  if (!context) {
    throw new Error("usePreview must be used inside PreviewProvider");
  }

  return context;
}

export function useOptionalPreview() {
  return useContext(PreviewContext);
}
