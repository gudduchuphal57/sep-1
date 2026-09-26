import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOBlog2 from "./NGOBlog2";

export default function NGOBlogPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-50/50 font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOBlog2 data={{ ...data, showExploreButton: false }} />
    </main>
  );
}
