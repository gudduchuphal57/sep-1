import Link from "next/link";



import type { SectionProps } from "../../../types/section";



export default function EventsCareersQuoteCta1({ data = {} }: SectionProps) {

  if (!data.quote && !data.ctaLabel) return null;



  return (

    <section

      data-editor-section-label="Culture Quote"

      data-editor-fields="quote quoteAuthor ctaLabel ctaHref"

      className="mt-8 bg-[#d61b58] py-16 text-white md:mt-10 lg:mt-14 lg:py-20"

    >

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

        {data.quote && (

          <p

            data-editor-field="quote"

            className="text-xl font-semibold leading-tight sm:text-2xl"

          >

            {data.quote}

          </p>

        )}

        {data.quoteAuthor && (

          <p

            data-editor-field="quoteAuthor"

            className="mt-4 text-sm uppercase tracking-[0.28em] text-[#ffe4f0]"

          >

            {data.quoteAuthor}

          </p>

        )}

        {data.ctaLabel && (

          <Link

            href={data.ctaHref ?? "#"}

            className="mt-10 inline-flex items-center justify-center rounded-[20px] bg-white px-8 py-4 text-sm font-semibold text-[#d61b58] shadow-xl shadow-[#00000026] transition hover:bg-slate-100"

          >

            {data.ctaLabel}

          </Link>

        )}

      </div>

    </section>

  );

}

