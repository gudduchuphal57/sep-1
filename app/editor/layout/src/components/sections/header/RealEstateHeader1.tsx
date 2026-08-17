"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import type { SectionData, SectionProps } from "../../../types/section";
import {
  getBlock,
  getBlocksByType,
  resolveSectionBlocks,
} from "../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";

type MenuItem = NonNullable<SectionData["menu"]>[number];

const getPageLabelFromHref = (href: string, fallback: string) => {
  const route = href
    .trim()
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .split(/[?#]/, 1)[0];

  if (!route) return "Home";

  return route
    .split("/")
    .filter(Boolean)
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase()) || fallback;
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

const navLinkClass = (active: boolean) =>
  [
    "inline-flex items-center gap-1.5 border-b-2 pb-0.5 transition",
    active
      ? "border-[#141414] font-semibold text-[#141414]"
      : "border-transparent text-[#141414]/75 hover:border-[#141414]/35 hover:text-[#141414]",
  ].join(" ");

function NavDropdown({
  item,
  active,
  onNavigate,
}: {
  item: MenuItem;
  active: boolean;
  onNavigate: (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        onClick={(event) => onNavigate(event, item.href, item.label)}
        className={navLinkClass(active)}
      >
        {item.label}
        <FaChevronDown
          className={`text-[0.55rem] transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-[1000] min-w-[13.5rem] pt-3 lg:left-1/2 lg:-translate-x-1/2">
          <div className="max-h-[70vh] overflow-y-auto border border-[#141414]/10 bg-white py-2 shadow-[0_16px_40px_rgba(20,20,20,0.1)]">
            {item.children?.map((child) => (
              <Link
                key={`${child.label}-${child.href}`}
                href={child.href}
                className="block whitespace-nowrap px-4 py-2.5 text-sm text-[#141414] transition hover:bg-[#141414] hover:text-white"
                onClick={(event) => {
                  onNavigate(event, child.href, child.label);
                  setOpen(false);
                }}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RealEstateHeader1({
  data = {},
  blocks,
}: SectionProps) {
  const resolvedBlocks = resolveSectionBlocks({ blocks, data });
  const logo = getBlock(resolvedBlocks, "logo");
  const menu = getBlock(resolvedBlocks, "menu");
  const buttons = getBlocksByType(resolvedBlocks, "button");
  const menuItems = menu?.items ?? data.menu ?? [];
  const cta = buttons[0];
  const preview = useOptionalPreview();
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  const isActive = (item: MenuItem) => {
    if (!preview) return false;
    const currentPage = preview.currentPage.toLowerCase();

    return [item, ...(item.children ?? [])].some(
      (candidate) =>
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
    setOpen(false);
    scrollTemplateToTop();
  };

  return (
    <header className="relative z-[70] w-full border-b border-[#141414]/12 bg-white">
      <div className="mx-auto grid min-h-16 max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-4 md:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link
          href="/"
          data-editor-no-inline
          onClick={(event) =>
            handleNavigate(event, logo?.href ?? "/", logo?.text ?? "Home")
          }
          className="flex min-w-0 items-center gap-3 text-[#141414]"
        >
          {data.logoImage ? (
            <Image
              src={data.logoImage}
              alt={data.logoImageTitle ?? logo?.text ?? "Logo"}
              width={150}
              height={48}
              unoptimized={
                data.logoImage.startsWith("data:") ||
                /^https?:\/\//.test(data.logoImage)
              }
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="truncate text-sm font-bold tracking-[0.12em] sm:text-base md:text-[1.05rem]">
              {(logo?.text ?? data.logo ?? "Haus Group").toUpperCase()}
            </span>
          )}
        </Link>

        <nav className="hidden items-center justify-center gap-6 text-[0.92rem] font-medium lg:flex xl:gap-7">
          {menuItems.map((item, index) =>
            item.children?.length ? (
              <NavDropdown
                key={`${item.label}-${index}`}
                item={item}
                active={isActive(item)}
                onNavigate={handleNavigate}
              />
            ) : (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                aria-current={isActive(item) ? "page" : undefined}
                className={navLinkClass(isActive(item))}
                onClick={(event) =>
                  handleNavigate(event, item.href, item.label)
                }
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center justify-end gap-2">
          {cta && (
            <Link
              href={cta.href}
              onClick={(event) =>
                handleNavigate(event, cta.href, cta.label)
              }
              className="hidden rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black lg:inline-flex"
            >
              {cta.label}
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="rounded-md p-2 text-[#141414] lg:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-[1000] max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#141414]/10 bg-white px-4 py-4 shadow-lg md:px-8 lg:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium text-[#141414]">
            {menuItems.map((item, index) => {
              const groupKey = `${item.label}-${index}`;
              const expanded = mobileGroup === groupKey;

              if (!item.children?.length) {
                return (
                  <Link
                    key={groupKey}
                    href={item.href}
                    className="border-b border-[#141414]/10 py-2.5"
                    onClick={(event) =>
                      handleNavigate(event, item.href, item.label)
                    }
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={groupKey} className="border-b border-[#141414]/10">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2.5 text-left"
                    aria-expanded={expanded}
                    onClick={() =>
                      setMobileGroup(expanded ? null : groupKey)
                    }
                  >
                    {item.label}
                    <FaChevronDown
                      className={`text-[0.6rem] transition ${
                        expanded ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>

                  {expanded && (
                    <div className="flex flex-col gap-1 pb-3 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={`${child.label}-${child.href}`}
                          href={child.href}
                          className="py-2 text-[#141414]/70"
                          onClick={(event) =>
                            handleNavigate(event, child.href, child.label)
                          }
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {cta && (
              <Link
                href={cta.href}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-5 py-3 text-white"
                onClick={(event) =>
                  handleNavigate(event, cta.href, cta.label)
                }
              >
                {cta.label}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
