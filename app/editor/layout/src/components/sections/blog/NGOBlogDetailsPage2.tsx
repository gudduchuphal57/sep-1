import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOBlogDetailsContent2 from "./NGOBlogDetailsContent2";

export default function NGOBlogDetailsPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOBlogDetailsContent2 data={data} />
    </main>
  );
}
