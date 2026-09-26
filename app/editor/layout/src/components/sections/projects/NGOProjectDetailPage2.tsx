import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOProjectDetailContent2 from "./NGOProjectDetailContent2";

export default function NGOProjectDetailPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOProjectDetailContent2 data={data} />
    </main>
  );
}
