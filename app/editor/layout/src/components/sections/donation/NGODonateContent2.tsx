"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import {
  FiLock,
  FiFileText,
  FiAward,
  FiHeart,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCreditCard,
} from "react-icons/fi";
import {
  FaHandHoldingHeart,
  FaUniversity,
  FaWallet,
  FaUsers,
  FaProjectDiagram,
  FaHeart,
} from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type DonationAmountOption = {
  id?: string | number;
  amount?: number;
  label?: string;
  pretitle?: string;
  currencySymbol?: string;
  isOther?: boolean;
};

type PaymentMethod = {
  id?: string;
  title?: string;
  pretitle?: string;
};

type FeatureItem = {
  id?: string | number;
  title?: string;
  description?: string;
};

type ImpactStat = {
  label?: string;
  value?: string;
  description?: string;
};

export default function NGODonateContent2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : undefined;
  const whyDonate = isRecord(data.whyDonate) ? data.whyDonate : undefined;
  const donationForm = isRecord(data.donationForm)
    ? data.donationForm
    : undefined;
  const amountSection = isRecord(donationForm?.amountSection)
    ? donationForm.amountSection
    : undefined;
  const donorInfoSection = isRecord(donationForm?.donorInfoSection)
    ? donationForm.donorInfoSection
    : undefined;
  const paymentMethodSection = isRecord(donationForm?.paymentMethodSection)
    ? donationForm.paymentMethodSection
    : undefined;
  const newsletterConsent = isRecord(donationForm?.newsletterConsent)
    ? donationForm.newsletterConsent
    : undefined;
  const submitButton = isRecord(donationForm?.submitButton)
    ? donationForm.submitButton
    : undefined;
  const securityNote = isRecord(donationForm?.securityNote)
    ? donationForm.securityNote
    : undefined;
  const fields = isRecord(donorInfoSection?.fields)
    ? donorInfoSection.fields
    : undefined;
  const fullNameField = isRecord(fields?.fullName) ? fields.fullName : undefined;
  const emailField = isRecord(fields?.email) ? fields.email : undefined;
  const phoneField = isRecord(fields?.phone) ? fields.phone : undefined;
  const countryField = isRecord(fields?.country) ? fields.country : undefined;

  const amounts = (Array.isArray(amountSection?.options)
    ? amountSection.options
    : Array.isArray(data.amounts)
      ? data.amounts
      : Array.isArray(data.donationAmounts)
        ? data.donationAmounts
        : [
            { amount: 500, label: "Support", currencySymbol: "₹" },
            { amount: 1000, label: "Care", currencySymbol: "₹" },
            { amount: 2500, label: "Impact", currencySymbol: "₹" },
            { amount: 5000, label: "Change", currencySymbol: "₹" },
            { isOther: true, pretitle: "Custom" },
          ]) as DonationAmountOption[];

  const features = Array.isArray(whyDonate?.features)
    ? (whyDonate.features as FeatureItem[])
    : [];
  const methods = Array.isArray(paymentMethodSection?.methods)
    ? (paymentMethodSection.methods as PaymentMethod[])
    : [
        { id: "upi", title: "UPI", pretitle: "Instant" },
        { id: "card", title: "Card", pretitle: "Visa/Master" },
        { id: "net-banking", title: "Net Banking", pretitle: "All Banks" },
        { id: "wallet", title: "Wallet", pretitle: "Paytm etc" },
      ];
  const impactStats = Array.isArray(data.impactStats)
    ? (data.impactStats as ImpactStat[])
    : [];
  const illustration = isRecord(whyDonate?.illustration)
    ? whyDonate.illustration
    : undefined;
  const titleObj = isRecord(header?.title) ? header.title : undefined;
  const whyTitle = isRecord(whyDonate?.title) ? whyDonate.title : undefined;

  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    amounts.find((a) => !a.isOther)?.amount ?? 500,
  );
  const [customAmount, setCustomAmount] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleAmountSelect = (option: DonationAmountOption) => {
    if (option.isOther) {
      setIsOtherSelected(true);
      setSelectedAmount(null);
    } else {
      setIsOtherSelected(false);
      setSelectedAmount(option.amount ?? null);
      setCustomAmount("");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const featureIcons = [
    <FiLock key="1" className="text-xl text-orange-400" />,
    <FiFileText key="2" className="text-xl text-orange-400" />,
    <FiAward key="3" className="text-xl text-orange-400" />,
    <FiHeart key="4" className="text-xl text-orange-400" />,
  ];

  const statIcons = [
    <FaUsers key="1" className="text-3xl text-orange-400" />,
    <FaHandHoldingHeart key="2" className="text-3xl text-orange-400" />,
    <FaProjectDiagram key="3" className="text-3xl text-orange-400" />,
    <FaHeart key="4" className="text-3xl text-orange-400" />,
  ];

  return (
    <section
      data-editor-section-label="Donate Content"
      data-editor-fields="header whyDonate donationForm amounts impactStats"
      className="relative py-8 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center gap-1">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span className="text-sm font-bold uppercase tracking-widest text-orange-400">
              {(typeof header?.badge === "string" && header.badge) || "Donate"}
            </span>
          </div>

          <h2 className="mt-0 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            {(typeof titleObj?.line1 === "string" && titleObj.line1) ||
              (typeof data.title === "string" ? data.title : "Make a")}{" "}
            <span className="text-[#0F172A]">
              {(typeof titleObj?.highlight === "string" && titleObj.highlight) ||
                "Donation"}
            </span>
          </h2>

          {typeof header?.description === "string" ? (
            <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
              {header.description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-3xl border border-red-100/50 bg-gradient-to-b from-red-50/60 via-pink-50/30 to-red-50/70 p-0 lg:col-span-4">
            <div className="p-3 sm:p-5">
              <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                {(typeof whyTitle?.line1 === "string" && whyTitle.line1) ||
                  "Why"}{" "}
                <span className="text-orange-400">
                  {(typeof whyTitle?.highlight === "string" &&
                    whyTitle.highlight) ||
                    "Donate"}
                </span>
              </h3>

              <div className="mt-2 h-[3px] w-10 bg-orange-500" />

              {typeof whyDonate?.description === "string" ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {whyDonate.description}
                </p>
              ) : null}

              <div className="mt-8 space-y-6">
                {features.map((feature, idx) => (
                  <div
                    key={feature.id ?? `${feature.title}-${idx}`}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 shadow-sm">
                      {featureIcons[idx % featureIcons.length]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        {feature.title}
                      </h4>
                      {feature.description ? (
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {feature.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {typeof illustration?.src === "string" ? (
              <div className="relative mt-8 flex justify-center pt-4">
                <div className="relative h-52 w-full">
                  <Image
                    src={illustration.src}
                    alt={(illustration.alt as string) || "Donate"}
                    fill
                    className="object-contain"
                    unoptimized={isUnoptimizedImageSrc(illustration.src)}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm sm:p-10 lg:col-span-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                  {(typeof amountSection?.title === "string" &&
                    amountSection.title) ||
                    "Select Amount"}
                </h3>
                <div className="mt-1.5 h-[3px] w-10 bg-orange-400" />

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {amounts.map((opt, idx) => {
                    const isSelected =
                      (!opt.isOther && selectedAmount === opt.amount) ||
                      (opt.isOther && isOtherSelected);
                    return (
                      <button
                        key={`${opt.label}-${idx}`}
                        type="button"
                        onClick={() => handleAmountSelect(opt)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200 ${
                          isSelected
                            ? "border-orange-500 bg-white shadow-sm ring-1 ring-orange-500"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <span className="text-base font-extrabold text-[#0F172A]">
                          {opt.isOther
                            ? "Other"
                            : `${opt.currencySymbol || "₹"}${opt.amount?.toLocaleString()}`}
                        </span>
                        <span className="mt-1 text-[11px] font-medium text-slate-500">
                          {opt.isOther ? opt.pretitle : opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isOtherSelected ? (
                  <div className="mt-4">
                    <div className="relative rounded-xl border border-gray-200 shadow-sm focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-500">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full rounded-xl py-3 pl-8 pr-4 text-sm font-semibold text-gray-900 outline-none"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                  {(typeof donorInfoSection?.title === "string" &&
                    donorInfoSection.title) ||
                    "Donor Information"}
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A]">
                      {(typeof fullNameField?.label === "string" &&
                        fullNameField.label) ||
                        "Full Name"}{" "}
                      <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder={
                          (typeof fullNameField?.placeholder === "string" &&
                            fullNameField.placeholder) ||
                          "Your name"
                        }
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0F172A]">
                      {(typeof emailField?.label === "string" &&
                        emailField.label) ||
                        "Email"}{" "}
                      <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={
                          (typeof emailField?.placeholder === "string" &&
                            emailField.placeholder) ||
                          "you@example.com"
                        }
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0F172A]">
                      {(typeof phoneField?.label === "string" &&
                        phoneField.label) ||
                        "Phone"}{" "}
                      <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={
                          (typeof phoneField?.placeholder === "string" &&
                            phoneField.placeholder) ||
                          "Phone number"
                        }
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0F172A]">
                      {(typeof countryField?.label === "string" &&
                        countryField.label) ||
                        "Country"}{" "}
                      <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-8 text-sm font-medium text-slate-800 outline-none transition-all focus:border-orange-400 focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="" disabled>
                          {(typeof countryField?.placeholder === "string" &&
                            countryField.placeholder) ||
                            "Select country"}
                        </option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                  {(typeof paymentMethodSection?.title === "string" &&
                    paymentMethodSection.title) ||
                    "Payment Method"}
                </h3>
                <div className="mt-1.5 h-[3px] w-10 bg-orange-500" />

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {methods.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id || "upi")}
                        className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                          isSelected
                            ? "border-orange-400 bg-white ring-1 ring-orange-500"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="mb-2 flex h-8 items-center justify-center">
                          {method.id === "upi" && (
                            <span className="text-sm font-black italic tracking-wider text-slate-800">
                              UPI
                            </span>
                          )}
                          {method.id === "card" && (
                            <FiCreditCard className="text-2xl text-blue-600" />
                          )}
                          {method.id === "net-banking" && (
                            <FaUniversity className="text-xl text-slate-700" />
                          )}
                          {method.id === "wallet" && (
                            <FaWallet className="text-xl text-slate-700" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#0F172A]">
                          {method.title}
                        </span>
                        {method.pretitle ? (
                          <span className="mt-1 text-[10px] text-slate-400">
                            {method.pretitle}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={receiveUpdates}
                    onChange={(e) => setReceiveUpdates(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-400 focus:ring-orange-500"
                  />
                  <span className="text-sm leading-normal text-slate-600">
                    {(typeof newsletterConsent?.label === "string" &&
                      newsletterConsent.label) ||
                      "Send me updates about how my donation is making an impact"}
                  </span>
                </label>

                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-orange-600 active:scale-[0.99]"
                >
                  <FaHeart className="text-sm" />
                  <span>
                    {(typeof submitButton?.label === "string" &&
                      submitButton.label) ||
                      "Donate Now"}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                  <FiLock className="text-slate-600" />
                  <span>
                    {(typeof securityNote?.text === "string" &&
                      securityNote.text) ||
                      "Secure encrypted donation"}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {impactStats.length > 0 ? (
          <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:mt-16">
            <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-gray-100">
              {impactStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center p-3 text-center sm:p-6"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                    {statIcons[idx % statIcons.length]}
                  </div>
                  <h4 className="mt-4 font-serif text-3xl font-extrabold text-orange-500">
                    {stat.value}
                  </h4>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">
                    {stat.label}
                  </p>
                  {stat.description ? (
                    <p className="mt-0.5 text-sm text-slate-400">
                      {stat.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
