import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsTeamJoinCta1 from "./EventsTeamJoinCta1";
import EventsTeamMembers1 from "./EventsTeamMembers1";

export default function EventsTeamsPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />

      <EventsTeamMembers1 data={data} />
      <EventsTeamJoinCta1 data={data} />
    </main>
  );
}
