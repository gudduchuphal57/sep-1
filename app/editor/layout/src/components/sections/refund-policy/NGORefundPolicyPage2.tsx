import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGORefundContent2 from "./NGORefundContent2";

export default function NGORefundPolicyPage2({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGORefundContent2 data={data} />
    </main>
  );
}
