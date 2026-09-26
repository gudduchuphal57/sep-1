"use client";

import Image from "next/image";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type Branch = {
  city?: string;
  address?: string;
  phone?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBranchesLocations2({ data = {} }: SectionProps) {
  const locationsSection = isRecord(data.locationsSection)
    ? data.locationsSection
    : undefined;
  const mapSide = isRecord(locationsSection?.mapSide)
    ? locationsSection.mapSide
    : undefined;
  const pretitle =
    (typeof data.locationsLabel === "string" && data.locationsLabel) ||
    (typeof locationsSection?.label === "string" && locationsSection.label) ||
    "WHERE WE WORK";
  const title =
    (typeof data.locationsTitle === "string" && data.locationsTitle) ||
    (typeof locationsSection?.title === "string" && locationsSection.title) ||
    "Find a Branch Near You";
  const branches = (Array.isArray(data.branches)
    ? data.branches
    : Array.isArray(locationsSection?.branches)
      ? locationsSection.branches
      : []) as Branch[];
  const mapImage =
    (typeof data.mapImage === "string" && data.mapImage) ||
    (typeof mapSide?.mapImage === "string" && mapSide.mapImage) ||
    "/Indianmap.png";
  const boxesPerRow =
    collectionBoxesPerRow(data, "branches") ?? sectionWrapperBoxesPerRow(data);

  return (
    <section
      data-editor-section-label="Branch Locations"
      data-editor-fields="locationsLabel locationsTitle branches mapImage"
      data-editor-card-fields="city address phone"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="mx-auto max-w-6xl px-2 pb-10 font-sans text-gray-800 sm:px-4 sm:pb-16"
    >
      <div className="mb-10 text-center">
        <div className="mb- flex items-center justify-center gap-3">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          {pretitle ? (
            <p className="text-sm font-semibold tracking-widest text-orange-600">
              {pretitle}
            </p>
          ) : null}
        </div>

        {title ? (
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {title}
          </h2>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div
          data-box-layout-grid="grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3"
        >
          {branches.map((branch, index) => (
            <div
              key={branch.city ?? index}
              className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:shadow-md"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                {renderNgoIcon("map-pin", "h-5 w-5 text-orange-600")}
              </div>

              <h3 className="mb-1.5 text-base font-bold text-gray-900">
                {branch.city}
              </h3>

              <div className="mb-3 flex min-h-24 items-start justify-center">
                {branch.address ? (
                  <p className="text-sm leading-relaxed text-gray-600">
                    {branch.address}
                  </p>
                ) : null}
              </div>

              {branch.phone ? (
                <a
                  href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:underline"
                >
                  {renderNgoIcon("phone", "h-4 w-4 text-orange-600")}
                  {branch.phone}
                </a>
              ) : null}
            </div>
          ))}
        </div>

        <div className="p-0 lg:col-span-2">
          <div className="relative flex min-h-[280px] items-center justify-center">
            {mapImage ? (
              <Image
                src={mapImage}
                alt="India map"
                width={480}
                height={560}
                className="h-auto w-full object-contain"
                unoptimized={isUnoptimizedImageSrc(mapImage)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
