import type { SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsLegalSections1 from "./EventsLegalSections1";

export default function EventsPrivacyPolicyPage1({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <EventsPageBanner1
        title={data.title}
        subtitle={data.subtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={data.breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />
      <EventsLegalSections1 data={data} editorLabel="Privacy Policy Content" />
    </main>
  );
}
