"use client";

import { useState, type ChangeEvent } from "react";
import { Briefcase, Check, ImagePlus, User, Users } from "lucide-react";
import Image from "next/image";

type Category = "clients" | "myself" | "company";

type BusinessInfo = {
  audience: "" | Category;
  name: string;
  description: string;
  websiteRelated:
  | ""
  | "service-provider"
  | "products"
  | "blog"
  | "ngo"
  | "campaign-page";
  pageType: "" | "multi-page" | "single-page";
  email: string;
  mobile: string;
  address: string;
  includeDetails: boolean;
  hasLogo: "" | "yes" | "no";
  logoName: string;
};

type CategoryStepProps = {
  value: BusinessInfo;
  showErrors: boolean;
  onChange: (value: BusinessInfo) => void;
};

export const MIN_DESCRIPTION_LENGTH = 10;

const categories = [
  {
    id: "clients",
    title: "Clients",
    subtitle: "Agency",
    icon: Users,
    labels: {
      name: "Website Name",
      desc: "Description",
      namePlaceholder: "Enter client name",
      descPlaceholder: "Tell us about agency...",
    },
    image: "/onboarding-clients.png",
  },
  {
    id: "myself",
    title: "Myself",
    subtitle: "Individual",
    icon: User,
    labels: {
      name: "Website Name",
      desc: "Description",
      namePlaceholder: "Enter your website name",
      descPlaceholder: "Tell us about your brand...",
    },
    image: "/onboarding-myself.png",
  },
  {
    id: "company",
    title: "My Company",
    subtitle: "Business",
    icon: Briefcase,
    labels: {
      name: "Business Name",
      desc: "Business Description",
      namePlaceholder: "Enter your business name",
      descPlaceholder: "Tell us what your business does...",
    },
    image: "/onboarding-company.png",
  },
] as const;

const defaultLabels = {
  name: "Name",
  desc: "Description",
  namePlaceholder: "Enter name",
  descPlaceholder: "Tell us about your project...",
};

const websiteOptions = [
  { value: "service-provider", label: "Service Provider" },
  { value: "products", label: "Products" },
  { value: "blog", label: "Blog" },
  { value: "ngo", label: "NGO" },
  { value: "campaign-page", label: "Campaign Page" },
] as const;

const pageOptions = [
  { value: "multi-page", label: "Multi-page Site" },
  { value: "single-page", label: "Single-page Site" },
] as const;

export default function CategoryStep({
  value,
  showErrors,
  onChange,
}: CategoryStepProps) {
  const [selected, setSelected] = useState<"" | Category>(value.audience);
  const [logoPreview, setLogoPreview] = useState("");

  const active = categories.find((item) => item.id === selected);
  const labels = active?.labels ?? defaultLabels;
  const hasAudienceError = showErrors && !value.audience;
  const hasNameError = showErrors && !value.name.trim();
  const descriptionLength = value.description.trim().length;
  const hasDescriptionError =
    showErrors && descriptionLength < MIN_DESCRIPTION_LENGTH;
  const hasWebsiteError = showErrors && !value.websiteRelated;
  const hasPageTypeError = showErrors && !value.pageType;
  const hasEmailError =
    showErrors && value.includeDetails && !value.email.trim();
  const hasMobileError =
    showErrors && value.includeDetails && !value.mobile.trim();
  const hasAddressError =
    showErrors && value.includeDetails && !value.address.trim();
  const hasLogoError = showErrors && !value.hasLogo;
  const hasLogoUploadError =
    showErrors && value.hasLogo === "yes" && !value.logoName;

  const updateBusinessInfo = (nextValue: Partial<BusinessInfo>) => {
    onChange({ ...value, ...nextValue });
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateBusinessInfo({ logoName: file.name });
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative mx-auto max-h-[calc(100dvh-156px)] w-full origin-center overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(23,38,76,.08)]">
      <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-8 2xl:px-9">
        <div>
          <div className="flex shrink-0 justify-center items-center gap-3 border-slate-200 pb-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-[-.035em] text-[#08132f] sm:text-2xl">
                {"Let's"} start with your business
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                This helps us create a website that fits your needs.
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 2xl:gap-3">
              {categories.map((item) => {
                const Icon = item.icon;
                const isActive = selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelected(item.id);
                      updateBusinessInfo({ audience: item.id });
                    }}
                    className={`group relative flex min-h-[70px] md:min-h-[82px] items-center justify-start gap-3 overflow-hidden rounded-lg border px-3 pr-14 text-left transition-all duration-500 ease-out active:scale-[.985] sm:px-4 sm:pr-[74px] 2xl:min-h-[90px] 2xl:px-5 2xl:pr-24 ${isActive
                      ? "border-[#315ff4] bg-blue-50/40 text-[#10182d] shadow-[0_8px_24px_rgba(49,95,244,.1)] ring-1 ring-[#315ff4]"
                      : hasAudienceError
                        ? "border-blue-400 bg-white text-[#08132f]"
                        : "border-slate-200 bg-white text-[#08132f] hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
                  >
                    <span
                      className={`hidden md:grid size-8 shrink-0 place-items-center rounded-lg transition-all duration-500 2xl:size-11 ${isActive ? "bg-white text-[#315ff4] shadow-sm" : "bg-slate-50 text-slate-500"}`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm font-medium sm:text-[12px] 2xl:text-[18px]">
                        {item.title}
                      </strong>
                      <small className="text-[12px] text-slate-400 sm:block 2xl:text-xs">
                        {item.subtitle}
                      </small>
                    </span>
                    <span
                      className={`hidden md:block pointer-events-none absolute -bottom-1 right-1 h-[54px] w-[72px] transition-all duration-500 ease-out sm:right-2 2xl:h-[68px] 2xl:w-[90px] ${isActive
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-1 scale-90 opacity-55 grayscale-[25%]"
                        }`}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="scale-150 object-contain"
                      />
                    </span>
                    {isActive && (
                      <span className="absolute right-2 top-2 z-10 grid size-4 place-items-center rounded-full bg-[#315ff4] text-white transition-all duration-300">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {hasAudienceError && (
              <ErrorLine message="Please choose who this website is for." />
            )}

            <form
              className="mt-5 grid items-start gap-y-5 2xl:mt-10 2xl:gap-y-10"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid min-w-0 grid-cols-1 content-start gap-3 sm:grid-cols-2">
                <FieldLabel
                  label={labels.name}
                  error={hasNameError ? "This field is required." : undefined}
                >
                  <input
                    value={value.name}
                    onChange={(event) =>
                      updateBusinessInfo({ name: event.target.value })
                    }
                    type="text"
                    placeholder={labels.namePlaceholder}
                    className={fieldClass(hasNameError)}
                  />
                </FieldLabel>

                <FieldLabel
                  label={labels.desc}
                  error={
                    hasDescriptionError
                      ? `Please enter at least ${MIN_DESCRIPTION_LENGTH} characters (${MIN_DESCRIPTION_LENGTH - descriptionLength} more needed).`
                      : undefined
                  }
                >
                  <div className="relative">
                    <textarea
                      value={value.description}
                      onChange={(event) =>
                        updateBusinessInfo({
                          description: event.target.value,
                        })
                      }
                      minLength={MIN_DESCRIPTION_LENGTH}
                      maxLength={300}
                      placeholder={labels.descPlaceholder}
                      className={`${fieldClass(hasDescriptionError)} resize-none py-2.5 pr-32`}
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-400">
                      {value.description.length}/300 · Min {MIN_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                </FieldLabel>
              </div>

              <div className="grid min-w-0 grid-cols-1 content-start items-start gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,.8fr)_minmax(0,.72fr)] 2xl:gap-y-6">
                <div className="order-1 col-span-1 md:col-span-2 xl:col-span-1">
                  <RadioGroup
                    legend="What is your website related to?"
                    name="website-related"
                    value={value.websiteRelated}
                    options={websiteOptions}
                    hasError={hasWebsiteError}
                    onChange={(websiteRelated) =>
                      updateBusinessInfo({ websiteRelated })
                    }
                  />
                </div>
                <div className="order-2 grid content-start gap-2">
                  <RadioGroup
                    legend="What kind of site do you need?"
                    name="page-type"
                    value={value.pageType}
                    options={pageOptions}
                    hasError={hasPageTypeError}
                    onChange={(pageType) => updateBusinessInfo({ pageType })}
                  />
                </div>

                {value.includeDetails && (
                  <div className="order-5 relative col-span-1 mt-3.5 grid animate-onboarding-swap gap-2 pt-1 sm:col-span-2 xl:col-span-3 xl:grid-cols-[1fr_1fr_1.2fr]">
                    <button
                      type="button"
                      aria-label="Close additional details"
                      title="Close additional details"
                      onClick={() =>
                        updateBusinessInfo({ includeDetails: false })
                      }
                      className="absolute right-0 top-0 z-10 grid size-6 place-items-center rounded-full bg-[#315ff4] text-base font-medium leading-none text-white shadow-[0_6px_16px_rgba(49,95,244,.3)] transition-all duration-200 hover:rotate-90 hover:bg-[#244bd5]"
                    >
                      ×
                    </button>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:contents">
                      <FieldLabel
                        label="Email ID"
                        compact
                        error={hasEmailError ? "Email is required." : undefined}
                      >
                        <input
                          type="email"
                          value={value.email}
                          onChange={(event) =>
                            updateBusinessInfo({ email: event.target.value })
                          }
                          placeholder="you@example.com"
                          className={fieldClass(hasEmailError, true)}
                        />
                      </FieldLabel>
                      <FieldLabel
                        label="Mobile number"
                        compact
                        error={
                          hasMobileError
                            ? "Mobile number is required."
                            : undefined
                        }
                      >
                        <input
                          type="tel"
                          value={value.mobile}
                          onChange={(event) =>
                            updateBusinessInfo({ mobile: event.target.value })
                          }
                          placeholder="Your number"
                          className={fieldClass(hasMobileError, true)}
                        />
                      </FieldLabel>
                    </div>
                    <FieldLabel
                      label="Business address"
                      compact
                      error={
                        hasAddressError ? "Address is required." : undefined
                      }
                    >
                      <input
                        type="text"
                        value={value.address}
                        onChange={(event) =>
                          updateBusinessInfo({ address: event.target.value })
                        }
                        placeholder="Street, city, country"
                        className={fieldClass(hasAddressError, true)}
                      />
                    </FieldLabel>
                  </div>
                )}

                <div className="order-3 col-span-1 grid min-w-0 content-start gap-2 xl:col-start-3 xl:row-start-1">
                  <RadioGroup
                    legend="Do you already have a logo?"
                    name="has-logo"
                    value={value.hasLogo}
                    options={[
                      { value: "yes", label: "Yes, I do" },
                      { value: "no", label: "Not yet" },
                    ]}
                    hasError={hasLogoError}
                    onChange={(hasLogo) => updateBusinessInfo({ hasLogo })}
                  />

                  {value.hasLogo === "yes" && (
                    <div className="animate-onboarding-swap">
                      <LogoUpload
                        fileName={value.logoName}
                        preview={logoPreview}
                        hasError={hasLogoUploadError}
                        onChange={handleLogoChange}
                      />
                    </div>
                  )}
                </div>

                {!value.includeDetails && (
                  <button
                    type="button"
                    onClick={() => updateBusinessInfo({ includeDetails: true })}
                    className="order-4 col-span-1 inline-flex h-8 w-fit items-center gap-2 justify-self-start rounded-md px-1 text-[13px] font-medium text-[#315ff4] transition hover:text-blue-800 md:col-span-2 xl:col-span-3 2xl:text-[15px]"
                  >
                    <span className="text-md leading-none">+</span>
                    Add more details
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
const fieldClass = (hasError: boolean, compact = false) =>
  `${compact ? "h-10 2xl:h-11" : "h-11 2xl:h-14"} min-w-0 w-full rounded-lg border bg-white px-3 text-[14px] leading-5 text-[#08132f] outline-none transition placeholder:text-[13px] placeholder:text-slate-400 focus:border-[#315ff4] focus:ring-3 focus:ring-blue-100/70 2xl:px-4 2xl:text-base 2xl:placeholder:text-[15px] ${hasError ? "border-red-400" : "border-slate-200"}`;

function FieldLabel({
  label,
  children,
  compact = false,
  error,
}: {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
  error?: string;
}) {
  return (
    <label
      className={`grid min-w-0 content-start ${compact ? "gap-1.5" : "gap-2"} text-[15px] font-medium text-[#08132f] 2xl:text-[17px]`}
    >
      <span className="block leading-normal">{label}</span>
      <div className="min-w-0">{children}</div>
      {error && <ErrorLine message={error} />}
    </label>
  );
}

function LogoUpload({
  fileName,
  preview,
  hasError,
  onChange,
}: {
  fileName: string;
  preview: string;
  hasError: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-lg border bg-white p-2 text-[#08132f] transition-all duration-300 ease-out hover:border-blue-300 focus-within:border-[#315ff4] focus-within:ring-2 focus-within:ring-blue-100 ${hasError ? "border-red-400" : "border-slate-200"
        }`}
    >
      <div className="flex items-center gap-2">
        {preview ? (
          <div
            className="size-9 shrink-0 rounded-lg border border-blue-100 bg-white bg-contain bg-center bg-no-repeat shadow-sm max-[500px]:hidden"
            style={{ backgroundImage: `url(${preview})` }}
            role="img"
            aria-label="Uploaded logo preview"
          />
        ) : (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#315ff4] max-[500px]:hidden">
            <ImagePlus size={16} />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <strong className="block truncate text-[13px] text-[#08132f]">
            {fileName || "Upload your logo"}
          </strong>
          <p className="mt-0.5 text-[11px] text-slate-400 max-[500px]:hidden">
            PNG, JPG, WebP or SVG
          </p>
        </div>
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onChange}
        className="sr-only"
      />
      {hasError && <ErrorLine message="Please choose your logo image." />}
    </label>
  );
}

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  hasError,
  onChange,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: readonly { value: T; label: string }[];
  hasError: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[15px] font-medium text-[#08132f] 2xl:mb-3 2xl:text-[17px]">
        {legend}
      </legend>
      <div className="flex min-w-0 flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-[13px] font-medium transition active:scale-[.97] 2xl:px-4 2xl:py-2.5 2xl:text-[15px] ${isSelected
                ? "border-[#315ff4] bg-blue-50 text-[#315ff4]"
                : hasError
                  ? "border-red-400 bg-white text-slate-700"
                  : "border-blue-100 bg-white text-slate-700 shadow-sm hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
                }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {hasError && <ErrorLine message="Please select an option." />}
    </fieldset>
  );
}

function ErrorLine({ message }: { message: string }) {
  return (
    <span
      role="alert"
      className="mt-1 flex items-center gap-1.5 text-[11px] font-medium leading-none text-red-500 animate-onboarding-swap"
    >
      <span className="h-px w-3 shrink-0 bg-red-500" aria-hidden="true" />
      {message}
    </span>
  );
}
