import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOServicesContent2 from "./NGOServicesContent2";
import NGOServicesCta2 from "./NGOServicesCta2";

export default function NGOServicesPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOServicesContent2 data={data} />
      <NGOServicesCta2 data={data} />
    </main>
  );
}
