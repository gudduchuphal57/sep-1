"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import type { IconType } from "react-icons";

import type {
  SectionProps,
  TeamDepartmentData,
  TeamMemberData,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const socialIconMap: Record<string, IconType> = {
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  instagram: FaInstagram,
};

export default function EventsTeamMembers1({ data = {} }: SectionProps) {
  const departments = (data.departments ?? []) as TeamDepartmentData[];
  const members = (data.members ?? data.teamItems ?? []) as TeamMemberData[];

  const [activeTab, setActiveTab] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = members.filter(
    (member) => activeTab === "all" || member.department === activeTab,
  );

  return (
    <section
      ref={sectionRef}
      data-editor-section-label="Team Members"
      data-editor-fields="departments members"
      data-editor-card-fields="image name role department bio social"
      className="mt-8 md:mt-10 lg:mt-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {departments.length > 0 && (
          <div
            className={`mb-12 flex flex-wrap justify-center gap-2 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            {departments.map((dept, index) => {
              const value = dept.value ?? "all";
              const isActive = activeTab === value;

              return (
                <button
                  key={`${value}-${index}`}
                  type="button"
                  onClick={() => setActiveTab(value)}
                  className={`cursor-pointer rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? "border-[#d61b58] bg-[#fce7ef] text-[#b01648] shadow-md shadow-[#d61b58]/20"
                      : "border-[#d61b58] text-[#d61b58] hover:bg-[#fce7ef]"
                  }`}
                >
                  {dept.label}
                </button>
              );
            })}
          </div>
        )}

        <div
          data-box-layout-grid="grid"
          className={`grid gap-6 transition-all delay-200 duration-1000 sm:grid-cols-2 lg:grid-cols-3 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          {filtered.map((member, index) => {
            const memberId =
              member.id ||
              (member.name ?? "").toLowerCase().replace(/\s+/g, "-");
            const social = member.social;
            const image = member.image;

            return (
              <div
                key={member.id ?? `${member.name ?? "member"}-${index}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link
                  href={`/teams/${memberId}`}
                  className="flex flex-1 cursor-pointer flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    {image ? (
                      <Image
                        src={image}
                        alt={member.name ?? "Team Member"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:1024px) 100vw, 33vw"
                        unoptimized={isUnoptimizedImageSrc(image)}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {member.department && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d61b58]">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 pb-2">
                    <h3 className="text-lg font-extrabold text-slate-900 transition-colors duration-200 group-hover:text-[#d61b58]">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#d61b58]">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <p className="flex-1 text-sm leading-5 text-slate-500">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="px-6 pb-6 pt-2">
                  <div className="my-2 h-px bg-[#f4d4e1]" />

                  {social && (
                    <div className="flex items-center gap-3">
                      {(
                        [
                          ["linkedin", social.linkedin],
                          ["twitter", social.twitter],
                          ["instagram", social.instagram],
                        ] as const
                      ).map(([key, href]) => {
                        if (!href) return null;
                        const Icon = socialIconMap[key];
                        return (
                          <Link
                            key={key}
                            href={href}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f4d4e1] bg-white text-slate-600 transition-colors duration-200 hover:border-[#d61b58] hover:text-[#d61b58]"
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-0.5 w-0 rounded-b-[2rem] bg-[#d61b58] transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
