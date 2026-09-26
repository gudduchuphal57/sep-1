"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { SectionData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { useOptionalPreview } from "../../context/PreviewContext";

type FooterLink = NonNullable<SectionData["footerLegalLinks"]>[number];
type FooterColumn = NonNullable<SectionData["footerColumns"]>[number];

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

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebookF className="h-5 w-5" />,
  instagram: <FaInstagram className="h-5 w-5" />,
  twitter: <FaXTwitter className="h-5 w-5" />,
  x: <FaXTwitter className="h-5 w-5" />,
  linkedin: <FaLinkedinIn className="h-5 w-5" />,
  youtube: <FaYoutube className="h-5 w-5" />,
  pinterest: <FaPinterestP className="h-5 w-5" />,
  pintest: <FaPinterestP className="h-5 w-5" />,
};

export default function EventsFooter1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const columns = (data.footerColumns ?? []) as FooterColumn[];
  const storedSocialLinks = (data.footerSocialLinks ?? []) as FooterLink[];
  const editorSocialLinks = (data.socialLinks ?? []) as FooterLink[];
  const socialLinks =
    editorSocialLinks.length >= storedSocialLinks.length
      ? editorSocialLinks
      : storedSocialLinks;
  const legalLinks = (data.footerLegalLinks ?? []) as FooterLink[];
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
  const contact = data.footerContact;
  const footerSolidColor = toText(data.footerBackgroundColor) ?? "#230f20";
  const footerGradientColor =
    toText(data.footerGradientColor) ?? footerSolidColor;
  const footerBackground =
    data.footerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${footerSolidColor}, ${footerGradientColor})`
      : footerSolidColor;
  // The editor exposes a single footer text color, so muted text is the same
  // color at a lower opacity instead of a separate fixed shade.
  const textColor = toText(data.footerTextColor) ?? "#ffffff";

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

  return (
    <div className="w-full bg-white pt-10 sm:pt-14 lg:pt-16">
      <footer
        className="w-full rounded-t-[2.5rem] border-t-[6px] border-[#e91e63] pb-8 pt-16 font-sans"
        style={{ background: footerBackground, color: textColor }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
            {/* Logo and Social */}
            <div className="space-y-4">
              <Link
                href="/"
                data-editor-no-inline
                onClick={(event) => handleNavigate(event, "/", "Home")}
              >
                {showLogoImage ? (
                  <div className="flex items-center">
                    <div className="flex h-16 w-16 items-center justify-center">
                      <Image
                        src={logoImage!}
                        alt={data.logoImageTitle ?? logoText ?? "Logo"}
                        width={64}
                        height={64}
                        unoptimized={isUnoptimizedImageSrc(logoImage!)}
                        className="object-contain"
                      />
                    </div>
                    {showLogoText ? (
                      <span className="text-md font-bold uppercase text-[#d61b58]">
                        {logoText}
                      </span>
                    ) : null}
                  </div>
                ) : showLogoText ? (
                  <div className="text-md font-bold uppercase text-[#d61b58]">
                    {logoText}
                  </div>
                ) : null}
              </Link>
              {logoDesc ? (
                <p className="text-md mt-2 max-w-md leading-relaxed opacity-80">
                  {logoDesc}
                </p>
              ) : null}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {socialLinks.map((item, idx) => {
                    const label = (item.label ?? "").toString().toLowerCase();
                    const icon = socialIcons[label] ?? (
                      <span className="text-xs font-bold uppercase">
                        {label.charAt(0)}
                      </span>
                    );
                    const href = item.href ?? "#";
                    const isExternal = href.startsWith("http");

                    return (
                      <Link
                        key={`${label}-${idx}`}
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        aria-label={item.label}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white bg-white/5 text-[#e91e63] transition hover:border-[#e91e63]"
                        onClick={(event) => {
                          if (isExternal || href === "#") return;
                          handleNavigate(event, href, item.label ?? label);
                        }}
                      >
                        {icon}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {columns.map((column, idx) => (
              <div key={`${column.title}-${idx}`}>
                <h3 className="text-md mb-6 font-semibold text-[#e91e63]">
                  {column.title}
                </h3>
                <div className="space-y-4">
                  {(column.links ?? []).map((link, linkIdx) => (
                    <Link
                      key={`${link.label}-${linkIdx}`}
                      href={link.href ?? "#"}
                      className="block text-sm opacity-80 transition hover:opacity-100"
                      onClick={(event) =>
                        handleNavigate(
                          event,
                          link.href ?? "#",
                          link.label ?? "Home",
                        )
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h3 className="text-md mb-6 font-semibold text-[#e91e63]">
                Contact Us
              </h3>
              <div className="space-y-4">
                {contact?.phone && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-[#e91e63]">
                      <FaPhoneAlt className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="text-sm opacity-80">{contact.phone}</p>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-[#e91e63]">
                      <FaEnvelope className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="text-sm opacity-80">{contact.email}</p>
                  </div>
                )}
                {contact?.location && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-[#e91e63]">
                      <FaMapMarkerAlt className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="text-sm opacity-80">{contact.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center gap-3 border-t border-current/30 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm opacity-70">{data.copyrightText}</p>
            {legalLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 md:justify-end md:gap-6">
                {legalLinks.map((link, idx) => (
                  <Link
                    key={`${link.label}-${idx}`}
                    href={link.href ?? "#"}
                    className="text-sm opacity-70 transition hover:opacity-100"
                    onClick={(event) =>
                      handleNavigate(
                        event,
                        link.href ?? "#",
                        link.label ?? "Home",
                      )
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
