import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsTeamDetailContent1 from "./EventsTeamDetailContent1";

export default function EventsTeamDetailPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1
        {...getEventsPageBannerProps(data, {
          breadcrumb: data.breadcrumb ?? [],
        })}
      />
      <EventsTeamDetailContent1 data={data} />
    </main>
  );
}
