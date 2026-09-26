import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOTeam2 from "./NGOTeam2";

export default function NGOTeamsPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOTeam2 data={data} />
      
    </main>
  );
}
 