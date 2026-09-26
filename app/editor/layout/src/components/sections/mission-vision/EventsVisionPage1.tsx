import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsCoreBeliefs1 from "./EventsCoreBeliefs1";
import EventsMissionBlock1 from "./EventsMissionBlock1";
import EventsVisionBlock1 from "./EventsVisionBlock1";

export default function EventsVisionPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsVisionBlock1 data={data} />
      <EventsMissionBlock1 data={data} />
      <EventsCoreBeliefs1 data={data} />
    </main>
  );
}
