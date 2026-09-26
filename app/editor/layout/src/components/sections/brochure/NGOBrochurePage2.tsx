import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOBrochureIntro2 from "./NGOBrochureIntro2";
import NGOBrochureList2 from "./NGOBrochureList2";
import NGOBrochureCta2 from "./NGOBrochureCta2";

export default function NGOBrochurePage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOBrochureIntro2 data={data} />
      <NGOBrochureList2 data={data} />
      <NGOBrochureCta2 data={data} />
    </main>
  );
}
