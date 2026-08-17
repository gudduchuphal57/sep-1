"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import type { SectionData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { useOptionalPreview } from "../../context/PreviewContext";

type MenuItem = NonNullable<SectionData["menu"]>[number];

type EventsHeaderButton = {
  label?: string;
  href?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const getPageLabelFromHref = (href: string, fallback: string) => {
  const route = href
    .trim()
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .split(/[?#]/, 1)[0];

  if (!route) return fallback;

  return (
    route
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()) || fallback
  );
};

const scrollTemplateToTop = () => {
  const scrollContainer = document.querySelector<HTMLElement>(
    "[data-template-scroll]",
  );

  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function EventsHeader1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<number | null>(
    null,
  );

  const menuItems = data.menu ?? [];
  const logoText = toText(data.logo);
  const logoImage = toText(data.logoImage);
  const buttonValue: unknown = data.button;
  const cta: EventsHeaderButton | undefined = isRecord(buttonValue)
    ? (buttonValue as EventsHeaderButton)
    : data.buttons?.[0];
  const headerSolidColor = toText(data.headerBackgroundColor) ?? "#F3F4F6";
  const headerGradientColor =
    toText(data.headerGradientColor) ?? headerSolidColor;
  const headerBackground =
    data.headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${headerSolidColor}, ${headerGradientColor})`
      : headerSolidColor;
  // Editor color overrides the design defaults only when it is set.
  const headerTextColor = toText(data.headerTextColor);

  const isActive = (item: MenuItem) => {
    if (!preview) return false;
    const currentPage = preview.currentPage.toLowerCase();

    return [item, ...(item.children ?? [])].some(
      (candidate) =>
        toText(candidate.href) &&
        getPageLabelFromHref(candidate.href, candidate.label).toLowerCase() ===
          currentPage,
    );
  };

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;

    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    setMenuOpen(false);
    setOpenMobileSubmenu(null);
    scrollTemplateToTop();
  };

  const handleBookNow = () => {
    if (!preview || !cta?.href) return;

    preview.setCurrentPage(getPageLabelFromHref(cta.href, cta.label ?? "Home"));
    setMenuOpen(false);
    scrollTemplateToTop();
  };

  return (
    <header
      className="relative z-50 w-full font-sans shadow-sm"
      style={
        {
          background: headerBackground,
          "--header-text": headerTextColor ?? "#475569",
          "--header-bar": headerTextColor ?? "#334155",
          "--header-submenu": headerTextColor ?? "#64748b",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-17 lg:px-8 xl:px-10">
        {/* Logo Area */}
        <div className="flex cursor-pointer items-center gap-3">
          {logoImage ? (
            <Link
              href="/"
              data-editor-no-inline
              onClick={(event) => handleNavigate(event, "/", "Home")}
              className="flex items-center"
            >
              <Image
                src={logoImage}
                alt={data.logoImageTitle ?? logoText ?? "Logo"}
                width={55}
                height={80}
                unoptimized={isUnoptimizedImageSrc(logoImage)}
                className="object-contain"
              />
              {logoText && (
                <span className="text-sm font-bold uppercase tracking-widest text-[#d61b58]">
                  {logoText}
                </span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              <svg
                viewBox="0 0 100 100"
                width="40"
                height="60"
                className="text-[#d61b58]"
                aria-hidden
              >
                <path
                  d="M50 15 L65 30 L85 30 L70 50 L85 70 L65 70 L50 85 L35 70 L15 70 L30 50 L15 30 L35 30 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                <path
                  d="M50 28 L62 40 L50 52 L38 40 Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M50 48 L62 60 L50 72 L38 60 Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </svg>
              <div className="text-3xl font-black tracking-tight">
                <span className="text-[#d61b58]">{logoText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex lg:items-stretch lg:self-stretch">
          <ul className="flex items-stretch gap-8 text-[13px] font-bold tracking-wider text-(--header-text)">
            {menuItems.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="group relative flex items-center"
              >
                <Link
                  href={item.href || "#"}
                  aria-current={isActive(item) ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      !item.href ||
                      item.href === "#" ||
                      (item.children && item.children.length > 0)
                    ) {
                      event.preventDefault();
                      return;
                    }

                    handleNavigate(event, item.href, item.label);
                  }}
                  className={`relative flex items-center gap-1 py-1 transition-colors
        after:absolute
        after:left-0
        after:bottom-0
        after:h-[2px]
        after:w-full
        after:bg-[#d61b58]
        after:origin-left
        after:scale-x-0
        after:transition-transform
        after:duration-300
        hover:after:scale-x-100
        ${
          isActive(item)
            ? "text-[#d61b58] after:scale-x-100"
            : "text-(--header-text) hover:text-[#d61b58]"
        }`}
                >
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <IoIosArrowDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && item.children.length > 0 && (
                  <ul className="pointer-events-none invisible absolute left-0 top-full z-50 w-52 rounded-b-md bg-white py-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="absolute -top-2 left-0 h-2 w-full" />
                    {item.children.map((child, childIndex) => (
                      <li key={`${child.label}-${childIndex}`}>
                        <Link
                          href={child.href}
                          onClick={(event) =>
                            handleNavigate(event, child.href, child.label)
                          }
                          className={`block px-4 py-2.5 text-[14px] transition-colors ${
                            isActive(child)
                              ? "bg-slate-50 text-[#d61b58]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-[#d61b58]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side: CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {cta?.label && (
            <button
              type="button"
              onClick={handleBookNow}
              className="hidden cursor-pointer rounded-full bg-[#d61b58] px-7 py-2 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#b01648] sm:block"
            >
              {cta.label}
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-(--header-bar) transition-transform duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-(--header-bar) transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-(--header-bar) transition-transform duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-slate-200 px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 pt-4 text-[13px] font-bold tracking-wider text-(--header-text)">
            {menuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href || "#"}
                    className={`block py-2 transition-colors ${
                      isActive(item)
                        ? "text-[#d61b58]"
                        : "text-(--header-text) hover:text-[#d61b58]"
                    }`}
                    onClick={(event) => {
                      if (
                        !item.href ||
                        item.href === "#" ||
                        (item.children && item.children.length > 0)
                      ) {
                        event.preventDefault();
                        setOpenMobileSubmenu(
                          openMobileSubmenu === index ? null : index,
                        );
                        return;
                      }

                      handleNavigate(event, item.href, item.label);
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileSubmenu(
                          openMobileSubmenu === index ? null : index,
                        )
                      }
                      className="p-2 hover:text-[#d61b58]"
                      aria-label="Toggle submenu"
                    >
                      <IoIosArrowDown
                        className={`transition-transform duration-200 ${
                          openMobileSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu */}
                {item.children &&
                  item.children.length > 0 &&
                  openMobileSubmenu === index && (
                    <ul className="mb-2 ml-1 border-l-2 border-[#d61b58] pl-4">
                      {item.children.map((child, childIndex) => (
                        <li key={`${child.label}-${childIndex}`}>
                          <Link
                            href={child.href}
                            className={`block py-2 text-[12px] transition-colors ${
                              isActive(child)
                                ? "text-[#d61b58]"
                                : "text-(--header-submenu) hover:text-[#d61b58]"
                            }`}
                            onClick={(event) =>
                              handleNavigate(event, child.href, child.label)
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
            <li>
              {cta?.label && (
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="mt-2 w-full cursor-pointer rounded-[20px] bg-[#d61b58] px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#b01648] sm:hidden"
                >
                  {cta.label}
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
