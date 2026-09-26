"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import type { EventsCareersRoleData, SectionData } from "../../../types/section";
import EventsCareersApplyForm1 from "./EventsCareersApplyForm1";

type EventsCareersApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: EventsCareersRoleData | null;
  pageData: SectionData;
};

export default function EventsCareersApplyModal1({
  isOpen,
  onClose,
  role,
  pageData,
}: EventsCareersApplyModalProps) {
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

  if (!isOpen || !role || typeof document === "undefined") {
    return null;
  }

  const formData = {
    ...pageData,
    ...role,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="careers-apply-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="relative my-8 w-full max-w-3xl rounded-[2rem] border border-[#f4d4e1] bg-white shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close apply form"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#f4d4e1] bg-white text-slate-500 transition hover:bg-[#fff5f8] hover:text-[#d61b58]"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="border-b border-[#f4d4e1] px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]">
            Apply Now
          </p>
          <h2
            id="careers-apply-modal-title"
            className="mt-2 pr-10 text-2xl font-extrabold text-slate-900 sm:text-3xl"
          >
            {role.title ?? "Open Role"}
          </h2>
          {(role.location || role.type) && (
            <p className="mt-2 text-sm text-slate-500">
              {[role.location, role.type].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-2 py-2 sm:px-4">
          <EventsCareersApplyForm1
            key={role.id ?? role.title ?? "apply-form"}
            data={formData}
            variant="modal"
            onClose={onClose}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
