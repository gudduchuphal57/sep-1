import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOFAQContent2 from "./NGOFAQContent2";

export default function NGOFAQPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-50/50 font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOFAQContent2 data={data} />
    </main>
  );
}
