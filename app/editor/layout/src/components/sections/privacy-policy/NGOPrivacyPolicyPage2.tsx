import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOPrivacyContent2 from "./NGOPrivacyContent2";

export default function NGOPrivacyPolicyPage2({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOPrivacyContent2 data={data} />
    </main>
  );
}
