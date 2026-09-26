import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsEventCategories1 from "./EventsEventCategories1";
import EventsEventCta1 from "./EventsEventCta1";

export default function EventsEventPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-800">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsEventCategories1 data={data} />

      <EventsEventCta1 data={data} />
    </main>
  );
}
