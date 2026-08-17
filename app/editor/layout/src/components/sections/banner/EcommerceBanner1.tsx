import Link from "next/link";
import Image from "next/image";
import { SectionProps } from "../../../types/section";

export default function EcommerceBanner1({ data = {} }: SectionProps) {
    return (
        <section
            className="relative flex w-full flex-col items-start justify-center overflow-hidden px-8 text-left md:px-24"
            style={{ minHeight: `${data.bannerHeight ?? 70}dvh` }}
        >
            {data?.backgroundImage && (
                <Image
                    src={data.backgroundImage}
                    alt="Banner Background"
                    fill
                    priority
                    className="z-0 object-cover"
                />
            )}

            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/45 to-transparent"></div>

            <div className="relative z-20 flex flex-col items-start max-w-3xl text-white mt-16">
                {data.pretitle && (
                    <span className="text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
                        {data.pretitle}
                    </span>
                )}

                {data.title && (
                    <h1 className="mb-6 max-w-4xl font-serif text-4xl italic leading-tight tracking-wide text-[#e8c56a] md:text-6xl lg:text-7xl">
                        {data.title}
                    </h1>
                )}

                {data.desc && (
                    <p className="mb-10 max-w-2xl text-sm font-light text-gray-200 md:text-lg">
                        {data.desc}
                    </p>
                )}

                {data.buttons && data.buttons.length > 0 && (
                    <div className="flex flex-wrap justify-start gap-4">
                        {data.buttons.map((btn, index) => (
                            <Link
                                key={index}
                                href={btn.href}
                                className={
                                    btn.variant === "primary"
                                        ? "bg-[#c03a2b] text-white px-8 py-4 text-[10px] tracking-[0.15em] uppercase hover:bg-[#d95345] transition-colors"
                                        : "border border-white text-white px-8 py-4 text-[10px] tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors"
                                }
                            >
                                {btn.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
