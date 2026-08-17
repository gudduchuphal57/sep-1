import type { SectionProps } from "../../../types/section";

export default function EventsAboutStats1({ data = {} }: SectionProps) {
  const stats = data.stats ?? [];

  return (
    <>
      {stats.length > 0 && (
        <section
          data-editor-section-label="Stats"
          data-editor-fields="stats"
          className="mt-8 md:mt-10 lg:mt-14"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="rounded-[1.75rem] border border-[#f4d4e1] bg-white p-7 shadow-sm"
                  >
                    <p className="text-3xl font-black text-[#d61b58]">
                      {stat.value}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {stat.label}
                    </h3>
                    {stat.desc && (
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {stat.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </section>
      )}
    </>
  );
}
