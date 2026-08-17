import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsAwardsStats1 from "./EventsAwardsStats1";
import EventsFeaturedAward1 from "./EventsFeaturedAward1";
import EventsTrophyWall1 from "./EventsTrophyWall1";

export default function EventsAwardsPage1({ data = {} }: SectionProps) {
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

      <EventsFeaturedAward1 data={data} />
      <EventsTrophyWall1 data={data} />
      <EventsAwardsStats1 data={data} />
    </main>
  );
}
