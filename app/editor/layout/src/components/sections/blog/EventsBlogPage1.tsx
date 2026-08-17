import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsBlogGrid1 from "./EventsBlogGrid1";

export default function EventsBlogPage1({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans text-slate-900">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle ?? data.desc ?? data.description}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />

      <EventsBlogGrid1 data={data} />
    </main>
  );
}
