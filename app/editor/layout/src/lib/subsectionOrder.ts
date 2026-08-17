export const toSubsectionOrder = (value: unknown): number[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const order = value.filter((item): item is number => typeof item === "number");

  return order.length ? order : undefined;
};

export const buildSubsectionScopeId = (value: string) =>
  `subsection-scope-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

/**
 * Subsections keep their DOM order so editor indexes stay stable; only the
 * visual order changes through flex `order`.
 */
export const buildSubsectionOrderCss = (
  scopeId: string,
  value: unknown,
): string | null => {
  const order = toSubsectionOrder(value);

  if (!order || order.every((originalIndex, position) => originalIndex === position)) {
    return null;
  }

  const rules = order
    .map(
      (originalIndex, position) =>
        `#${scopeId} main > :nth-child(${originalIndex + 1}){order:${position};}`,
    )
    .join("");

  // Keep full-width blocks (e.g. max-w-7xl + mx-auto) from collapsing to
  // content width when main switches to a flex column for visual reorder.
  return `#${scopeId} main{display:flex;flex-direction:column;align-items:stretch;}#${scopeId} main>*{width:100%;box-sizing:border-box;}${rules}`;
};
