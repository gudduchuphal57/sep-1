import type { SectionProps } from "../../../types/section";
import EventsSupportContact1 from "./EventsSupportContact1";
import EventsSupportFaq1 from "./EventsSupportFaq1";

export default function EventsSupportOverview1({ data = {} }: SectionProps) {
  return (
    <section
      id="faq"
      data-editor-section-label="Support Overview"
      data-editor-fields="contactPretitle contactTitle contactDescription contactItems faqPretitle faqTitle faqItems"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <EventsSupportContact1 data={data} />
        <EventsSupportFaq1 data={data} />
      </div>
    </section>
  );
}
