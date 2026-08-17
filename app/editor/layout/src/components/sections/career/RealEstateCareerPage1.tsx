"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, MapPin } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import RealEstateBreadCrumb1 from "../breadcrumb/RealEstateBreadCrumb1";

type CareerItem = { title: string; desc: string };
type JobItem = CareerItem & { location: string; type: string };
type CareerFormField = {
  label: string;
  name: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  readOnly?: boolean;
};

const fallbackFormFields: CareerFormField[] = [
  { label: "Full name", name: "fullName", type: "text", placeholder: "Your full name" },
  { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
  { label: "Phone", name: "phone", type: "tel", placeholder: "Your phone number" },
  { label: "Position", name: "position", type: "text", placeholder: "General application", readOnly: true },
  { label: "Why are you interested?", name: "message", type: "textarea", placeholder: "Tell us about your experience" },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getCareerItems = (value: unknown): CareerItem[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
      isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.desc === "string"
        ? [{ title: item.title, desc: item.desc }]
        : [],
    )
    : [];

const getJobs = (value: unknown): JobItem[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
      isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.desc === "string" &&
        typeof item.location === "string" &&
        typeof item.type === "string"
        ? [{ title: item.title, desc: item.desc, location: item.location, type: item.type }]
        : [],
    )
    : [];

const getFormFields = (value: unknown): CareerFormField[] => {
  if (!Array.isArray(value)) return fallbackFormFields;

  const fields = value.flatMap((item) => {
    if (!isRecord(item) || typeof item.label !== "string") return [];
    const type = ["text", "email", "tel", "textarea"].includes(String(item.type))
      ? (item.type as CareerFormField["type"])
      : "text";

    return [{
      label: item.label,
      name: typeof item.name === "string" ? item.name : "field",
      type,
      placeholder: typeof item.placeholder === "string" ? item.placeholder : "",
      readOnly: item.readOnly === true,
    }];
  });

  return fields.length ? fields : fallbackFormFields;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#141414]/12 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#141414]/35 focus:border-[#a4472f]";
export default function RealEstateCareerPage1({ data = {} }: SectionProps) {
  const jobs = useMemo(() => getJobs(data.jobs), [data.jobs]);
  const benefits = useMemo(() => getCareerItems(data.benefits), [data.benefits]);
  const formFields = useMemo(() => getFormFields(data.formFields), [data.formFields]);
  const [activeJob, setActiveJob] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const selectedJob = jobs[Math.min(activeJob, Math.max(jobs.length - 1, 0))];
  return (
    <main className="bg-white text-[#141414]">
      <RealEstateBreadCrumb1
        editorFields={["pretitle", "title", "desc", "desc2"]}
        pretitle={data.pretitle ?? "Careers"}
        title={data.title ?? "Build meaningful spaces with us."}
        desc={(data.desc || data.desc2) ? (
          <>
            {data.desc && <p>{data.desc}</p>}
            {data.desc2 && <p className="mt-3 text-sm md:text-base">{data.desc2}</p>}
          </>
        ) : undefined}
      />

      <section
        data-editor-section-label="Employee Benefits"
        data-editor-fields="benefits"
        className="border-b border-[#141414]/10 bg-[#f8f6f1] px-5 py-12 md:px-8 md:py-16 lg:px-10"
      >
        <div data-box-layout-grid="grid" className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-[1.25rem] border border-[#141414]/10 bg-[#141414]/10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="bg-white p-6 md:p-7">
              <CheckCircle2 size={20} className="text-[#a4472f]" />
              <h2 className="mt-4 text-lg font-semibold">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#141414]/60">{benefit.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        data-editor-section-label="Open Positions"
        data-editor-fields="jobsPretitle jobsTitle jobs formPretitle formTitle formFields applyLabel successTitle successDesc successButtonLabel"
        data-editor-form-fields="formPretitle formTitle formFields applyLabel successTitle successDesc successButtonLabel"
        className="px-5 py-14 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a4472f]">{typeof data.jobsPretitle === "string" ? data.jobsPretitle : "Open positions"}</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] md:text-4xl">{typeof data.jobsTitle === "string" ? data.jobsTitle : "Find your next role at HAUS Group."}</h2>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <button
                  key={`${job.title}-${job.location}`}
                  type="button"
                  onClick={() => {
                    setActiveJob(index);
                    setSubmitted(false);
                  }}
                  className={`w-full rounded-[1rem] border p-5 text-left transition ${activeJob === index
                    ? "border-[#14251f] bg-[#14251f] text-white"
                    : "border-[#141414]/10 bg-[#f8f6f1] hover:border-[#141414]/30"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className={`mt-2 flex items-center gap-2 text-xs ${activeJob === index ? "text-white/60" : "text-[#141414]/50"}`}>
                        <MapPin size={13} /> {job.location} · {job.type}
                      </p>
                    </div>
                    <BriefcaseBusiness size={19} className={activeJob === index ? "text-[#e9ad91]" : "text-[#a4472f]"} />
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${activeJob === index ? "text-white/65" : "text-[#141414]/60"}`}>{job.desc}</p>
                </button>
              ))}
            </div>

            <div className="rounded-[1.25rem] border border-[#141414]/10 bg-white p-6 shadow-[0_18px_50px_rgba(20,20,20,0.06)] md:p-8 lg:sticky lg:top-24 lg:self-start">
              {submitted ? (
                <div className="py-14 text-center" role="status">
                  <CheckCircle2 size={38} className="mx-auto text-[#a4472f]" />
                  <h2 className="mt-5 text-2xl font-semibold">{typeof data.successTitle === "string" ? data.successTitle : "Application received."}</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#141414]/60">{typeof data.successDesc === "string" ? data.successDesc : "Thanks for your interest. Our team will review your details and contact you if the role is a match."}</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-white">{typeof data.successButtonLabel === "string" ? data.successButtonLabel : "Apply for another role"}</button>
                </div>
              ) : (
                <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a4472f]">{typeof data.formPretitle === "string" ? data.formPretitle : "Application form"}</p>
                  <h2 className="mt-3 text-2xl font-semibold">{typeof data.formTitle === "string" ? data.formTitle : "Apply for"} {selectedJob?.title ?? "a position"}</h2>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    {formFields.map((field) => (
                      <label key={field.name} className={`text-sm font-semibold ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
                        {field.label}
                        {field.type === "textarea" ? (
                          <textarea required name={field.name} rows={5} placeholder={field.placeholder} className={inputClass} />
                        ) : (
                          <input
                            required={!field.readOnly}
                            readOnly={field.readOnly}
                            type={field.type}
                            name={field.name}
                            value={field.readOnly ? selectedJob?.title ?? field.placeholder : undefined}
                            placeholder={field.placeholder}
                            className={`${inputClass} ${field.readOnly ? "bg-[#f8f6f1]" : ""}`}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="mt-6 rounded-full bg-[#141414] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#a4472f]">{typeof data.applyLabel === "string" ? data.applyLabel : "Submit application"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
