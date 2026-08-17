import type {
  Block,
  BlockSection,
  LayoutComponentProps,
} from "../components/sections/types/section";

export type {
  Block,
  BlockSection,
  SectionType,
  TextBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  SliderBlock,
  CarouselBlock,
  CardBlock,
  ListBlock,
  MenuBlock,
  LogoBlock,
} from "../components/sections/types/section";

type MenuItem = {
  label: string;
  href: string;
  children?: MenuItem[];
};

export type SocialLinkData = {
  label: "facebook" | "instagram" | "twitter" | "linkedin";
  href: string;
};

export type ButtonData = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type BannerSlideData = {
  image: string;
  video?: string;
  alt?: string;
  title: string;
  desc?: string;
  button?: ButtonData;

  pretitle?: string;

	subtitle?: string;
	backgroundImage?: string;
	breadcrumb?: BreadcrumbItem[];
	ctaLabel?: string;
	ctaHref?: string;
	hero?: {
		title?: string;
		subtitle?: string;
		backgroundImage?: string;
	};


};

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export type ProductImageData = {
  image: string;
  alt: string;
};

export type ProductFeatureData = {
  label: string;
  price: string;
};

export type ProductSlideData = {
  image: string;
  alt: string;
  link?: string;
  productTitle: string;
  productSubtitle: string;
  productInfoTitle: string;
  productInfoDesc: string;
  productFeatures: ProductFeatureData[];
  productTotalPrice: string;
  productShippingText: string;
  button?: ButtonData;
};

export type ProductCardData = {
  title: string;
  category: string;
  desc: string;
  image: string;
  price?: string;
  alt?: string;
  imageTitle?: string;
  link?: string;
};

export type StatItemData = {
  label: string;
  value: string;
  desc?: string;
};

export type LinkActionData = {
  label?: string;
  href?: string;
  icon?: string;
};

export type WhyChooseUsItemData = {
  title: string;
  desc: string;
  description?: string;
  icon?: string;
  stat?: string;
  image?: string;
};

export type PopularEventItemData = {
  id?: string;
  image?: string;
  seats?: string;
  date?: string;
  location?: string;
  title?: string;
  description?: string;
  desc?: string;
  link?: string;
  category?: string;
  longDescription?: string;
  time?: string;
  price?: string;
  organizer?: string;
  highlights?: string[];
};

export type GalleryItemData = {
  image: string;
  alt?: string;
  title?: string;
  desc?: string;
  description?: string;
};

export type GalleryCardData = {
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
};

export type GalleryImageData = {
  src?: string;
  image?: string;
  alt?: string;
  label?: string;
  title?: string;
  description?: string;
  desc?: string;
  icon?: string;
};

export type CtaData = LinkActionData & {
  pretitle?: string;
  title?: string;
  description?: string;
  button?: LinkActionData;
};

export type GalleryCtaData = CtaData;

export type AwardStatItemData = {
  icon?: string;
  value?: string;
  title?: string;
  description?: string;
  desc?: string;
};

export type EventsFeaturedAwardData = {
  year?: string;
  title?: string;
  body?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export type EventsAwardItemData = {
  year?: string;
  title?: string;
  body?: string;
  category?: string;
  icon?: string;
  description?: string;
};

export type EventsEventCategoryItemData = {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  introDescription?: string;
  image?: string;
  imageAlt?: string;
  heroImage?: string;
  href?: string;
  slug?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  textColor?: string;
  backgroundColor?: string;
  features?: EventsFeatureItemData[];
  detailCtaTitle?: string;
  detailCtaDescription?: string;
  detailCtaButton?: LinkActionData;
};

export type TeamMemberSocialData = {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
};

export type TeamSkillData = {
  title?: string;
  description?: string;
};

export type TeamMemberData = {
  id?: string;
  image?: string;
  name?: string;
  role?: string;
  department?: string;
  bio?: string;
  title?: string;
  desc?: string;
  href?: string;
  email?: string;
  phone?: string;
  longBio?: string;
  skills?: TeamSkillData[];
  backgroundImage?: string;
  textColor?: string;
  backgroundColor?: string;
  social?: TeamMemberSocialData;
};

export type TeamDepartmentData = {
  label?: string;
  value?: string;
};

export type JoinButtonData = LinkActionData;

export type FormFieldData = {
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
};

export type FaqItemData = {
  question: string;
  answer: string;
};

export type TestimonialItemData = {
  name: string;
  role: string;
  quote: string;
  image?: string;
  rating?: string;
  initials?: string;
  address?: string;
};

export type EventsBlogContentBlockData = {
  type?: "paragraph" | "heading" | "quote" | "list";
  text?: string;
  items?: string[];
};

export type EventsBlogPostData = {
  image?: string;
  alt?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  desc?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  author?: string;
  category?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  textColor?: string;
  backgroundColor?: string;
  content?: EventsBlogContentBlockData[];
  relatedTitle?: string;
  relatedPosts?: EventsBlogPostData[];
  link?: string;
  href?: string;
  slug?: string;
};

export type EventsCareersStatData = {
  value?: string;
  label?: string;
};

export type EventsCareersRoleData = {
  id?: string;
  title?: string;
  location?: string;
  type?: string;
  department?: string;
  experience?: string;
  postedOn?: string;
  description?: string;
  applyHref?: string;
  slug?: string;
};

export type EventsCareersApplyFormData = {
  title?: string;
  subtitle?: string;
  locations?: string[];
  noticePeriods?: string[];
  submitLabel?: string;
  successTitle?: string;
  successDescription?: string;
  backToCareersLabel?: string;
  homeLabel?: string;
  jobDetailsTitle?: string;
  whyJoinUsTitle?: string;
};

export type EventsWhyJoinUsItemData = {
  icon?: string;
  title?: string;
  description?: string;
};

export type EventsCareersBenefitData = {
  title?: string;
  description?: string;
};

export type EventsCareersCultureItemData = {
  title?: string;
  description?: string;
};

export type EventsMilestoneData = {
  year?: string;
  title?: string;
  description?: string;
  desc?: string;
};

export type EventsVisionPointData = {
  icon?: string;
  text?: string;
};

export type EventsVisionBlockData = {
  pretitle?: string;
  title?: string;
  description?: string;
  detail?: string;
  image?: string;
  imageAlt?: string;
  points?: EventsVisionPointData[];
};

export type EventsFeatureItemData = {
  icon?: string;
  title?: string;
  description?: string;
  desc?: string;
};

export type EventsContactLeftContentData = {
  badge?: string;
  title?: string;
  description?: string;
  features?: EventsFeatureItemData[];
  cta?: LinkActionData;
};

export type EventsContactFormData = {
  namePlaceholder?: string;
  emailPlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  buttonLabel?: string;
  buttonIcon?: string;
};

export type EventsContactItemData = {
  icon?: string;
  label?: string;
  value?: string;
};

export type EventsCaseStudyHighlightData = {
  title?: string;
  description?: string;
};

export type EventsCaseStudyProjectPointData = {
  title?: string;
  description?: string;
};

export type EventsLegalSectionData = {
  title?: string;
  content?: string[] | string;
  desc?: string;
};

export type FooterSocialData = {
  label: "facebook" | "instagram" | "twitter" | "linkedin";
  href: string;
};

export type FooterLinkData = {
  label: string;
  href: string;
};

export type FooterColumnData = {
  title: string;
  links: FooterLinkData[];
};

export type FooterContactData = {
  location: string;
  email: string;
  phone: string;
};

export type CollectionItemData = {
  brand: string;
  title: string;
  desc?: string;
  image: string;
  price?: string;
};

export type ContactInfoData = {
  address: string;
  phone: string;
  email: string;
};

export type SectionData = {
  [field: string]: unknown;

  hiddenContentFields?: string[];
  hiddenSubsections?: number[];
  subsectionOrder?: number[];
  boxesPerRow?: 1 | 2 | 3 | 4 | 5 | 6;
  topbarType?: "scroll" | "sticky";
  topbarBackgroundType?: "solid" | "gradient";
  topbarBackgroundColor?: string;
  topbarGradientColor?: string;
  topbarTextColor?: string;
  text?: string[];
  phone?: string;
  email?: string;
  location?: string;
  socialLinks?: SocialLinkData[];

  logo?: string;
  logoImage?: string;
  logoImageTitle?: string;
  menu?: MenuItem[];
  buttons?: ButtonData[];

  headerBackgroundType?: "solid" | "gradient";
  headerType?: "scroll" | "sticky";
  headerBackgroundColor?: string;
  headerGradientColor?: string;
  headerTextColor?: string;

  pretitle?: string;
  title?: string;
  subtitle?: string;

  backgroundImage?: string;
  backgroundImageTitle?: string;
  backgroundVideo?: string;
  bannerBackgroundMode?: "image" | "video" | "solid" | "gradient";
  bannerBackgroundColor?: string;
  bannerGradientColor?: string;
  bannerHeight?: number;
  bannerSlides?: BannerSlideData[];

  eyebrowColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  textColor?: string;
  backgroundColor?: string;
  overlayColor?: string;
  collectionItems?: CollectionItemData[];
  contactInfo?: ContactInfoData;
   mapUrl?: string;

  desc?: string;
  desc2?: string;

  buttonBackground?: string;
  buttonColor?: string;

  highlightedText?: string;

  length?: number;
  sideImage?: string;
  sideImageTitle?: string;
  philosophyTitle?: string;
  philosophyDesc?: string;

  productImages?: ProductImageData[];
  productTitle?: string;
  productSubtitle?: string;
  productInfoTitle?: string;
  productInfoDesc?: string;
  productFeatures?: ProductFeatureData[];
  productTotalPrice?: string;
  productShippingText?: string;
  productSlides?: ProductSlideData[];
  productSectionTitle?: string;
  productItems?: ProductCardData[];
  stats?: StatItemData[];

  whyChooseUsItems?: WhyChooseUsItemData[];
  galleryItems?: GalleryItemData[];
  images?: GalleryImageData[];
  cards?: GalleryCardData[];
  noImagesLabel?: string;
  cta?: GalleryCtaData;
  items?: AwardStatItemData[] | EventsEventCategoryItemData[];
  featuredAward?: EventsFeaturedAwardData;
  awards?: EventsAwardItemData[];
  awardsPretitle?: string;
  awardsTitle?: string;
  ctaPretitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButton?: LinkActionData;
  ctaItems?: StatItemData[];
  members?: TeamMemberData[];
  teamItems?: TeamMemberData[];
  departments?: TeamDepartmentData[];
  joinButton?: JoinButtonData;
  joinButton1?: JoinButtonData;
  joinTitle?: string;
  joinDescription?: string;
  categories?: string[] | Record<string, unknown>[];
  tabs?: string[];
  events?: PopularEventItemData[];
  buttonLabel?: string;
  buttonIcon?: string;
  formFields?: FormFieldData[];
  formSubmitLabel?: string;
  successMessage?: string;
  faqItems?: FaqItemData[];
  testimonialItems?: TestimonialItemData[];
  blogItems?: EventsBlogPostData[];
  leftContent?: EventsContactLeftContentData;
  contactItems?: EventsContactItemData[];
  form?: EventsContactFormData;
  mapEmbedUrl?: string;
  contactPretitle?: string;
  contactTitle?: string;
  contactDescription?: string;
  faqPretitle?: string;
  faqTitle?: string;
  heroSubtitle?: string;

  description?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  image?: string;
  imageAlt?: string;
  image2?: string;
  image2Alt?: string;
  worldImage?: string;
  worldImageAlt?: string;
  heroImage?: string;
  heroImageAlt?: string;
  rolesPretitle?: string;
  rolesTitle?: string;
  rolesApplyLabel?: string;
  roles?: EventsCareersRoleData[];
  applyForm?: EventsCareersApplyFormData;
  whyJoinUs?: EventsWhyJoinUsItemData[];
  benefits?: EventsCareersBenefitData[];
  culture?: EventsCareersCultureItemData[];
  ctaLabel?: string;
  ctaHref?: string;
  highlightsTitle?: string;
  highlights?: EventsCaseStudyHighlightData[] | string[];
  projectTitle?: string;
  projectDescription?: string;
  projectPoints?: EventsCaseStudyProjectPointData[];
  introDescription?: string;
  detailCtaTitle?: string;
  detailCtaDescription?: string;
  detailCtaButton?: LinkActionData;
  features?: EventsFeatureItemData[];
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  author?: string;
  readTime?: string;
  content?: EventsBlogContentBlockData[];
  relatedTitle?: string;
  relatedPosts?: EventsBlogPostData[];
  quote?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  breadcrumb?: BreadcrumbItem[];
  values?: WhyChooseUsItemData[];
  milestones?: EventsMilestoneData[];
  milestonesPretitle?: string;
  milestonesTitle?: string;
  milestonesDesc?: string;
  button?: LinkActionData;
  vision?: EventsVisionBlockData;
  mission?: EventsVisionBlockData;
  coreBeliefs?: WhyChooseUsItemData[];
  coreBeliefsPretitle?: string;
  coreBeliefsTitle?: string;

  footerBackgroundType?: "solid" | "gradient";
  footerBackgroundColor?: string;
  footerGradientColor?: string;
  footerTextColor?: string;
  footerMutedTextColor?: string;
  footerSocialLinks?: FooterSocialData[];
  footerColumns?: FooterColumnData[];
  footerContact?: FooterContactData;
  footerLegalLinks?: FooterLinkData[];
  whatsappLink?: string;
  callLink?: string;
  copyrightText?: string;
  officeLabel?: string;
  contactLabel?: string;
  legalTitle?: string;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonLabel?: string;
  disclaimerTitle?: string;
  disclaimerText?: string;
  sections?: EventsLegalSectionData[];
};

export type SectionProps = {
  data?: SectionData;
} & Partial<LayoutComponentProps> & {
    blocks?: Block[];
    section?: BlockSection;
  };

export type SectionItem = {
  id?: string;
  page?: string;
  type: string;
  variant: string;
  data: Record<string, SectionData>;
};

export type SelectedConfig = {
  templateId: string;
  sections: SectionItem[];
};
