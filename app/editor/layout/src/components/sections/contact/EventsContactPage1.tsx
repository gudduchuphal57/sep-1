import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsContactMap1 from "./EventsContactMap1";
import EventsContactOverview1 from "./EventsContactOverview1";

export default function EventsContactPage1({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsContactOverview1 data={data} />
      <EventsContactMap1 data={data} />
    </main>
  );
}
