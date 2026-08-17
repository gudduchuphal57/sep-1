"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { SectionProps } from "../../../types/section";
import RealEstateBreadcrumbNav1 from "../breadcrumb/RealEstateBreadcrumbNav1";
import RealEstateAmenities1 from "./RealEstateAmenities1";

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getRecords = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    )
    : [];

const bypassImageOptimization = (src: string) =>
  src.startsWith("data:") || /^https?:\/\//i.test(src);

const defaultAmenities = [
  "Swimming Pool",
  "Gym / Fitness",
  "Covered Parking",
  "24×7 Security",
  "Power Backup",
  "High-Speed Wi-Fi",
  "Kids Play Area",
  "Landscaped Garden",
  "Clubhouse",
  "Elevator",
  "Laundry",
  "Visitor Parking",
];

export default function RealEstatePropertyDetail1({ data = {} }: SectionProps) {
  const title = getString(data.title, "Property details");
  const image = getString(data.image);
  const statusText = getString(data.statusText);
  const infoTitle = getString(data.infoTitle);
  const price = getString(data.price);
  const body = getString(data.body, getString(data.description));
  const features = getRecords(data.features);
  const amenities = Array.isArray(data.amenities)
    ? data.amenities.filter((item): item is string => typeof item === "string")
    : defaultAmenities;
  const button =
    typeof data.button === "object" && data.button !== null && !Array.isArray(data.button)
      ? (data.button as Record<string, unknown>)
      : null;

  return (
    <main className="border-t border-[#141414]/10 bg-white text-[#141414]">
      <section
        data-editor-section-label="Property Overview"
        data-editor-fields="homeLabel propertiesLabel title subtitle description body image alt category statusText price infoTitle features button primaryButtonLabel primaryButtonHref backButtonLabel"
        className="px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16"
      >
        <div className="mx-auto max-w-[112rem]">
          <RealEstateBreadcrumbNav1
            items={[
              {
                label:
                  typeof data.homeLabel === "string"
                    ? data.homeLabel
                    : "Home",
                href: "/",
              },
              {
                label:
                  typeof data.propertiesLabel === "string"
                    ? data.propertiesLabel
                    : "Properties",
                href: "/properties",
              },
              { label: title },
            ]}
          />

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {statusText && <span className="bg-[#141414] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">{statusText}</span>}
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c44536]">
                  {[getString(data.category), getString(data.subtitle)].filter(Boolean).join(" · ")}
                </p>
              </div>

              <h1 className="mt-7 whitespace-nowrap text-[clamp(0.75rem,2.2vw,3.75rem)] font-semibold leading-tight tracking-[-0.04em]">{title}</h1>
              {infoTitle && <p className="mt-5 text-xl text-[#141414]/80">{infoTitle}</p>}
              {price && <p className="mt-5 text-2xl font-semibold">{price}</p>}
              {body && <p className="mt-8 max-w-3xl text-lg leading-8 text-[#141414]/65 md:text-xl md:leading-10">{body}</p>}

              {features.length > 0 && (
                <dl className="mt-10 grid grid-cols-3 border-y border-[#141414]/12 py-8">
                  {features.map((feature, index) => (
                    <div key={`${getString(feature.label)}-${index}`} className={index > 0 ? "pl-5 md:pl-8" : ""}>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#141414]/45">{getString(feature.label)}</dt>
                      <dd className="mt-3 text-base font-semibold md:text-lg">{getString(feature.value)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={button ? getString(button.href, getString(data.primaryButtonHref, "/contact")) : getString(data.primaryButtonHref, "/contact")} className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#141414] px-8 text-base font-semibold text-white transition hover:bg-[#c44536]">
                  {button ? getString(button.label, getString(data.primaryButtonLabel, "Book a visit")) : getString(data.primaryButtonLabel, "Book a visit")} <ArrowRight size={17} aria-hidden />
                </Link>
                <Link href="/properties" className="inline-flex min-h-14 items-center gap-3 rounded-full border border-[#141414]/20 px-8 text-base font-semibold transition hover:border-[#141414]">
                  <ArrowLeft size={17} aria-hidden /> {typeof data.backButtonLabel === "string" ? data.backButtonLabel : "All properties"}
                </Link>
              </div>
            </div>

            {image && (
              <div className="relative aspect-[16/10] min-h-[20rem] overflow-hidden rounded-[1.35rem] bg-[#eee9df] lg:min-h-[34rem]">
                <Image src={image} alt={getString(data.alt, title)} fill priority unoptimized={bypassImageOptimization(image)} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" data-editor-media data-editor-media-type="image" data-editor-media-src={image} />
                <button type="button" aria-label="Previous property image" className="absolute left-5 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-[#17241f]/90 text-white"><ArrowLeft size={22} /></button>
                <button type="button" aria-label="Next property image" className="absolute right-5 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-[#17241f]/90 text-white"><ArrowRight size={22} /></button>
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2" aria-hidden>
                  <span className="h-3 w-10 rounded-full bg-white" />
                  <span className="h-3 w-3 rounded-full bg-white/55" />
                  <span className="h-3 w-3 rounded-full bg-white/55" />
                  <span className="h-3 w-3 rounded-full bg-white/55" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <RealEstateAmenities1
        pretitle={
          typeof data.amenitiesPretitle === "string"
            ? data.amenitiesPretitle
            : "Amenities"
        }
        title={
          typeof data.amenitiesTitle === "string"
            ? data.amenitiesTitle
            : "What this property offers."
        }
        description={
          typeof data.amenitiesDesc === "string"
            ? data.amenitiesDesc
            : "Everyday comforts and lifestyle facilities included with this listing."
        }
        items={amenities}
      />
    </main>
  );
}
