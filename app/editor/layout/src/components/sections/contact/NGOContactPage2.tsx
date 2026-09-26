import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOContactOverview2 from "./NGOContactOverview2";
import NGOContactFeatures2 from "./NGOContactFeatures2";
import NGOContactMap2 from "./NGOContactMap2";

export default function NGOContactPage2({ data = {} }: SectionProps) {
  return (
    <main className="w-full overflow-hidden bg-gray-50/50 font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOContactOverview2 data={data} />
      <NGOContactFeatures2 data={data} />
      <NGOContactMap2 data={data} />
    </main>
  );
}
