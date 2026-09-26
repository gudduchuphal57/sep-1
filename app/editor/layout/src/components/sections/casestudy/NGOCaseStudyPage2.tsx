import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCaseStudyContent2 from "./NGOCaseStudyContent2";
import NGOCaseStudyCta2 from "./NGOCaseStudyCta2";

export default function NGOCaseStudyPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCaseStudyContent2 data={data} />
      <NGOCaseStudyCta2 data={data} />
    </main>
  );
}
