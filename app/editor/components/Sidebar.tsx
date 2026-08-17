"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  House,
  Palette,
  Type,
  SearchCheck,
  Settings2,
  LogOut,
  FileText,
  Monitor,
  Layers3,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";

import { usePreview } from "../layout/src/components/context/PreviewContext";

const createPageHref = (label: string) => {
  const slug = label.trim().toLowerCase().replace(/\s+/g, "-");

  return slug === "home" ? "#" : `#${slug}`;
};

type SidebarChildItem = {
  label: string;
  icon: LucideIcon;
  route?: string;
};

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  route?: string;
  children?: SidebarChildItem[];
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: House,
    route: "/dashboard",
  },
  {
    label: "Theme Color",
    icon: Palette,
  },
  {
    label: "Theme Fonts",
    icon: Type,
  },
  {
    label: "SEO",
    icon: SearchCheck,
    children: [
      {
        label: "Meta Tags",
        icon: FileText,
      },
      {
        label: "Open Graph",
        icon: Monitor,
      },
      {
        label: "Schema Markup",
        icon: Layers3,
      },
      {
        label: "Sitemap",
        icon: FileText,
      },
      {
        label: "Robots.txt",
        icon: FileText,
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings2,
    route: "/dashboard/settings",
  },
  {
    label: "Logout",
    icon: LogOut,
  },
];

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

type PageItem = {
  label: string;
  icon: LucideIcon;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const [pages, setPages] = useState<PageItem[]>([
    {
      label: "Home Page",
      icon: FileText,
    },
    {
      label: "About Page",
      icon: FileText,
    },
    {
      label: "Contact Page",
      icon: FileText,
    },
  ]);

  return (
    <>
      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <aside className="relative h-full w-64 border-r border-gray-200 bg-white">
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <span className="font-medium text-gray-900">Menu</span>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer rounded-md p-1 text-gray-700 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <SidebarContent
              collapsed={false}
              pages={pages}
              setPages={setPages}
              closeMobileSidebar={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] overflow-visible border-r border-gray-200 bg-white transition-all duration-300 md:block ${
          collapsed ? "w-12" : "w-40"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          pages={pages}
          setPages={setPages}
        />

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-gray-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ArrowRight
            size={18}
            className={`transition-transform duration-300 ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </aside>
    </>
  );
}

function SidebarContent({
  collapsed,
  pages,
  setPages,
  closeMobileSidebar,
}: {
  collapsed: boolean;
  pages: PageItem[];
  setPages: React.Dispatch<React.SetStateAction<PageItem[]>>;
  closeMobileSidebar?: () => void;
}) {
  const pathname = usePathname();

  const [openItem, setOpenItem] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [showPageModal, setShowPageModal] = useState(false);
  const [pageName, setPageName] = useState("");

  const { pageLinks, setCurrentPage, setPageLinks } = usePreview();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatedSidebarItems: SidebarItem[] = sidebarItems.map((item) =>
    item.label === "Pages"
      ? {
          ...item,
          children: pages,
        }
      : item,
  );

  const activeItem = updatedSidebarItems.find(
    (item) => item.label === openItem,
  );

  const handleAddPage = () => {
    const trimmedPageName = pageName.trim();

    if (!trimmedPageName) return;

    const normalizedPageName = trimmedPageName.toLowerCase();

    const alreadyExists = pageLinks.some(
      (page) => page.label.trim().toLowerCase() === normalizedPageName,
    );

    setPages((previousPages) => [
      ...previousPages,
      {
        label: trimmedPageName,
        icon: FileText,
      },
    ]);

    if (!alreadyExists) {
      const href = createPageHref(trimmedPageName);

      setPageLinks([
        ...pageLinks,
        {
          label: trimmedPageName,
          href,
        },
      ]);

      window.dispatchEvent(
        new CustomEvent("ai-builder-page-added", {
          detail: {
            label: trimmedPageName,
            href,
          },
        }),
      );
    }

    setCurrentPage(trimmedPageName);
    setPageName("");
    setShowPageModal(false);
    setOpenItem("Pages");
  };

  const handleNormalItemClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: SidebarItem,
  ) => {
    const hasChildren = Boolean(item.children?.length);

    if (hasChildren) {
      setDropdownTop(event.currentTarget.offsetTop);

      setOpenItem((currentItem) =>
        currentItem === item.label ? null : item.label,
      );

      return;
    }

    setOpenItem(null);

    // Add Theme Color, Theme Fonts or Logout action here.
    if (item.label === "Theme Color") {
      console.log("Open theme color settings");
    }

    if (item.label === "Theme Fonts") {
      console.log("Open theme font settings");
    }

    if (item.label === "Logout") {
      console.log("Logout clicked");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={dropdownRef}
        className="relative flex h-full flex-col overflow-visible p-2"
      >
        <div className="relative h-full space-y-2 pt-2">
          {updatedSidebarItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isLogout = item.label.toLowerCase() === "logout";

            const isActive =
              item.route === "/dashboard"
                ? pathname === "/dashboard"
                : item.route
                  ? pathname.startsWith(item.route)
                  : openItem === item.label;

            /*
             * Items with a route use Next.js Link.
             * Dashboard therefore opens /dashboard.
             */
            if (item.route) {
              return (
                <Link
                  key={item.label}
                  href={item.route}
                  onClick={() => {
                    setOpenItem(null);
                    closeMobileSidebar?.();
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      isActive ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <Icon size={16} />
                  </span>

                  {!collapsed && (
                    <span
                      className={`text-sm ${
                        isActive ? "font-medium text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            }

            /*
             * Items without a route remain buttons.
             * They can open dropdowns or trigger editor actions.
             */
            return (
              <button
                type="button"
                key={item.label}
                title={collapsed ? item.label : undefined}
                onClick={(event) => handleNormalItemClick(event, item)}
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                  isLogout
                    ? "absolute bottom-2 left-0 bg-red-100 py-3 text-red-600 hover:bg-red-600 hover:text-white"
                    : isActive
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  <Icon
                    size={16}
                    className={
                      isLogout
                        ? "text-red-600 group-hover:text-white"
                        : isActive
                          ? "text-blue-600"
                          : "text-gray-600"
                    }
                  />
                </span>

                {!collapsed && (
                  <>
                    <span
                      className={`text-sm ${
                        isLogout
                          ? "text-red-700 group-hover:text-white"
                          : isActive
                            ? "font-medium text-blue-600"
                            : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>

                    {hasChildren && (
                      <ArrowRight
                        size={16}
                        className={`ml-auto shrink-0 transition-transform ${
                          openItem === item.label
                            ? "rotate-180 text-blue-600"
                            : "text-gray-700"
                        }`}
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar child dropdown */}
        {activeItem?.children && (
          <div
            style={{ top: dropdownTop }}
            className="absolute left-full z-50 ml-2 w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-xl md:w-48"
          >
            <button
              type="button"
              onClick={() => setOpenItem(null)}
              className="absolute right-1 top-1 cursor-pointer rounded-md p-1 hover:bg-gray-100"
              aria-label="Close submenu"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 pt-7">
              {activeItem.children.map((child, index) => {
                const ChildIcon = child.icon;

                if (child.route) {
                  return (
                    <Link
                      key={`${child.label}-${index}`}
                      href={child.route}
                      onClick={() => {
                        setOpenItem(null);
                        closeMobileSidebar?.();
                      }}
                      className="flex w-full items-center gap-2 rounded-md bg-gray-50/50 px-2 py-2 text-left hover:bg-gray-200"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                        <ChildIcon size={15} />
                      </span>

                      <span className="text-sm">{child.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={`${child.label}-${index}`}
                    onClick={() => {
                      setOpenItem(null);
                      console.log(`${child.label} clicked`);
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-gray-50/50 px-2 py-2 text-left hover:bg-gray-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                      <ChildIcon size={15} />
                    </span>

                    <span className="text-sm">{child.label}</span>
                  </button>
                );
              })}

              {activeItem.label === "Pages" && (
                <button
                  type="button"
                  onClick={() => setShowPageModal(true)}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                >
                  <Plus size={15} />
                  Add More
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add page modal */}
      {showPageModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowPageModal(false)}
        >
          <div
            className="w-[90%] max-w-md rounded-xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Page
              </h2>

              <button
                type="button"
                onClick={() => setShowPageModal(false)}
                className="cursor-pointer rounded-full bg-gray-100 p-1 hover:bg-gray-200"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <input
              value={pageName}
              onChange={(event) => setPageName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddPage();
                }
              }}
              placeholder="Enter page name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={handleAddPage}
              disabled={!pageName.trim()}
              className="mt-4 w-full cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Add Page
            </button>
          </div>
        </div>
      )}
    </>
  );
}
