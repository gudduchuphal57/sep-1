import type { SectionProps } from "../../../types/section";

export default function EventsOurStoryMilestones1({ data = {} }: SectionProps) {
  const milestones = data.milestones ?? [];

  return (
    <>
      {milestones.length > 0 && (
        <section
          data-editor-section-label="Milestones"
          data-editor-fields="milestonesPretitle milestonesTitle milestonesDesc milestones"
          className="mt-8 overflow-hidden bg-white md:mt-10 lg:mt-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              {data.milestonesPretitle && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
                  {data.milestonesPretitle}
                </p>
              )}
              {data.milestonesTitle && (
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-4xl">
                  {data.milestonesTitle}
                </h2>
              )}
              {data.milestonesDesc && (
                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
                  {data.milestonesDesc}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-transparent via-[#f4d4e1] to-transparent lg:block" />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {milestones.map((milestone, index) => (
                  <div
                    key={`${milestone.year}-${index}`}
                    className="group relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d61b58] text-sm font-extrabold text-white shadow-lg shadow-[#d61b58]/30 transition-transform duration-300 group-hover:scale-110">
                      {milestone.year}
                      <div className="absolute -bottom-3 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-[#d61b58]" />
                    </div>

                    <div className="w-full rounded-[1.5rem] border border-[#f4d4e1] bg-white p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                      <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-[#d61b58]" />
                      <h3 className="mb-2 text-base font-bold text-slate-900">
                        {milestone.title}
                      </h3>
                      <p className="text-xs leading-5 text-slate-500">
                        {milestone.description ?? milestone.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
