"use client";

import type { SectionProps } from "../../../types/section";

type SkillItem = { skill?: string; percentage?: number };

export default function NGOTeamDetailAbout2({ data = {} }: SectionProps) {
  const name = (typeof data.name === "string" && data.name) || "Member";
  const about = Array.isArray(data.about)
    ? (data.about as string[]).filter(
        (item): item is string => typeof item === "string" && Boolean(item.trim()),
      )
    : [];
  const skills = Array.isArray(data.skills)
    ? (data.skills as (SkillItem | string)[])
    : [];

  if (about.length === 0 && skills.length === 0) return null;

  return (
    <section
      data-editor-section-label="About & Skills"
      data-editor-fields="about skills"
      data-editor-card-fields="skill percentage"
      className="bg-slate-50/50 pb-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            About {name}
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            {about.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Expertise & Skills
          </h2>
          <div className="space-y-5">
            {skills.map((item, idx) => {
              const skillName =
                typeof item === "string"
                  ? item
                  : typeof item.skill === "string"
                    ? item.skill
                    : "";
              const percentage =
                typeof item === "object" && typeof item.percentage === "number"
                  ? item.percentage
                  : 0;
              return (
                <div key={`${skillName}-${idx}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">
                      {skillName}
                    </span>
                    {percentage > 0 ? (
                      <span className="text-sm font-bold text-slate-600">
                        {percentage}%
                      </span>
                    ) : null}
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${percentage || 70}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
