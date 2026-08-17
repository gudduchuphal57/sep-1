"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { SectionProps } from "../../../types/section";
import ImageModal from "../../sections/modal/ImageModal";

export default function BusinessProduct1({ data = {} }: SectionProps) {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

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
    <section className="w-full bg-[#f4f2ef] px-8 md:px-24 py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8"
        >
          <div className="max-w-2xl">
            {data.pretitle && (
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[1.5px] bg-[#c03a2b]"></span>
                <span className="text-[#c03a2b] text-[10px] tracking-[0.15em] uppercase font-semibold">
                  {data.pretitle}
                </span>
              </div>
            )}
            <h2 className="text-4xl font-serif leading-[1.1] text-[#1a1a1a] md:text-5xl lg:text-6xl">
              {data.title}{" "}
              {data.highlightedText && (
                <span className="italic text-[#cfa94e]">
                  {data.highlightedText}
                </span>
              )}
            </h2>
          </div>
          {data.productInfoDesc && (
            <div className="max-w-[280px]">
              <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed uppercase tracking-[0.1em]">
                {data.productInfoDesc}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {data.productItems?.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              variants={itemVariants}
              className="flex flex-col group cursor-pointer"
              onClick={() => {
                if (item.image) {
                  setSelectedImage({
                    url: item.image,
                    alt: item.alt ?? item.title,
                  });
                }
              }}
            >
              <div className="relative mb-5 aspect-[3/4] overflow-hidden bg-[#e8e4db]">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.alt ?? item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={item.image}
                  />
                )}
              </div>
              {item.category && (
                <span className="text-[#cfa94e] text-[9px] tracking-[0.15em] uppercase mb-2">
                  {item.category}
                </span>
              )}
              {item.title && (
                <h3 className="text-[15px] font-serif text-[#1a1a1a] mb-1">
                  {item.title}
                </h3>
              )}
              {item.price && (
                <span className="text-[#cfa94e] text-[11px] font-medium mb-3 block">
                  {item.price}
                </span>
              )}
              {item.desc && (
                <p className="text-[15px] text-gray-500 tracking-wide leading-relaxed">
                  {item.desc}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || null}
        altText={selectedImage?.alt}
      />
    </section>
  );
}
