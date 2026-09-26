"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import NGOCareersApplyModal2, {
  type NGOCareerJob,
} from "./NGOCareersApplyModal2";

export default function NGOCareersRoles2({ data = {} }: SectionProps) {
  const jobs = (Array.isArray(data.jobs)
    ? data.jobs
    : Array.isArray(data.roles)
      ? data.roles
      : []) as NGOCareerJob[];
  const title =
    (typeof data.rolesTitle === "string" && data.rolesTitle) ||
    "Open Positions";
  const applyLabel =
    (typeof data.rolesApplyLabel === "string" && data.rolesApplyLabel) ||
    "Job details";

  const [showAllJobs, setShowAllJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<NGOCareerJob | null>(null);
  const visibleJobs = showAllJobs ? jobs : jobs.slice(0, 4);

  return (
    <>
      <section
        data-editor-section-label="Open Roles"
        data-editor-fields="rolesTitle rolesApplyLabel jobs"
        data-editor-card-fields="title description location employmentType"
        className="px-4 font-sans text-slate-900 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 text-center">
            <h2 className="font-serif text-3xl font-extrabold text-[#0d152e] sm:text-4xl">
              {title}
            </h2>
          </div>

          <div id="jobs" className="flex flex-col gap-4">
            {visibleJobs.map((job) => (
              <div
                key={job.id ?? job.title}
                className="group flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] md:flex-row md:items-center md:px-8 md:py-6"
              >
                <div className="flex items-start gap-4 md:max-w-md">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0eb] text-[#ff541b]">
                    {(job.employmentType || "").toLowerCase().includes("full") ? (
                      <FiBriefcase className="text-xl" />
                    ) : (
                      <FiClock className="text-xl" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#0d152e] transition-colors group-hover:text-[#ff541b]">
                      {job.title}
                    </h3>

                    {job.description ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#64748b]">
                        {job.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 sm:gap-8">
                  {job.location ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0eb]/60 text-[#ff541b]">
                        <FiMapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-[#94a3b8]">
                          Location
                        </p>
                        <p className="text-sm font-bold text-[#0d152e]">
                          {job.location}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {job.employmentType ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0eb]/60 text-[#ff541b]">
                        <FiClock size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-[#94a3b8]">
                          Job Type
                        </p>
                        <p className="text-sm font-bold text-[#0d152e]">
                          {job.employmentType}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#ff541b] px-5 py-2.5 text-sm font-bold text-[#ff541b] transition-all duration-300 hover:bg-[#ff541b] hover:text-white md:w-auto"
                  >
                    <span>{applyLabel}</span>
                    <FiArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {jobs.length > 4 ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllJobs(!showAllJobs)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-100 bg-white px-6 py-3 text-sm font-bold text-[#ff541b] shadow-sm transition-all duration-300 hover:bg-[#fff0eb] hover:shadow-md"
              >
                <span>
                  {showAllJobs ? "View Less Positions" : "View More Positions"}
                </span>
                {showAllJobs ? (
                  <FiChevronUp className="text-base" />
                ) : (
                  <FiChevronDown className="text-base" />
                )}
              </button>
            </div>
          ) : null}

          {jobs.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#0d152e]">
                No Open Positions
              </h3>
              <p className="mt-2 text-sm text-[#64748b]">
                There are currently no open positions. Please check back later.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <NGOCareersApplyModal2
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        pageData={data}
      />
    </>
  );
}
