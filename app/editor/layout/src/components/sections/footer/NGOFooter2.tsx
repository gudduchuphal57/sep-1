"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { useOptionalPreview } from "../../context/PreviewContext";

type FooterLink = { label?: string; href?: string };
type FooterColumn = { title?: string; links?: FooterLink[] };

const NGO_FOOTER_COPYRIGHT =
  "Copyright © 2026. All rights reserved. Powered by Lestow.";

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

const toLinks = (value: unknown): FooterLink[] =>
  Array.isArray(value)
    ? value.filter((item): item is FooterLink => isRecord(item))
    : [];

export default function NGOFooter2({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const nestedNewsletter = isRecord(data.newsletter)
    ? (data.newsletter as {
        title?: string;
        description?: string;
        placeholder?: string;
        buttonLabel?: string;
      })
    : undefined;
  const nestedContact = isRecord(data.contactInfo)
    ? (data.contactInfo as {
        title?: string;
        location?: { address?: string };
        phone?: { number?: string };
        email?: { address?: string };
      })
    : undefined;
  const nestedSupport = isRecord(data.support)
    ? (data.support as { title?: string; links?: FooterLink[] })
    : undefined;
  const nestedServices = isRecord(data.services)
    ? (data.services as { title?: string; links?: FooterLink[] })
    : undefined;
  const nestedBottomBar = isRecord(data.bottomBar)
    ? (data.bottomBar as { links?: FooterLink[] })
    : undefined;

  const newsletterTitle =
    toText(data.newsletterTitle) ?? toText(nestedNewsletter?.title);
  const newsletterDesc =
    toText(data.newsletterDesc) ?? toText(nestedNewsletter?.description);
  const newsletterPlaceholder =
    toText(data.newsletterPlaceholder) ??
    toText(nestedNewsletter?.placeholder) ??
    "Enter your email";
  const newsletterButtonLabel =
    toText(data.newsletterButtonLabel) ??
    toText(nestedNewsletter?.buttonLabel) ??
    "Subscribe Now";
  const showNewsletter = Boolean(newsletterTitle || newsletterDesc);

  const logoImage = toText(data.logoImage);
  const logoText = toText(data.logo);
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
  const logoDesc = toText(data.desc);
  const showLogoColumn = Boolean(showLogoImage || showLogoText || logoDesc);

  const contactLabel =
    toText(data.contactLabel) ?? toText(nestedContact?.title) ?? "Contact Info";
  const contact = data.footerContact ?? {
    location: nestedContact?.location?.address,
    phone: nestedContact?.phone?.number,
    email: nestedContact?.email?.address,
  };
  const showContact = Boolean(
    contact.location || contact.phone || contact.email,
  );

  const columns = (
    Array.isArray(data.footerColumns) && data.footerColumns.length
      ? (data.footerColumns as FooterColumn[])
      : [
          nestedSupport
            ? { title: nestedSupport.title, links: nestedSupport.links }
            : undefined,
          nestedServices
            ? { title: nestedServices.title, links: nestedServices.links }
            : undefined,
        ].filter((column): column is FooterColumn => Boolean(column))
  ) as FooterColumn[];
  const leadingColumns = columns.slice(0, 2);
  const trailingColumns = columns.slice(2);

  const legalLinks = toLinks(
    data.footerLegalLinks ?? nestedBottomBar?.links ?? data.links,
  );

  const footerSolidColor = toText(data.footerBackgroundColor) ?? "#252525";
  const footerGradientColor =
    toText(data.footerGradientColor) ?? footerSolidColor;
  const footerBackground =
    data.footerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${footerSolidColor}, ${footerGradientColor})`
      : footerSolidColor;
  const textColor = toText(data.footerTextColor) ?? "#e2e8f0";

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  const phoneHref = contact.phone
    ? `tel:${contact.phone.replace(/[^\d+]/g, "")}`
    : undefined;
  const emailHref = contact.email ? `mailto:${contact.email}` : undefined;

  const renderLinkColumn = (column: FooterColumn, index: number) => (
    <div key={`${column.title}-${index}`}>
      {column.title ? (
        <h3 className="mb-6 text-xl font-bold">{column.title}</h3>
      ) : null}
      <ul className="space-y-3">
        {(column.links ?? []).map((link, linkIndex) => {
          const href = link.href || "#";
          return (
            <li key={`${link.label}-${linkIndex}`}>
              <Link
                href={href}
                className="text-sm opacity-80 transition-colors duration-200 hover:text-[#ff5a1f] hover:opacity-100"
                onClick={(event) =>
                  handleNavigate(event, href, link.label ?? "Home")
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <footer
      data-editor-section-label="Footer Content"
      data-editor-fields="logo logoImage logoImageTitle logoType desc newsletterTitle newsletterDesc newsletterPlaceholder newsletterButtonLabel contactLabel footerContact footerColumns footerLegalLinks"
      className="font-sans"
      style={{ background: footerBackground, color: textColor }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {showNewsletter ? (
          <div className="border-b border-dashed border-current/20 py-8">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
              <div>
                {newsletterTitle ? (
                  <h2 className="text-2xl font-bold">{newsletterTitle}</h2>
                ) : null}
                {newsletterDesc ? (
                  <p className="mt-2 max-w-xl text-sm leading-7 opacity-80">
                    {newsletterDesc}
                  </p>
                ) : null}
              </div>
              <form
                className="flex w-full items-center rounded-full bg-white p-1"
                onSubmit={(event) => event.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#ff5a1f] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#e94d16]"
                >
                  {newsletterButtonLabel}
                  <FiArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-10 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {showLogoColumn ? (
            <div className="space-y-4">
              <Link
                href="/"
                data-editor-no-inline
                onClick={(event) => handleNavigate(event, "/", "Home")}
              >
                {showLogoImage ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-[8.5rem] items-center justify-start sm:h-20 sm:w-44">
                      <Image
                        src={logoImage!}
                        alt={data.logoImageTitle ?? logoText ?? "Logo"}
                        width={176}
                        height={80}
                        unoptimized={isUnoptimizedImageSrc(logoImage!)}
                        className="h-full w-full object-contain object-left"
                      />
                    </div>
                    {showLogoText ? (
                      <span className="text-lg font-bold uppercase text-[#ff5a1f]">
                        {logoText}
                      </span>
                    ) : null}
                  </div>
                ) : showLogoText ? (
                  <div className="text-lg font-bold uppercase text-[#ff5a1f]">
                    {logoText}
                  </div>
                ) : null}
              </Link>
              {logoDesc ? (
                <p className="text-md mt-2 max-w-md leading-relaxed opacity-80">
                  {logoDesc}
                </p>
              ) : null}
            </div>
          ) : null}

          {leadingColumns.map((column, index) =>
            renderLinkColumn(column, index),
          )}

          {showContact ? (
            <div>
              <h3 className="mb-6 text-xl font-bold">{contactLabel}</h3>
              <div className="space-y-5">
                {contact.location ? (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#ff5a1f]">
                      <FiMapPin size={16} />
                      <span>LOCATION</span>
                    </div>
                    <p className="text-sm leading-6 opacity-80">
                      {contact.location}
                    </p>
                  </div>
                ) : null}
                {contact.phone ? (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#ff5a1f]">
                      <FiPhone size={16} />
                      <span>CALL US</span>
                    </div>
                    <a
                      href={phoneHref}
                      className="text-sm opacity-80 transition-colors hover:text-[#ff5a1f] hover:opacity-100"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ) : null}
                {contact.email ? (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#ff5a1f]">
                      <FiMail size={16} />
                      <span>EMAIL US</span>
                    </div>
                    <a
                      href={emailHref}
                      className="text-sm opacity-80 transition-colors hover:text-[#ff5a1f] hover:opacity-100"
                    >
                      {contact.email}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {trailingColumns.map((column, index) =>
            renderLinkColumn(column, index + leadingColumns.length),
          )}
        </div>

        <div className="border-t border-dashed border-current/20 py-5">
          <div className="flex flex-col items-center justify-center gap-4 text-center text-sm opacity-80 sm:flex-row sm:justify-between sm:text-left">
            <p className="leading-6">{NGO_FOOTER_COPYRIGHT}</p>
            {legalLinks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                {legalLinks.map((link, index) => {
                  const href = link.href || "#";
                  return (
                    <React.Fragment key={`${link.label}-${index}`}>
                      {index > 0 ? (
                        <span className="hidden text-[#ff5a1f] sm:inline">
                          |
                        </span>
                      ) : null}
                      <Link
                        href={href}
                        className="whitespace-nowrap transition-colors duration-200 hover:text-[#ff5a1f] hover:opacity-100"
                        onClick={(event) =>
                          handleNavigate(event, href, link.label ?? "Home")
                        }
                      >
                        {link.label}
                      </Link>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
