"use client";

import { useRef, useState } from "react";
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

import type {
  EventsCareersApplyFormData,
  EventsCareersRoleData,
  SectionProps,
} from "../../../types/section";

const defaultLocations = [
  "Delhi",
  "Karnataka",
  "Mumbai",
  "Dubai",
  "Remote",
  "Other",
];
const defaultNoticePeriods = [
  "Immediate joiner",
  "15 Days",
  "30 Days",
  "60 Days",
  "90 Days",
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export default function EventsCareersApplyForm1({ data = {} }: SectionProps) {
  const job = data as EventsCareersRoleData;
  const formConfig = (data.applyForm ?? {}) as EventsCareersApplyFormData;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const locations =
    formConfig.locations?.length ? formConfig.locations : defaultLocations;
  const noticePeriods =
    formConfig.noticePeriods?.length
      ? formConfig.noticePeriods
      : defaultNoticePeriods;

  const validateAndSetFile = (file: File) => {
    const validExtensions = ["pdf", "doc", "docx"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    if (!fileExt || !validExtensions.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Unsupported format. Only PDF, DOC, and DOCX are allowed.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size exceeds 5MB limit.",
      }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid Email Address";
    }
    if (!phone.trim()) newErrors.phone = "Phone Number is required";
    if (!currentLocation) {
      newErrors.currentLocation = "Current Location is required";
    }
    if (!noticePeriod) newErrors.noticePeriod = "Notice Period is required";
    if (!resumeFile) newErrors.resume = "Current Resume is required";

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

  if (isSubmitted) {
    const successDescription =
      formConfig.successDescription?.replace(
        "{roleTitle}",
        job.title ?? "the selected role",
      ) ??
      `Thank you for applying for the ${job.title ?? "selected role"} position. Our recruiting team will review your profile and get in touch with you shortly.`;

    return (
      <section
        data-editor-section-label="Application Form"
        data-editor-fields="applyForm"
        className="lg:col-span-2"
      >
        <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 text-center shadow-lg shadow-[#d61b58]/5 md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5f8] text-[#d61b58]">
            <CheckCircle2 className="h-12 w-12" aria-hidden />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900">
            {formConfig.successTitle ?? "Application Submitted!"}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-slate-600">
            {successDescription}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#f4d4e1] bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {formConfig.backToCareersLabel ?? "Back to Careers"}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d61b58] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#d61b58]/10 transition hover:bg-[#b01648]"
            >
              {formConfig.homeLabel ?? "Go to Homepage"}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-slate-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d61b58] ${
      hasError ? "border-red-400 focus:ring-red-400" : "border-slate-200"
    }`;

  return (
    <section
      data-editor-section-label="Application Form"
      data-editor-fields="applyForm"
      className="rounded-[2rem] border border-[#f4d4e1]/60 bg-white p-6 shadow-sm shadow-[#d61b58]/5 md:p-8 lg:col-span-2"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {formConfig.title ?? "Personal Information"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {formConfig.subtitle ?? "Please provide your personal details."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div id="fullName" className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass(Boolean(errors.fullName))}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          <div id="email" className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div id="phone" className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={`${inputClass(Boolean(errors.phone))} pl-11`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Alternate Number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <input
                type="tel"
                placeholder="Enter alternate number"
                value={alternatePhone}
                onChange={(event) => setAlternatePhone(event.target.value)}
                className={`${inputClass(false)} pl-11`}
              />
            </div>
          </div>

          <div id="currentLocation" className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Current Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <select
                value={currentLocation}
                onChange={(event) => setCurrentLocation(event.target.value)}
                className={`${inputClass(Boolean(errors.currentLocation))} appearance-none bg-white pl-11 pr-10`}
              >
                <option value="">Select your location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                <ChevronDown className="h-5 w-5" aria-hidden />
              </span>
            </div>
            {errors.currentLocation && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.currentLocation}
              </p>
            )}
          </div>

          <div id="noticePeriod" className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Notice Period <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={noticePeriod}
                onChange={(event) => setNoticePeriod(event.target.value)}
                className={`${inputClass(Boolean(errors.noticePeriod))} appearance-none bg-white pr-10`}
              >
                <option value="">Select notice period</option>
                {noticePeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                <ChevronDown className="h-5 w-5" aria-hidden />
              </span>
            </div>
            {errors.noticePeriod && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.noticePeriod}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              LinkedIn Profile
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Portfolio / Website (if any)
            </label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={portfolio}
              onChange={(event) => setPortfolio(event.target.value)}
              className={inputClass(false)}
            />
          </div>
        </div>

        <div id="resume" className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Current Resume <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              if (event.dataTransfer.files.length > 0) {
                validateAndSetFile(event.dataTransfer.files[0]);
              }
            }}
            className={`relative rounded-[1.5rem] border-2 border-dashed p-8 text-center transition-all ${
              isDragOver
                ? "border-[#d61b58] bg-[#fff5f8]"
                : errors.resume
                  ? "border-red-300 bg-red-50/20"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  validateAndSetFile(event.target.files[0]);
                }
              }}
              className="hidden"
            />

            {resumeFile ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5f8] text-[#d61b58] shadow-sm">
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
                    setResumeFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
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
                onClick={() => fileInputRef.current?.click()}
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
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#d61b58] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#b01648]"
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
            {errors.resume && (
              <p className="text-xs font-semibold text-red-500">
                {errors.resume}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d61b58] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#d61b58]/10 transition-all hover:bg-[#b01648] hover:shadow-lg disabled:opacity-75 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Submitting...
              </>
            ) : (
              (formConfig.submitLabel ?? "Apply Here")
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
