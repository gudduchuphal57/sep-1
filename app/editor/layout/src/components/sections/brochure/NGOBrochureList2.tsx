"use client";

import Image from "next/image";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type BrochureItem = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  downloadUrl?: string;
  href?: string;
  downloadlabel?: string;
};

export default function NGOBrochureList2({ data = {} }: SectionProps) {
  const sectionTitle = isRecord(data.sectionTitle) ? data.sectionTitle : {};
  const pretitle =
    (typeof data.listPretitle === "string" && data.listPretitle) ||
    (typeof sectionTitle.label === "string" && sectionTitle.label) ||
    "OUR BROCHURES";
  const title =
    (typeof data.listTitle === "string" && data.listTitle) ||
    (typeof sectionTitle.heading === "string" && sectionTitle.heading) ||
    "Inform. Inspire. Involve.";
  const brochures = (
    Array.isArray(data.brochures) ? data.brochures : []
  ) as BrochureItem[];

  if (!brochures.length && !title) return null;

  return (
    <div
      data-editor-section-label="Brochures"
      data-editor-fields="listPretitle listTitle brochures"
      data-editor-card-fields="image name description downloadlabel downloadUrl"
    >
      <section className="mx-auto max-w-4xl px-2 pb-10 text-center sm:px-4">
        <div className="mb-0 flex items-center justify-center gap-2">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="text-sm font-semibold tracking-widest text-orange-600">
            {pretitle}
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
      </section>

      <section className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brochures.map((item, index) => {
            const href = item.downloadUrl || item.href || "#";
            return (
              <div
                key={item.id ?? `${item.name}-${index}`}
                className="group rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-[17rem] overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || item.title || "Brochure"}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      unoptimized={isUnoptimizedImageSrc(item.image)}
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="mb-1.5 text-base font-bold text-gray-900">
                    {item.name || item.title}
                  </h3>
                  {item.description ? (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  ) : null}
                  <a
                    href={href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                  >
                    {renderNgoIcon("download", "h-4 w-4")}
                    {item.downloadlabel || "Download"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
