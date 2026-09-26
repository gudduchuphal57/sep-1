import type { SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsLegalSections1 from "./EventsLegalSections1";

export default function EventsPrivacyPolicyPage1({ data = {} }: SectionProps) {
  return (
    <main className="bg-white font-sans">
      <EventsPageBanner1 {...getEventsPageBannerProps(data)} />
      <EventsLegalSections1 data={data} editorLabel="Privacy Policy Content" />
    </main>
  );
}
