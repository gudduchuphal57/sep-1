"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type ProjectItem = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCsrProjects2({ data = {} }: SectionProps) {
  const csrProjects = isRecord(data.csrProjects) ? data.csrProjects : {};
  const title =
    (typeof data.projectsPretitle === "string" && data.projectsPretitle) ||
    (typeof csrProjects.topBadge === "string" && csrProjects.topBadge) ||
    "OUR CSR PROJECTS";
  const items = (
    Array.isArray(data.csrProjectItems)
      ? data.csrProjectItems
      : Array.isArray(csrProjects.items)
        ? csrProjects.items
        : []
  ) as ProjectItem[];

  if (!items.length && !title) return null;

  return (
    <section
      data-editor-section-label="CSR Projects"
      data-editor-fields="projectsPretitle csrProjectItems"
      data-editor-card-fields="image title description"
      className="w-full bg-slate-50 px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((project, index) => (
            <div
              key={project.id ?? `${project.title}-${index}`}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 w-full overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title || "CSR project"}
                    fill
                    className="object-cover"
                    unoptimized={isUnoptimizedImageSrc(project.image)}
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="mb-2 font-serif text-sm font-bold text-slate-900">
                    {project.title}
                  </h3>
                  {project.description ? (
                    <p className="text-sm leading-relaxed text-slate-500">
                      {project.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
