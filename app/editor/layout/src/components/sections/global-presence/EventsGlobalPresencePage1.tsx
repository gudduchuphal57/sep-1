import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsPresence1 from "./EventsPresence1";

export default function EventsGlobalPresencePage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsPresence1 data={data} />
    </main>
  );
}
