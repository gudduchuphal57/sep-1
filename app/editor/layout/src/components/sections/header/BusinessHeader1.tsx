"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";

const getPageLabelFromHref = (href: string, fallback: string) => {
    const normalizedHref = href.trim();

    if (!normalizedHref || normalizedHref === "#") return fallback;
    if (normalizedHref === "/") return "Home";

    const pagePath = normalizedHref
        .replace(/^#/, "")
        .replace(/^\/+/, "")
        .split(/[?#]/, 1)[0];

    if (!pagePath) return fallback;

    return pagePath
        .replace(/\/+$/, "")
        .split("/")
        .pop()!
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const scrollTemplateToTop = () => {
    const scrollContainer = document.querySelector<HTMLElement>(
        "[data-template-scroll]",
    );

    if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Header1({
    data = {},
    solidBackground = false
}: SectionProps & { solidBackground?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const preview = useOptionalPreview();
    const [editorFrame, setEditorFrame] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);

    useEffect(() => {
        const scrollContainer = document.querySelector<HTMLElement>(
            "[data-template-scroll]",
        );
        const scrollTarget: Window | HTMLElement = scrollContainer ?? window;
        const updateHeader = () => {
            const scrollTop = scrollContainer?.scrollTop ?? window.scrollY;

            setIsScrolled(scrollTop > 50);
        };
        const updateEditorFrame = () => {
            if (!scrollContainer) {
                setEditorFrame(null);
                return;
            }

            const bounds = scrollContainer.getBoundingClientRect();

            setEditorFrame({
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
            });
        };

        updateHeader();
        updateEditorFrame();
        scrollTarget.addEventListener("scroll", updateHeader, {
            passive: true,
        });
        window.addEventListener("resize", updateEditorFrame);

        const resizeObserver = scrollContainer
            ? new ResizeObserver(updateEditorFrame)
            : null;

        if (scrollContainer) resizeObserver?.observe(scrollContainer);

        return () => {
            scrollTarget.removeEventListener("scroll", updateHeader);
            window.removeEventListener("resize", updateEditorFrame);
            resizeObserver?.disconnect();
        };
    }, []);

    const handlePageClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
        label: string,
    ) => {
        if (!preview) return;

        event.preventDefault();
        preview.setCurrentPage(getPageLabelFromHref(href, label));
        setIsOpen(false);
        scrollTemplateToTop();
    };
    const isActive =
        isScrolled ||
        solidBackground ||
        Boolean(preview?.currentPage && preview.currentPage !== "Home");

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 px-10 py-5 flex items-center justify-between font-sans transition-all duration-300 ${isActive
                ? "bg-[#f4f2ef] text-black shadow-sm"
                : "bg-transparent text-white"
                }`}
            style={
                editorFrame
                    ? {
                        top: editorFrame.top,
                        left: editorFrame.left,
                        width: editorFrame.width,
                    }
                    : undefined
            }
        >
            <div className="flex items-center gap-3">
                {data.logoImage && (
                    <Image
                        src={data.logoImage}
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain transition-all duration-300"
                    />
                )}
                <span className="text-xl font-medium tracking-widest">{data.logo}</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.15em] uppercase">
                {data.menu?.map((item) => (
                    <Link
                        key={`${item.label}-${item.href}`}
                        href={item.href}
                        onClick={(event) =>
                            handlePageClick(event, item.href, item.label)
                        }
                        className={`transition-colors ${isActive ? "hover:text-gray-800" : "hover:text-gray-300"
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <button
                className="md:hidden z-[60] flex flex-col gap-1.5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`w-6 h-0.5 transition-all ${isActive ? "bg-black" : "bg-white"} ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                <div className={`w-6 h-0.5 transition-all ${isActive ? "bg-black" : "bg-white"} ${isOpen ? "opacity-0" : ""}`}></div>
                <div className={`w-6 h-0.5 transition-all ${isActive ? "bg-black" : "bg-white"} ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-[#f4f2ef] text-black flex flex-col items-center justify-center gap-8 text-lg uppercase tracking-[0.2em] z-50">
                    {data.menu?.map((item) => (
                        <Link
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            onClick={(event) =>
                                handlePageClick(event, item.href, item.label)
                            }
                            className="hover:text-gray-500"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}

            <div className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.15em] uppercase">
                {data.buttons?.map((btn, index) => (
                    <Link
                        key={index}
                        href={btn.href}
                        onClick={(event) =>
                            handlePageClick(event, btn.href, btn.label)
                        }
                        className={`transition-all duration-300 ${btn.variant === "primary"
                            ? isActive
                                ? "bg-[#ba3022] text-white border border-[#ba3022] px-4 py-2 hover:bg-[#9a261a]"
                                : "border border-white px-4 py-2 hover:bg-white hover:text-black"
                            : isActive
                                ? "hover:text-gray-500"
                                : "hover:text-gray-300"
                            }`}
                    >
                        {btn.label}
                    </Link>
                ))}
            </div>
        </header>
    );
}
