"use client";

import Link from "next/link";
import { FiMapPin, FiPhone } from "react-icons/fi";
import type { SectionProps, SocialLinkData } from "../../../types/section";
import { renderNgoSocialIcon } from "../../../lib/ngoIcons";

type Cta = { label?: string; href?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

export default function NGOTopbar2({ data = {} }: SectionProps) {
  const address = toText(data.address) ?? toText(data.location);
  const phone = toText(data.phone);
  const phoneHref =
    toText(data.phoneHref) ??
    (phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined);
  const headerCta: Cta | undefined = isRecord(data.headerCta)
    ? (data.headerCta as Cta)
    : data.buttons?.[0]
      ? { label: data.buttons[0].label, href: data.buttons[0].href }
      : undefined;
  const socialLinks = (data.socialLinks ?? []) as SocialLinkData[];
  const isHidden = (field: string) =>
    data.hiddenContentFields?.includes(field) ?? false;

  const topbarSolidColor = data.topbarBackgroundColor ?? "#ffffff";
  const topbarGradientColor = data.topbarGradientColor ?? "#ff541b";
  const topbarBackground =
    data.topbarBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${topbarSolidColor}, ${topbarGradientColor})`
      : topbarSolidColor;
  const topbarTextColor = data.topbarTextColor ?? "#0f172a";

  return (
    <section
      className="relative z-0 text-sm transition-all duration-300"
      style={{ background: topbarBackground, color: topbarTextColor }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-3 py-2 sm:justify-between sm:px-6 sm:py-1 lg:px-8">
        <div className="flex items-center gap-3 sm:ml-44 sm:gap-4">
          {!isHidden("location") && address ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <FiMapPin className="shrink-0 text-orange-500" size={14} />
              <span>{address}</span>
            </div>
          ) : null}

          {!isHidden("phone") && phone ? (
            <a href={phoneHref} className="flex items-center gap-1.5 text-sm">
              <FiPhone className="shrink-0 text-orange-500" size={14} />
              <span>{phone}</span>
            </a>
          ) : null}

          {!isHidden("headerCta") && headerCta?.label ? (
            <Link
              href={headerCta.href || "#"}
              className="hidden items-center justify-center rounded-full bg-orange-500 px-4 py-1 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all duration-200 hover:bg-orange-700 hover:shadow-lg hover:shadow-rose-600/30 sm:inline-flex"
            >
              {headerCta.label}
            </Link>
          ) : null}
        </div>

        {!isHidden("socialLinks") && socialLinks.length > 0 ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks.map((social, index) => {
              const label = social.label?.toLowerCase?.() ?? "";
              if (!label) return null;
              return (
                <a
                  key={`${social.label}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full p-1.5 transition-colors hover:bg-black/10 hover:opacity-80"
                >
                  {renderNgoSocialIcon(label, "h-3.5 w-3.5")}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
