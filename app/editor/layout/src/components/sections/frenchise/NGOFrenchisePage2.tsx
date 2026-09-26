import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOFrenchiseIntro2 from "./NGOFrenchiseIntro2";
import NGOFrenchiseForm2 from "./NGOFrenchiseForm2";
import NGOFrenchiseProcess2 from "./NGOFrenchiseProcess2";
import NGOFrenchiseCta2 from "./NGOFrenchiseCta2";

export default function NGOFrenchisePage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOFrenchiseIntro2 data={data} />
      <NGOFrenchiseForm2 data={data} />
      <NGOFrenchiseProcess2 data={data} />
      <NGOFrenchiseCta2 data={data} />
    </main>
  );
}
