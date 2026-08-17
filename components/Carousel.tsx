"use client";

import {
    Children,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export type CarouselController = {
    activeIndex: number;
    slideNext: () => void;
    slidePrev: () => void;
};

type CarouselProps = {
    children: ReactNode;
    withNav?: boolean;
    /** Wider cards (default) or compact team avatars. */
    density?: "cards" | "compact";
    spaceBetween?: number;
    className?: string;
    slideClassName?: string;
    prevLabel?: string;
    nextLabel?: string;
    onSlideChange?: (index: number) => void;
    onSwiper?: (carousel: CarouselController) => void;
};

export default function Carousel({
    children,
    withNav = false,
    density = "cards",
    spaceBetween = 16,
    className = "",
    slideClassName = "",
    prevLabel = "Previous",
    nextLabel = "Next",
    onSlideChange,
    onSwiper,
}: CarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = Children.toArray(children);

    const move = useCallback((direction: -1 | 1) => {
        const track = trackRef.current;
        const slide = track?.firstElementChild as HTMLElement | null;
        if (!track || !slide) return;
        track.scrollBy({
            left: direction * (slide.offsetWidth + spaceBetween),
            behavior: "smooth",
        });
    }, [spaceBetween]);

    useEffect(() => {
        onSwiper?.({
            activeIndex,
            slideNext: () => move(1),
            slidePrev: () => move(-1),
        });
    }, [activeIndex, move, onSwiper]);

    if (slides.length === 0) return null;

    const widthClass = density === "compact"
        ? "basis-[66.667%] sm:basis-[33.333%] md:basis-1/4 xl:basis-1/5"
        : "basis-[86.957%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4";

    return (
        <div className={`relative ${className}`}>
            <div
                ref={trackRef}
                className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ gap: spaceBetween }}
                onScroll={(event) => {
                    const track = event.currentTarget;
                    const first = track.firstElementChild as HTMLElement | null;
                    if (!first) return;
                    const index = Math.round(track.scrollLeft / (first.offsetWidth + spaceBetween));
                    if (index !== activeIndex) {
                        setActiveIndex(index);
                        onSlideChange?.(index);
                    }
                }}
            >
                {slides.map((child, index) => (
                    <div
                        key={index}
                        className={`h-auto shrink-0 snap-start ${widthClass} ${slideClassName}`}
                    >
                        <div className="h-full">{child}</div>
                    </div>
                ))}
            </div>

            {withNav && slides.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label={prevLabel}
                        onClick={() => move(-1)}
                        className="absolute left-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#141414]/10 bg-white/95 text-[#141414] shadow-[0_8px_24px_rgba(20,20,20,0.12)] transition hover:bg-[#141414] hover:text-white md:flex"
                    >
                        <FaArrowLeft className="text-xs" />
                    </button>
                    <button
                        type="button"
                        aria-label={nextLabel}
                        onClick={() => move(1)}
                        className="absolute right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#141414]/10 bg-white/95 text-[#141414] shadow-[0_8px_24px_rgba(20,20,20,0.12)] transition hover:bg-[#141414] hover:text-white md:flex"
                    >
                        <FaArrowRight className="text-xs" />
                    </button>
                </>
            )}
        </div>
    );
}
