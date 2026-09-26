import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsGalleryGrid1 from "./EventsGalleryGrid1";

export default function EventsGalleryPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-[#fffafc] font-sans text-slate-800">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsGalleryGrid1 data={data} />
    </main>
  );
}
