import type {
  EventsCareersApplyFormData,
  EventsCareersApplyFormFieldData,
} from "../types/section";

export const MAX_EVENTS_CAREERS_FORM_FIELDS = 12;

export const defaultEventsCareersApplyLocations = [
  "Delhi",
  "Karnataka",
  "Mumbai",
  "Dubai",
  "Remote",
  "Other",
];

export const defaultEventsCareersApplyNoticePeriods = [
  "Immediate joiner",
  "15 Days",
  "30 Days",
  "60 Days",
  "90 Days",
];

export const defaultEventsCareersApplyFormFields: EventsCareersApplyFormFieldData[] =
  [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      required: true,
      width: "half",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      type: "email",
      required: true,
      width: "half",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      type: "tel",
      required: true,
      width: "half",
    },
    {
      name: "alternatePhone",
      label: "Alternate Number",
      placeholder: "Enter alternate number",
      type: "tel",
      required: false,
      width: "half",
    },
    {
      name: "currentLocation",
      label: "Current Location",
      placeholder: "Select your location",
      type: "select",
      required: true,
      width: "half",
      optionsSource: "locations",
    },
    {
      name: "noticePeriod",
      label: "Notice Period",
      placeholder: "Select notice period",
      type: "select",
      required: true,
      width: "half",
      optionsSource: "noticePeriods",
    },
    {
      name: "linkedin",
      label: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/yourprofile",
      type: "url",
      required: false,
      width: "half",
    },
    {
      name: "portfolio",
      label: "Portfolio / Website (if any)",
      placeholder: "https://yourwebsite.com",
      type: "url",
      required: false,
      width: "half",
    },
    {
      name: "resume",
      label: "Current Resume",
      placeholder: "Upload resume",
      type: "file",
      required: true,
      width: "full",
    },
  ];

export function resolveEventsCareersApplyForm(
  applyForm: EventsCareersApplyFormData | undefined,
) {
  const config = applyForm ?? {};

  return {
    title: config.title ?? "Personal Information",
    subtitle: config.subtitle ?? "Please provide your personal details.",
    submitLabel: config.submitLabel ?? "Apply Here",
    successTitle: config.successTitle ?? "Application Submitted!",
    successDescription:
      config.successDescription ??
      "Thank you for applying for {roleTitle}. Our recruiting team will review your profile and get in touch with you shortly.",
    backToCareersLabel: config.backToCareersLabel ?? "Back to Careers",
    homeLabel: config.homeLabel ?? "Go to Homepage",
    locations:
      config.locations?.length && config.locations.length > 0
        ? config.locations
        : defaultEventsCareersApplyLocations,
    noticePeriods:
      config.noticePeriods?.length && config.noticePeriods.length > 0
        ? config.noticePeriods
        : defaultEventsCareersApplyNoticePeriods,
    fields:
      Array.isArray(config.fields) && config.fields.length > 0
        ? config.fields
        : defaultEventsCareersApplyFormFields,
  };
}

export function getEventsCareersFieldOptions(
  field: EventsCareersApplyFormFieldData,
  formConfig: ReturnType<typeof resolveEventsCareersApplyForm>,
) {
  if (field.optionsSource === "noticePeriods") {
    return formConfig.noticePeriods;
  }

  if (field.optionsSource === "locations") {
    return formConfig.locations;
  }

  return field.options ?? [];
}
