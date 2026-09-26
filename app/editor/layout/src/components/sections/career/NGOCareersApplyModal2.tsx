"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { SectionData } from "../../../types/section";
import EventsCareersApplyForm1 from "./EventsCareersApplyForm1";

export type NGOCareerJob = {
  id?: string | number;
  title?: string;
  description?: string;
  employmentType?: string;
  location?: string;
  department?: string;
  experience?: string;
  image?: string;
};

type NGOCareersApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: NGOCareerJob | null;
  pageData: SectionData;
};

export default function NGOCareersApplyModal2({
  isOpen,
  onClose,
  job,
  pageData,
}: NGOCareersApplyModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job || typeof document === "undefined") {
    return null;
  }

  const formData = {
    ...pageData,
    ...job,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ngo-careers-apply-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="relative my-8 w-full max-w-4xl rounded-[1.75rem] border border-orange-100 bg-white shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close apply form"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-500 transition hover:bg-[#fff0eb] hover:text-[#ff541b]"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="border-b border-orange-100 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff541b]">
            Apply Now
          </p>
          <h2
            id="ngo-careers-apply-modal-title"
            className="mt-2 pr-10 font-serif text-2xl font-extrabold text-[#0d152e] sm:text-3xl"
          >
            {job.title ?? "Open Role"}
          </h2>
          {(job.location || job.employmentType) && (
            <p className="mt-2 text-sm text-slate-500">
              {[job.location, job.employmentType].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-2 py-2 sm:px-4">
          <EventsCareersApplyForm1
            key={String(job.id ?? job.title ?? "apply-form")}
            data={formData}
            variant="modal"
            accent="ngo"
            onClose={onClose}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
