import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCaseDetailsContent2 from "./NGOCaseDetailsContent2";

export default function NGOCaseDetailsPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#fafafa]">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCaseDetailsContent2 data={data} />
    </main>
  );
}
