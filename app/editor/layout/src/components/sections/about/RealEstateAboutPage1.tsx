"use client";

import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import RealEstateStats1 from "../stats/RealEstateStats1";
import RealEstateCTA1 from "../types/RealEstateCTA1";
import RealEstateAbout1 from "./RealEstateAbout1";

const defaultPromises = [
  "Verified property information",
  "Clear pricing and local context",
  "Guided visits with local advisors",
  "Support from shortlist to closing",
];

export default function RealEstateAboutPage1({ data = {} }: SectionProps) {
  const promises = Array.isArray(data.promises)
    ? data.promises.filter((item): item is string => typeof item === "string")
    : defaultPromises;
  const stats = data.stats?.length
    ? data.stats
    : [
      { value: "12+", label: "Years of local experience" },
      { value: "1,500+", label: "Verified properties" },
      { value: "2,800+", label: "Families advised" },
      { value: "4.9/5", label: "Client satisfaction" },
    ];

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={data.pretitle ?? "About us"}
        title={data.title ?? "Real estate guidance from search to keys."}
        desc={data.desc ?? "We help families and investors make confident property decisions with verified information and practical local guidance."}
      />

      <RealEstateAbout1 data={data} pageMode promises={promises} />

      <RealEstateStats1
        data={{ stats }}
        variant="light"
        sectionLabel="Experience Stats"
      />

      <RealEstateCTA1
        editor={{
          sectionLabel: "Property Search CTA",
          fields: [
            "ctaPretitle",
            "ctaTitle",
            "ctaPrimaryLabel",
            "ctaPrimaryHref",
            "ctaSecondaryLabel",
            "ctaSecondaryHref",
          ],
        }}
        className="px-5 py-14 md:px-8 md:py-20 lg:px-10"
        content={{
          pretitle:
            typeof data.ctaPretitle === "string"
              ? data.ctaPretitle
              : "Start your search",
          title:
            typeof data.ctaTitle === "string"
              ? data.ctaTitle
              : "Let us help you find the right next move.",
          buttons: [
            {
              label:
                typeof data.ctaPrimaryLabel === "string"
                  ? data.ctaPrimaryLabel
                  : "Browse properties",
              href:
                typeof data.ctaPrimaryHref === "string"
                  ? data.ctaPrimaryHref
                  : "/buy-a-property",
            },
            {
              label:
                typeof data.ctaSecondaryLabel === "string"
                  ? data.ctaSecondaryLabel
                  : "Contact us",
              href:
                typeof data.ctaSecondaryHref === "string"
                  ? data.ctaSecondaryHref
                  : "/contact",
              secondary: true,
            },
          ],
        }}
      />
    </main>
  );
}
