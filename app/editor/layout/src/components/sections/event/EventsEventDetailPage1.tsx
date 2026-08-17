import type {
  EventsEventCategoryItemData,
  SectionProps,
} from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsEventDetailContent1 from "./EventsEventDetailContent1";
import EventsEventDetailCta1 from "./EventsEventDetailCta1";

export default function EventsEventDetailPage1({ data = {} }: SectionProps) {
  const item = data as EventsEventCategoryItemData;

  return (
    <main className="min-h-screen bg-white font-sans text-slate-800">
      <EventsPageBanner1
        title={item.title ?? data.title}
        subtitle={item.subtitle ?? data.subtitle}
        backgroundImage={item.backgroundImage ?? data.backgroundImage}
        breadcrumb={item.breadcrumb ?? data.breadcrumb}
        textColor={item.textColor ?? data.textColor}
        backgroundColor={item.backgroundColor ?? data.backgroundColor}
      />

      <EventsEventDetailContent1 data={data} />

      <EventsEventDetailCta1 data={data} />
    </main>
  );
}
