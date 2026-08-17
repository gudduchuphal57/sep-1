"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { SectionProps } from "./../../../types/section";
import { getBlock, getBlocksByType, resolveSectionBlocks } from "../types/section";
import BlockRenderer from "../blocks/BlockRenderer";
import { useOptionalPreview } from "../../context/PreviewContext";

const getPageLabelFromHref = (href: string, fallback: string) => {
  const normalizedHref = href.trim();

  if (!normalizedHref || normalizedHref === "#") return fallback;

  return normalizedHref
    .replace(/^#/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

export default function SchoolHeader1({ data = {}, blocks }: SectionProps) {
  const resolvedBlocks = resolveSectionBlocks({ blocks, data });
  const logo = getBlock(resolvedBlocks, "logo");
  const menu = getBlock(resolvedBlocks, "menu");
  const buttonBlocks = getBlocksByType(resolvedBlocks, "button");
  const [open, setOpen] = useState(false);
  const preview = useOptionalPreview();
  const headerRef = useRef<HTMLElement>(null);
  const headerSolidColor = data.headerBackgroundColor ?? "#245c6e";
  const headerGradientColor =
    data.headerGradientColor ?? "#0668ff";
  const headerBackground =
    data.headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${headerSolidColor}, ${headerGradientColor})`
      : headerSolidColor;
  const headerTextColor = data.headerTextColor ?? "#ffffff";
  const handlePageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;

    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };
  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    preview?.setCurrentPage("Home");
    setOpen(false);
    scrollTemplateToTop();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="relative z-[70] w-full px-4 shadow-sm transition-all duration-500"
      style={
        {
          background: headerBackground,
          "--header-text": headerTextColor,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4">
        <Link
          href="#"
          onClick={handleLogoClick}
          data-editor-no-inline
          className="relative shrink-0 text-(--header-text) transition-opacity duration-300 hover:opacity-80"
        >
          {data.logoImage ? (
            <Image
              src={data.logoImage}
              alt={data.logoImageTitle ?? logo?.text ?? "Logo"}
              width={150}
              height={48}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-base font-semibold sm:text-lg">
              {logo?.text}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          {menu?.items.map((item) => {
            const hasDropdown = !!item.children?.length;

            return (
              <div key={item.label} className="group/item relative z-[1] hover:z-[90] focus-within:z-[90]">
                <Link
                  href={item.href}
                  onClick={(event) =>
                    handlePageClick(event, item.href, item.label)
                  }
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-(--header-text) transition-all duration-300 hover:bg-white/10 hover:opacity-90 lg:text-base"
                >
                  {item.label}

                  {hasDropdown && (
                    <ChevronDown
                      size={15}
                      className="transition-transform duration-200 group-hover/item:rotate-180"
                    />
                  )}
                </Link>

                {hasDropdown && (
                  <div className="invisible absolute left-0 top-full z-[1000] pt-2 opacity-0 transition-all duration-200 group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100">
                    <div className="max-h-[min(60vh,360px)] min-w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-2xl">
                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(event) =>
                            handlePageClick(event, child.href, child.label)
                          }
                          className="block whitespace-nowrap px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {!!buttonBlocks.length && (
          <div className="hidden items-center gap-2 md:flex">
            {buttonBlocks.map((button, index) => {
              const variant =
                button.variant || (index === 0 ? "primary" : "secondary");

              return (
                <BlockRenderer
                  key={button.id}
                  block={button}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    variant === "primary"
                      ? "bg-white text-slate-950"
                      : "bg-[#0668ff] text-white"
                  }`}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer text-(--header-text) transition-opacity duration-300 hover:opacity-80 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="absolute left-0 top-16 z-[1000] w-full border-t px-4 py-4 shadow-lg animate-editor-fade md:hidden"
          style={{ background: headerBackground }}
        >
          <nav className="flex flex-col gap-3">
            {menu?.items.map((item) => {
              const hasDropdown = !!item.children?.length;

              return (
                <div key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.href}
                    onClick={(event) => {
                      handlePageClick(event, item.href, item.label);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2 text-sm font-medium text-(--header-text)"
                  >
                    {item.label}
                    {hasDropdown && <ChevronDown size={15} />}
                  </Link>

                  {hasDropdown && (
                    <div className="ml-4 flex flex-col gap-1 border-l pl-3">
                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(event) => {
                            handlePageClick(event, child.href, child.label);
                            setOpen(false);
                          }}
                          className="py-2 text-sm text-(--header-text)/80"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {!!buttonBlocks.length &&
              buttonBlocks.map((button) => (
                <BlockRenderer
                  key={button.id}
                  block={button}
                  className="mt-2 inline-flex w-fit items-center gap-1 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-950"
                />
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
