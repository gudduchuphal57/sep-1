import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCareersOverview2 from "./NGOCareersOverview2";
import NGOCareersRoles2 from "./NGOCareersRoles2";
import NGOCareersCta2 from "./NGOCareersCta2";

export default function NGOCareersPage2({ data = {} }: SectionProps) {
  return (
    <main className="w-full overflow-hidden bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCareersOverview2 data={data} />
      <NGOCareersRoles2 data={data} />
      <NGOCareersCta2 data={data} />
    </main>
  );
}
