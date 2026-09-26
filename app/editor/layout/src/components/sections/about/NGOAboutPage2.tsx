import type { SectionData, SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOAbout2 from "./NGOAbout2";
import NGOMission2 from "../mission-vision/NGOMission2";
import NGOWhyChooseUs2 from "../whychooseus/NGOWhyChooseUs2";

export default function NGOAboutPage2({ data = {} }: SectionProps) {
  const aboutData = (data.aboutContent as SectionData | undefined) || data;
  const missionData = (data.mission as SectionData | undefined) || data;
  const whyData = (data.whyChooseUs as SectionData | undefined) || data;

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOAbout2 data={aboutData} />
      <NGOMission2 data={missionData} />
      <NGOWhyChooseUs2 data={whyData} />
    </main>
  );
}
