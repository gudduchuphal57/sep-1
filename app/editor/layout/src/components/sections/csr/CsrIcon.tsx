"use client";

import { renderNgoIcon } from "../../../lib/ngoIcons";

export function CsrIcon({ name }: { name?: string }) {
  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-100 bg-red-50 text-orange-500 shadow-sm">
      {renderNgoIcon(name || "heart", "h-7 w-7")}
    </div>
  );
}
