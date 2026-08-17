"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, Variants } from "framer-motion";
import { SectionProps } from "../../../types/section";
import Image from "next/image";

export default function Collection1({ data = {} }: SectionProps) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedItem) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelectedItem(null);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedItem]);

    const containerVariants: Variants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="w-full bg-[#fbfaf6] px-8 md:px-24 py-10 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto"
                >
                    {data.pretitle && (
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="w-6 h-[1.5px] bg-[#c03a2b]"></span>
                            <span className="text-[#c03a2b] text-[10px] tracking-[0.15em] uppercase font-semibold">
                                {data.pretitle}
                            </span>
                            <span className="w-6 h-[1.5px] bg-[#c03a2b]"></span>
                        </div>
                    )}
                    {data.title && (
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a] mb-6 leading-tight">
                            {data.title}
                        </h2>
                    )}
                    {data.desc && (
                        <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed tracking-wide font-light">
                            {data.desc}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {data.collectionItems?.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            role="button"
                            tabIndex={0}
                            aria-label={`Enquire about ${item.title || "this collection item"}`}
                            className="group/collection-card relative overflow-hidden cursor-pointer aspect-[3/4] bg-[#e8e4db]"
                            onClick={() => setSelectedItem(item.title || "Collection item")}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    setSelectedItem(item.title || "Collection item");
                                }
                            }}
                        >
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-1000 group-hover/collection-card:scale-110"
                                />
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/collection-card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <div className="transform translate-y-4 group-hover/collection-card:translate-y-0 transition-transform duration-500">
                                    <span className="text-[#cfa94e] text-[10px] tracking-[0.2em] uppercase mb-2 block font-semibold drop-shadow-md">
                                        {item.brand}
                                    </span>
                                    <h3 className="text-2xl font-serif text-white mb-2 drop-shadow-md">
                                        {item.title}
                                    </h3>
                                    {item.desc && (
                                        <p className="text-white/70 text-[13px] tracking-wide leading-relaxed font-light line-clamp-2">
                                            {item.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {selectedItem &&
                typeof document !== "undefined" &&
                createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[2px] sm:p-6"
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="collection-enquiry-title"
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(event) => event.stopPropagation()}
                            className="relative w-full max-w-lg bg-[#fbfaf6] p-7 shadow-2xl sm:p-10"
                        >
                            <button
                                type="button"
                                aria-label="Close enquiry form"
                                onClick={() => setSelectedItem(null)}
                                className="absolute right-5 top-4 text-3xl font-light leading-none text-black/50 transition-colors hover:text-black"
                            >
                                ×
                            </button>

                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c03a2b]">
                                Collection enquiry
                            </p>
                            <h2
                                id="collection-enquiry-title"
                                className="mb-2 pr-8 font-serif text-3xl text-[#1a1a1a]"
                            >
                                Enquire about this item
                            </h2>
                            <p className="mb-8 text-sm text-gray-500">{selectedItem}</p>

                            <form
                                className="space-y-5"
                                onSubmit={(event) => event.preventDefault()}
                            >
                                <label className="block">
                                    <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-gray-600">
                                        Name
                                    </span>
                                    <input
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="w-full border border-[#d8d3c9] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a1a1a]"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-gray-600">
                                        Email
                                    </span>
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full border border-[#d8d3c9] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a1a1a]"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-gray-600">
                                        Number
                                    </span>
                                    <input
                                        name="number"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        required
                                        className="w-full border border-[#d8d3c9] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a1a1a]"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-gray-600">
                                        Address
                                    </span>
                                    <textarea
                                        name="address"
                                        rows={3}
                                        autoComplete="street-address"
                                        required
                                        className="w-full resize-none border border-[#d8d3c9] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a1a1a]"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    className="w-full bg-[#1a1a1a] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c03a2b]"
                                >
                                    Submit enquiry
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>,
                    document.body,
                )}
        </section>
    );
}
