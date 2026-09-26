import type { SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOEvents2 from "./NGOEvents2";
import NGOTestimonial2 from "../testimonial/NGOTestimonial2";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOEventsPage2({ data = {} }: SectionProps) {
  const testimonialData = isRecord(data.testimonialData)
    ? data.testimonialData
    : isRecord(data.testimonialsSection)
      ? data.testimonialsSection
      : isRecord(data.testimonial)
        ? data.testimonial
        : undefined;

  return (
    <main className="mb-0 min-h-screen overflow-hidden bg-gray-50/50 font-sans text-slate-900 md:mb-5">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOEvents2 data={{ ...data, showExploreButton: false }} />
      {testimonialData ? <NGOTestimonial2 data={testimonialData} /> : null}
    </main>
  );
}
