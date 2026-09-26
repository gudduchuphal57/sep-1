import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOIndustryContent2 from "./NGOIndustryContent2";
import NGOIndustryPartner2 from "./NGOIndustryPartner2";

export default function NGOIndustryPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen w-full bg-[#FCFDFD] font-sans text-[#0F172A]">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOIndustryContent2 data={data} />
      <NGOIndustryPartner2 data={data} />
    </main>
  );
}
