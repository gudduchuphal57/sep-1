import { SectionProps } from "./../../../types/section";

export default function AboutPageThree({ data = {} }: SectionProps) {
  return (
    <main className="bg-slate-950 text-white">
      <section data-editor-section-label="About Overview" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
          {data.pretitle}
        </p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {data.title}
          </h1>
          <div className="space-y-5 text-base leading-8 text-slate-300">
            <p>{data.desc}</p>
            <p>{data.desc2}</p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
            {data.subtitle}
          </p>
          <h2 className="mt-3 text-3xl font-black">
            {data.philosophyTitle}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
            {data.philosophyDesc}
          </p>
        </div>
      </section>
    </main>
  );
}
