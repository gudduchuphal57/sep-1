"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiChevronDown,
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { BsGrid3X3GapFill } from "react-icons/bs";
import type { SectionData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoSocialIcon } from "../../../lib/ngoIcons";
import { useOptionalPreview } from "../../context/PreviewContext";

type MenuItem = NonNullable<SectionData["menu"]>[number];

type PopupData = {
  aboutpopup?: { title?: string; desc?: string };
  instagram?: { title?: string; images?: Array<{ src: string; alt?: string }> };
  contactpopup?: {
    phone?: string;
    phoneHref?: string;
    separator?: string;
    email?: string;
    emailHref?: string;
  };
  socialLinkspopup?: Array<{ label: string; href: string }>;
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

const renderSocialIcon = (label: string) =>
  renderNgoSocialIcon(label.toLowerCase(), "h-3.5 w-3.5");

export default function NGOHeader2({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<
    Record<string, boolean>
  >({});

  const menuItems: MenuItem[] = data.menu ?? [];
  const logoText = toText(data.logo);
  const logoImage = toText(data.logoImage);
  const logoType =
    data.logoType === "image" ||
    data.logoType === "text" ||
    data.logoType === "image-text"
      ? data.logoType
      : logoImage && logoText
        ? "image-text"
        : logoImage
          ? "image"
          : "text";
  const showLogoImage =
    Boolean(logoImage) &&
    (logoType === "image" || logoType === "image-text");
  const showLogoText =
    Boolean(logoText) &&
    (logoType === "text" || logoType === "image-text");
  const popup: PopupData | undefined = isRecord(data.PopupData)
    ? (data.PopupData as PopupData)
    : isRecord(data.popupData)
      ? (data.popupData as PopupData)
      : undefined;

  const headerSolidColor = toText(data.headerBackgroundColor) ?? "#3d376d";
  const headerGradientColor =
    toText(data.headerGradientColor) ?? "#ff541b";
  const headerBackground =
    data.headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${headerSolidColor}, ${headerGradientColor})`
      : headerSolidColor;
  const headerTextColor = toText(data.headerTextColor) ?? "#f8fafc";

  useEffect(() => {
    if (isMobileMenuOpen || isPopupOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMobileMenuOpen, isPopupOpen]);

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
    setIsMobileMenuOpen(false);
    setOpenMobileDropdowns({});
    scrollTemplateToTop();
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <header
        className="relative z-50 w-full overflow-visible shadow-md transition-all duration-300"
        style={
          {
            background: headerBackground,
            color: headerTextColor,
            "--header-text": headerTextColor,
          } as React.CSSProperties
        }
      >
        <div className="mx-auto max-w-7xl overflow-visible px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between overflow-visible sm:h-20">
            <Link
              href="/"
              data-editor-no-inline
              onClick={(event) => handleNavigate(event, "/", "Home")}
              className="group relative z-[140] flex min-w-0 items-center gap-2.5"
            >
              {showLogoImage ? (
                <div
                  className={`relative z-[140] flex items-center justify-center transition duration-300 group-hover:scale-105 ${
                    logoType === "image"
                      ? "w-16 sm:-mt-8 sm:w-40"
                      : "w-10 sm:w-12"
                  }`}
                >
                  <Image
                    src={logoImage!}
                    alt={data.logoImageTitle ?? logoText ?? "Logo"}
                    width={logoType === "image" ? 160 : 48}
                    height={logoType === "image" ? 80 : 48}
                    unoptimized={isUnoptimizedImageSrc(logoImage!)}
                    className={
                      logoType === "image"
                        ? "w-full rounded-br-2xl object-cover [clip-path:polygon(0_0,_100%_0,_100%_95%,_0_100%)]"
                        : "h-10 w-10 object-contain sm:h-11 sm:w-11"
                    }
                  />
                </div>
              ) : null}

              {showLogoText ? (
                <span
                  className={
                    logoType === "text"
                      ? "truncate text-xl font-extrabold tracking-tight sm:text-2xl"
                      : "truncate text-sm font-bold uppercase tracking-widest"
                  }
                  style={{ color: headerTextColor }}
                >
                  {logoText}
                </span>
              ) : null}

              {!showLogoImage && !showLogoText ? (
                <span
                  className="text-lg font-bold"
                  style={{ color: headerTextColor }}
                >
                  NGO
                </span>
              ) : null}
            </Link>

            <div className="flex h-full items-center gap-4">
              <div className="hidden h-full items-center gap-3 md:flex">
                <nav className="flex items-center md:gap-1 xl:gap-2">
                  {menuItems.map((item) => {
                    const hasChildren =
                      item.children && item.children.length > 0;
                    const active = isActive(item);

                    return (
                      <div key={item.label} className="group relative py-6">
                        <Link
                          href={item.href || "#"}
                          onClick={(event) => {
                            if (
                              !item.href ||
                              item.href === "#" ||
                              hasChildren
                            ) {
                              event.preventDefault();
                              return;
                            }
                            handleNavigate(event, item.href, item.label);
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition duration-200 focus:outline-none ${
                            active
                              ? "font-semibold text-orange-500"
                              : "hover:bg-white/10"
                          }`}
                          style={active ? undefined : { color: headerTextColor }}
                        >
                          <span>{item.label}</span>
                          {hasChildren && (
                            <FiChevronDown
                              size={16}
                              className={`transition-transform duration-300 group-hover:rotate-180 ${
                                active ? "text-orange-500" : ""
                              }`}
                              style={
                                active ? undefined : { color: headerTextColor }
                              }
                            />
                          )}
                        </Link>

                        {hasChildren && (
                          <div className="invisible absolute left-0 top-full z-50 translate-y-0 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
                            <div
                              className={`mt-0 border border-slate-100 bg-white p-2 shadow-xl ${
                                item.children!.length > 6
                                  ? "grid w-[480px] grid-cols-2 gap-1"
                                  : "w-[240px]"
                              }`}
                            >
                              {item.children!.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={(event) =>
                                    handleNavigate(
                                      event,
                                      child.href,
                                      child.label,
                                    )
                                  }
                                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium transition duration-100 hover:bg-slate-100 hover:text-black ${
                                    isActive(child)
                                      ? "bg-orange-50/50 font-semibold text-orange-600"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{child.label}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  aria-label="Open About Information"
                  className="flex h-full w-14 cursor-pointer items-center justify-center bg-orange-500 text-white transition-all duration-200 hover:bg-orange-600 focus:outline-none"
                >
                  <BsGrid3X3GapFill size={28} />
                </button>
              </div>

              <div className="flex items-center gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  aria-label="Open About Information"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-500 p-2.5 text-white shadow-md shadow-rose-600/20 transition-all duration-200 hover:bg-orange-700 focus:outline-none"
                >
                  <BsGrid3X3GapFill size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open Mobile Menu"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 p-2.5 hover:bg-white/10 focus:outline-none"
                  style={{ color: headerTextColor }}
                >
                  <FiMenu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About popup drawer */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isPopupOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        onClick={() => setIsPopupOpen(false)}
      />
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-2xl transition-transform duration-300 ease-in-out ${
          isPopupOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between px-5 pt-5">
          <h3 className="pt-16 text-xl font-bold text-black">
            {popup?.aboutpopup?.title || "About Us"}
          </h3>
          <button
            type="button"
            onClick={() => setIsPopupOpen(false)}
            className="cursor-pointer rounded-full p-2 text-slate-900"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          {popup?.aboutpopup?.desc && (
            <p className="text-sm text-slate-500">{popup.aboutpopup.desc}</p>
          )}

          {popup?.instagram?.images && popup.instagram.images.length > 0 && (
            <div className="mt-4">
              {popup.instagram.title && (
                <h4 className="mb-4 text-base font-semibold text-slate-800">
                  {popup.instagram.title}
                </h4>
              )}
              <div className="grid grid-cols-4 gap-2">
                {popup.instagram.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden bg-slate-800"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt ?? "Gallery"}
                      width={100}
                      height={100}
                      unoptimized={isUnoptimizedImageSrc(img.src)}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {popup?.contactpopup && (
            <div className="flex justify-center space-y-6 rounded-xl py-8 text-center">
              <div>
                <a
                  href={popup.contactpopup.phoneHref}
                  className="flex items-center gap-3 text-sm text-slate-900 hover:text-orange-400"
                >
                  <FiPhone className="text-orange-500" size={16} />
                  <span>{popup.contactpopup.phone}</span>
                </a>
                <p className="pt-5 text-sm font-semibold uppercase text-slate-500">
                  {popup.contactpopup.separator}
                </p>
                <a
                  href={popup.contactpopup.emailHref}
                  className="flex items-center gap-3 text-sm text-slate-900 hover:text-orange-400"
                >
                  <FiMail className="text-orange-500" size={16} />
                  <span>{popup.contactpopup.email}</span>
                </a>
              </div>
            </div>
          )}

          {popup?.socialLinkspopup && popup.socialLinkspopup.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {popup.socialLinkspopup.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-slate-600 transition-all hover:bg-orange-500 hover:text-white"
                >
                  {renderSocialIcon(social.label)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[85%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 p-5">
          <Link
            href="/"
            onClick={(event) => {
              handleNavigate(event, "/", "Home");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5"
          >
            {showLogoImage ? (
              <Image
                src={logoImage!}
                alt={logoText ?? "Logo"}
                width={36}
                height={36}
                unoptimized={isUnoptimizedImageSrc(logoImage!)}
                className="h-9 w-9 object-contain"
              />
            ) : null}
            {showLogoText || !showLogoImage ? (
              <span className="font-bold text-slate-800">
                {logoText ?? "NGO"}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Close Menu"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = !!openMobileDropdowns[item.label];

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href || "#"}
                      onClick={(event) => {
                        if (hasChildren) {
                          event.preventDefault();
                          return;
                        }
                        handleNavigate(event, item.href || "/", item.label);
                      }}
                      className="flex-1 px-2 py-3 text-base font-semibold text-slate-800 transition duration-200 hover:text-slate-600"
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleMobileDropdown(item.label)}
                        className="p-3 text-slate-400 hover:text-slate-700"
                        aria-label={`Toggle ${item.label} Submenu`}
                      >
                        <FiChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-slate-600" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {hasChildren && isOpen && (
                    <div className="ml-2 space-y-1 border-l-2 border-slate-200 pb-3 pl-4">
                      {item.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(event) =>
                            handleNavigate(event, child.href, child.label)
                          }
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition duration-150 hover:bg-slate-50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
