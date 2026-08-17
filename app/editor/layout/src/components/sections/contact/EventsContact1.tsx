"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function EventsContact1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const leftContent = data.leftContent ?? {};
  const form = data.form ?? {};

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="mt-8 w-full scroll-mt-24 md:mt-10 lg:mt-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          {data.pretitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d61b58]">
              {data.pretitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          {description && (
            <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 sm:text-base sm:leading-6 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr] xl:grid-cols-[0.9fr_1.4fr]">
          <div
            className={`relative overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_35px_90px_-45px_rgba(214,27,88,0.25)] transition duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="absolute right-0 top-8 opacity-20">
              <svg
                width="220"
                height="120"
                viewBox="0 0 220 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M0 90C40 90 40 20 80 20C120 20 120 110 160 110C190 110 200 70 220 70"
                  stroke="#d61b58"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>

            <div className="relative z-10">
              {leftContent.badge && (
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d61b58]">
                  {leftContent.badge}
                </p>
              )}

              {leftContent.title && (
                <h3 className="mt-2 text-3xl font-black leading-none text-slate-900">
                  {leftContent.title.split("\n").map((line, index) => (
                    <span
                      key={`${line}-${index}`}
                      className={
                        index === 1 ? "block text-[#d61b58]" : "block"
                      }
                    >
                      {line}
                    </span>
                  ))}
                </h3>
              )}

              {leftContent.description && (
                <p className="mt-3 text-[17px] leading-6 text-slate-600">
                  {leftContent.description}
                </p>
              )}

              <div className="mt-8 space-y-6">
                {(leftContent.features ?? []).map((feature, index) => (
                  <div key={`${feature.title}-${index}`} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fde8f2] text-[#d61b58]">
                      {feature.icon === "shield" && (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z" />
                        </svg>
                      )}
                      {feature.icon === "users" && (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 1a3 3 0 100-6 3 3 0 000 6zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-1.3.6-2.5 1.7-3.4A14 14 0 008 14zm8 0c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {feature.title}
                      </h4>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {leftContent.cta?.label && (
                <Link
                  href={leftContent.cta.href ?? "/contact"}
                  className="group mx-auto mt-6 flex h-12 w-52 items-center justify-center rounded-full bg-[#d61b58] px-5 text-md font-bold text-white transition hover:bg-[#b01648]"
                >
                  <span>{leftContent.cta.label}</span>
                  <span className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-3">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div
            className={`rounded-[2rem] border border-[#f4d4e1] bg-white p-6 shadow-[0_35px_90px_-45px_rgba(214,27,88,0.25)] transition duration-700 sm:p-8 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-6 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder={form.namePlaceholder ?? ""}
                  className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
                />
                <input
                  type="email"
                  placeholder={form.emailPlaceholder ?? ""}
                  className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
                />
              </div>

              <input
                type="text"
                placeholder={form.subjectPlaceholder ?? ""}
                className="h-14 w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
              />

              <textarea
                rows={4}
                placeholder={form.messagePlaceholder ?? ""}
                className="w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 py-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5"
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="mx-auto flex h-12 w-56 cursor-pointer items-center justify-center gap-3 rounded-3xl bg-[#d61b58] px-8 text-sm font-semibold text-white transition hover:bg-[#b01648]"
                >
                  {form.buttonLabel}
                  {form.buttonIcon === "send" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 2 11 13" />
                      <path d="M22 2 15 22 11 13 2 9 22 2Z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
