import Link from "next/link";

import type {
  EventsEventCategoryItemData,
  LinkActionData,
  SectionProps,
} from "../../../types/section";

export default function EventsEventDetailCta1({ data = {} }: SectionProps) {
  const item = data as EventsEventCategoryItemData;
  const ctaButton = (item.detailCtaButton ?? data.ctaButton) as
    | LinkActionData
    | undefined;
  const ctaTitle =
    item.detailCtaTitle ?? "Have a unique request?";
  const ctaDescription =
    item.detailCtaDescription ??
    "Let us design a custom experience for you from scratch. Tell us about your vision, attendees, and goals, and we will send you a tailored proposal.";

  return (
    <section
      data-editor-section-label="Contact Area"
      data-editor-fields="detailCtaTitle detailCtaDescription detailCtaButton"
      className="mx-auto mt-8 max-w-7xl bg-zinc-50 px-4 pb-8 sm:px-6 md:mt-10 md:pb-10 lg:mt-14 lg:px-8 lg:pb-14"
    >
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#d61b58] to-[#990a38] p-8 text-center text-white shadow-xl sm:p-12 lg:p-16">
          <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            {ctaTitle}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {ctaDescription}
          </p>
          {ctaButton?.label && (
            <div className="mt-8 flex justify-center">
              <Link
                href={ctaButton.href ?? "/contact"}
                className="rounded-[20px] bg-white px-8 py-3 text-sm font-bold text-[#d61b58] shadow-lg transition duration-200 hover:scale-105 hover:bg-[#fee4ee]"
              >
                {ctaButton.label}
              </Link>
            </div>
          )}
        </div>
    </section>
  );
}
