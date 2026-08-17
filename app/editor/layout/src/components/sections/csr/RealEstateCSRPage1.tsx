"use client";

import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";
import RealEstateEditorialCards1 from "../featured/RealEstateEditorialCards1";
import RealEstateCTA1 from "../types/RealEstateCTA1";
import RealEstateCSRImpact1 from "./RealEstateCSRImpact1";

type ImpactStat = { stat: string; label: string };
type Program = {
  title: string;
  desc: string;
  image: string;
  amount?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getImpactStats = (value: unknown): ImpactStat[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
        isRecord(item) &&
        typeof item.stat === "string" &&
        typeof item.label === "string"
          ? [{ stat: item.stat, label: item.label }]
          : [],
      )
    : [];

const getPrograms = (value: unknown): Program[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.desc === "string" &&
        typeof item.image === "string"
          ? [
              {
                title: item.title,
                desc: item.desc,
                image: item.image,
                amount:
                  typeof item.amount === "string" ? item.amount : undefined,
              },
            ]
          : [],
      )
    : [];

export default function RealEstateCSRPage1({ data = {} }: SectionProps) {
  const impactStats = getImpactStats(data.impactStats);
  const programs = getPrograms(data.programs);
  const sideImage =
    typeof data.sideImage === "string" ? data.sideImage : undefined;
  const donateCta = isRecord(data.donateCta) ? data.donateCta : {};
  const ctaTitle =
    typeof donateCta.title === "string"
      ? donateCta.title
      : "Want to contribute with us?";
  const ctaDesc =
    typeof donateCta.desc === "string"
      ? donateCta.desc
      : "Reach out to learn about matched donations and volunteer opportunities.";
  const ctaLabel =
    typeof donateCta.buttonLabel === "string"
      ? donateCta.buttonLabel
      : "Talk to our community team";
  const ctaHref =
    typeof donateCta.buttonHref === "string"
      ? donateCta.buttonHref
      : "/contact";

  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={data.pretitle ?? "Community"}
        title={data.title ?? "How we give back."}
        desc={data.desc}
      />

      <RealEstateCSRImpact1
        image={sideImage}
        imageAlt={
          typeof data.sideImageTitle === "string"
            ? data.sideImageTitle
            : "HAUS Group community initiative"
        }
        stats={impactStats}
      />

      <RealEstateEditorialCards1
        sectionLabel="Community Programs"
        editorFields={["programsPretitle", "programsTitle", "programs"]}
        pretitle={
          typeof data.programsPretitle === "string"
            ? data.programsPretitle
            : "Our initiatives"
        }
        title={
          typeof data.programsTitle === "string"
            ? data.programsTitle
            : "Practical support for stronger communities."
        }
        items={programs.map((program) => ({
          title: program.title,
          description: program.desc,
          image: program.image,
          alt: program.title,
          eyebrow: program.amount,
        }))}
      />

      <RealEstateCTA1
        editor={{
          sectionLabel: "Donation CTA",
          fields: ["ctaPretitle", "donateCta"],
        }}
        content={{
          pretitle:
            typeof data.ctaPretitle === "string"
              ? data.ctaPretitle
              : "Get involved",
          title: ctaTitle,
          description: ctaDesc,
          buttons: [{ label: ctaLabel, href: ctaHref }],
        }}
      />
    </main>
  );
}
