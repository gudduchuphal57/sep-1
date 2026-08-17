"use client";

import type { SectionProps } from "../../../types/section";

const defaultMapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224356.85923192592!2d77.23701088488971!3d28.522404036526275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1786345160037!5m2!1sen!2sin";

export default function EventsContactMap1({ data = {} }: SectionProps) {
  const mapEmbedUrl =
    typeof data.mapEmbedUrl === "string" && data.mapEmbedUrl.trim()
      ? data.mapEmbedUrl
      : defaultMapEmbedUrl;

  return (
    <section
      data-editor-section-label="Map"
      data-editor-fields="mapEmbedUrl"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        className="rounded-[20px]"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Location map"
      />
    </section>
  );
}
