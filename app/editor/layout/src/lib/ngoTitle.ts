const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Normalize string or {line1,highlight,line2} / {part1,part2} titles for text nodes. */
export function toDisplayText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!isRecord(value)) return undefined;

  // Prefer explicit part1/part2 (Awards/Industry), else line1/highlight/line2
  const keyed =
    typeof value.part1 === "string" || typeof value.part2 === "string"
      ? [value.part1, value.part2]
      : [value.line1, value.highlight, value.line2];

  const parts = keyed
    .filter(
      (part): part is string =>
        typeof part === "string" && Boolean(part.trim()),
    )
    .map((part) => part.trim());

  return parts.length ? parts.join(" ") : undefined;
}

export function resolveTitle(
  value: unknown,
  fallback = "",
): string {
  return toDisplayText(value) || fallback;
}
