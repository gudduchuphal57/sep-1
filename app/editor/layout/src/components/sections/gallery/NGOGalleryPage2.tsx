import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOGallery2 from "./NGOGallery2";

export default function NGOGalleryPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-50/50 font-sans text-slate-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOGallery2 data={data} />
    </main>
  );
}
