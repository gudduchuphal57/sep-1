import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsContactMap1 from "./EventsContactMap1";
import EventsContactOverview1 from "./EventsContactOverview1";

export default function EventsContactPage1({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans text-slate-900">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />

      <EventsContactOverview1 data={data} />
      <EventsContactMap1 data={data} />
    </main>
  );
}
