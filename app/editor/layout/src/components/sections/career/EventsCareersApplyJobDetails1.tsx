"use client";

import {
  Briefcase,
  CalendarClock,
  CircleDot,
  Clock,
  GitBranch,
  MapPin,
} from "lucide-react";

import type {
  EventsCareersApplyFormData,
  EventsCareersRoleData,
  SectionProps,
} from "../../../types/section";

export default function EventsCareersApplyJobDetails1({ data = {} }: SectionProps) {
  const job = data as EventsCareersRoleData;
  const formConfig = (data.applyForm ?? {}) as EventsCareersApplyFormData;

  return (
    <section
      data-editor-section-label="Job Details"
      data-editor-fields="title department location type experience postedOn description"
      className="rounded-[2rem] border border-[#f4d4e1]/60 bg-white p-6 shadow-sm shadow-[#d61b58]/5"
    >
      <h3 className="mb-2 text-lg font-extrabold tracking-tight text-slate-900">
        {formConfig.jobDetailsTitle ?? "Job Details"}
      </h3>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#fde8ef] bg-[#fff5f8] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#f4d4e1]/40 bg-white text-[#d61b58] shadow-sm">
          <Briefcase className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h4
            data-editor-field="title"
            className="text-sm font-bold leading-tight text-slate-900"
          >
            {job.title ?? "Position Details"}
          </h4>
          {job.department && (
            <p
              data-editor-field="department"
              className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#d61b58]"
            >
              {job.department}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 text-sm">
          <GitBranch className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="mt-0.5 font-semibold text-slate-800">
              {job.department ?? "Operations & Production"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <MapPin className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xs text-slate-400">Location</p>
            <p
              data-editor-field="location"
              className="mt-0.5 font-semibold text-slate-800"
            >
              {job.location ?? "Delhi"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <CalendarClock className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xs text-slate-400">Experience</p>
            <p
              data-editor-field="experience"
              className="mt-0.5 font-semibold text-slate-800"
            >
              {job.experience ?? "3 - 5 Years"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <CircleDot className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xs text-slate-400">Job Type</p>
            <p
              data-editor-field="type"
              className="mt-0.5 font-semibold text-slate-800"
            >
              {job.type ?? "Full-time"}
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-slate-100" />

        <div className="flex items-start gap-3 text-sm">
          <Clock className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xs text-slate-400">Posted On</p>
            <p
              data-editor-field="postedOn"
              className="mt-0.5 font-semibold text-slate-800"
            >
              {job.postedOn ?? "20 May, 2024"}
            </p>
          </div>
        </div>

        {job.description && (
          <p
            data-editor-field="description"
            className="text-sm leading-6 text-slate-600"
          >
            {job.description}
          </p>
        )}
      </div>
    </section>
  );
}
