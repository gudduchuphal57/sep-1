import React from "react";
import type { SectionProps } from "../../../types/section";

export default function Marquee1({ data = {} }: SectionProps) {
    const items = data.text || [];

    return (
        <section className="w-full bg-[#eeeadd] py-3 overflow-hidden flex items-center border-b border-[#e2dcc8]">
            <div className="flex w-max whitespace-nowrap animate-marquee">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <span className="text-[#999285] text-xs md:text-sm tracking-[0.2em] px-8 uppercase font-medium">
                                    {item}
                                </span>
                                <span className="text-[#cfa94e] text-[10px] px-2">◆</span>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}