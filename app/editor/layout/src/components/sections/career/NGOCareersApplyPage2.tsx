import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCareersApplyJobDetails2 from "./NGOCareersApplyJobDetails2";
import NGOCareersApplyForm2 from "./NGOCareersApplyForm2";

export default function NGOCareersApplyPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen w-full bg-[#fcfcfd] font-sans text-[#0d152e]">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCareersApplyJobDetails2 data={data} />
      <NGOCareersApplyForm2 data={data} />
    </main>
  );
}
