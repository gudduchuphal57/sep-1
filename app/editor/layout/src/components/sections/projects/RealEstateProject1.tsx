"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import { RealEstatePagination } from "../buy-a-property/RealEstateProperty1";
import useCardPagination from "../types/useCardPagination";

type ProjectItem = {
  title: string;
  desc: string;
  image: string;
  alt: string;
  href: string;
  category: string;
  status: string;
  location: string;
};

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getProjects = (value: unknown): ProjectItem[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const record = item as Record<string, unknown>;
    const title = getString(record.title);
    const image = getString(record.image);
    if (!title || !image) return [];

    return [{
      title,
      desc: getString(record.desc, getString(record.description)),
      image,
      alt: getString(record.alt, title),
      href: getString(record.href, `/projects/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
      category: getString(record.category, getString(record.listingsLabel, "Project")),
      status: getString(record.status, getString(record.statusText)),
      location: getString(record.location),
    }];
  });
};

const getTabLabels = (value: unknown) =>
  Array.isArray(value)
    ? value.map((label) => (typeof label === "string" ? label : ""))
    : [];

export default function RealEstateProject1({ data = {} }: SectionProps) {
  const projects = useMemo(() => getProjects(data.projectItems), [data.projectItems]);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((item) => item.category).filter(Boolean)))],
    [projects],
  );
  const tabLabels = useMemo(() => getTabLabels(data.tabs), [data.tabs]);
  const categoryTabs = useMemo(
    () =>
      categories.map((value, index) => ({
        value,
        label: tabLabels[index] || value,
      })),
    [categories, tabLabels],
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const visibleProjects = useMemo(
    () => activeCategory === "All"
      ? projects
      : projects.filter((item) => item.category === activeCategory),
    [activeCategory, projects],
  );
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
  } = useCardPagination({
    itemCount: visibleProjects.length,
    boxesPerRow: data.boxesPerRow,
    fallbackColumns: 4,
  });
  const pagedProjects = visibleProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={data.pretitle ?? "Latest projects"}
        title={data.title ?? "Featured Projects"}
        desc={data.desc ?? "Explore verified residential and commercial developments across Delhi NCR."}
      />

      <section
        data-editor-section-label="Project Categories"
        data-editor-fields="tabs"
        className="px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categoryTabs.map((category) => {
              const isActive = category.value === activeCategory;
              return (
                <button
                  key={category.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveCategory(category.value);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                      ? "border-[#141414] bg-[#141414] text-white"
                      : "border-[#141414]/15 text-[#141414]/65 hover:border-[#141414]/35"
                    }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        data-editor-section-label="Project Listings"
        data-editor-fields="projectItems resultsTitle resultsLabel viewProjectLabel emptyMessage"
        className="px-5 pb-12 pt-10 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-medium text-[#141414]">{typeof data.resultsTitle === "string" ? data.resultsTitle : "Our projects"}</h2>
            <p className="text-xs text-[#141414]/45">{visibleProjects.length} {typeof data.resultsLabel === "string" ? data.resultsLabel : "results"}</p>
          </div>

          {visibleProjects.length ? (
            <div
              data-box-layout-grid="grid"
              data-editor-card-fields="image status statusText category listingsLabel title location desc description href"
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {pagedProjects.map((project, index) => (
                <article key={`${project.title}-${index}`} className="group overflow-hidden rounded-2xl border border-[#141414]/10 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                  <Link href={project.href} className="relative block aspect-[4/5] overflow-hidden bg-[#f3efe8]">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      unoptimized={project.image.startsWith("http")}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
                        <Building2 size={12} /> {project.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold leading-snug">{project.title}</h3>
                      {project.location && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                          <MapPin size={12} /> {project.location}
                        </p>
                      )}
                      {project.desc && <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">{project.desc}</p>}
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium underline underline-offset-4">
                        {typeof data.viewProjectLabel === "string" ? data.viewProjectLabel : "View project"} <ArrowRight size={13} />
                      </span>
                    </div>
                    {project.status && (
                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#141414]">
                        {project.status}
                      </span>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#141414]/20 px-6 py-16 text-center text-sm text-[#141414]/50">
              {typeof data.emptyMessage === "string" ? data.emptyMessage : "No projects are available in this category."}
            </div>
          )}

          <RealEstatePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
}
