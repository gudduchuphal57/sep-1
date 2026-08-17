import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsTeamDetailContent1 from "./EventsTeamDetailContent1";

export default function EventsTeamDetailPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb ?? []}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />
      <EventsTeamDetailContent1 data={data} />
    </main>
  );
}
