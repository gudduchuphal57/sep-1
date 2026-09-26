import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOProjects2 from "./NGOProjects2";

export default function NGOProjectsPage2({ data = {} }: SectionProps) {
  return (
    <main className="mb-10 min-h-screen overflow-hidden bg-gray-50/50 font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOProjects2
        data={{ ...data, showExploreButton: false, hideExploreControls: true }}
      />
    </main>
  );
}
