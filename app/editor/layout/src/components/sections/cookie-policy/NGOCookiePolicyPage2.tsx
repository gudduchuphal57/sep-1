import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOCookieContent2 from "./NGOCookieContent2";

export default function NGOCookiePolicyPage2({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOCookieContent2 data={data} />
    </main>
  );
}
