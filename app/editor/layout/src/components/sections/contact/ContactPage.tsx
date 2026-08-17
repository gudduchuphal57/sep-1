import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionProps } from "./../../../types/section";

export default function ContactPage({ data = {} }: SectionProps) {
  const contact = data.footerContact;
  const fields = data.formFields ?? [];
  const sideImage = data.sideImage;
  const sideImageTitle = data.sideImageTitle ?? "";

  return (
    <main className="bg-white text-slate-950">
      <section data-editor-section-label="Contact Details and Form" className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:px-8 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            {data.pretitle}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
            {data.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            {data.desc}
          </p>

          <div className="mt-8 space-y-4">
            {contact?.location && (
              <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <MapPin className="mt-1 text-blue-600" size={20} />
                <span>{contact.location}</span>
              </div>
            )}
            {contact?.email && (
              <Link
                href={`mailto:${contact.email}`}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50"
              >
                <Mail className="mt-1 text-blue-600" size={20} />
                <span>{contact.email}</span>
              </Link>
            )}
            {contact?.phone && (
              <Link
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50"
              >
                <Phone className="mt-1 text-blue-600" size={20} />
                <span>{contact.phone}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-50 p-5 shadow-xl">
          {sideImage && (
            <div className="relative mb-5 h-52 overflow-hidden rounded-2xl bg-slate-200">
              <Image
                src={sideImage}
                alt={sideImageTitle}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={sideImage}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          )}

          <form className="grid gap-3">
            {fields.map((field, index) =>
              field.type === "textarea" ? (
                <textarea
                  key={`${field.label}-${index}`}
                  placeholder={field.placeholder}
                  className="h-28 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              ) : (
                <input
                  key={`${field.label}-${index}`}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
                />
              ),
            )}
            <button
              type="button"
              className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white"
            >
              {data.formSubmitLabel}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
