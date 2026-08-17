import Image from "next/image";
import Link from "next/link";

import type { SectionProps } from "../../../types/section";

export default function BusinessFooter1({ data = {} }: SectionProps) {
  const navigationLinks =
    data.footerColumns?.flatMap((column) => column.links) ?? [];
  const contact = data.footerContact;
  const logoText = data.logo ?? data.logoImageTitle;
  const footerBackground =
    data.footerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${data.footerBackgroundColor ?? "#f4f2ef"
      }, ${data.footerGradientColor ?? "#e8e2d8"})`
      : (data.footerBackgroundColor ?? "#f4f2ef");

  return (
    <footer
      className="flex w-full flex-col px-8 py-12 md:px-24"
      style={{
        background: footerBackground,
        color: data.footerTextColor ?? "#111827",
      }}
    >
      <div className="mb-12 flex w-full items-center justify-center">
        <div className="flex-grow border-t border-[#e2dcc8]" />
        {data.desc && (
          <span className="max-w-2xl px-6 text-center text-xs uppercase tracking-[0.2em] text-[#9a7a31]">
            {data.desc}
          </span>
        )}
        <div className="flex-grow border-t border-[#e2dcc8]" />
      </div>

      <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="flex items-center gap-3">
          {data.logoImage && (
            <Image
              src={data.logoImage}
              alt={data.logoImageTitle ?? data.logo ?? "Business logo"}
              width={128}
              height={48}
              sizes="128px"
              unoptimized={data.logoImage.startsWith("data:")}
              className="h-12 w-32 object-contain object-left"
              data-editor-media
              data-editor-media-type="image"
              data-editor-media-src={data.logoImage}
            />
          )}
          {!data.logoImage && logoText && (
            <span className="text-xl font-medium tracking-widest">
              {logoText}
            </span>
          )}


        </div>

        {navigationLinks.length > 0 && (
          <nav
            className="flex flex-wrap items-center justify-center gap-6 lg:gap-8"
            aria-label="Footer navigation"
          >
            {navigationLinks.map((link, index) => (
              <Link
                key={`${link.label}-${link.href}-${index}`}
                href={link.href}
                className="text-[13px] text-gray-500 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-col flex-wrap items-center justify-center gap-4">
          {contact && (
            <div className="flex flex-col flex-wrap items-center justify-center gap-2 text-[13px] text-gray-500">
              <div>
                Email: {contact.email && (
                  <Link
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-black"
                  >
                    {contact.email}
                  </Link>
                )}
              </div>
              <div>
                Number: {contact.phone && (
                  <Link
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-black"
                  >
                    {contact.phone}
                  </Link>
                )}
              </div>
            </div>
          )}






        </div>
      </div>


      {data.copyrightText && (
        <div className="mt-10 w-full text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
            {data.copyrightText}
          </p>
        </div>
      )}
    </footer>
  );
}
