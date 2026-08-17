"use client";

import { useState, useEffect } from "react";
import { useFooter } from "../layout/footercontext";
import Categorystep, { MIN_DESCRIPTION_LENGTH } from "./categorystep";
import CategoryType from "./categorytype";
import PageSelection, { DEFAULT_PAGE_SELECTIONS } from "./pageselection";
import TemplatePreview from "./templatepreview";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BusinessInfo = {
  audience: "" | "clients" | "myself" | "company";
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

const steps: { title: string; subtitle: string }[] = [
  { title: "Category", subtitle: "" },
  { title: "Category Data", subtitle: "" },
  { title: "Design", subtitle: "" },
  { title: "Pages", subtitle: "" },
];

export default function BusinessOnboarding({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const { setHideFooter } = useFooter();
  const [loadspinner, setLoadspinner] = useState(false);
  const [businessInfoSubmitted, setBusinessInfoSubmitted] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    audience: "clients",
    name: "",
    description: "",
    websiteRelated: "products",
    pageType: "single-page",
    email: "",
    mobile: "",
    address: "",
    includeDetails: false,
    hasLogo: "no",
    logoName: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("Business");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedPages, setSelectedPages] = useState<string[]>(() => [
    ...DEFAULT_PAGE_SELECTIONS,
  ]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  useEffect(() => {
    setHideFooter(true);

    return () => {
      setHideFooter(false);
    };
  }, [setHideFooter]);

  const isBusinessInfoValid =
    Boolean(businessInfo.audience) &&
    Boolean(businessInfo.name.trim()) &&
    businessInfo.description.trim().length >= MIN_DESCRIPTION_LENGTH &&
    Boolean(businessInfo.websiteRelated) &&
    Boolean(businessInfo.pageType) &&
    (!businessInfo.includeDetails ||
      (Boolean(businessInfo.email.trim()) &&
        Boolean(businessInfo.mobile.trim()) &&
        Boolean(businessInfo.address.trim()))) &&
    Boolean(businessInfo.hasLogo) &&
    (businessInfo.hasLogo !== "yes" || Boolean(businessInfo.logoName));

  const handleContinue = async () => {
    if (step === 0 && !isBusinessInfoValid) {
      setBusinessInfoSubmitted(true);
      return;
    }

    if (step === 1 && !selectedCategory) {
      return;
    }

    if (step === 2 && !selectedTemplate) {
      return;
    }

    if (step === 3 && selectedPages.length === 0) {
      return;
    }

    setLoadspinner(true);

    await new Promise((resolve) => setTimeout(resolve, 200));
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setShowTemplatePreview(true);
    }

    setLoadspinner(false);
  };

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#fbfaf6] pb-[72px] pt-[84px] text-[#08132f] 2xl:pt-20">
      <OnboardingBackdrop />

      <OnboardingHeader />

      <div className="relative z-10 w-full max-w-[1320px] overflow-visible px-4 sm:px-7 lg:px-8 2xl:max-w-[1632px]">
        <div className="w-full">
          {step === 0 && (
            <div className="min-w-0 w-full">
              <Categorystep
                value={businessInfo}
                showErrors={businessInfoSubmitted}
                onChange={(nextValue) => {
                  setBusinessInfo(nextValue);
                  if (
                    nextValue.audience &&
                    nextValue.name.trim() &&
                    nextValue.description.trim().length >=
                    MIN_DESCRIPTION_LENGTH &&
                    nextValue.websiteRelated &&
                    nextValue.pageType &&
                    (!nextValue.includeDetails ||
                      (nextValue.email.trim() &&
                        nextValue.mobile.trim() &&
                        nextValue.address.trim())) &&
                    nextValue.hasLogo &&
                    (nextValue.hasLogo !== "yes" || nextValue.logoName)
                  ) {
                    setBusinessInfoSubmitted(false);
                  }
                }}
              />
            </div>
          )}
          {step === 1 && (
            <CategoryType
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setSelectedTemplate("");
              }}
            />
          )}
          {step === 2 && (
            <TemplatePreview
              selectedCategory={selectedCategory}
              selectedTemplate={selectedTemplate}
              showPreview={showTemplatePreview}
              onTemplateChange={setSelectedTemplate}
              onClosePreview={() => setShowTemplatePreview(false)}
            />
          )}
          {step === 3 &&
            (showTemplatePreview ? (
              <TemplatePreview
                selectedCategory={selectedCategory}
                selectedTemplate={selectedTemplate}
                showPreview
                onTemplateChange={setSelectedTemplate}
                onClosePreview={() => setShowTemplatePreview(false)}
              />
            ) : (
              <PageSelection
                selectedPages={selectedPages}
                onChange={setSelectedPages}
              />
            ))}
        </div>
      </div>

      {!showTemplatePreview && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 py-2.5 backdrop-blur-xl 2xl:h-[72px]">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-7 lg:px-8 2xl:max-w-[1632px]">
            <button
              type="button"
              onClick={step === 0 ? onBack : () => setStep((prev) => prev - 1)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-blue-700 px-4 text-xs font-medium text-white shadow-sm transition hover:border-blue-300 2xl:h-10 2xl:px-5 2xl:text-xs"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="hidden items-center gap-2 text-[11px] font-medium text-slate-400 sm:flex 2xl:text-xs">
              <span className="size-1.5 rounded-full bg-[#315ff4]" />
              Your progress is saved automatically
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                loadspinner ||
                (step === 1 && !selectedCategory) ||
                (step === 2 && !selectedTemplate) ||
                (step === 3 && selectedPages.length === 0)
              }
              className="group inline-flex h-9 min-w-[122px] items-center justify-center gap-2 rounded-lg bg-[#08132f] px-5 text-xs font-medium text-white shadow-[0_8px_20px_rgba(8,19,47,.16)] transition hover:bg-[#315ff4] disabled:cursor-not-allowed disabled:opacity-50 2xl:h-10 2xl:min-w-[142px] 2xl:px-6 2xl:text-sm"
            >
              {loadspinner && (
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loadspinner ? "Loading..." : "Continue"}
              {!loadspinner && (
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function OnboardingBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 top-16 overflow-hidden 2xl:top-20"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.82),transparent_42%),linear-gradient(180deg,#fcfbf8_0%,#faf9f4_100%)]" />
      <svg
        viewBox="0 0 1600 760"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern
            id="onboarding-dots"
            width="17"
            height="17"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.35" fill="#6299ff" opacity=".82" />
          </pattern>
        </defs>

        <path
          d="M-72 183 A250 250 0 0 1 218 -58"
          fill="none"
          stroke="#a9c8ff"
          strokeWidth="116"
          opacity=".82"
        />
        <circle cx="263" cy="185" r="62" fill="#cbb4ed" opacity=".64" />
        <rect
          x="72"
          y="188"
          width="145"
          height="145"
          fill="url(#onboarding-dots)"
        />
        <path
          d="M268 74 C420 58 436 184 568 184"
          fill="none"
          stroke="#70a7ff"
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity=".9"
        />

        <path
          d="M1295 760 A270 270 0 0 1 1565 490 L1565 760 Z"
          fill="#FFD3C4"
          opacity=".9"
        />
        <rect
          x="1498"
          y="624"
          width="150"
          height="136"
          fill="#f5a03b"
          opacity=".72"
        />
        <rect
          x="1570"
          y="624"
          width="120"
          height="136"
          fill="#ffd25f"
          opacity=".72"
        />
        <path
          d="M1405 760 A118 118 0 0 1 1523 642"
          fill="none"
          stroke="#155292"
          strokeWidth="4"
        />
        <path
          d="M1000 580 C1090 690 1170 652 1235 664 C1295 676 1332 724 1430 690"
          fill="none"
          stroke="#70a7ff"
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity=".9"
        />

        <path
          d="M1490 70 C1490 84 1497 92 1510 92 C1497 92 1490 100 1490 114 C1490 100 1483 92 1470 92 C1483 92 1490 84 1490 70Z"
          fill="#76a9ff"
        />
        <path
          d="M1462 112 C1462 123 1468 129 1478 129 C1468 129 1462 135 1462 146 C1462 135 1456 129 1446 129 C1456 129 1462 123 1462 112Z"
          fill="#d4b8ec"
        />
        <path
          d="M1516 140 C1516 150 1521 156 1531 156 C1521 156 1516 162 1516 172 C1516 162 1511 156 1501 156 C1511 156 1516 150 1516 140Z"
          fill="#f6bd4d"
        />
        <path
          d="M88 620 C88 633 95 641 108 641 C95 641 88 649 88 662 C88 649 81 641 68 641 C81 641 88 633 88 620Z"
          fill="#f6bd4d"
        />
        <path
          d="M136 650 C136 661 142 667 153 667 C142 667 136 673 136 684 C136 673 130 667 119 667 C130 667 136 661 136 650Z"
          fill="#d4b8ec"
        />
        <path
          d="M106 685 C106 699 113 707 127 707 C113 707 106 715 106 729 C106 715 99 707 85 707 C99 707 106 699 106 685Z"
          fill="#76a9ff"
        />
      </svg>
      <div className="absolute inset-px rounded-2xl border border-slate-200/60" />
    </div>
  );
}

function OnboardingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl 2xl:h-20">
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-8 2xl:max-w-[1632px]">
        <Link
          href="/"
          aria-label="Lestow home"
          className="relative block h-8 w-[108px] shrink-0 2xl:h-10 2xl:w-[120px]"
        >
          <Image
            src="/lestow-logo.svg"
            alt="Lestow AI Website Builder"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <nav className="flex items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/auth"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-[#315ff4] transition hover:border-blue-300 hover:bg-blue-50 sm:px-5 2xl:px-7 2xl:py-3 2xl:text-xs"
          >
            Sign up
          </Link>
          <Link
            href="/auth"
            className="rounded-lg bg-black px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-black/75 sm:px-5 2xl:px-7 2xl:py-3 2xl:text-xs"
          >
            Get Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
