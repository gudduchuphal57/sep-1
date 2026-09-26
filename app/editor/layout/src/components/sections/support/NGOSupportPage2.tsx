import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOSupportIntro2 from "./NGOSupportIntro2";
import NGOSupportWays2 from "./NGOSupportWays2";
import NGOSupportImpact2 from "./NGOSupportImpact2";
import NGOSupportCta2 from "./NGOSupportCta2";
import NGOSupportTransparency2 from "./NGOSupportTransparency2";

export default function NGOSupportPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen w-full bg-[#FAF9F6] font-sans text-slate-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOSupportIntro2 data={data} />
      <NGOSupportWays2 data={data} />
      <NGOSupportImpact2 data={data} />
      <NGOSupportCta2 data={data} />
      <NGOSupportTransparency2 data={data} />
    </main>
  );
}
