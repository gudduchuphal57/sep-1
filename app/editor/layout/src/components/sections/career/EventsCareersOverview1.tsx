"use client";



import { useEffect, useRef, useState } from "react";

import Image from "next/image";



import type { EventsCareersStatData, SectionProps } from "../../../types/section";

import { isUnoptimizedImageSrc } from "../../../lib/media";



export default function EventsCareersOverview1({ data = {} }: SectionProps) {

  const stats = (data.stats ?? []) as EventsCareersStatData[];

  const heroImage = data.heroImage;



  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);



  useEffect(() => {

    const el = sectionRef.current;

    if (!el) return;



    const observer = new IntersectionObserver(

      ([entry]) => {

        if (entry.isIntersecting) {

          setIsVisible(true);

          observer.disconnect();

        }

      },

      { threshold: 0.2 },

    );



    observer.observe(el);

    return () => observer.disconnect();

  }, []);



  return (

    <section

      ref={sectionRef}

      data-editor-section-label="Careers Overview"

      data-editor-fields="description description2 heroImage heroImageAlt stats"
      data-editor-card-fields="value label"

      className="mt-8 md:mt-10 lg:mt-14"

    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div

            className={`space-y-6 transition-all duration-1000 ${

              isVisible

                ? "translate-x-0 opacity-100"

                : "-translate-x-10 opacity-0"

            }`}

          >

            {data.description && (

              <p

                data-editor-field="description"

                className="border-l-4 border-[#d61b58] pl-5 text-base italic leading-8 text-slate-600 sm:text-lg"

              >

                {data.description}

              </p>

            )}

            {data.description2 && (

              <p

                data-editor-field="description2"

                className="text-sm leading-7 text-slate-500 sm:text-base"

              >

                {data.description2}

              </p>

            )}



            {stats.length > 0 && (

              <div className="grid gap-4 sm:grid-cols-2">

                {stats.map((stat, index) => (

                  <div

                    key={`${stat.label}-${index}`}

                    className="rounded-[2rem] border border-[#f4d4e1] bg-[#fff5f8] p-6 shadow-sm"

                  >

                    <p className="text-3xl font-extrabold text-slate-900">

                      {stat.value}

                    </p>

                    <p className="mt-2 text-sm uppercase tracking-[0.1em] text-[#d61b58]">

                      {stat.label}

                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>



          {heroImage && (

            <div

              className={`relative h-80 overflow-hidden rounded-[2rem] shadow-xl shadow-[#d61b58]/10 transition-all delay-200 duration-1000 sm:h-[420px] lg:h-[500px] ${

                isVisible

                  ? "translate-x-0 opacity-100"

                  : "translate-x-10 opacity-0"

              }`}

            >

              <Image

                src={heroImage}

                alt={data.heroImageAlt ?? "Careers at EventLab"}

                fill

                className="object-cover transition-transform duration-700 hover:scale-105"

                sizes="(max-width:1024px) 100vw, 50vw"

                unoptimized={isUnoptimizedImageSrc(heroImage)}

              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            </div>

          )}

        </div>

      </div>

    </section>

  );

}

