import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTAButton = {
  label: string;
  href: string;
  secondary?: boolean;
};

export type RealEstateCTAContent = {
  pretitle: string;
  title: string;
  description?: string;
  buttons: CTAButton[];
};

type RealEstateCTA1Props = {
  content: RealEstateCTAContent;
  editor: {
    sectionLabel: string;
    fields: string[];
  };
  className?: string;
};

export default function RealEstateCTA1({
  content,
  editor,
  className = "px-5 pb-14 md:px-8 md:pb-20 lg:px-10",
}: RealEstateCTA1Props) {
  return (
    <section
      data-editor-section-label={editor.sectionLabel}
      data-editor-fields={editor.fields.join(" ")}
      className={className}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[1.5rem] bg-[#14251f] px-7 py-10 text-white md:flex-row md:items-center md:px-10 md:py-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e9ad91]">
            {content.pretitle}
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] md:text-3xl">
            {content.title}
          </h2>
          {content.description && (
            <p className="mt-3 text-sm leading-7 text-white/60">
              {content.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {content.buttons.map((button, index) => (
            <Link
              key={`${button.label}-${button.href}`}
              href={button.href}
              className={
                button.secondary
                  ? "inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  : "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#14251f] transition hover:bg-[#f1e5dc]"
              }
            >
              {button.label}
              {!button.secondary && index === 0 && (
                <ArrowRight size={15} aria-hidden />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
