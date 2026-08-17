import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsGalleryGrid1 from "./EventsGalleryGrid1";

export default function EventsGalleryPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-[#fffafc] font-sans text-slate-800">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle ?? data.desc ?? data.description}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />

      <EventsGalleryGrid1 data={data} />
    </main>
  );
}
