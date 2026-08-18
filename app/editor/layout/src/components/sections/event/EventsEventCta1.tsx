import Link from "next/link";

import type {
  LinkActionData,
  SectionProps,
  StatItemData,
} from "../../../types/section";

export default function EventsEventCta1({ data = {} }: SectionProps) {
  const ctaItems = (data.ctaItems ?? []) as StatItemData[];
  const ctaButton = data.ctaButton as LinkActionData | undefined;

  if (!(data.ctaTitle || ctaButton?.label)) return null;

  return (
    <section
      data-editor-section-label="CTA"
      data-editor-fields="ctaPretitle ctaTitle ctaDescription ctaButton ctaItems"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
    >
      <div className="rounded-[2rem] border bg-gradient-to-r from-[#d61b58] to-[#f04a84] p-8 text-white lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {data.ctaPretitle && (
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-100">
                {data.ctaPretitle}
              </p>
            )}
            {data.ctaTitle && (
              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                {data.ctaTitle}
              </h3>
            )}
            {data.ctaDescription && (
              <p className="mt-3 text-base leading-7 text-pink-50">
                {data.ctaDescription}
              </p>
            )}
          </div>
          {ctaButton?.label && (
            <Link
              href={ctaButton.href ?? "/contact"}
              className="inline-flex items-center justify-center rounded-[20px] bg-white px-6 py-3 text-sm font-semibold text-[#d61b58] transition hover:bg-[#fff1f5]"
            >
              {ctaButton.label}
            </Link>
          )}
        </div>

        {ctaItems.length > 0 && (
          <div data-box-layout-grid="grid" className="mt-8 grid gap-4 sm:grid-cols-3">
            {ctaItems.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-[1.25rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xl font-bold">{item.value}</p>
                <p className="mt-1 text-sm text-pink-100">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
