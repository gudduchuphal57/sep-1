"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  FileText,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";

import {
  getEventsCareersFieldOptions,
  resolveEventsCareersApplyForm,
} from "../../../lib/eventsCareersApplyForm";
import type {
  EventsCareersApplyFormFieldData,
  EventsCareersRoleData,
  SectionProps,
} from "../../../types/section";

const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

type EventsCareersApplyFormProps = SectionProps & {
  variant?: "page" | "modal";
  onClose?: () => void;
  accent?: "events" | "ngo";
};

const formAccents = {
  events: {
    primary: "bg-[#d61b58] hover:bg-[#b01648]",
    primaryShadow: "shadow-[#d61b58]/10",
    ring: "focus:ring-[#d61b58]",
    wash: "bg-[#fff5f8]",
    washText: "text-[#d61b58]",
    border: "border-[#f4d4e1]",
    dropActive: "border-[#d61b58] bg-[#fff5f8]",
    sectionShadow: "shadow-[#d61b58]/5",
  },
  ngo: {
    primary: "bg-[#ff541b] hover:bg-[#e0430e]",
    primaryShadow: "shadow-[#ff541b]/10",
    ring: "focus:ring-[#ff541b]",
    wash: "bg-[#fff0eb]",
    washText: "text-[#ff541b]",
    border: "border-orange-100",
    dropActive: "border-[#ff541b] bg-[#fff0eb]",
    sectionShadow: "shadow-[#ff541b]/5",
  },
};

export default function EventsCareersApplyForm1({
  data = {},
  variant = "page",
  onClose,
  accent = "events",
}: EventsCareersApplyFormProps) {
  const job = data as EventsCareersRoleData;
  const formConfig = useMemo(
    () => resolveEventsCareersApplyForm(data.applyForm),
    [data.applyForm],
  );

  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOverField, setIsDragOverField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isModal = variant === "modal";
  const theme = formAccents[accent] ?? formAccents.events;
  const sectionClassName = isModal
    ? "rounded-[1.75rem] bg-white p-4 sm:p-6"
    : `rounded-[2rem] border ${theme.border}/60 bg-white p-6 shadow-sm ${theme.sectionShadow} md:p-8 lg:col-span-2`;

  const setFieldValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateAndSetFile = (fieldName: string, file: File) => {
    const validExtensions = ["pdf", "doc", "docx"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    if (!fileExt || !validExtensions.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]:
          "Unsupported format. Only PDF, DOC, and DOCX are allowed.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size exceeds 5MB limit.",
      }));
      return;
    }

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    formConfig.fields.forEach((field, index) => {
      const fieldName = field.name ?? `field-${index}`;
      const value = values[fieldName]?.trim() ?? "";

      if (!field.required) return;

      if (field.type === "file") {
        if (!files[fieldName]) {
          newErrors[fieldName] = `${field.label ?? "File"} is required`;
        }
        return;
      }

      if (!value) {
        newErrors[fieldName] = `${field.label ?? "Field"} is required`;
        return;
      }

      if (field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[fieldName] = "Invalid Email Address";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrField = Object.keys(newErrors)[0];
      document
        .getElementById(firstErrField)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-slate-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 ${theme.ring} ${
      hasError ? "border-red-400 focus:ring-red-400" : "border-slate-200"
    }`;

  const renderField = (field: EventsCareersApplyFormFieldData, index: number) => {
    const fieldName = field.name ?? `field-${index}`;
    const fieldId = fieldName;
    const isFullWidth =
      field.width === "full" || field.type === "textarea" || field.type === "file";
    const widthClass = isFullWidth ? "md:col-span-2" : "";
    const hasError = Boolean(errors[fieldName]);
    const label = field.label ?? "Field";

    if (field.type === "file") {
      const resumeFile = files[fieldName] ?? null;

      return (
        <div key={fieldName} id={fieldId} className={`space-y-2 ${widthClass}`}>
          <label className="text-sm font-semibold text-slate-700">
            {label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOverField(fieldName);
            }}
            onDragLeave={() => setIsDragOverField(null)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOverField(null);
              if (event.dataTransfer.files.length > 0) {
                validateAndSetFile(fieldName, event.dataTransfer.files[0]);
              }
            }}
            className={`relative rounded-[1.5rem] border-2 border-dashed p-8 text-center transition-all ${
              isDragOverField === fieldName
                ? theme.dropActive
                : hasError
                  ? "border-red-300 bg-red-50/20"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              ref={(element) => {
                fileInputRefs.current[fieldName] = element;
              }}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  validateAndSetFile(fieldName, event.target.files[0]);
                }
              }}
              className="hidden"
            />

            {resumeFile ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${theme.wash} ${theme.washText} shadow-sm`}>
                  <FileText className="h-8 w-8" aria-hidden />
                </div>
                <div>
                  <p className="mx-auto max-w-md truncate text-sm font-bold text-slate-800">
                    {resumeFile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatBytes(resumeFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFiles((prev) => ({ ...prev, [fieldName]: null }));
                    if (fileInputRefs.current[fieldName]) {
                      fileInputRefs.current[fieldName]!.value = "";
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Remove Resume
                </button>
              </div>
            ) : (
              <div
                className="flex cursor-pointer flex-col items-center justify-center"
                onClick={() => fileInputRefs.current[fieldName]?.click()}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm">
                  <CloudUpload className="h-8 w-8" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Drag & drop your file here
                </p>
                <p className="mt-1 text-xs text-slate-500">or</p>
                <button
                  type="button"
                  className={`mt-3 inline-flex items-center justify-center rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition ${theme.primary}`}
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] text-slate-400">
              Supported formats: PDF, DOC, DOCX (Max size: 5MB)
            </p>
            {errors[fieldName] && (
              <p className="text-xs font-semibold text-red-500">
                {errors[fieldName]}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (field.type === "select") {
      const options = getEventsCareersFieldOptions(field, formConfig);

      return (
        <div key={fieldName} id={fieldId} className={`space-y-1.5 ${widthClass}`}>
          <label className="text-sm font-semibold text-slate-700">
            {label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {field.optionsSource === "locations" && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
            )}
            <select
              value={values[fieldName] ?? ""}
              onChange={(event) => setFieldValue(fieldName, event.target.value)}
              className={`${inputClass(hasError)} appearance-none bg-white ${
                field.optionsSource === "locations" ? "pl-11" : ""
              } pr-10`}
            >
              <option value="">{field.placeholder ?? "Select option"}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <ChevronDown className="h-5 w-5" aria-hidden />
            </span>
          </div>
          {errors[fieldName] && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors[fieldName]}
            </p>
          )}
        </div>
      );
    }

    const showPhoneIcon = field.type === "tel";

    return (
      <div key={fieldName} id={fieldId} className={`space-y-1.5 ${widthClass}`}>
        <label className="text-sm font-semibold text-slate-700">
          {label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {showPhoneIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Phone className="h-5 w-5" aria-hidden />
            </span>
          )}
          <input
            type={field.type === "url" ? "url" : field.type ?? "text"}
            placeholder={field.placeholder ?? ""}
            value={values[fieldName] ?? ""}
            onChange={(event) => setFieldValue(fieldName, event.target.value)}
            className={`${inputClass(hasError)} ${showPhoneIcon ? "pl-11" : ""}`}
          />
        </div>
        {errors[fieldName] && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {errors[fieldName]}
          </p>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    const successDescription =
      formConfig.successDescription.replace(
        "{roleTitle}",
        job.title ?? "the selected role",
      ) ??
      `Thank you for applying for the ${job.title ?? "selected role"} position. Our recruiting team will review your profile and get in touch with you shortly.`;

    return (
      <section
        data-editor-section-label="Application Form"
        data-editor-fields="applyForm"
        className={isModal ? sectionClassName : "lg:col-span-2"}
      >
        <div className={`rounded-[2rem] border ${theme.border} bg-white p-8 text-center shadow-lg ${theme.sectionShadow} md:p-12`}>
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${theme.wash} ${theme.washText}`}>
            <CheckCircle2 className="h-12 w-12" aria-hidden />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900">
            {formConfig.successTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-slate-600">
            {successDescription}
          </p>
          {isModal && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-md ${theme.primaryShadow} transition ${theme.primary}`}
            >
              Close
            </button>
          ) : (
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/careers"
                className={`inline-flex items-center justify-center gap-2 rounded-full border ${theme.border} bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {formConfig.backToCareersLabel}
              </Link>
              <Link
                href="/"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-md ${theme.primaryShadow} transition ${theme.primary}`}
              >
                {formConfig.homeLabel}
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      data-editor-section-label="Application Form"
      data-editor-fields="applyForm"
      className={sectionClassName}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {formConfig.title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{formConfig.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {formConfig.fields.map(renderField)}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-md ${theme.primaryShadow} transition-all ${theme.primary} hover:shadow-lg disabled:opacity-75 sm:w-auto`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Submitting...
              </>
            ) : (
              formConfig.submitLabel
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
