"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import {
  ngoSocialIconMap,
  renderNgoSocialIcon,
} from "../../../lib/ngoIcons";

type SocialLink = { icon?: string; href?: string; label?: string };
type TeamMember = {
  name?: string;
  role?: string;
  designation?: string;
  description?: string;
  image?: string;
  href?: string;
  link?: string;
  textLink?: string;
  socialLinks?: SocialLink[];
  socials?: SocialLink[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const TEAM_DETAIL_HREF = "/team-detail";

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value.trim();
  if (!isRecord(value)) return "";
  return [value.line1, value.highlight, value.line2, value.title]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOTeam2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const heading = isRecord(data.heading) ? data.heading : undefined;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle.trim()) ||
    (typeof badge?.label === "string" && badge.label.trim()) ||
    "Meet Our Team";
  const headingTitle =
    typeof heading?.title === "string" ? heading.title.trim() : "";
  const headingHighlight =
    typeof heading?.highlight === "string" ? heading.highlight.trim() : "";
  const composedHeading =
    headingTitle &&
    headingHighlight &&
    !headingTitle.toLowerCase().includes(headingHighlight.toLowerCase())
      ? `${headingTitle} ${headingHighlight}`
      : headingTitle;
  const rawTitle = toTitleText(data.title);
  const title =
    (rawTitle && rawTitle.toLowerCase() !== pretitle.toLowerCase()
      ? rawTitle
      : composedHeading &&
          composedHeading.toLowerCase() !== pretitle.toLowerCase()
        ? composedHeading
        : rawTitle) ||
    composedHeading ||
    "Our Team";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const members = (Array.isArray(data.members)
    ? data.members
    : Array.isArray(data.teamMembers)
      ? data.teamMembers
      : Array.isArray(data.cards)
        ? data.cards
        : []) as TeamMember[];

  return (
    <section
      data-editor-section-label="Team"
      data-editor-fields="pretitle title desc members"
      data-editor-card-fields="image name designation description socials"
      className="relative overflow-hidden bg-[#fafafa] px-0 py-8 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, idx) => {
            const role = member.designation || member.role || "";
            const socials = Array.isArray(member.socials)
              ? member.socials
              : Array.isArray(member.socialLinks)
                ? member.socialLinks
                : [];
            return (
              <div
                key={`${member.name}-${idx}`}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={TEAM_DETAIL_HREF} className="relative block h-72 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name || "Team member"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1280px) 50vw, 25vw"
                      unoptimized={isUnoptimizedImageSrc(member.image)}
                    />
                  ) : (
                    <div className="h-full w-full bg-orange-50" />
                  )}
                </Link>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    <Link
                      href={TEAM_DETAIL_HREF}
                      className="transition hover:text-[#ff541b]"
                    >
                      {member.name}
                    </Link>
                  </h3>
                  {role ? (
                    <p className="mt-1 text-sm text-[#ff541b]">{role}</p>
                  ) : null}
                  {member.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {member.description}
                    </p>
                  ) : null}
                  {socials.length > 0 ? (
                    <div className="mt-3 flex justify-center gap-2">
                      {socials.map((social, sIdx) => {
                        const iconKey = (
                          social.icon ||
                          social.label ||
                          ""
                        ).trim();
                        const mapped =
                          ngoSocialIconMap[iconKey] ||
                          ngoSocialIconMap[iconKey.toLowerCase()];
                        if (!mapped) return null;
                        return (
                          <Link
                            key={`${iconKey}-${sIdx}`}
                            href={social.href || "#"}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ff541b] transition hover:bg-[#ff541b] hover:text-white"
                            aria-label={social.label || iconKey || "social"}
                          >
                            {renderNgoSocialIcon(iconKey, "h-3.5 w-3.5")}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div> 
      </div>
    </section>
  );
}
