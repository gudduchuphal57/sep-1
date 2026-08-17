"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { ProductSlideData, SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import RealEstateCTA1 from "../types/RealEstateCTA1";

const fallbackServices: ProductSlideData[] = [
  {
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    alt: "Property advisor meeting clients",
    productTitle: "Property buying assistance",
    productSubtitle: "Buy",
    productInfoTitle: "Property buying assistance",
    productInfoDesc:
      "Shortlist verified homes, compare locations, arrange site visits, and review the details before you commit.",
    productFeatures: [
      { label: "Verified listings", price: "01" },
      { label: "Guided visits", price: "02" },
      { label: "Price guidance", price: "03" },
    ],
    productTotalPrice: "Advisory",
    productShippingText: "Available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=85",
    alt: "Modern rental apartment building",
    productTitle: "Rental support",
    productSubtitle: "Rent",
    productInfoTitle: "Rental support",
    productInfoDesc:
      "Find move-in-ready rentals with transparent monthly pricing, suitable locations, and practical lease support.",
    productFeatures: [
      { label: "Tenant matching", price: "01" },
      { label: "Lease support", price: "02" },
      { label: "Move-in help", price: "03" },
    ],
    productTotalPrice: "Rental",
    productShippingText: "Available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    alt: "Contemporary commercial property",
    productTitle: "Investment advisory",
    productSubtitle: "Invest",
    productInfoTitle: "Investment advisory",
    productInfoDesc:
      "Compare emerging corridors, project credentials, rental demand, and long-term potential with local context.",
    productFeatures: [
      { label: "Market research", price: "01" },
      { label: "Project comparison", price: "02" },
      { label: "Return outlook", price: "03" },
    ],
    productTotalPrice: "Investment",
    productShippingText: "Available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=85",
    alt: "Real estate documentation and keys",
    productTitle: "Documentation support",
    productSubtitle: "Support",
    productInfoTitle: "Documentation support",
    productInfoDesc:
      "Move forward confidently with coordinated paperwork, due-diligence guidance, and transaction assistance.",
    productFeatures: [
      { label: "Document checks", price: "01" },
      { label: "Loan coordination", price: "02" },
      { label: "Closing support", price: "03" },
    ],
    productTotalPrice: "Support",
    productShippingText: "Available",
  },
];

const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

export default function RealEstateServicePage1({ data = {} }: SectionProps) {
  const services = data.productSlides?.length
    ? data.productSlides
    : fallbackServices;
  const sideImage =
    data.sideImage ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85";

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={data.pretitle ?? "Property services"}
        title={data.title ?? "Expert help for every property decision."}
        desc={data.desc ?? "From your first shortlist to the final paperwork, our local advisors make buying, renting, and investing simpler across Delhi NCR."}
      />

      <section
        data-editor-section-label="Services Overview"
        data-editor-fields="sideImage sideImageTitle"
        className="border-b border-[#141414]/10 px-5 py-14 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[#ece8df] md:min-h-[430px]">
            <Image
              src={sideImage}
              alt={data.sideImageTitle ?? "Modern residential property"}
              fill
              priority
              unoptimized={isRemoteImage(sideImage)}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
          </div>
        </div>
      </section>

      <section
        data-editor-section-label="Service Listings"
        data-editor-fields="subtitle productSectionTitle productSlides"
        className="px-5 py-14 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b44e32]">
              {data.subtitle ?? "How we can help"}
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
              {data.productSectionTitle ?? "Property support, all in one place"}
            </h2>
          </div>

          <div data-box-layout-grid="grid" className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={`${service.productTitle}-${index}`}
                className="grid overflow-hidden rounded-[1.35rem] border border-[#141414]/10 bg-white sm:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-56 bg-[#ece8df] sm:min-h-full">
                  <Image
                    src={service.image}
                    alt={service.alt ?? service.productTitle}
                    fill
                    unoptimized={isRemoteImage(service.image)}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b44e32]">
                    {service.productSubtitle ?? `Service ${index + 1}`}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
                    {service.productTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#141414]/60">
                    {service.productInfoDesc}
                  </p>
                  {!!service.productFeatures?.length && (
                    <ul className="mt-5 space-y-2">
                      {service.productFeatures.slice(0, 3).map((feature) => (
                        <li
                          key={`${feature.label}-${feature.price}`}
                          className="flex items-center gap-2 text-xs font-medium text-[#141414]/75"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f2e3dc] text-[#b44e32]">
                            <Check size={12} strokeWidth={2.5} />
                          </span>
                          {feature.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RealEstateCTA1
        editor={{
          sectionLabel: "Services CTA",
          fields: ["ctaPretitle", "ctaTitle", "ctaLabel", "ctaHref"],
        }}
        content={{
          pretitle:
            typeof data.ctaPretitle === "string"
              ? data.ctaPretitle
              : "Personal guidance",
          title:
            typeof data.ctaTitle === "string"
              ? data.ctaTitle
              : "Tell us what you are looking for.",
          buttons: [
            {
              label:
                typeof data.ctaLabel === "string"
                  ? data.ctaLabel
                  : "Contact us",
              href:
                typeof data.ctaHref === "string"
                  ? data.ctaHref
                  : "/contact",
            },
          ],
        }}
      />
    </main>
  );
}
