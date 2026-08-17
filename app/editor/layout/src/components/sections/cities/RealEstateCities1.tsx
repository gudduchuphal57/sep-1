"use client";

import { useMemo } from "react";
import { usePreview } from "../../context/PreviewContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBuilding } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";

// const MAX_CARDS = 4;

type CityItem = {
  name: string;
  desc: string;
  image: string;
  alt: string;
  listingsLabel?: string;
  href: string;
  category?: string;
  location?: string;
};

type SectionButton = {
  label: string;
  href: string;
};

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getCities = (value: unknown): CityItem[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const city = item as Record<string, unknown>;
    const name = getString(city.name, getString(city.title));
    const image = getString(city.image);

    if (!name || !image) return [];

    return [
      {
        name,
        image,
        alt: getString(city.alt, name),
        desc: getString(city.desc, getString(city.description)),
        listingsLabel: getString(city.listingsLabel) || undefined,
        href: getString(city.href, "/projects"),
        category: getString(city.category) || undefined,
        location: getString(city.location) || undefined,
      },
    ];
  });
};

const getCategories = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
      (category): category is string =>
        typeof category === "string" && Boolean(category.trim()),
    )
    : [];

const getTabLabels = (value: unknown) =>
  Array.isArray(value)
    ? value.map((label) => (typeof label === "string" ? label : ""))
    : [];

const getButton = (value: unknown): SectionButton | null => {
  if (!value || typeof value !== "object") return null;

  const button = value as Record<string, unknown>;
  const label = getString(button.label);
  const href = getString(button.href);

  return label && href ? { label, href } : null;
};

const bypassImageOptimization = (src: string) =>
  src.startsWith("data:") ||
  src.startsWith("http://") ||
  src.startsWith("https://");

export default function RealEstateCities1({ data = {} }: SectionProps) {
  const cities = useMemo(() => getCities(data.cities), [data.cities]);
  const categories = useMemo(
    () => getCategories(data.categories),
    [data.categories],
  );
  const filterValues = useMemo(() => {
    if (categories.length) {
      return categories[0].toLowerCase() === "all"
        ? categories
        : ["All", ...categories];
    }

    const fromItems = Array.from(
      new Set(
        cities
          .map((city) => city.category ?? city.listingsLabel)
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return ["All", ...fromItems];
  }, [categories, cities]);
  const tabLabels = useMemo(() => getTabLabels(data.tabs), [data.tabs]);
  const filters = useMemo(
    () =>
      filterValues.map((value, index) => ({
        value,
        label: tabLabels[index] || value,
      })),
    [filterValues, tabLabels],
  );
  const { activePortfolioFilter, setActivePortfolioFilter } = usePreview();
  // const [activeFilter, setActiveFilter] = useState("All");
  const button = getButton(data.button);
  const filteredCities = cities.filter((city) => {
    if (activePortfolioFilter === "All") return true;

    return (
      (city.category ?? city.listingsLabel ?? "").toLowerCase() ===
      activePortfolioFilter.toLowerCase()
    );
  });
  // .slice(0, MAX_CARDS);

  if (!cities.length) return null;

  return (
    <section className="bg-white py-7 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          {data.pretitle && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c44536]">
              {data.pretitle}
            </p>
          )}
          {data.title && (
            <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-[#141414] sm:text-[2rem] md:text-[2.5rem]">
              {data.title}
            </h2>
          )}
          {data.desc && (
            <p className="mt-3 text-sm leading-relaxed text-[#141414]/65 md:text-base">
              {data.desc}
            </p>
          )}
        </div>

        <div className="mt-6 flex max-w-full justify-start gap-2 overflow-x-auto pb-1 md:mt-8 md:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setActivePortfolioFilter(filter.value);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${activePortfolioFilter === filter.value
                ? "bg-[#141414] text-white"
                : "text-[#141414] hover:bg-[#141414]/5"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div
          data-box-layout-grid="grid"
          className="
    mt-8
    flex
    gap-4
    overflow-x-auto
    scroll-smooth
    snap-x
    snap-mandatory
    pb-3
    md:mt-10
    md:gap-5
    [-ms-overflow-style:none]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
        >
          {filteredCities.map((city) => {
            const category = city.category ?? city.listingsLabel;

            return (
              <Link
                key={`${city.name}-${city.href}`}
                href={city.href}
                className="
    group
    relative
    w-[85%]
    shrink-0
    snap-start
    overflow-hidden
    rounded-2xl
    sm:w-[48%]
    lg:w-[calc(25%-15px)]
  "
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f3efe8]">
                  <Image
                    src={city.image}
                    alt={city.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={bypassImageOptimization(city.image)}
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={city.image}
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    {category && (
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/85">
                        <FaBuilding className="text-[10px]" aria-hidden />
                        {category}
                      </p>
                    )}
                    <h3 className="mt-2 text-lg font-semibold leading-snug">
                      {city.name}
                    </h3>
                    {city.desc && (
                      <p className="mt-1 line-clamp-1 text-sm text-white/80">
                        {city.desc}
                      </p>
                    )}
                    {city.location && (
                      <p className="mt-1.5 text-xs text-white/65">
                        {city.location}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {button && (
          <div className="mt-8 flex justify-center">
            <Link
              href={
                activePortfolioFilter === "All"
                  ? button.href
                  : `/projects?category=${encodeURIComponent(activePortfolioFilter)}`
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#141414] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#141414]/90"
            >
              {button.label}
              <FaArrowRight className="text-[10px]" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
