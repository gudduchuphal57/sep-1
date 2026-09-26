"use client";

import type { SectionProps } from "../../../types/section";
import NGOLegalContent2 from "./NGOLegalContent2";

export default function NGOPrivacyContent2({ data = {} }: SectionProps) {
  return <NGOLegalContent2 data={data} editorLabel="Privacy Content" />;
}
