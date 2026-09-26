"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type FormField = {
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: string;
  width?: "half" | "full";
  options?: Array<{ value?: string; label?: string; default?: boolean }>;
};

type PrivacyLink = { label?: string; href?: string };

type LeftFeature = {
  icon?: string;
  title?: string;
  description?: string;
};

export default function NGOEnquiryForm2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header.label === "string" && header.label) ||
    "ENQUIRY NOW";
  const heading =
    (typeof data.heading === "string" && data.heading) ||
    (typeof header.heading === "string" && header.heading) ||
    "";
  const rawTitle = typeof data.title === "string" ? data.title.trim() : "";
  const titleLooksLikeBanner =
    !rawTitle ||
    rawTitle.toLowerCase() === "enquiry" ||
    rawTitle.toLowerCase() === "enquiry now";
  const title = titleLooksLikeBanner
    ? heading || "We're Here to Help You"
    : rawTitle;
  const desc =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header.description === "string" && header.description) ||
    "";
  const leftSection = isRecord(data.leftSection) ? data.leftSection : {};
  const form = isRecord(data.form) ? data.form : {};
  const nestedImage = isRecord(leftSection.image) ? leftSection.image : {};
  const privacy = isRecord(form.privacy) ? form.privacy : {};
  const submitButton = isRecord(form.submitButton) ? form.submitButton : {};
  const leftTitle =
    (typeof data.leftTitle === "string" && data.leftTitle) ||
    (typeof leftSection.title === "string" && leftSection.title) ||
    "";
  const leftDesc =
    (typeof data.leftDesc === "string" && data.leftDesc) ||
    (typeof leftSection.description === "string" && leftSection.description) ||
    "";
  const leftFeatures = (
    Array.isArray(data.leftFeatures)
      ? data.leftFeatures
      : Array.isArray(leftSection.features)
        ? leftSection.features
        : []
  ) as LeftFeature[];
  const visibleLeftFeatures = leftFeatures.slice(0, 5);
  const leftImage =
    (typeof data.leftImage === "string" && data.leftImage) ||
    (typeof nestedImage.src === "string" && nestedImage.src) ||
    "";
  const leftImageAlt =
    (typeof data.leftImageAlt === "string" && data.leftImageAlt) ||
    (typeof nestedImage.alt === "string" && nestedImage.alt) ||
    leftTitle;
  const formTitle =
    (typeof data.formTitle === "string" && data.formTitle) ||
    (typeof form.title === "string" && form.title) ||
    "Send Us a Message";
  const formFields = useMemo(() => {
    if (Array.isArray(form.fields) && form.fields.length) {
      return form.fields as FormField[];
    }
    return [];
  }, [form.fields]);
  const privacyLinks = (
    Array.isArray(privacy.links) ? privacy.links : []
  ) as PrivacyLink[];
  const submitLabel =
    (typeof submitButton.label === "string" && submitButton.label) ||
    "Submit Enquiry";

  const defaultRadio = formFields.reduce<Record<string, string>>((acc, field) => {
    if (field.type === "radio" && field.name) {
      const selected = (field.options || []).find((option) => option.default);
      acc[field.name] = selected?.value || field.options?.[0]?.value || "";
    }
    return acc;
  }, {});
  const [formData, setFormData] = useState<Record<string, string>>(defaultRadio);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const renderInputField = (field: FormField, key: string) => {
    const name = field.name || key;
    const isTextarea = field.type === "textarea";
    const isSelect = field.type === "select";
    const isRadio = field.type === "radio";
    const options = Array.isArray(field.options) ? field.options : [];

    return (
      <div key={key}>
        {field.label ? (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {field.label}
            {field.required ? (
              <span className="ml-1 text-orange-600">*</span>
            ) : null}
          </label>
        ) : null}
        {isRadio ? (
          <div className="flex flex-wrap gap-5">
            {options.map((option) => (
              <label
                key={option.value || option.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value || option.label}
                  required={Boolean(field.required)}
                  checked={
                    (formData[name] ?? "") === (option.value || option.label)
                  }
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        ) : isSelect ? (
          <select
            name={name}
            required={Boolean(field.required)}
            value={formData[name] ?? ""}
            onChange={handleChange}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          >
            <option value="" disabled>
              {field.placeholder || "Select an option"}
            </option>
            {options.map((option) => (
              <option
                key={option.value || option.label}
                value={option.value || option.label}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <div className="relative">
            {field.icon ? (
              <span className="absolute left-3 top-3 text-gray-400">
                {renderNgoIcon(field.icon, "h-4 w-4")}
              </span>
            ) : null}
            <textarea
              name={name}
              rows={4}
              required={Boolean(field.required)}
              value={formData[name] ?? ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full resize-none rounded-lg border border-gray-200 py-2.5 pr-4 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                field.icon ? "pl-10" : "px-4"
              }`}
            />
          </div>
        ) : (
          <div className="relative">
            {field.icon ? (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {renderNgoIcon(field.icon, "h-4 w-4")}
              </span>
            ) : null}
            <input
              type={field.type || "text"}
              name={name}
              required={Boolean(field.required)}
              value={formData[name] ?? ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full rounded-lg border border-gray-200 py-2.5 pr-4 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                field.icon ? "pl-10" : "px-4"
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      data-editor-section-label="Enquiry Form"
      data-editor-fields="pretitle title desc leftTitle leftDesc leftFeatures leftImage leftImageAlt formTitle form"
      data-editor-form-fields="form"
      data-editor-card-fields="icon title description"
      className="bg-white text-gray-800"
    >
      <div className="mx-auto max-w-4xl px-2 pb-10 pt-8 text-center sm:pt-12">
        <div className="flex justify-center gap-1">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="mb-0 text-sm font-semibold tracking-widest text-orange-600">
            {pretitle}
          </p>
        </div>
        <h2 className="mb-0 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h2>
        {desc ? (
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
            {desc}
          </p>
        ) : null}
      </div>
      <div className="mx-auto max-w-6xl pb-16 sm:px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative overflow-hidden rounded-2xl bg-orange-50 p-3 sm:p-8">
          <div className="absolute right-0 top-0 opacity-70">
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="enquiryDotTriangle">
                  <polygon points="0,0 150,0 150,150" />
                </clipPath>
              </defs>
              <g clipPath="url(#enquiryDotTriangle)" fill="#d1d5db">
                {Array.from({ length: 12 }).map((_, row) =>
                  Array.from({ length: 12 }).map((_, col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={12 + col * 12}
                      cy={12 + row * 12}
                      r="1.6"
                    />
                  )),
                )}
              </g>
            </svg>
          </div>
          <div className="relative z-10 mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              {renderNgoIcon("heart-hands", "h-6 w-6")}
            </div>
            <div>
              {leftTitle ? (
                <h3 className="text-xl font-bold leading-snug text-gray-900">
                  {leftTitle}
                </h3>
              ) : null}
            </div>
          </div>
          {leftDesc ? (
            <p className="relative z-10 mb-8 text-sm leading-relaxed text-gray-600">
              {leftDesc}
            </p>
          ) : null}
          <div className="relative z-10 mb-8 space-y-5">
            {visibleLeftFeatures.map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                  {renderNgoIcon(feature.icon || "users", "h-5 w-5")}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                  {feature.description ? (
                    <p className="mt-0.5 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          {leftImage ? (
            <div className="relative overflow-hidden">
              <Image
                src={leftImage}
                alt={leftImageAlt}
                width={800}
                height={450}
                className="h-56 w-full rounded-b-[150px] border-b-8 border-b-orange-500 object-cover"
                unoptimized={isUnoptimizedImageSrc(leftImage)}
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-8">
          <h3 className="mb-6 text-xl font-bold text-gray-900">{formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {formFields.map((field, index) => {
                const isFull =
                  field.type === "textarea" ||
                  field.type === "radio" ||
                  field.width === "full";
                return (
                  <div
                    key={`${field.name || "field"}-${index}`}
                    className={isFull ? "sm:col-span-2" : ""}
                  >
                    {renderInputField(
                      field,
                      field.name || `field-${index}`,
                    )}
                  </div>
                );
              })}
            </div>

            {privacyLinks.length > 0 ? (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="enquiry-privacy"
                  required={privacy.required !== false}
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="enquiry-privacy"
                  className="text-sm leading-relaxed text-gray-600"
                >
                  {(typeof privacy.prefix === "string" && privacy.prefix) ||
                    "I agree to the"}{" "}
                  {privacyLinks.map((link, index) => (
                    <span key={`${link.href}-${index}`}>
                      {index === 1 ? " and " : index > 1 ? ", " : null}
                      <Link
                        href={link.href || "#"}
                        className="font-medium text-orange-600 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </span>
                  ))}
                  .
                </label>
              </div>
            ) : null}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3.5 font-semibold text-white shadow-md shadow-orange-200 transition-colors hover:bg-orange-700"
            >
              {renderNgoIcon(
                (typeof submitButton.icon === "string" && submitButton.icon) ||
                  "paper-plane",
                "h-5 w-5",
              )}
              {submitLabel}
            </button>
          </form>
        </div>
        </div>
      </div>
    </section>
  );
}
