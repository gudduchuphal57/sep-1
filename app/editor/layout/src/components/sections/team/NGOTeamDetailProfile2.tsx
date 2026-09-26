"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Globe,
  Briefcase,
  CheckCircle,
  Award,
} from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import {
  ngoSocialIconMap,
  renderNgoSocialIcon,
} from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type StatItem = { value?: string; label?: string };

const statIcons = [
  <Briefcase key="exp" className="mx-auto mb-1 h-5 w-5 text-orange-500" />,
  <CheckCircle
    key="projects"
    className="mx-auto mb-1 h-5 w-5 text-orange-500"
  />,
  <Award key="rate" className="mx-auto mb-1 h-5 w-5 text-orange-500" />,
];

export default function NGOTeamDetailProfile2({ data = {} }: SectionProps) {
  const name = (typeof data.name === "string" && data.name) || "";
  const role =
    (typeof data.role === "string" && data.role) ||
    (typeof data.designation === "string" && data.designation) ||
    "";
  const bio =
    (typeof data.bio === "string" && data.bio) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const image = (typeof data.image === "string" && data.image) || "";
  const stats = Array.isArray(data.stats) ? (data.stats as StatItem[]) : [];
  const contactInfo = isRecord(data.contactInfo) ? data.contactInfo : undefined;
  const socialLinks = isRecord(data.socialLinks)
    ? data.socialLinks
    : undefined;

  const languages = Array.isArray(contactInfo?.languages)
    ? (contactInfo.languages as string[]).join(", ")
    : typeof contactInfo?.languages === "string"
      ? contactInfo.languages
      : "";

  const socialEntries = socialLinks
    ? Object.entries(socialLinks).filter(
        ([key, href]) =>
          typeof href === "string" &&
          Boolean(href) &&
          (ngoSocialIconMap[key] || ngoSocialIconMap[key.toLowerCase()]),
      )
    : [];

  return (
    <section
      data-editor-section-label="Team Profile"
      data-editor-fields="name role bio image stats contactInfo socialLinks"
      data-editor-card-fields="value label"
      className="bg-slate-50/50 py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="w-full lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-xl">
              <div className="relative h-[580px] w-full">
                {image ? (
                  <Image
                    src={image}
                    alt={name || "Team member"}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized={isUnoptimizedImageSrc(image)}
                  />
                ) : (
                  <div className="h-full w-full bg-orange-50" />
                )}
              </div>

              {stats.length > 0 ? (
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 divide-x divide-slate-800 rounded-xl border border-slate-800/50 bg-slate-950/70 p-4 text-center text-white shadow-lg backdrop-blur-sm sm:p-5">
                  {stats.map((stat, idx) => (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="flex flex-col items-center justify-center px-2"
                    >
                      {statIcons[idx % statIcons.length]}
                      <h4 className="text-xl font-extrabold text-orange-500 sm:text-2xl lg:text-3xl">
                        {stat.value}
                      </h4>
                      <p className="mt-0.5 min-h-8 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full lg:col-span-7">
            <div className="space-y-6">
              <div>
                {role ? (
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    {role}
                  </span>
                ) : null}
                <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {name}
                </h1>
                {bio ? (
                  <p className="mt-3 text-lg leading-relaxed text-slate-900">
                    {bio}
                  </p>
                ) : null}
              </div>

              {contactInfo ? (
                <div className="flex flex-col gap-4 border-y border-slate-200 py-4">
                  {typeof contactInfo.email === "string" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Email
                        </p>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-sm font-semibold text-slate-800 transition hover:text-orange-600"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {typeof contactInfo.phone === "string" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Phone
                        </p>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-sm font-semibold text-slate-800 transition hover:text-orange-600"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {typeof contactInfo.location === "string" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {contactInfo.location}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {typeof contactInfo.qualification === "string" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Qualification
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {contactInfo.qualification}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {languages ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Language
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {languages}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {socialEntries.length > 0 ? (
                <div className="flex items-center gap-3 pt-2">
                  {socialEntries.map(([key, href]) => (
                    <Link
                      key={key}
                      href={href as string}
                      target="_blank"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-orange-500 hover:text-white"
                      aria-label={key}
                    >
                      {renderNgoSocialIcon(key, "h-5 w-5")}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
