import type { SectionProps } from "../../../types/section";
import EventsContactDetails1 from "./EventsContactDetails1";
import EventsContactForm1 from "./EventsContactForm1";

export default function EventsContactOverview1({ data = {} }: SectionProps) {
  return (
    <section
      data-editor-section-label="Contact Overview"
      data-editor-fields="contactItems form"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
        <EventsContactDetails1 data={data} />
        <EventsContactForm1 data={data} />
      </div>
    </section>
  );
}
