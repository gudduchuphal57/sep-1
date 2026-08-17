"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import {
  getRealEstateListings,
  RealEstatePagination,
  type Listing,
} from "../buy-a-property/RealEstateProperty1";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import useCardPagination from "../types/useCardPagination";

type PropertyTab = "all" | "sale" | "rent";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function PropertyCard({ property }: { property: Listing }) {
  const detailHref =
    property.href || `/properties/${property.slug || slugify(property.title)}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#17241f]/10 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={property.image}
          alt={property.alt}
          fill
          unoptimized={property.image.startsWith("http")}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {property.propertyType && (
          <span className="absolute right-3 top-3 rounded-full bg-[#26343d]/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {property.propertyType}
          </span>
        )}
        {property.statusText && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#17241f]/90 px-3 py-1 text-[10px] font-medium text-white">
            {property.statusText}
          </span>
        )}
      </Link>

      <div className="p-4">
        {property.subtitle && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c44536]">
            {property.subtitle}
          </p>
        )}
        <h3 className="mt-2 text-base font-semibold text-[#141414]">
          <Link href={detailHref} className="transition-colors hover:text-[#c44536]">
            {property.title}
          </Link>
        </h3>
        {property.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#141414]/60">
            {property.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#141414]/10 pt-4">
          <p className="text-base font-semibold text-[#141414]">{property.price}</p>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#141414] underline underline-offset-4 transition-colors hover:text-[#c44536]"
          >
            View details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function RealEstateRent1({ data = {} }: SectionProps) {
  const listings = useMemo(
    () => getRealEstateListings(data.listings),
    [data.listings],
  );
  const [activeTab, setActiveTab] = useState<PropertyTab>("rent");
  const [city, setCity] = useState("all");

  const cities = useMemo(
    () => Array.from(new Set(listings.map((item) => item.location).filter(Boolean))).sort(),
    [listings],
  );
  const visibleListings = useMemo(
    () => listings.filter((item) => {
      const category = item.category.toLowerCase();
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "sale" && category.includes("sale")) ||
        (activeTab === "rent" && category.includes("rent"));
      const matchesCity = city === "all" || item.location === city;

      return matchesTab && matchesCity;
    }),
    [activeTab, city, listings],
  );
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
  } = useCardPagination({
    itemCount: visibleListings.length,
    boxesPerRow: data.boxesPerRow,
    fallbackColumns: 4,
  });
  const pagedListings = visibleListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tabs: Array<{ label: string; value: PropertyTab }> = [
    { label: typeof data.allPropertiesLabel === "string" ? data.allPropertiesLabel : "All properties", value: "all" },
    { label: typeof data.forSaleLabel === "string" ? data.forSaleLabel : "For Sale", value: "sale" },
    { label: typeof data.forRentLabel === "string" ? data.forRentLabel : "For Rent", value: "rent" },
  ];

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={typeof data.pretitle === "string" ? data.pretitle : "Properties"}
        title={typeof data.title === "string" ? data.title : "Featured Properties"}
        desc={typeof data.desc === "string" ? data.desc : "Browse verified homes for sale and rent across Delhi NCR."}
      />

      <section
        data-editor-section-label="Rental Listings"
        data-editor-fields="listings allPropertiesLabel forSaleLabel forRentLabel cityLabel allCitiesLabel resultsLabel emptyMessage"
        className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveTab(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                        ? "border-[#141414] bg-[#141414] text-white"
                        : "border-[#141414]/15 bg-white text-[#141414]/70 hover:border-[#141414]/35"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}

              <label className="relative ml-1 inline-flex items-center rounded-full border border-[#141414]/15 bg-white">
                <span className="pl-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c44536]">{typeof data.cityLabel === "string" ? data.cityLabel : "City"}</span>
                <select
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-transparent py-2 pl-3 pr-9 text-sm font-medium text-[#141414] outline-none"
                >
                  <option value="all">{typeof data.allCitiesLabel === "string" ? data.allCitiesLabel : "All cities"}</option>
                  {cities.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 text-[#141414]/60" />
              </label>
            </div>

            <p className="text-xs text-[#141414]/45">{visibleListings.length} {typeof data.resultsLabel === "string" ? data.resultsLabel : "results"}</p>
          </div>

          {visibleListings.length ? (
            <div
              data-box-layout-grid="grid"
              data-editor-card-fields="image propertyType statusText subtitle title href description price"
              className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {pagedListings.map((property) => (
                <PropertyCard key={`${property.title}-${property.slug}`} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-[#141414]/20 px-6 py-16 text-center text-sm text-[#141414]/50">
              {typeof data.emptyMessage === "string" ? data.emptyMessage : "No properties match this selection."}
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
