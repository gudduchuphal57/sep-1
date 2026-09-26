"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { FiArrowRight, FiSend } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type LabelValue = { label?: string; value?: string; title?: string };

type OfficeBlock = {
  title?: string;
  description?: string;
  address?: LabelValue;
  phone?: LabelValue;
  email?: LabelValue;
  hours?: LabelValue;
};

type ContactItem = {
  icon?: string;
  title?: string;
  label?: string;
  value?: string;
};

type FormField = {
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  width?: "half" | "full";
};

type FormConfig = {
  title?: string;
  pretitle?: string;
  submitLabel?: string;
  button?: { label?: string };
  buttonLabel?: string;
  fields?: FormField[] | Record<string, FormField>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const fallbackContactItems = (office: OfficeBlock): ContactItem[] => [
  {
    icon: "map-pin",
    title: office.address?.label || office.address?.title || "Office Address",
    value: office.address?.value || "245 Hope Street, New Delhi, India",
  },
  {
    icon: "phone",
    title: office.phone?.label || office.phone?.title || "Phone Number",
    value: office.phone?.value || "++1-555-0014",
  },
  {
    icon: "mail",
    title: office.email?.label || office.email?.title || "Email Address",
    value: office.email?.value || "support@charityhope.org",
  },
  {
    icon: "clock",
    title: office.hours?.label || office.hours?.title || "Working Hours",
    value: office.hours?.value || "Monday - Saturday : 09:00 AM - 06:00 PM",
  },
];

const defaultFormFields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
    width: "half",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email address",
    type: "email",
    width: "half",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    type: "text",
    width: "half",
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "How can we help you?",
    type: "text",
    width: "half",
  },
  {
    name: "message",
    label: "Your Message",
    placeholder: "Write your message here...",
    type: "textarea",
    width: "full",
  },
];

const toFormFields = (fields: FormConfig["fields"]): FormField[] => {
  if (Array.isArray(fields) && fields.length > 0) {
    return fields;
  }
  if (isRecord(fields)) {
    const fromObject = Object.entries(fields).map(([key, value]) => {
      const entry = isRecord(value) ? (value as FormField) : {};
      return {
        name: key,
        label: entry.label || key,
        placeholder: entry.placeholder || "",
        type: entry.type || (key === "message" ? "textarea" : "text"),
        width: entry.width || (key === "message" ? "full" : "half"),
      };
    });
    if (fromObject.length) return fromObject;
  }
  return defaultFormFields;
};

export default function NGOContact2({ data = {} }: SectionProps) {
  const office = (isRecord(data.office) ? data.office : {}) as OfficeBlock;
  const form = (isRecord(data.form) ? data.form : {}) as FormConfig;
  const contactItems = (
    Array.isArray(data.contactItems) && data.contactItems.length > 0
      ? data.contactItems
      : fallbackContactItems(office)
  ) as ContactItem[];
  const formFields = useMemo(() => toFormFields(form.fields), [form.fields]);

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      data-editor-section-label="Contact Overview"
      data-editor-fields="office contactItems form"
      data-editor-card-fields="icon title value"
      className="relative overflow-hidden bg-white py-8 md:py-12"
    >
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-100 blur-[140px]" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-50 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[580px_1fr] lg:gap-0">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-600 p-4 text-white sm:p-6 md:p-8 lg:rounded-none lg:rounded-l-2xl">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/10" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full border border-white/10" />
            <div className="absolute bottom-16 right-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold sm:text-3xl">
                  {office.title || "Head Office"}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:mt-5 sm:text-base lg:mx-0">
                  {office.description ||
                    "Our dedicated team is always ready to assist volunteers, donors, and partners. Reach out through any of the following channels and we'll respond as quickly as possible."}
                </p>
              </div>

              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4 lg:mt-10 lg:space-y-5">
                {contactItems.map((item, index) => (
                  <div
                    key={`${item.title || item.label}-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md sm:gap-4 sm:p-4 md:p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14">
                      {renderNgoIcon(
                        item.icon || "map-pin",
                        "h-5 w-5 text-white sm:h-6 sm:w-6",
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-sm font-semibold sm:text-base">
                        {item.title || item.label}
                      </h4>
                      {item.value ? (
                        <p className="mt-1 whitespace-pre-line break-words text-sm leading-5 text-white/80 sm:leading-6">
                          {item.value}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 lg:rounded-l-none lg:rounded-r-2xl">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {form.title || "Send Us A Message"}
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-900 sm:mt-4 sm:text-base lg:mx-0">
                {form.pretitle ||
                  "Fill out the form below and our team will contact you shortly."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-8 lg:mt-10"
            >
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {formFields.map((field, index) => {
                  const name = field.name || `field-${index}`;
                  const isTextarea = field.type === "textarea";
                  const isFullWidth =
                    field.width === "full" || isTextarea;
                  const widthClass = isFullWidth ? "sm:col-span-2" : "";
                  const inputClassName =
                    "w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base";

                  return (
                    <div key={`${name}-${index}`} className={widthClass}>
                      {field.label ? (
                        <label className="mb-2 block text-left text-sm font-semibold text-slate-900">
                          {field.label}
                        </label>
                      ) : null}
                      {isTextarea ? (
                        <textarea
                          rows={6}
                          name={name}
                          value={formData[name] ?? ""}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`${inputClassName} resize-none`}
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          name={name}
                          value={formData[name] ?? ""}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={inputClassName}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center lg:justify-start">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-300/40 transition-all duration-300 hover:bg-orange-600 sm:px-8 sm:py-4 sm:text-base"
                >
                  <FiSend />
                  {form.button?.label ||
                    form.buttonLabel ||
                    form.submitLabel ||
                    "Send Message"}
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
