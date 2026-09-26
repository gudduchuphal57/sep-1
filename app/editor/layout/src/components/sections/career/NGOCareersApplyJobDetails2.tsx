"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  FiFileText,
  FiList,
  FiCheckCircle,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiAward,
  FiDollarSign,
  FiUsers,
  FiArrowRight,
  FiHeadphones,
  FiMail,
  FiGift,
  FiTrendingUp,
  FiLayers,
} from "react-icons/fi";
import { GiCheckedShield, GiLifeSupport } from "react-icons/gi";
import { IoMdClock } from "react-icons/io";
import { FaGift } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";

type Perk = { title?: string; icon?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const iconMap: Record<string, ReactNode> = {
  FiShield: <GiCheckedShield className="text-xl md:text-4xl" />,
  FiTrendingUp: <FiTrendingUp className="text-xl md:text-4xl" />,
  FiHeart: <GiLifeSupport className="text-xl md:text-4xl" />,
  FiClock: <IoMdClock className="text-xl md:text-4xl" />,
  FiGift: <FaGift className="text-xl md:text-4xl" />,
};

export default function NGOCareersApplyJobDetails2({ data = {} }: SectionProps) {
  const job = isRecord(data.job) ? data.job : data;
  const title =
    (typeof job.title === "string" && job.title) ||
    (typeof data.title === "string" && data.title) ||
    "Job Details";
  const overview =
    (typeof job.overview === "string" && job.overview) ||
    (typeof data.overview === "string" && data.overview) ||
    "";
  const description =
    (typeof job.description === "string" && job.description) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const responsibilities = (
    Array.isArray(job.responsibilities)
      ? job.responsibilities
      : Array.isArray(data.responsibilities)
        ? data.responsibilities
        : []
  ) as string[];
  const requirements = (
    Array.isArray(job.requirements)
      ? job.requirements
      : Array.isArray(data.requirements)
        ? data.requirements
        : []
  ) as string[];
  const perks = (
    Array.isArray(job.perks)
      ? job.perks
      : Array.isArray(data.perks)
        ? data.perks
        : []
  ) as Perk[];
  const questionsSection = isRecord(job.questionsSection)
    ? job.questionsSection
    : isRecord(data.questionsSection)
      ? data.questionsSection
      : undefined;
  const applyButton = isRecord(job.applyButton)
    ? job.applyButton
    : isRecord(data.applyButton)
      ? data.applyButton
      : undefined;
  const cta = (
    isRecord(job.cta) ? job.cta : isRecord(data.cta) ? data.cta : undefined
  ) as Record<string, unknown> | undefined;
  const ctaButton = isRecord(cta?.button) ? cta.button : undefined;

  const employmentType =
    (typeof job.employmentType === "string" && job.employmentType) ||
    (typeof data.employmentType === "string" && data.employmentType) ||
    "";
  const department =
    (typeof job.department === "string" && job.department) ||
    (typeof data.department === "string" && data.department) ||
    "";
  const location =
    (typeof job.location === "string" && job.location) ||
    (typeof data.location === "string" && data.location) ||
    "";
  const experience =
    (typeof job.experience === "string" && job.experience) ||
    (typeof data.experience === "string" && data.experience) ||
    "";
  const vacancies =
    (typeof job.vacancies === "string" && job.vacancies) ||
    (typeof data.vacancies === "string" && data.vacancies) ||
    "";
  const salary =
    (typeof job.salary === "string" && job.salary) ||
    (typeof data.salary === "string" && data.salary) ||
    "";

  return (
    <section
      data-editor-section-label="Job Details"
      data-editor-fields="job title overview description responsibilities requirements perks questionsSection applyButton cta employmentType department location experience vacancies salary"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="w-full space-y-10 lg:col-span-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff541b] text-white">
                <FiFileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#0d152e] sm:text-2xl">
                Job Overview
              </h2>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-[#525b70] sm:text-base">
              {overview ? <p>{overview}</p> : null}
              {description ? <p>{description}</p> : null}
            </div>
          </div>

          {responsibilities.length > 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff541b] text-white">
                  <FiList size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0d152e] sm:text-2xl">
                  Key Responsibilities
                </h2>
              </div>

              <ul className="mt-6 space-y-3.5">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff541b]" />
                    <span className="text-sm leading-normal text-[#525b70] sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {requirements.length > 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff541b] text-white">
                  <FiAward size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0d152e] sm:text-2xl">
                  Requirements
                </h2>
              </div>

              <ul className="mt-6 space-y-3.5">
                {requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff541b]" />
                    <span className="text-sm leading-normal text-[#525b70] sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {perks.length > 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff541b] text-white">
                  <FiGift size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0d152e] sm:text-2xl">
                  What We Offer
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {perks.map((perk, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl bg-[#fff7f4] p-4 text-center transition-all duration-300 hover:bg-[#fff0eb]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ff541b] shadow-sm md:h-20 md:w-20">
                      {(perk.icon && iconMap[perk.icon]) || (
                        <FiGift className="text-xl" />
                      )}
                    </div>
                    <span className="mt-3 text-sm font-bold leading-tight text-[#0d152e]">
                      {perk.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="w-full space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] sm:p-7">
            <h3 className="text-lg font-bold text-[#0d152e]">Job Summary</h3>
            <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />

            <div className="mt-6 space-y-4 text-sm sm:text-sm">
              <div className="flex items-center justify-between border-b border-slate-50 py-1">
                <div className="flex items-center gap-2.5 text-[#64748b]">
                  <FiBriefcase className="text-[#ff541b]" />
                  <span>Job Title:</span>
                </div>
                <span className="font-semibold text-[#0d152e]">{title}</span>
              </div>

              {employmentType ? (
                <div className="flex items-center justify-between border-b border-slate-50 py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiClock className="text-[#ff541b]" />
                    <span>Job Type:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">
                    {employmentType}
                  </span>
                </div>
              ) : null}

              {department ? (
                <div className="flex items-center justify-between border-b border-slate-50 py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiUsers className="text-[#ff541b]" />
                    <span>Department:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">
                    {department}
                  </span>
                </div>
              ) : null}

              {location ? (
                <div className="flex items-center justify-between border-b border-slate-50 py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiMapPin className="text-[#ff541b]" />
                    <span>Location:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">
                    {location}
                  </span>
                </div>
              ) : null}

              {experience ? (
                <div className="flex items-center justify-between border-b border-slate-50 py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiAward className="text-[#ff541b]" />
                    <span>Experience:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">
                    {experience}
                  </span>
                </div>
              ) : null}

              {vacancies ? (
                <div className="flex items-center justify-between border-b border-slate-50 py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiLayers className="text-[#ff541b]" />
                    <span>Vacancies:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">
                    {vacancies}
                  </span>
                </div>
              ) : null}

              {salary ? (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5 text-[#64748b]">
                    <FiDollarSign className="text-[#ff541b]" />
                    <span>Salary:</span>
                  </div>
                  <span className="font-semibold text-[#0d152e]">{salary}</span>
                </div>
              ) : null}
            </div>

            {applyButton ? (
              <div className="mt-7">
                <Link
                  href={
                    (typeof applyButton.href === "string" &&
                      applyButton.href) ||
                    "#"
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff541b] py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#e0430e]"
                >
                  <span>
                    {(typeof applyButton.label === "string" &&
                      applyButton.label) ||
                      "Apply Now"}
                  </span>
                  <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ) : null}
          </div>

          {questionsSection ? (
            <div className="rounded-2xl border border-blue-50 bg-[#f0f5ff] p-6 text-center sm:p-7">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <FiHeadphones className="text-xl" />
              </div>

              {typeof questionsSection.title === "string" ? (
                <h4 className="mt-3 text-base font-bold text-[#0d152e]">
                  {questionsSection.title}
                </h4>
              ) : null}
              {typeof questionsSection.pretitle === "string" ? (
                <p className="mt-1 text-sm leading-relaxed text-[#64748b]">
                  {questionsSection.pretitle}
                </p>
              ) : null}

              <a
                href={
                  typeof questionsSection.phone === "string"
                    ? `tel:${questionsSection.phone}`
                    : "#"
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
              >
                <FiMail size={14} />
                <span>
                  {(typeof questionsSection.buttonLabel === "string" &&
                    questionsSection.buttonLabel) ||
                    "Contact HR Team"}
                </span>
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {cta ? (
        <div className="relative mt-14 w-full overflow-hidden rounded-3xl bg-[#fff2eb] p-6 sm:p-8 md:p-10">
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ff541b] text-white shadow-md sm:h-18 sm:w-18">
                <FiMail className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>

              <div className="max-w-md">
                {typeof cta.badge === "string" ? (
                  <span className="text-sm font-bold uppercase tracking-wider text-[#ff541b]">
                    {cta.badge}
                  </span>
                ) : null}
                {typeof cta.title === "string" ? (
                  <h3 className="mt-1 text-xl font-bold text-[#0d152e] sm:text-2xl">
                    {cta.title}
                  </h3>
                ) : null}
                {typeof cta.description === "string" ? (
                  <p className="mt-1 text-sm leading-relaxed text-[#525b70] sm:text-sm">
                    {cta.description}
                  </p>
                ) : null}
              </div>
            </div>

            {ctaButton ? (
              <div className="shrink-0">
                <Link
                  href={
                    (typeof ctaButton.href === "string" && ctaButton.href) ||
                    "#"
                  }
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#ff541b] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#e0430e] sm:text-sm"
                >
                  <span>
                    {(typeof ctaButton.label === "string" &&
                      ctaButton.label) ||
                      "Send Your Resume"}
                  </span>
                  <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
