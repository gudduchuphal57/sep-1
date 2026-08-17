export const isUnoptimizedImageSrc = (src?: string) =>
  Boolean(
    src &&
      (src.startsWith("data:") ||
        src.startsWith("http://") ||
        src.startsWith("https://")),
  );
