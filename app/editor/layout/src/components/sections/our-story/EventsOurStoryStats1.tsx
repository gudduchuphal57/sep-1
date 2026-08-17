import type { SectionProps } from "../../../types/section";

export default function EventsOurStoryStats1({ data = {} }: SectionProps) {
  const stats = data.stats ?? [];

  return (
    <>
      {stats.length > 0 && (
        <section
          data-editor-section-label="Stats"
          data-editor-fields="stats"
          className="mt-8 bg-[#d61b58] py-14 md:mt-10 lg:mt-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 text-center text-white lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="space-y-1">
                  <p className="text-3xl font-extrabold sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-pink-200 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
