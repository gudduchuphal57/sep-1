"use client";

import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { SectionProps } from "../../../types/section";

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  twitter: <FaXTwitter />,
  x: <FaXTwitter />,
  youtube: <FaYoutube />,
};

function getSocialIcon(label: string) {
  return socialIcons[label.toLowerCase()] ?? label.charAt(0).toUpperCase();
}

export default function RealEstateFooter1({ data = {} }: SectionProps) {

  const footerBackgroundType =
    data.footerBackgroundType === "gradient" ? "gradient" : "solid";

  const footerBackgroundColor =
    typeof data.footerBackgroundColor === "string" &&
      data.footerBackgroundColor.trim()
      ? data.footerBackgroundColor
      : "#17241f";

  const footerGradientColor =
    typeof data.footerGradientColor === "string" &&
      data.footerGradientColor.trim()
      ? data.footerGradientColor
      : "#1d4ed8";

  const footerTextColor =
    typeof data.footerTextColor === "string" &&
      data.footerTextColor.trim()
      ? data.footerTextColor
      : "#ffffff";

  const footerBackground =
    footerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${footerBackgroundColor}, ${footerGradientColor})`
      : footerBackgroundColor;


  const columns = (data.footerColumns ?? []).map((column) =>
    column.title.trim().toLowerCase() === "tools & help"
      ? {
        ...column,
        links: column.links.filter(
          (link) => link.label.trim().toLowerCase() !== "sitemap",
        ),
      }
      : column,
  );
  const contact = data.footerContact;
  const legalLinks = data.footerLegalLinks ?? [];
  const socialLinks = data.socialLinks ?? data.footerSocialLinks ?? [];
  const logoText = data.logo === undefined ? "HAUS Group" : data.logo;
  const hasBrandSection = Boolean(logoText || data.logoImage || data.desc);
  const hasBottomBar = Boolean(
    data.copyrightText || legalLinks.length || socialLinks.length,
  );

  return (
    <footer
      style={{
        background: footerBackground,
        color: footerTextColor,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        {hasBrandSection && (
          <div className="border-b border-white/10 pb-12">
            <div>
              <Link
                href="/"
                className="inline-block text-xl font-bold uppercase tracking-[0.16em] text-white"
              >
                {logoText}
              </Link>
              {data.desc && (
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
                  {data.desc}
                </p>
              )}
            </div>
          </div>
        )}

        {columns.length > 0 && (
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}

        {contact && (
          <div className="grid border-y border-white/10 sm:grid-cols-3">
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="group flex items-start gap-3 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03] sm:border-b-0 sm:border-r sm:px-6"
              >
                <FaPhoneAlt className="mt-1 shrink-0 text-[#e9ad91]" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    {data.contactLabel ?? "Call an advisor"}
                  </span>
                  <span className="mt-1 block text-sm text-white/75 group-hover:text-white">
                    {contact.phone}
                  </span>
                </span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-start gap-3 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03] sm:border-b-0 sm:border-r sm:px-6"
              >
                <FaEnvelope className="mt-1 shrink-0 text-[#e9ad91]" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Email us
                  </span>
                  <span className="mt-1 block break-all text-sm text-white/75 group-hover:text-white">
                    {contact.email}
                  </span>
                </span>
              </a>
            )}
            {contact.location && (
              <div className="flex items-start gap-3 py-6 sm:px-6">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#e9ad91]" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    {data.officeLabel ?? "Visit us"}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-white/75">
                    {contact.location}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {data.disclaimerText && (
          <p className="py-7 text-[11px] leading-6 text-white/35">
            <span className="font-semibold text-white/50">
              {data.disclaimerTitle ?? "Disclaimer"}:{" "}
            </span>
            {data.disclaimerText}
          </p>
        )}
      </div>

      {hasBottomBar && (
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 text-xs text-white/40 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            {data.copyrightText && <p>{data.copyrightText}</p>}

            {legalLinks.length > 0 && (
              <nav aria-label={data.legalTitle ?? "Legal"}>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {legalLinks.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link href={link.href} className="transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const isExternal = social.href.startsWith("http");
                  return (
                    <a
                      key={`${social.label}-${social.href}`}
                      href={social.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={social.label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-xs text-white/60 transition-colors hover:border-[#e9ad91] hover:bg-[#e9ad91] hover:text-[#17241f]"
                    >
                      {getSocialIcon(social.label)}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
