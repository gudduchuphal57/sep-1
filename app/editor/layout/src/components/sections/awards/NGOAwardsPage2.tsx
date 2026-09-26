import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOAwardsContent2 from "./NGOAwardsContent2";
import NGOAwardsGrid2 from "./NGOAwardsGrid2";
import NGOAwardsSupport2 from "./NGOAwardsSupport2";
import NGOAwardsTransparency2 from "./NGOAwardsTransparency2";

export default function NGOAwardsPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen w-full bg-[#FAF9F6] font-sans text-[#0F172A] antialiased">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOAwardsContent2 data={data} />
      <NGOAwardsGrid2 data={data} />
      <NGOAwardsSupport2 data={data} />
      <NGOAwardsTransparency2 data={data} />
    </main>
  );
}
