import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsTeamJoinCta1 from "./EventsTeamJoinCta1";
import EventsTeamMembers1 from "./EventsTeamMembers1";

export default function EventsTeamsPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />

      <EventsTeamMembers1 data={data} />
      <EventsTeamJoinCta1 data={data} />
    </main>
  );
}
