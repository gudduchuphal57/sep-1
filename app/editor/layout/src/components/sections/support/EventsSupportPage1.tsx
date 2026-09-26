import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsSupportOverview1 from "./EventsSupportOverview1";

export default function EventsSupportPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen font-sans">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />
      <EventsSupportOverview1 data={data} />
    </main>
  );
}
