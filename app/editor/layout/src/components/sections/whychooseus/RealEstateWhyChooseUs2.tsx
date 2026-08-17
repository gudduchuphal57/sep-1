import Image from "next/image";
import { Award, BookOpen, Clock, Rocket, Target, Users } from "lucide-react";
import type { SectionProps } from "../../../types/section";

const icons = [Users, Rocket, Target, Clock, Award, BookOpen];

export default function RealEstateWhyChooseUs2({ data = {} }: SectionProps) {
  const items = data.whyChooseUsItems ?? [];

  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        {data.title && <h2 className="text-3xl font-semibold sm:text-4xl">{data.title}</h2>}
        <div data-box-layout-grid="grid" className="mt-10 grid gap-px overflow-hidden bg-white/15 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article key={item.title} className="bg-slate-950 p-6 sm:p-8">
                {item.image ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized={item.image.startsWith("data:") || item.image.startsWith("http")}
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={item.image}
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Icon className="text-cyan-300" size={32} />
                )}
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
