import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOBranchesContent2 from "./NGOBranchesContent2";
import NGOBranchesLocations2 from "./NGOBranchesLocations2";
import NGOBranchesCta2 from "./NGOBranchesCta2";
import NGOBranchesContact2 from "./NGOBranchesContact2";

export default function NGOBranchesPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOBranchesContent2 data={data} />
      <NGOBranchesLocations2 data={data} />
      <NGOBranchesCta2 data={data} />
      <NGOBranchesContact2 data={data} />
    </main>
  );
}
