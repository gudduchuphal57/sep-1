"use client";

import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import NGOProjects2 from "../projects/NGOProjects2";

type ProjectItem = {
  title?: string;
  image?: string;
  href?: string;
  link?: string;
  description?: string;
  desc?: string;
  category?: string;
};

export default function NGOProjectsGrid2({ data = {} }: SectionProps) {
  const projects = (Array.isArray(data.projects)
    ? data.projects
    : Array.isArray(data.cards)
      ? data.cards
      : null) as ProjectItem[] | null;

  if (!projects) {
    return (
      <div data-editor-section-label="Projects Grid">
        <NGOProjects2 data={data} />
      </div>
    );
  }

  return (
    <section
      data-editor-section-label="Projects Grid"
      data-editor-fields="projects cards title description"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => {
          const href = project.href ?? project.link ?? "#";
          return (
            <Link
              key={`${project.title}-${idx}`}
              href={href}
              className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden bg-orange-50">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title || "Project"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(project.image)}
                  />
                ) : null}
              </div>
              <div className="p-5">
                {project.category ? (
                  <p className="text-xs font-bold uppercase tracking-wide text-[#ff541b]">
                    {project.category}
                  </p>
                ) : null}
                <h3 className="mt-2 text-lg font-bold text-[#0F172A]">
                  {project.title}
                </h3>
                {(project.description || project.desc) ? (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {project.description || project.desc}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
