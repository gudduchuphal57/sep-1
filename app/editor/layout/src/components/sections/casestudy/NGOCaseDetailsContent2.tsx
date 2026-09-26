import type { SectionProps } from "../../../types/section";
import NGOCaseDetailsArticle2 from "./NGOCaseDetailsArticle2";
import NGOCaseDetailsSidebar2 from "./NGOCaseDetailsSidebar2";

export default function NGOCaseDetailsContent2({ data = {} }: SectionProps) {
  return (
    <section
      data-editor-section-label="Article Content"
      data-editor-fields="pageTitle primaryTitle primaryImage primaryImageAlt primaryParagraphs postedOn secondaryTitle secondaryParagraphs popularPostsTitle popularPosts"
      data-editor-card-fields="image date category title slug"
      className="mx-auto max-w-7xl px-2 py-8 sm:px-6 md:py-12 lg:px-8"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="w-full lg:col-span-8">
          <NGOCaseDetailsArticle2 data={data} />
        </div>
        <div className="w-full lg:col-span-4">
          <NGOCaseDetailsSidebar2 data={data} />
        </div>
      </div>
    </section>
  );
}
