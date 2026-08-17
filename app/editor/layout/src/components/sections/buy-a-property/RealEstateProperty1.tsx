"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BedDouble, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import useCardPagination from "../types/useCardPagination";

export type Listing = {
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  location: string;
  category: string;
  propertyType: string;
  statusText: string;
  slug: string;
  href: string;
  features: Array<{ label: string; value: string }>;
};

export function RealEstatePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#141414]/15 text-[#141414] transition-colors hover:border-[#141414] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={17} />
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${isActive
                  ? "border-[#141414] bg-[#141414] text-white"
                  : "border-[#141414]/15 text-[#141414] hover:border-[#141414]"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#141414]/15 text-[#141414] transition-colors hover:border-[#141414] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

export const getRealEstateListings = (value: unknown): Listing[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const record = item as Record<string, unknown>;
    const title = getString(record.title);
    const image = getString(record.image);
    if (!title || !image) return [];

    const features = Array.isArray(record.features)
      ? record.features.flatMap((feature) => {
        if (!feature || typeof feature !== "object" || Array.isArray(feature)) return [];
        const entry = feature as Record<string, unknown>;
        return [{ label: getString(entry.label), value: getString(entry.value) }];
      })
      : [];

    return [{
      image,
      alt: getString(record.alt, title),
      title,
      subtitle: getString(record.subtitle),
      description: getString(record.description, getString(record.body)),
      price: getString(record.price),
      location: getString(record.location),
      category: getString(record.category),
      propertyType: getString(record.propertyType),
      statusText: getString(record.statusText),
      slug: getString(record.slug),
      href: getString(record.href),
      features,
    }];
  });
};

const getRealEstatePropertyTypes = (value: unknown, mode: "sale" | "rent") => {
  if (!Array.isArray(value)) return [];

  const types = new Map<string, string>();

  value.forEach((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return;
    const record = item as Record<string, unknown>;
    const category = getString(record.category).toLowerCase();
    const propertyType = getString(record.propertyType).trim();

    if (!category.includes(mode) || !propertyType) return;
    const normalizedType = propertyType.toLowerCase();
    if (!types.has(normalizedType)) types.set(normalizedType, propertyType);
  });

  return Array.from(types.values());
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function RealEstatePropertyCatalog({
  data = {},
  mode = "sale",
}: SectionProps & { mode?: "sale" | "rent" }) {
  const listings = useMemo(
    () => getRealEstateListings(data.listings).filter((item) =>
      item.category.toLowerCase().includes(mode),
    ),
    [data.listings, mode],
  );
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");

  const propertyTypes = useMemo(
    () => getRealEstatePropertyTypes(data.listings, mode),
    [data.listings, mode],
  );
  const visibleListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return listings.filter((item) => {
      const matchesType = propertyType === "all" || item.propertyType === propertyType;
      const matchesQuery = !normalizedQuery ||
        `${item.title} ${item.location} ${item.propertyType}`.toLowerCase().includes(normalizedQuery);
      return matchesType && matchesQuery;
    });
  }, [listings, propertyType, query]);
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
  } = useCardPagination({
    itemCount: visibleListings.length,
    boxesPerRow: data.boxesPerRow,
    fallbackColumns: 3,
  });
  const pagedListings = visibleListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <main className="bg-white">
      <RealEstateBreadCrumb1
        pretitle={typeof data.pretitle === "string" ? data.pretitle : mode === "rent" ? "Verified rentals" : "Verified homes"}
        title={
          typeof data.title === "string" ? data.title : mode === "rent"
            ? "Rent a home that fits your life."
            : "Buy a property with confidence."
        }
        desc={
          typeof data.desc === "string" ? data.desc : mode === "rent"
            ? "Browse move-in-ready rentals with clear monthly pricing across Delhi NCR."
            : "Explore verified apartments, villas, floors, and studios across Delhi NCR."
        }
      />

      <section
        data-editor-section-label={
          mode === "rent" ? "Rental Listings" : "Property Catalog"
        }
        data-editor-fields="listings searchPlaceholder propertyTypeAllLabel listingsPretitle listingsTitle resultsLabel emptyMessage"
        className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 rounded-2xl border-2 border-[#a45b42]/35 bg-white p-4 shadow-[0_12px_32px_rgba(23,36,31,0.12)] sm:grid-cols-[1fr_auto] sm:items-center">
            <label className="flex items-center gap-3 rounded-xl bg-[#f8f6f1] px-4 py-3 ring-1 ring-[#a45b42]/15 transition focus-within:ring-2 focus-within:ring-[#a45b42]/55">
              <Search size={18} className="text-[#17241f]/45" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={typeof data.searchPlaceholder === "string" ? data.searchPlaceholder : "Search by property or location"}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#17241f] outline-none placeholder:text-[#17241f]/40"
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#17241f]/10 px-4 py-3">
              <SlidersHorizontal size={17} className="text-[#a45b42]" />
              <select
                value={propertyType}
                onChange={(event) => {
                  setPropertyType(event.target.value);
                  setQuery("");
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-medium text-[#17241f] outline-none"
              >
                <option value="all">{typeof data.propertyTypeAllLabel === "string" ? data.propertyTypeAllLabel : "All property types"}</option>
                {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a45b42]">{typeof data.listingsPretitle === "string" ? data.listingsPretitle : "Properties"}</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#17241f]">
                {typeof data.listingsTitle === "string" ? data.listingsTitle : `Homes for ${mode === "rent" ? "rent" : "sale"}`}
              </h2>
            </div>
            <p className="text-sm text-[#17241f]/55">{visibleListings.length} {typeof data.resultsLabel === "string" ? data.resultsLabel : "listings"}</p>
          </div>

          {visibleListings.length ? (
            <div
              data-box-layout-grid="grid"
              data-editor-card-fields="image statusText propertyType price title href location description features"
              className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {pagedListings.map((property) => (
                <article key={`${property.title}-${property.slug}`} className="group overflow-hidden rounded-2xl border border-[#17241f]/10 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                  <Link href={property.href || `/properties/${property.slug || slugify(property.title)}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image src={property.image} alt={property.alt} fill unoptimized={property.image.startsWith("http")} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    {property.statusText && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#17241f]">{property.statusText}</span>}
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-[#a45b42]">{property.price}</p>
                      <p className="text-xs font-medium text-[#17241f]/50">{property.propertyType}</p>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#17241f]">
                      <Link
                        href={property.href || `/properties/${property.slug || slugify(property.title)}`}
                        className="transition-colors hover:text-[#a45b42]"
                      >
                        {property.title}
                      </Link>
                    </h3>
                    {property.location && <p className="mt-2 flex items-center gap-2 text-sm text-[#17241f]/55"><MapPin size={14} />{property.location}</p>}
                    {property.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#17241f]/60">{property.description}</p>}
                    {property.features.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#17241f]/10 pt-4">
                        {property.features.map((feature) => (
                          <span key={`${feature.label}-${feature.value}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f4ee] px-3 py-1 text-xs text-[#17241f]/70">
                            {feature.label.toLowerCase().includes("bed") && <BedDouble size={13} />}
                            {feature.value} {feature.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#17241f]/20 bg-white px-6 py-16 text-center text-sm text-[#17241f]/55">
              {typeof data.emptyMessage === "string" ? data.emptyMessage : "No properties match your search."}
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

export default function RealEstateProperty1(props: SectionProps) {
  return <RealEstatePropertyCatalog {...props} mode="sale" />;
}
