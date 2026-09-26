"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiUploadCloud,
  FiBriefcase,
  FiCheck,
  FiUsers,
  FiHeadphones,
  FiChevronDown,
} from "react-icons/fi";
import { BsFillLightbulbFill } from "react-icons/bs";
import type { SectionProps } from "../../../types/section";

type FieldMeta = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  dragDropText?: string;
  actionText?: string;
  supportedFormats?: string;
  uploadTitle?: string;
};

type FormSection = {
  step?: number | string;
  title?: string;
  pretitle?: string;
  fields?: Record<string, FieldMeta>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asField = (value: unknown): FieldMeta =>
  isRecord(value) ? (value as FieldMeta) : {};

const asFormSection = (value: unknown): FormSection =>
  isRecord(value) ? (value as FormSection) : {};

export default function NGOCareersApplyForm2({
  data = {},
  variant = "page",
  onClose,
}: SectionProps & { variant?: "page" | "modal"; onClose?: () => void }) {
  const [whyText, setWhyText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const formSections = isRecord(data.formSections) ? data.formSections : {};
  const personal = asFormSection(formSections.personalInformation);
  const professional = asFormSection(formSections.professionalInformation);
  const uploadDocs = asFormSection(formSections.uploadDocuments);
  const additional = asFormSection(formSections.additionalInformation);
  const personalFields = isRecord(personal.fields) ? personal.fields : {};
  const professionalFields = isRecord(professional.fields)
    ? professional.fields
    : {};
  const uploadFields = isRecord(uploadDocs.fields) ? uploadDocs.fields : {};
  const additionalFields = isRecord(additional.fields)
    ? additional.fields
    : {};

  const actions = isRecord(data.actions) ? data.actions : {};
  const backButton = isRecord(actions.backButton) ? actions.backButton : {};
  const submitButton = isRecord(actions.submitButton)
    ? actions.submitButton
    : {};

  const sidebar = isRecord(data.sidebar) ? data.sidebar : {};
  const jobSummary = isRecord(sidebar.jobSummary) ? sidebar.jobSummary : {};
  const tips = isRecord(sidebar.tipsBeforeYouApply)
    ? sidebar.tipsBeforeYouApply
    : {};
  const equalOpp = isRecord(sidebar.equalOpportunityEmployer)
    ? sidebar.equalOpportunityEmployer
    : {};
  const needHelp = isRecord(sidebar.needHelp) ? sidebar.needHelp : {};
  const needHelpButton = isRecord(needHelp.button) ? needHelp.button : {};

  const summaryDetails = (
    Array.isArray(jobSummary.details) ? jobSummary.details : []
  ) as Array<{ label?: string; value?: string }>;
  const tipItems = (
    Array.isArray(tips.tips) ? tips.tips : []
  ) as string[];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const fullName = asField(personalFields.fullName);
  const emailAddress = asField(personalFields.emailAddress);
  const phoneNumber = asField(personalFields.phoneNumber);
  const currentLocation = asField(personalFields.currentLocation);
  const currentJobTitle = asField(professionalFields.currentJobTitle);
  const totalExperience = asField(professionalFields.totalExperience);
  const relevantExperience = asField(professionalFields.relevantExperience);
  const noticePeriod = asField(professionalFields.noticePeriod);
  const resume = asField(uploadFields.resume);
  const coverLetter = asField(uploadFields.coverLetter);
  const whyInterested = asField(additionalFields.whyInterested);
  const hearAboutUs = asField(additionalFields.hearAboutUs);
  const isModal = variant === "modal";

  const stepBadge = (step: number | string | undefined): ReactNode => (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff541b] text-sm font-bold text-white sm:h-7 sm:w-7 sm:text-sm">
      {step}
    </span>
  );

  return (
    <section
      data-editor-section-label="Application Form"
      data-editor-fields="formSections actions sidebar"
      className={
        isModal
          ? "w-full bg-white text-[#0d152e]"
          : "w-full bg-[#fcfcfd] text-[#0d152e]"
      }
    >
      <div
        className={
          isModal
            ? "mx-auto w-full px-3 py-4 sm:px-5 sm:py-6"
            : "mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
        }
      >
        <form
          onSubmit={handleSubmit}
          className={
            isModal
              ? "grid grid-cols-1 gap-6"
              : "grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
          }
        >
          <div
            className={
              isModal ? "space-y-6 sm:space-y-8" : "space-y-6 sm:space-y-8 lg:col-span-8"
            }
          >
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                {stepBadge(personal.step ?? 1)}
                <h2 className="text-base font-bold text-[#0d152e] sm:text-lg lg:text-xl">
                  {personal.title || "Personal Information"}
                </h2>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {fullName.label || "Full Name"}{" "}
                    {fullName.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <input
                    type="text"
                    required={Boolean(fullName.required)}
                    placeholder={fullName.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {emailAddress.label || "Email Address"}{" "}
                    {emailAddress.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <input
                    type="email"
                    required={Boolean(emailAddress.required)}
                    placeholder={emailAddress.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {phoneNumber.label || "Phone Number"}{" "}
                    {phoneNumber.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <input
                    type="tel"
                    required={Boolean(phoneNumber.required)}
                    placeholder={phoneNumber.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {currentLocation.label || "Current Location"}{" "}
                    {currentLocation.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required={Boolean(currentLocation.required)}
                      placeholder={currentLocation.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                    />
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                {stepBadge(professional.step ?? 2)}
                <h2 className="text-base font-bold text-[#0d152e] sm:text-lg lg:text-xl">
                  {professional.title || "Professional Information"}
                </h2>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {currentJobTitle.label || "Current Job Title"}
                  </label>
                  <input
                    type="text"
                    placeholder={currentJobTitle.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {totalExperience.label || "Total Experience"}{" "}
                    {totalExperience.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <div className="relative">
                    <select
                      required={Boolean(totalExperience.required)}
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-[#0d152e] outline-none transition-all focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <option value="" disabled hidden>
                        {totalExperience.placeholder || "Select experience"}
                      </option>
                      <option value="0-1">0 - 1 Years</option>
                      <option value="1-3">1 - 3 Years</option>
                      <option value="3-5">3 - 5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {relevantExperience.label || "Relevant Experience"}{" "}
                    {relevantExperience.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <div className="relative">
                    <select
                      required={Boolean(relevantExperience.required)}
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-[#0d152e] outline-none transition-all focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <option value="" disabled hidden>
                        {relevantExperience.placeholder || "Select experience"}
                      </option>
                      <option value="0-1">0 - 1 Years</option>
                      <option value="1-3">1 - 3 Years</option>
                      <option value="3-5">3 - 5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {noticePeriod.label || "Notice Period"}{" "}
                    {noticePeriod.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <div className="relative">
                    <select
                      required={Boolean(noticePeriod.required)}
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-[#0d152e] outline-none transition-all focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <option value="" disabled hidden>
                        {noticePeriod.placeholder || "Select notice period"}
                      </option>
                      <option value="immediate">Immediate</option>
                      <option value="15-days">15 Days</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-months">2 Months</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                {stepBadge(uploadDocs.step ?? 3)}
                <h2 className="text-base font-bold text-[#0d152e] sm:text-lg lg:text-xl">
                  {uploadDocs.title || "Upload Documents"}
                </h2>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />
              {typeof uploadDocs.pretitle === "string" ? (
                <p className="mt-3 text-sm text-slate-500 sm:text-sm">
                  {uploadDocs.pretitle}
                </p>
              ) : null}

              <div className="mt-5 space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {resume.label || "Upload Your Resume"}{" "}
                    {resume.required ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[#fafafa] p-4 text-center transition-all hover:bg-slate-50 sm:p-6">
                    <input
                      type="file"
                      required={Boolean(resume.required)}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) =>
                        setResumeFile(e.target.files?.[0] || null)
                      }
                    />
                    <FiUploadCloud className="h-7 w-7 text-[#ff541b] sm:h-8 sm:w-8" />
                    <p className="mt-2 text-sm font-medium text-[#0d152e] sm:text-sm">
                      {resumeFile ? (
                        <span className="font-semibold text-[#ff541b]">
                          {resumeFile.name}
                        </span>
                      ) : (
                        <>
                          {resume.label || "Upload Your Resume"}{" "}
                          <span className="text-red-500">*</span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 sm:text-sm">
                      {resume.dragDropText ||
                        "Drag & drop your file here, or"}{" "}
                      <span className="font-semibold text-[#ff541b] underline">
                        {resume.actionText || "browse"}
                      </span>
                    </p>
                    <p className="mt-1 text-[9px] text-slate-400 sm:text-[11px]">
                      {resume.supportedFormats ||
                        "Supported formats: PDF, DOC, DOCX (Max size: 5MB)"}
                    </p>
                  </label>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {coverLetter.label || "Cover Letter (Optional)"}
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[#fafafa] p-4 text-center transition-all hover:bg-slate-50 sm:p-6">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) =>
                        setCoverLetterFile(e.target.files?.[0] || null)
                      }
                    />
                    <FiUploadCloud className="h-7 w-7 text-[#ff541b] sm:h-8 sm:w-8" />
                    <p className="mt-2 text-sm font-medium text-[#0d152e] sm:text-sm">
                      {coverLetterFile ? (
                        <span className="font-semibold text-[#ff541b]">
                          {coverLetterFile.name}
                        </span>
                      ) : (
                        coverLetter.uploadTitle || "Upload Cover Letter"
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 sm:text-sm">
                      {coverLetter.dragDropText ||
                        "Drag & drop your file here, or"}{" "}
                      <span className="font-semibold text-[#ff541b] underline">
                        {coverLetter.actionText || "browse"}
                      </span>
                    </p>
                    <p className="mt-1 text-[9px] text-slate-400 sm:text-[11px]">
                      {coverLetter.supportedFormats ||
                        "Supported formats: PDF, DOC, DOCX (Max size: 5MB)"}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                {stepBadge(additional.step ?? 4)}
                <h2 className="text-base font-bold text-[#0d152e] sm:text-lg lg:text-xl">
                  {additional.title || "Additional Information"}
                </h2>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />

              <div className="mt-5 space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {whyInterested.label ||
                      "Why are you interested in this role?"}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      maxLength={whyInterested.maxLength || 500}
                      value={whyText}
                      onChange={(e) => setWhyText(e.target.value)}
                      placeholder={whyInterested.placeholder}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#0d152e] outline-none transition-all placeholder:text-slate-400 focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:p-4 sm:text-sm"
                    />
                    <div className="mt-1 text-right text-[10px] text-slate-400 sm:text-sm">
                      {whyText.length}/{whyInterested.maxLength || 500}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#0d152e] sm:text-sm">
                    {hearAboutUs.label || "How did you hear about this job?"}
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-[#0d152e] outline-none transition-all focus:border-[#ff541b] focus:ring-1 focus:ring-[#ff541b] sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <option value="" disabled hidden>
                        {hearAboutUs.placeholder || "Select an option"}
                      </option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="website">Company Website</option>
                      <option value="referral">Friend / Referral</option>
                      <option value="other">Other</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center justify-between gap-3 pt-2 sm:flex-row sm:gap-4">
              {isModal ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-[#0d152e] transition-all hover:bg-slate-50 sm:w-auto sm:px-6 sm:py-3"
                >
                  <FiArrowLeft className="text-sm" />
                  <span>Close</span>
                </button>
              ) : (
                <Link
                  href={
                    (typeof backButton.href === "string" && backButton.href) ||
                    "#"
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-[#0d152e] transition-all hover:bg-slate-50 sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                >
                  <FiArrowLeft className="text-sm" />
                  <span>
                    {(typeof backButton.label === "string" &&
                      backButton.label) ||
                      "Back to Job Details"}
                  </span>
                </Link>
              )}

              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff541b] py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e0430e] sm:w-auto sm:px-8 sm:py-3 sm:text-sm"
              >
                <span>
                  {(typeof submitButton.label === "string" &&
                    submitButton.label) ||
                    "Submit Application"}
                </span>
                <FiArrowRight className="text-sm" />
              </button>
            </div>
          </div>

          {isModal ? null : (
          <div className="space-y-4 sm:space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-100 bg-[#fffdfc] p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-[#ff541b]">
                <FiBriefcase className="text-base sm:text-lg" />
                <h3 className="text-sm font-bold text-[#0d152e] sm:text-base">
                  {(typeof jobSummary.title === "string" &&
                    jobSummary.title) ||
                    "Job Summary"}
                </h3>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-[#ff541b]" />

              <div className="mt-4 space-y-3 divide-y divide-slate-100 text-sm sm:text-sm">
                {summaryDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pt-2.5 first:pt-0"
                  >
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiBriefcase className="text-[#ff541b]" />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-medium text-[#0d152e]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100/50 bg-[#fffbf5] p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-amber-600">
                <BsFillLightbulbFill className="text-base sm:text-lg" />
                <h3 className="text-sm font-bold text-[#0d152e] sm:text-base">
                  {(typeof tips.title === "string" && tips.title) ||
                    "Tips Before You Apply"}
                </h3>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-amber-500" />

              <ul className="mt-4 space-y-2.5">
                {tipItems.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600 sm:text-sm"
                  >
                    <FiCheck className="mt-0.5 shrink-0 text-amber-600" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-50 bg-[#f8fbff] p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <FiUsers className="text-base sm:text-lg" />
                <h3 className="text-sm font-bold text-[#0d152e] sm:text-base">
                  {(typeof equalOpp.title === "string" && equalOpp.title) ||
                    "Equal Opportunity Employer"}
                </h3>
              </div>
              <div className="mt-2 h-[2px] w-8 bg-blue-500" />
              {typeof equalOpp.description === "string" ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-sm">
                  {equalOpp.description}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#fafafa] p-4 text-center shadow-sm sm:p-6">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm sm:h-12 sm:w-12">
                <FiHeadphones className="text-lg sm:text-xl" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-[#0d152e] sm:text-base">
                {(typeof needHelp.title === "string" && needHelp.title) ||
                  "Need Help?"}
              </h4>
              {typeof needHelp.description === "string" ? (
                <p className="mt-1 text-sm text-slate-500 sm:text-sm">
                  {needHelp.description}
                </p>
              ) : null}
              <a
                href={
                  (typeof needHelpButton.href === "string" &&
                    needHelpButton.href) ||
                  "#"
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#ff541b] bg-white px-4 py-2 text-sm font-semibold text-[#ff541b] transition-all hover:bg-[#ff541b] hover:text-white sm:text-sm"
              >
                <span>
                  {(typeof needHelpButton.label === "string" &&
                    needHelpButton.label) ||
                    "Contact HR Team"}
                </span>
                <FiArrowRight className="text-sm" />
              </a>
            </div>
          </div>
          )}
        </form>
      </div>
    </section>
  );
}
