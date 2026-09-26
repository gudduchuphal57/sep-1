import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGODisclaimerContent2 from "./NGODisclaimerContent2";

export default function NGODisclaimerPage2({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGODisclaimerContent2 data={data} />
    </main>
  );
}
