"use client";

import { Briefcase } from "lucide-react";
import type { SectionProps } from "../../../types/section";

type ExperienceItem = {
  period?: string;
  role?: string;
  organization?: string;
  description?: string;
};

export default function NGOTeamDetailExperience2({ data = {} }: SectionProps) {
  const experience = Array.isArray(data.experience)
    ? (data.experience as ExperienceItem[])
    : [];

  if (experience.length === 0) return null;

  return (
    <section
      data-editor-section-label="Experience"
      data-editor-fields="experience"
      data-editor-card-fields="period role organization description"
      className="bg-slate-50/50 pb-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Experience</h2>
        </div>

        <div className="relative my-8 flex items-center justify-between px-4 sm:px-20">
          <div className="absolute inset-x-0 border-b-2 border-dashed border-orange-300" />
          {experience.slice(0, 4).map((_, idx) => (
            <div
              key={idx}
              className="relative z-10 h-5 w-5 rounded-full border-4 border-slate-50 bg-orange-500 ring-2 ring-orange-400"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experience.map((exp, idx) => (
            <div
              key={`${exp.role}-${idx}`}
              className="relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="flex-1">
                {exp.period ? (
                  <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                    {exp.period}
                  </span>
                ) : null}
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {exp.role}
                </h3>
                {exp.organization ? (
                  <p className="mb-3 text-sm font-medium text-orange-600">
                    {exp.organization}
                  </p>
                ) : null}
                {exp.description ? (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {exp.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
