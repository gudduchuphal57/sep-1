"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
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
  options?: Array<{ value?: string; label?: string }>;
};

type PrivacyLink = { label?: string; href?: string };

export default function NGOFrenchiseForm2({ data = {} }: SectionProps) {
  const leftSection = isRecord(data.leftSection) ? data.leftSection : {};
  const form = isRecord(data.form) ? data.form : {};
  const nestedImage = isRecord(leftSection.image) ? leftSection.image : {};
  const privacy = isRecord(form.privacy) ? form.privacy : {};
  const submitButton = isRecord(form.submitButton) ? form.submitButton : {};
  const leftPretitle =
    (typeof data.leftPretitle === "string" && data.leftPretitle) ||
    (typeof leftSection.label === "string" && leftSection.label) ||
    "WHY PARTNER WITH US?";
  const leftTitle =
    (typeof data.leftTitle === "string" && data.leftTitle) ||
    (typeof leftSection.title === "string" && leftSection.title) ||
    "";
  const leftDesc =
    (typeof data.leftDesc === "string" && data.leftDesc) ||
    (typeof leftSection.description === "string" && leftSection.description) ||
    "";
  const leftPoints = (
    Array.isArray(data.leftPoints)
      ? data.leftPoints
      : Array.isArray(leftSection.points)
        ? leftSection.points
        : []
  ) as string[];
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
    "Enquire Now";
  const formPretitle =
    (typeof data.formPretitle === "string" && data.formPretitle) ||
    (typeof form.pretitle === "string" && form.pretitle) ||
    "";
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
    (typeof form.buttonLabel === "string" && form.buttonLabel) ||
    "Submit Enquiry";

  const [formData, setFormData] = useState<Record<string, string>>({});
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

  return (
    <section
      data-editor-section-label="Franchise Form"
      data-editor-fields="leftPretitle leftTitle leftDesc leftPoints leftImage leftImageAlt formTitle formPretitle form"
      data-editor-form-fields="form"
      className="mx-auto max-w-6xl bg-white px-2 pb-16 sm:px-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative overflow-hidden rounded-2xl bg-orange-50 p-3 sm:p-8">
          <p className="mb-2 text-sm font-semibold tracking-widest text-orange-600">
            {leftPretitle}
          </p>
          {leftTitle ? (
            <h3 className="mb-3 text-2xl font-bold leading-snug text-gray-900">
              {leftTitle}
            </h3>
          ) : null}
          {leftDesc ? (
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              {leftDesc}
            </p>
          ) : null}
          <ul className="mb-8 space-y-1 sm:space-y-3">
            {leftPoints.map((point, index) => (
              <li key={`${point}-${index}`} className="flex items-start gap-3">
                <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <span className="text-sm text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
          {leftImage ? (
            <div className="relative overflow-hidden">
              <Image
                src={leftImage}
                alt={leftImageAlt}
                width={800}
                height={450}
                className="h-52 w-full rounded-b-[150px] border-b-8 border-b-orange-500 object-cover"
                unoptimized={isUnoptimizedImageSrc(leftImage)}
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:p-8">
          <h3 className="mb-1 text-xl font-bold text-gray-900">{formTitle}</h3>
          {formPretitle ? (
            <p className="mb-6 text-sm text-gray-500">{formPretitle}</p>
          ) : null}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {formFields.map((field, index) => {
                const name = field.name || `field-${index}`;
                const isTextarea = field.type === "textarea";
                const isSelect = field.type === "select";
                const isFull =
                  isTextarea || field.width === "full";
                const options = Array.isArray(field.options)
                  ? field.options
                  : [];
                return (
                  <div
                    key={`${name}-${index}`}
                    className={isFull ? "sm:col-span-2" : ""}
                  >
                    {field.label ? (
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required ? (
                          <span className="ml-1 text-orange-500">*</span>
                        ) : null}
                      </label>
                    ) : null}
                    {isSelect ? (
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
                          rows={3}
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
              })}
            </div>

            {privacyLinks.length > 0 ? (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="franchise-privacy"
                  required={privacy.required !== false}
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="franchise-privacy"
                  className="text-sm leading-relaxed text-gray-600"
                >
                  {(typeof privacy.prefix === "string" && privacy.prefix) ||
                    "I agree to the"}{" "}
                  {privacyLinks.map((link, index) => (
                    <span key={`${link.href}-${index}`}>
                      {index === 1 ? " and " : index > 1 ? ", " : null}
                      <Link
                        href={link.href || "#"}
                        className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
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
                  "send",
                "h-5 w-5",
              )}
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
