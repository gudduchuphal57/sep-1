import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsOurStoryContent1 from "./EventsOurStoryContent1";
import EventsOurStoryMilestones1 from "./EventsOurStoryMilestones1";
import EventsOurStoryStats1 from "./EventsOurStoryStats1";

export default function EventsOurStoryPage1({ data = {} }: SectionProps) {
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

      <EventsOurStoryContent1 data={data} />
      <EventsOurStoryStats1 data={data} />
      <EventsOurStoryMilestones1 data={data} />
    </main>
  );
}
