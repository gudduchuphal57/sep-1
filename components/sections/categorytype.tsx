"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  FileText,
  ShoppingCart,
  Home,
  GraduationCap,
  Heart,
  ShoppingBag,
  Gamepad2,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { getCategoryNamesWithContent } from "@/app/editor/layout/src/data/templateFlow";

const types = [
  {
    title: "Business",
    desc: "Grow your business",
    icon: Briefcase,
  },
  {
    title: "Events",
    desc: "Plan and promote events",
    icon: Briefcase,
  },
  {
    title: "Portfolio",
    desc: "Showcase your work",
    icon: FileText,
  },
  {
    title: "Ecommerce",
    desc: "Sell products online",
    icon: ShoppingCart,
  },
  {
    title: "Realestate",
    desc: "List homes for sale",
    icon: Home,
  },
  {
    title: "School",
    desc: "Manage admissions",
    icon: GraduationCap,
  },
  {
    title: "Hospitals",
    desc: "Manage patient care",
    icon: Heart,
  },
  {
    title: "Fashion",
    desc: "Promote fashion brands",
    icon: ShoppingBag,
  },
  {
    title: "Games",
    desc: "Build gaming communities",
    icon: Gamepad2,
  },
  {
    title: "Financial",
    desc: "Offer financial services",
    icon: Briefcase,
  },
];

const availableCategoryNames = getCategoryNamesWithContent();
const availableTypes = types.filter((item) =>
  availableCategoryNames.includes(item.title),
);

type CategoryTypeProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function Categorystep({
  selectedCategory,
  onCategoryChange,
}: CategoryTypeProps) {
  const [selected, setSelected] = useState(selectedCategory);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTypes = useMemo(() => {
    if (!search.trim()) return availableTypes;

    return availableTypes.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const handleSelect = (title: string) => {
    setSelected(title);
    onCategoryChange(title);
    setOpen(false);
  };

  const handleAllItems = () => {
    setSelected("");
    onCategoryChange("");
    setSearch("");
    setOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="w-full">
      <section className="onboarding-responsive-scroll relative mx-auto max-h-[calc(100dvh-156px)] w-full overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(23,38,76,.08)] lg:max-h-none lg:overflow-visible">
        <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6 2xl:px-9">
          <div className="flex shrink-0 justify-center items-center gap-3 border-b border-slate-200 pb-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-[-.035em] text-[#08132f] sm:text-2xl">
                Choose your website category
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Select the closest match. AI will tailor the pages and content
                around it.
              </p>
            </div>
          </div>

          <div className="mt-5 flex shrink-0 flex-col gap-3 md:flex-row">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search for a category (e.g., Realestate, Education)..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-11 text-sm text-[#08132f] outline-none transition placeholder:text-slate-400 focus:border-[#315ff4] focus:ring-3 focus:ring-blue-100/70"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#315ff4] sm:right-5"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div ref={dropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 text-sm font-medium transition md:w-[210px] ${open
                  ? "border-[#315ff4] bg-blue-50 text-[#315ff4] ring-3 ring-blue-100/70"
                  : "border-slate-200 bg-white text-[#08132f] hover:border-blue-300"
                  }`}
              >
                <span className="truncate">Popular Categories</span>
                {open ? (
                  <ChevronUp className="shrink-0" size={16} />
                ) : (
                  <ChevronDown className="shrink-0" size={16} />
                )}
              </button>

              {open && (
                <div
                  className="
                  absolute right-0 z-50 mt-2 max-h-64 w-full overflow-y-auto
                  rounded-lg border border-slate-200 bg-white py-2 shadow-[0_18px_45px_rgba(25,60,150,.16)]
                  md:w-[210px] lg:max-h-none lg:overflow-visible
                "
                >
                  <button
                    type="button"
                    onClick={handleAllItems}
                    className={`block w-full px-5 py-2 text-left text-sm transition hover:bg-blue-50 hover:text-[#315ff4] ${selected === ""
                      ? "bg-blue-50 font-bold text-[#315ff4]"
                      : "font-semibold text-slate-900"
                      }`}
                  >
                    All Items
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {availableTypes.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSelect(item.title)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-2 text-left text-sm transition hover:bg-blue-50 hover:text-[#315ff4] ${selected === item.title
                        ? "bg-blue-50 font-bold text-[#315ff4]"
                        : "text-slate-700"
                        }`}
                    >
                      <span>{item.title}</span>
                      {selected === item.title && (
                        <Check size={14} strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex-1 px-1 pt-1">
            <div
              className="
              grid grid-cols-1 gap-3
              min-[480px]:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5
              lg:gap-4
            "
            >
              {filteredTypes.map((item) => {
                const Icon = item.icon;
                const isActive = selected === item.title;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelect(item.title)}
                    className={`group relative min-h-[90px] cursor-pointer overflow-hidden rounded-lg border p-4 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(49,95,244,.1)] ${isActive
                      ? "border-[#315ff4] bg-blue-50/50 text-[#08132f] shadow-[0_8px_24px_rgba(49,95,244,.1)] ring-1 ring-[#315ff4]"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
                  >
                    {isActive && (
                      <span className="absolute right-3 top-3 z-10 flex size-5 items-center justify-center rounded-full bg-[#315ff4] text-white shadow">
                        <Check size={15} />
                      </span>
                    )}

                    <div className="flex justify-between items-center">
                      <h3
                        className="text-base font-semibold text-[#08132f]"
                      >
                        {item.title}
                      </h3>

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-8 sm:w-8 ${isActive
                          ? "bg-white text-[#315ff4] shadow-sm"
                          : "bg-slate-50 text-slate-500"
                          }`}
                      >
                        <Icon size={14} />
                      </div>
                    </div>

                    <p
                      className="mt-2 text-xs leading-5 text-slate-500"
                    >
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {filteredTypes.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">
                No category found.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
