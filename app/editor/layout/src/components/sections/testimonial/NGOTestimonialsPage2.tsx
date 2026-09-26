import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOTestimonialsContent2 from "./NGOTestimonialsContent2";

export default function NGOTestimonialsPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOTestimonialsContent2 data={data} />
    </main>
  );
}
