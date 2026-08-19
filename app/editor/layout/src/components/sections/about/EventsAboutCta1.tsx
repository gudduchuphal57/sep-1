import Link from "next/link";

import type { SectionProps } from "../../../types/section";
import { renderEventsIcon as renderIcon } from "../../../lib/eventsIcons";

export default function EventsAboutCta1({ data = {} }: SectionProps) {
  const cta = data.cta ?? {};

  return (
    <>
      {(cta.title || cta.button?.label) && (
        <section
          data-editor-section-label="CTA"
          data-editor-fields="cta"
          className="mt-8 md:mt-10 lg:mt-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#d61b58] to-[#f04a84] px-6 py-10 sm:px-10 lg:px-14">
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-3xl">
                  {cta.pretitle && (
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-white">
                      {cta.pretitle}
                    </p>
                  )}
                  {cta.title && (
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                      {cta.title}
                    </h2>
                  )}
                  {cta.description && (
                    <p className="mt-4 max-w-2xl text-base leading-6 text-slate-200">
                      {cta.description}
                    </p>
                  )}
                </div>

                {cta.button?.label && (
                  <Link
                    href={cta.button.href ?? "/contact"}
                    className="group inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-[#d61b58] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d61b58]/40"
                  >
                    <span>{cta.button.label}</span>
                    <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#d61b58]/10 transition-transform duration-300 group-hover:translate-x-1">
                      {renderIcon(cta.button.icon, "h-5 w-5")}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
