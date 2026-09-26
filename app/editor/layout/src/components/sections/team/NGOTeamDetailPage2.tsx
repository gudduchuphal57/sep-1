import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOTeamDetailProfile2 from "./NGOTeamDetailProfile2";
import NGOTeamDetailAbout2 from "./NGOTeamDetailAbout2";
import NGOTeamDetailExperience2 from "./NGOTeamDetailExperience2";
import NGOTeamDetailAchievements2 from "./NGOTeamDetailAchievements2";

export default function NGOTeamDetailPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOTeamDetailProfile2 data={data} />
      <NGOTeamDetailAbout2 data={data} />
      <NGOTeamDetailExperience2 data={data} />
      <NGOTeamDetailAchievements2 data={data} />
    </main>
  );
}
