import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsAboutContent1 from "./EventsAboutContent1";
import EventsAboutCta1 from "./EventsAboutCta1";
import EventsAboutStats1 from "./EventsAboutStats1";
import EventsAboutValues1 from "./EventsAboutValues1";

export default function EventsAboutPage1({ data = {} }: SectionProps) {
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

      <EventsAboutContent1 data={data} />
      <EventsAboutStats1 data={data} />
      <EventsAboutValues1 data={data} />
      <EventsAboutCta1 data={data} />
    </main>
  );
}
