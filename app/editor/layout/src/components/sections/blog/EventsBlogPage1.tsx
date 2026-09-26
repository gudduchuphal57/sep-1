import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsBlogGrid1 from "./EventsBlogGrid1";

export default function EventsBlogPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsBlogGrid1 data={data} />
    </main>
  );
}
