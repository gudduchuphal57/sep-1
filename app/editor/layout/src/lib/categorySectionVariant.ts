const categoryComponentPrefixes: Record<string, string> = {
  Realestate: "RealEstate",
};

export const getCategoryComponentPrefix = (category: string) =>
  categoryComponentPrefixes[category] ?? category;

const getLayoutIndex = (variant: string) => {
  const match = variant.match(/(\d+)$/);

  return match ? Number(match[1]) : 1;
};

export const getCategorySectionVariant = (
  category: string,
  sectionType: string,
  templateVariant: string,
) => {
  const prefix = getCategoryComponentPrefix(category);
  const componentSectionType =
    sectionType === "MarqueeSlide" ? "Marquee" : sectionType;
  const layoutIndex = getLayoutIndex(templateVariant);

  return `${prefix}${componentSectionType}${layoutIndex}`;
};
