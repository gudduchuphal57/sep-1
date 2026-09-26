"use client";

import { Plus, Minus } from "lucide-react";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOContactMap2({ data = {} }: SectionProps) {
  const map = isRecord(data.map) ? data.map : undefined;
  const embedUrl =
    (typeof data.mapEmbedUrl === "string" && data.mapEmbedUrl) ||
    (typeof map?.embedUrl === "string" && map.embedUrl) ||
    "";

  if (!embedUrl) return null;

  return (
    <section
      data-editor-section-label="Map"
      data-editor-fields="mapEmbedUrl"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
    >
      <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm sm:h-[480px] lg:h-[520px]">
        {/* Google Map iFrame */}
        <iframe
          title="Office Location Map"
          src={embedUrl}
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Bottom-Right Zoom Controls (Visual Component) */}
        <div className="absolute bottom-6 right-4 z-10 flex flex-col overflow-hidden rounded border border-gray-300 bg-white shadow-md">
          <button
            type="button"
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
