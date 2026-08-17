"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiSparkles } from "react-icons/hi";

import type { SectionProps, TeamMemberData } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsTeamDetailContent1({ data = {} }: SectionProps) {
  const member = data as TeamMemberData;
  const image = member.image ?? "/categories/events/template1/team1.jpg";
  const skills = member.skills ?? [];

  return (
    <section
      data-editor-section-label="Team Profile"
      data-editor-fields="image name role department email phone bio longBio skills social"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative lg:sticky lg:top-28">
          <div className="group overflow-hidden rounded-[2.5rem] border border-[#f4d4e1] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(214,27,88,0.25)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-30px_rgba(214,27,88,0.35)]">
            <div className="relative h-[22rem] w-full overflow-hidden rounded-[2rem] sm:h-[26rem] lg:h-[30rem]">
              <Image
                src={image}
                alt={member.name ?? "Team Member"}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                unoptimized={isUnoptimizedImageSrc(image)}
              />
              {member.department && (
                <span className="absolute left-4 top-4 rounded-full bg-[#d61b58] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#d61b58]/20">
                  {member.department}
                </span>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Contact Details
              </h4>
              <div className="h-px bg-[#f4d4e1]" />

              {member.email && (
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fee4ee] text-[#d61b58]">
                    <HiOutlineMail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm font-bold text-slate-800 transition-colors hover:text-[#d61b58]"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fee4ee] text-[#d61b58]">
                    <HiOutlinePhone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </p>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-sm font-bold text-slate-800 transition-colors hover:text-[#d61b58]"
                    >
                      {member.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {member.social && (
              <div className="mt-8">
                <h4 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Connect
                </h4>
                <div className="flex items-center gap-3">
                  {member.social.linkedin && (
                    <Link
                      href={member.social.linkedin}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f4d4e1] bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d61b58] hover:bg-[#d61b58] hover:text-white"
                    >
                      <FaLinkedinIn className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.twitter && (
                    <Link
                      href={member.social.twitter}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f4d4e1] bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d61b58] hover:bg-[#d61b58] hover:text-white"
                    >
                      <FaTwitter className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.instagram && (
                    <Link
                      href={member.social.instagram}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f4d4e1] bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d61b58] hover:bg-[#d61b58] hover:text-white"
                    >
                      <FaInstagram className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 lg:pt-0">
          <div>
            {member.role && (
              <span className="rounded-lg bg-[#fee4ee] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#d61b58]">
                {member.role}
              </span>
            )}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              {member.name}
            </h1>
            {member.department && (
              <p className="mt-3 text-lg font-medium text-slate-500">
                Department:{" "}
                <span className="font-bold capitalize text-slate-700">
                  {member.department}
                </span>
              </p>
            )}
          </div>

          {member.bio && (
            <div className="mt-8 border-l-4 border-[#d61b58] pl-5">
              <p className="text-md font-medium italic leading-relaxed text-slate-700 md:text-lg">
                &quot;{member.bio}&quot;
              </p>
            </div>
          )}

          {member.longBio && (
            <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
              <h3 className="text-2xl font-bold text-slate-900">About Me</h3>
              <p className="text-base sm:text-[17px]">{member.longBio}</p>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mt-8 rounded-[2rem] border border-[#f4d4e1] bg-gradient-to-br from-[#fff7fa] to-white p-6 shadow-sm shadow-[#d61b58]/5">
              <h3 className="text-xl font-bold text-slate-900">Core Strengths</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {skills.map((skill, index) => {
                  const title = skill.title ?? "";
                  const description =
                    skill.description ??
                    "A key part of the experience I bring to every project.";

                  return (
                  <div
                    key={`${title}-${index}`}
                    className="group flex items-start gap-3 rounded-2xl border border-[#f4d4e1] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#d61b58] hover:shadow-[0_15px_35px_-20px_rgba(214,27,88,0.35)]"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fee4ee] text-[#d61b58]">
                      <HiSparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{title}</p>
                      {description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
