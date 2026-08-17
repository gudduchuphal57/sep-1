import type { SectionProps } from "../../../types/section";
import EventsCaseStudyFeatured1 from "./EventsCaseStudyFeatured1";
import EventsCaseStudyHighlights1 from "./EventsCaseStudyHighlights1";

export default function EventsCaseStudyOverview1({ data = {} }: SectionProps) {
  return (
    <section
      data-editor-section-label="Case Study Overview"
      data-editor-fields="featuredImage featuredImageAlt stats highlightsTitle highlights"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <EventsCaseStudyFeatured1 data={data} />
        <div className="space-y-6">
          <EventsCaseStudyHighlights1 data={data} />
        </div>
      </div>
    </section>
  );
}
