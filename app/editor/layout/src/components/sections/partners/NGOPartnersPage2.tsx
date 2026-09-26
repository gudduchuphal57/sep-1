import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOPartnersContent2 from "./NGOPartnersContent2";

export default function NGOPartnersPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOPartnersContent2 data={data} />
    </main>
  );
}
