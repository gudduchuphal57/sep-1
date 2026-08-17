import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsLegalSections1 from "../privacy-policy/EventsLegalSections1";

export default function EventsTermsConditionPage1({ data = {} }: SectionProps) {
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
      <EventsLegalSections1 data={data} editorLabel="Terms Content" />
    </main>
  );
}
