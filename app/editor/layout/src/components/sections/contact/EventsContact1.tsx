"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import type {
  EventsContactFormFieldData,
  SectionProps,
} from "../../../types/section";
import { renderEventsIcon } from "../../../lib/eventsIcons";

export default function EventsContact1({ data = {} }: SectionProps) {
  const description = data.desc ?? data.description;
  const leftContent = data.leftContent ?? {};
  const form = data.form ?? {};

  const formFields = useMemo<EventsContactFormFieldData[]>(() => {
    if (Array.isArray(form.fields) && form.fields.length > 0) {
      return form.fields;
    }

    return [
      { placeholder: form.namePlaceholder ?? "Your Name *", type: "text" },
      {
        placeholder: form.emailPlaceholder ?? "Email Address *",
        type: "email",
      },
      { placeholder: form.subjectPlaceholder ?? "Subject *", type: "text" },
      {
        placeholder: form.messagePlaceholder ?? "Message *",
        type: "textarea",
      },
    ];
  }, [form]);

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
      data-editor-fields="pretitle title desc leftBadge leftTitle leftTitleHighlight leftDesc features ctaLabel ctaHref form"
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

              {(leftContent.title || leftContent.titleHighlight) && (
                <h3 className="mt-2 text-3xl font-black leading-none text-slate-900">
                  {(leftContent.titleHighlight
                    ? [leftContent.title ?? "", leftContent.titleHighlight]
                    : (leftContent.title ?? "").split("\n")
                  ).map((line, index) => (
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
                      {renderEventsIcon(feature.icon, "h-5 w-5")}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {feature.title}
                      </h4>
                      <p className="text-slate-600">
                        {feature.description ?? feature.desc}
                      </p>
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
            <form
              className="space-y-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {formFields.map((field, index) => {
                  const isTextarea = field.type === "textarea";
                  const isFullWidth =
                    field.width === "full" || isTextarea;
                  const sharedClassName =
                    "w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5";
                  const widthClass = isFullWidth ? "sm:col-span-2" : "";

                  return isTextarea ? (
                    <textarea
                      key={`contact-field-${index}`}
                      rows={4}
                      placeholder={field.placeholder ?? ""}
                      className={`${sharedClassName} py-4 ${widthClass}`}
                    />
                  ) : (
                    <input
                      key={`contact-field-${index}`}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder ?? ""}
                      className={`${sharedClassName} h-14 ${widthClass}`}
                    />
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="mx-auto flex h-12 w-56 cursor-pointer items-center justify-center gap-3 rounded-3xl bg-[#d61b58] px-8 text-sm font-semibold text-white transition hover:bg-[#b01648]"
                >
                  {form.buttonLabel}
                  {form.buttonIcon
                    ? renderEventsIcon(form.buttonIcon, "h-5 w-5")
                    : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
