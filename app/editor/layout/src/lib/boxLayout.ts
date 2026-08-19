const toBoxesPerRow = (value: unknown) => {
  const count =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;

  return Number.isInteger(count) && count >= 1 && count <= 6
    ? count
    : undefined;
};

export const collectionBoxesPerRow = (
  data:
    | {
        boxesPerRow?: unknown;
        boxLayoutByField?: unknown;
      }
    | undefined,
  field: string,
) => {
  const map = data?.boxLayoutByField;
  const fromField =
    map && typeof map === "object" && !Array.isArray(map)
      ? (map as Record<string, unknown>)[field]
      : undefined;

  return toBoxesPerRow(fromField);
};

export const sectionWrapperBoxesPerRow = (
  data:
    | {
        boxesPerRow?: unknown;
        boxLayoutByField?: unknown;
      }
    | undefined,
  max?: number,
) => {
  const map = data?.boxLayoutByField;
  if (map && typeof map === "object" && !Array.isArray(map) && Object.keys(map).length) {
    return undefined;
  }

  const count = toBoxesPerRow(data?.boxesPerRow);
  if (!count) return undefined;
  return typeof max === "number" ? Math.min(max, count) : count;
};

