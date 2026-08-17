import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsSupportOverview1 from "./EventsSupportOverview1";

export default function EventsSupportPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen font-sans">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />
      <EventsSupportOverview1 data={data} />
    </main>
  );
}
