import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionProps } from "./../../../types/section";

export default function ContactPageTwo({ data = {} }: SectionProps) {
  const contact = data.footerContact;
  const fields = data.formFields ?? [];

  return (
    <main className="bg-slate-950 text-white">
      <section data-editor-section-label="Contact Details and Form" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
              {data.pretitle}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {data.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              {data.desc}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {contact?.location && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <MapPin className="text-blue-300" size={22} />
                <p className="mt-4 text-sm text-slate-300">{contact.location}</p>
              </div>
            )}
            {contact?.email && (
              <Link
                href={`mailto:${contact.email}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <Mail className="text-blue-300" size={22} />
                <p className="mt-4 text-sm text-slate-300">{contact.email}</p>
              </Link>
            )}
            {contact?.phone && (
              <Link
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <Phone className="text-blue-300" size={22} />
                <p className="mt-4 text-sm text-slate-300">{contact.phone}</p>
              </Link>
            )}
          </div>
        </div>

        <form className="mt-12 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-2">
          {fields.map((field, index) =>
            field.type === "textarea" ? (
              <textarea
                key={`${field.label}-${index}`}
                placeholder={field.placeholder}
                className="h-32 resize-none rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none md:col-span-2"
              />
            ) : (
              <input
                key={`${field.label}-${index}`}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                className="h-12 rounded-xl border border-white/10 bg-white px-4 text-sm text-slate-950 outline-none"
              />
            ),
          )}
          <button
            type="button"
            className="h-12 rounded-xl bg-blue-500 px-5 text-sm font-bold text-white md:col-span-2"
          >
            {data.formSubmitLabel}
          </button>
        </form>
      </section>
    </main>
  );
}
