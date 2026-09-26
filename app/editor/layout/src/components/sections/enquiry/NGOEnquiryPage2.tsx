import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOEnquiryForm2 from "./NGOEnquiryForm2";
import NGOEnquiryContact2 from "./NGOEnquiryContact2";
import NGOEnquiryCta2 from "./NGOEnquiryCta2";

export default function NGOEnquiryPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOEnquiryForm2 data={data} />
      <NGOEnquiryContact2 data={data} />
      <NGOEnquiryCta2 data={data} />
    </main>
  );
}
