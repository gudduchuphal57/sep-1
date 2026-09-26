"use client";

import type { SectionProps } from "../../../types/section";
import NGOLegalContent2 from "../privacy-policy/NGOLegalContent2";

export default function NGOTermsContent2({ data = {} }: SectionProps) {
  return <NGOLegalContent2 data={data} editorLabel="Terms Content" />;
}
