import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCsrIntro2 from "./NGOCsrIntro2";
import NGOCsrFocus2 from "./NGOCsrFocus2";
import NGOCsrImpact2 from "./NGOCsrImpact2";
import NGOCsrProjects2 from "./NGOCsrProjects2";
import NGOCsrCta2 from "./NGOCsrCta2";
import NGOCsrValues2 from "./NGOCsrValues2";

export default function NGOCsrPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCsrIntro2 data={data} />
      <NGOCsrFocus2 data={data} />
      <NGOCsrImpact2 data={data} />
      <NGOCsrProjects2 data={data} />
      <NGOCsrCta2 data={data} />
      <NGOCsrValues2 data={data} />
    </main>
  );
}
