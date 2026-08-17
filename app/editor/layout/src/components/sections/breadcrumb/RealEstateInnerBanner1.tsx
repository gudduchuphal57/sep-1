import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "./RealEstateBreadCrumb1";

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

export default function RealEstateInnerBanner1({
  data = {},
}: SectionProps) {
  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        pretitle={text(data.pretitle, "Explore")}
        title={text(data.title, "Discover more")}
        desc={text(
          data.desc,
          "Tips, home guides, and practical notes to help you buy, rent, or move with confidence."
        )}
      />
    </main>
  );
} 
