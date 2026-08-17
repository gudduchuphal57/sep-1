"use client";

import type {
  EventsCaseStudyProjectPointData,
  SectionProps,
} from "../../../types/section";

export default function EventsCaseStudyProject1({ data = {} }: SectionProps) {
  const projectTitle =
    typeof data.projectTitle === "string" ? data.projectTitle : undefined;
  const projectDescription =
    typeof data.projectDescription === "string"
      ? data.projectDescription
      : undefined;
  const projectPoints = (data.projectPoints ??
    []) as EventsCaseStudyProjectPointData[];

  if (!projectTitle && !projectDescription && !projectPoints.length) {
    return null;
  }

  return (
    <section
      data-editor-section-label="Project Details"
      data-editor-fields="projectTitle projectDescription projectPoints"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="rounded-[1.5rem] border border-[#f4d4e1] bg-[#fff5f8] p-6">
        {projectTitle && (
          <h3 className="text-xl font-semibold text-slate-900">{projectTitle}</h3>
        )}
        {projectDescription && (
          <p className="mt-3 text-base leading-6 text-slate-600">
            {projectDescription}
          </p>
        )}

        {projectPoints.length > 0 && (
          <div className="mt-3 space-y-3">
            {projectPoints.map((point, index) => (
              <div key={`${point.title}-${index}`}>
                {point.title && (
                  <h4 className="font-semibold text-slate-900">{point.title}</h4>
                )}
                {point.description && (
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {point.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
