"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import type { IconType } from "react-icons";

import type { SectionProps, TeamMemberData } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const socialIconMap: Record<string, IconType> = {
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  instagram: FaInstagram,
};

export default function EventsTeam1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const members = (
    data.members ??
    data.teamItems ??
    ((data as { items?: TeamMemberData[] }).items ?? [])
  ) as TeamMemberData[];
  const joinButton = data.joinButton;
  const visibleMembers = members.slice(0, 3);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mt-8 w-full md:mt-10 lg:mt-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div
          className={`grid gap-6 transition-all delay-200 duration-1000 sm:grid-cols-2 lg:grid-cols-3 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {visibleMembers.map((member, idx) => {
            const memberId =
              member.id ||
              (member.name ?? "").toLowerCase().replace(/\s+/g, "-");
            const social = member.social;

            return (
              <div
                key={member.id ?? `${member.name ?? "member"}-${idx}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link
                  href={`/teams/${memberId}`}
                  className="flex flex-1 cursor-pointer flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name ?? "Team Member"}
                        data-editor-media
                        data-editor-media-type="image"
                        data-editor-media-src={member.image}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        unoptimized={isUnoptimizedImageSrc(member.image)}
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

        {joinButton?.label && (
          <div className="mt-10 flex justify-center">
            <Link
              href={joinButton.href ?? "/src/pages/teams"}
              className="group inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full bg-[#d61b58] px-6 text-sm font-semibold text-white shadow-xl shadow-[#d61b58]/10 transition hover:bg-[#b01648]"
            >
              {joinButton.label}
              <span
                className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-3"
                aria-hidden
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
