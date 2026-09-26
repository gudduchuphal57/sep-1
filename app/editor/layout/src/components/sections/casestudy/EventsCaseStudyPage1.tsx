import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsCaseStudyCta1 from "./EventsCaseStudyCta1";
import EventsCaseStudyOverview1 from "./EventsCaseStudyOverview1";
import EventsCaseStudyProject1 from "./EventsCaseStudyProject1";

export default function EventsCaseStudyPage1({ data = {} }: SectionProps) {
  return (
    <main className="font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsCaseStudyOverview1 data={data} />
      <EventsCaseStudyProject1 data={data} />
      <EventsCaseStudyCta1 data={data} />
    </main>
  );
}
