import type { SectionProps } from "../../../types/section";
import { VisionBlockContent, VisionImage } from "./EventsVisionBlock1";

export default function EventsMissionBlock1({ data = {} }: SectionProps) {
  const mission = data.mission;

  return (
    <>
      {mission && (
        <section
          data-editor-section-label="Mission"
          data-editor-fields="mission"
          className="mt-8 bg-[#fff5f8] py-8 md:mt-10 md:py-10 lg:mt-14 lg:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              {mission.pretitle && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
                  {mission.pretitle}
                </p>
              )}
              {mission.title && (
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-4xl">
                  {mission.title}
                </h2>
              )}
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <VisionImage
                src={mission.image}
                alt={mission.imageAlt ?? "Mission"}
              />
              <VisionBlockContent block={mission} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
