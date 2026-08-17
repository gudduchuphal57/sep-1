"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionProps } from "../../../types/section";

export default function BusinessContactPage1({ data = {} }: SectionProps) {
    return (
        <section className="w-full bg-[#fbfaf6] px-8 md:px-24 py-10 overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
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

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="w-full lg:w-1/2 bg-white p-8 md:p-12 shadow-sm border border-[#e8e4db]"
                    >
                        <form className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium">Name</label>
                                <input type="text" className="w-full border-b border-gray-300 py-3 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors bg-transparent" placeholder="Your full name" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium">Email</label>
                                <input type="email" className="w-full border-b border-gray-300 py-3 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors bg-transparent" placeholder="Your email address" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium">Message</label>
                                <textarea rows={4} className="w-full border-b border-gray-300 py-3 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors bg-transparent resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="button" className="mt-4 bg-[#1a1a1a] text-white px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-[#cfa94e] transition-colors duration-300 w-full md:w-auto self-start">
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    {/* Right Column: Contact Info & Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        className="w-full lg:w-1/2 flex flex-col gap-10"
                    >
                        {data.contactInfo && (
                            <div className="flex flex-col gap-8">
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium mb-3">Address</h4>
                                    <p className="text-[15px] text-[#1a1a1a] leading-relaxed font-serif">
                                        {data.contactInfo.address}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div>
                                        <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium mb-3">Phone</h4>
                                        <p className="text-[15px] text-[#1a1a1a] font-serif">{data.contactInfo.phone}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-medium mb-3">Email</h4>
                                        <p className="text-[15px] text-[#1a1a1a] font-serif">{data.contactInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {data.mapUrl && (
                            <div className="w-full h-[300px] bg-[#e8e4db] overflow-hidden">
                                <iframe
                                    src={data.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Map Location"
                                    className="w-full h-full grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                                ></iframe>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}