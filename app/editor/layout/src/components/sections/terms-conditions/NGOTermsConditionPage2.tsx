import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOTermsContent2 from "./NGOTermsContent2";

export default function NGOTermsConditionPage2({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOTermsContent2 data={data} />
    </main>
  );
}
