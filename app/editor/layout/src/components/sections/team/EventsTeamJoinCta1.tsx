import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

import type { SectionProps } from "../../../types/section";

export default function EventsTeamJoinCta1({ data = {} }: SectionProps) {
  const joinButton = data.joinButton1 ?? data.joinButton;

  if (!(data.joinTitle || joinButton?.label)) return null;

  return (
    <section
      data-editor-section-label="Join CTA"
      data-editor-fields="joinTitle joinDescription joinButton1"
      className="mt-8 md:mt-10 lg:mt-14"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fde8ef] text-[#d61b58]">
          <Rocket className="h-8 w-8" aria-hidden />
        </div>
        {data.joinTitle && (
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {data.joinTitle}
          </h2>
        )}
        {data.joinDescription && (
          <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {data.joinDescription}
          </p>
        )}
        {joinButton?.label && (
          <Link
            href={joinButton.href ?? "/contact"}
            className="inline-flex items-center gap-2 rounded-[20px] bg-[#d61b58] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#d61b58]/30 transition-colors hover:bg-[#b01648] sm:text-base"
          >
            {joinButton.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </section>
  );
}
