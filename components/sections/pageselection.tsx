"use client";

import { useState } from "react";

type DropdownOption = {
  id: string;
  label: string;
};

type MenuItem = {
  id: string;
  label: string;
  dropdown?: DropdownOption[];
};

const headerMenuItems: MenuItem[] = [
  { id: "home", label: "Home" },
  {
    id: "about",
    label: "About",
    dropdown: [
      { id: "our-story", label: "Our Story" },
      { id: "vision-mission", label: "Vision & Mission" },
      { id: "our-values", label: "Our Values" },
      { id: "leadership-team", label: "Leadership Team" },
    ],
  },
  {
    id: "services",
    label: "Services",
    dropdown: [
      { id: "Service-1", label: "Service-1" },
      { id: "Service-2", label: "Service-2" },
      { id: "Service-3", label: "Service-3" },
      { id: "Service-4", label: "Service-4" },
      { id: "Service-5", label: "Service-5" },
    ],
  },
  { id: "gallery", label: "Gallery" },
  { id: "events", label: "Events" },
  { id: "contact", label: "Contact" },
  {
    id: "legal",
    label: "Legal",
    dropdown: [
      { id: "privacy-policy", label: "Privacy Policy" },
      { id: "terms-and-conditions", label: "Terms & Conditions" },
      { id: "disclaimer", label: "Disclaimer" },
      { id: "cookie-policy", label: "Cookie Policy" },
    ],
  },
  {
    id: "csr",
    label: "CSR",
    dropdown: [
      { id: "csr-partnership", label: "CSR Partnership" },
      { id: "csr-projects", label: "CSR Projects" },
      { id: "csr-success-stories", label: "CSR Success Stories" },
      { id: "csr-reports", label: "CSR Reports" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    dropdown: [
      { id: "resource-blogs", label: "Blogs" },
      { id: "resource-reports", label: "Reports" },
      { id: "resource-faqs", label: "FAQs" },
    ],
  },
  {
    id: "investors",
    label: "Investors",
    dropdown: [
      { id: "annual-reports", label: "Annual Reports" },
      { id: "financial-statements", label: "Financial Statements" },
      { id: "audit-reports", label: "Audit Reports" },
    ],
  },
  {
    id: "media-center",
    label: "Media Center",
    dropdown: [
      { id: "media-news", label: "News" },
      { id: "press-releases", label: "Press Releases" },
      { id: "downloads", label: "Downloads" },
      { id: "videos", label: "Videos" },
      { id: "photo-gallery", label: "Photo Gallery" },
    ],
  },
];

const footerUsefulLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "gallery", label: "Gallery" },
  { id: "events", label: "Events" },
];

const footerServices = [
  { id: "Service-1", label: "Service-1" },
  { id: "Service-2", label: "Service-2" },
  { id: "Service-3", label: "Service-3" },
  { id: "Service-4", label: "Service-4" }
];

const footerResources = [
  { id: "blog", label: "Blog" },
  { id: "news", label: "News" },
];

const footerSupport = [
  { id: "contact", label: "Contact" },
  { id: "help-center", label: "Help Center" },
];

const footerPolicies = [
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms-and-conditions", label: "Terms & Conditions" },
  { id: "cookie-policy", label: "Cookie Policy" },
];

type PageSelectionProps = {
  selectedPages: string[];
  onChange: (pages: string[]) => void;
};

const defaultHeaderPageIds = [
  "home",
  "about",
  "services",
  "gallery",
  "events",
  "contact",
];

const defaultFooterPageIds = [...defaultHeaderPageIds, "blog"];

export const DEFAULT_PAGE_SELECTIONS = [
  ...defaultHeaderPageIds.map((pageId) => `header:${pageId}`),
  "header:our-story",
  "header:vision-mission",
  ...defaultFooterPageIds.map((pageId) => `footer:${pageId}`),
];

const selectionKey = (location: "header" | "footer", pageId: string) =>
  `${location}:${pageId}`;

export default function PageSelection({
  selectedPages,
  onChange,
}: PageSelectionProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const togglePage = (pageId: string) => {
    onChange(
      selectedPages.includes(pageId)
        ? selectedPages.filter((id) => id !== pageId)
        : [...selectedPages, pageId],
    );
  };

  return (
    <div className="w-full">
      <section className="onboarding-responsive-scroll relative mx-auto max-h-[calc(100dvh-156px)] w-full overflow-x-hidden overflow-y-auto rounded-[18px] border border-[#dce4f2] bg-[#fbfcff] shadow-[0_22px_70px_rgba(0,10,27,.08)] lg:max-h-none lg:overflow-visible">
        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6 2xl:px-10">
          <div className="border-b border-[#e4e9f2] pb-5 text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-.025em] text-[#000a1b]">
              Choose pages for your website
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-[#526079]">
              Select menu pages and add dropdown items where you need them.
            </p>
          </div>

          <div className="pt-5">
            <SectionTitle>Header menu</SectionTitle>

            <nav
              aria-label="Header menu page selection"
              className="mt-3 grid min-w-0 grid-cols-2 gap-3 overflow-visible pb-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8"
            >
              {headerMenuItems.map((item) => {
                const pageId = selectionKey("header", item.id);
                const isSelected = selectedPages.includes(pageId);
                const isOpen = openDropdown === item.id;
                const hasSelectedDropdownItem =
                  item.dropdown?.some((option) =>
                    selectedPages.includes(selectionKey("header", option.id)),
                  ) ?? false;

                return (
                  <div
                    key={item.id}
                    className="relative min-w-0"
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        togglePage(pageId);
                        if (isSelected && isOpen) {
                          setOpenDropdown(null);
                        }
                      }}
                      className={`relative flex h-[60px] w-full items-center justify-center rounded-xl border px-4 text-center  transition duration-200 ${item.dropdown ? "pr-14" : ""} ${isSelected
                        ? "border-[#053bee] bg-[#f0f4ff] text-[#053bee] shadow-[0_4px_14px_rgba(5,59,238,.06)]"
                        : "border-[#ccd8ef] bg-white text-[#000a1b] hover:border-[#ccd8ef] hover:bg-white hover:text-[#053bee]"
                        }`}
                    >
                      <span className="max-w-full truncate text-sm font-medium leading-none">
                        {item.label}
                      </span>
                    </button>

                    {item.dropdown && (
                      <>
                        <button
                          type="button"
                          disabled={!isSelected}
                          aria-expanded={isOpen}
                          aria-label={`Choose ${item.label} dropdown pages`}
                          onClick={() =>
                            setOpenDropdown(isOpen ? null : item.id)
                          }
                          className={`absolute right-3 top-1/2 z-10 grid size-6 -translate-y-1/2 place-items-center rounded-full text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#053bee] focus-visible:ring-offset-2 ${!isSelected
                            ? "cursor-not-allowed bg-[#d5dceb] shadow-none"
                            : hasSelectedDropdownItem
                              ? "bg-[#053bee] shadow-[0_6px_16px_rgba(5,59,238,.24)] hover:scale-105 hover:bg-[#053bee]"
                              : "bg-[#aebce0] shadow-[0_4px_12px_rgba(100,116,160,.14)] hover:scale-105 hover:bg-[#053bee]"
                            } ${isOpen ? "rotate-45" : ""}`}
                        >
                          <span className="absolute h-px w-2 bg-current" />
                          <span className="absolute h-2 w-px bg-current" />
                        </button>

                        {isOpen && (
                          <div className="absolute left-1/2 top-[76px] z-30 w-52 -translate-x-1/2 rounded-xl border border-[#dce4f2] bg-white p-2.5 text-sm text-black shadow-[0_18px_45px_rgba(0,10,27,.16)]">
                            {item.dropdown.map((option) => {
                              const optionId = selectionKey(
                                "header",
                                option.id,
                              );
                              return (
                                <SelectionLink
                                  key={option.id}
                                  label={option.label}
                                  selected={selectedPages.includes(optionId)}
                                  onClick={() => togglePage(optionId)}
                                />
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-3 border-t border-[#e4e9f2] pt-5">
            <SectionTitle>Footer links</SectionTitle>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <FooterGroup title="Useful Links">
                {footerUsefulLinks.map((link) => (
                  <SelectionLink
                    key={link.id}
                    label={link.label}
                    selected={selectedPages.includes(
                      selectionKey("footer", link.id),
                    )}
                    onClick={() => togglePage(selectionKey("footer", link.id))}
                  />
                ))}
              </FooterGroup>

              <FooterGroup title="Services">
                {footerServices.map((link) => (
                  <SelectionLink
                    key={link.id}
                    label={link.label}
                    selected={selectedPages.includes(
                      selectionKey("footer", link.id),
                    )}
                    onClick={() => togglePage(selectionKey("footer", link.id))}
                  />
                ))}
              </FooterGroup>

              <FooterGroup title="Resources">
                {footerResources.map((link) => (
                  <SelectionLink
                    key={link.id}
                    label={link.label}
                    selected={selectedPages.includes(
                      selectionKey("footer", link.id),
                    )}
                    onClick={() => togglePage(selectionKey("footer", link.id))}
                  />
                ))}
              </FooterGroup>

              <FooterGroup title="Support">
                {footerSupport.map((link) => (
                  <SelectionLink
                    key={link.id}
                    label={link.label}
                    selected={selectedPages.includes(
                      selectionKey("footer", link.id),
                    )}
                    onClick={() => togglePage(selectionKey("footer", link.id))}
                  />
                ))}
              </FooterGroup>

              <FooterGroup title="Policies">
                {footerPolicies.map((link) => (
                  <SelectionLink
                    key={link.id}
                    label={link.label}
                    selected={selectedPages.includes(
                      selectionKey("footer", link.id),
                    )}
                    onClick={() => togglePage(selectionKey("footer", link.id))}
                  />
                ))}
              </FooterGroup>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[#053bee]">
      {children}
    </h3>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[150px] rounded-xl border border-[#dce4f2] bg-white px-4 py-4 shadow-[0_6px_22px_rgba(0,10,27,.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[#bdcbe3] hover:shadow-[0_10px_28px_rgba(0,10,27,.06)]">
      <h4 className="mb-2.5 border-b border-[#edf0f5] pb-2.5 text-xs font-semibold leading-none text-[#000a1b]">
        {title}
      </h4>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function SelectionLink({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group mb-1 flex min-h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md px-2 text-left !text-[16px] leading-none transition hover:bg-[#f0f4ff] hover:text-[#053bee] ${selected ? "bg-[#f0f4ff] font-medium text-[#053bee]" : "text-[#000a1b]"
        }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span
        className={`grid size-3.5 shrink-0 place-items-center rounded border transition ${selected
          ? "border-[#053bee] bg-[#285aff] text-white"
          : "border-[#9aa6b9] bg-white group-hover:border-[#053bee]"
          }`}
        aria-hidden="true"
      >
        {selected && (
          <svg
            viewBox="0 0 12 12"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2.25 6.25 2.2 2.2 5.3-5.3" />
          </svg>
        )}
      </span>
    </button>
  );
}
