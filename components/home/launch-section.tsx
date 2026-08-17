import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const deliverables = [
  "Conversion strategy",
  "Responsive pages",
  "Brand system",
  "SEO foundation",
  "Lead capture",
  "Domain publishing",
];
const sequence = [
  ["01", "Business brief"],
  ["02", "Strategy and copy"],
  ["03", "Responsive design"],
  ["04", "Domain ready"],
];

export default function LaunchSection() {
  return (
    <>
      <section className="hidden relative overflow-hidden bg-[#f4fff8] px-5 py-28 text-[#07111e] sm:px-8">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(29,78,216,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(29,78,216,.09)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div
          data-neon-orb
          className="absolute -left-28 top-6 size-[470px] rounded-full bg-cyan-300/45 blur-[105px]"
        />
        <div
          data-neon-orb
          className="absolute right-[8%] top-[-18%] size-[520px] rounded-full bg-[#b9ff66]/55 blur-[115px]"
        />
        <div
          data-neon-orb
          className="absolute bottom-[-30%] left-[42%] size-[520px] rounded-full bg-violet-300/45 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent,rgba(244,255,248,.62)_72%)]" />

        <div className="relative mx-auto max-w-[1320px]">
          <div
            data-reveal
            className="flex flex-col justify-between gap-7 border-b border-[#07111e]/12 pb-9 sm:flex-row sm:items-end"
          >
            <div>
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-blue-700">
                <span className="size-2 rounded-full bg-[#5df6d0] shadow-[0_0_16px_#5df6d0]" />
                Your AI website team is ready
              </div>
              <h2 className="mt-6 max-w-4xl text-[clamp(3.6rem,7.7vw,7.6rem)] font-semibold leading-[.84] tracking-[-.075em]">
                From first prompt to{" "}
                <span className="font-serif italic font-normal text-blue-700">
                  first customer.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#07111e]/55">
              Launch a website with the strategy, polish, and technical
              foundation to start doing business from day one.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <div
              data-reveal
              className="flex min-h-[460px] flex-col justify-between border border-white/70 bg-white/48 p-6 shadow-[0_30px_80px_rgba(52,87,130,.1)] backdrop-blur-2xl sm:p-9"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#07111e]/42">
                  Included in every build
                </p>
                <div className="mt-7 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  {deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-b border-[#07111e]/10 pb-4 text-xs font-medium"
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-[#d9ffc0] text-emerald-800">
                        <Check size={12} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 rounded-2xl bg-[#07111e] p-5 text-white">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#b9ff66] text-[#07111e]">
                    <Sparkles size={17} />
                  </span>
                  <div>
                    <p className="text-xs font-medium">
                      Built around your business
                    </p>
                    <p className="mt-1 text-[10px] text-white/45">
                      No generic copy. No locked template.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              data-launch-panel
              className="relative overflow-hidden border border-blue-200/65 bg-[linear-gradient(140deg,rgba(255,255,255,.82),rgba(232,255,245,.62),rgba(235,232,255,.72))] p-6 shadow-[0_35px_100px_rgba(45,77,150,.16)] backdrop-blur-2xl sm:p-9 lg:p-11"
            >
              <div className="absolute right-[-10%] top-[-22%] size-72 rounded-full border-[44px] border-blue-600/8" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-blue-700">
                    Start with your business, not a template
                  </p>
                  <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.14em] text-emerald-700">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    AI team online
                  </span>
                </div>
                <h3 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
                  Describe the business. Lestow will shape the website.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#07111e]/52">
                  Your goals become a focused site map, persuasive copy, a
                  consistent visual system, and a responsive website ready for
                  your domain.
                </p>
                <div className="mt-8 flex flex-col gap-3 border border-blue-200/70 bg-white/80 p-3 shadow-sm sm:flex-row sm:items-center">
                  <div className="flex-1 px-2 py-3 text-sm text-[#07111e]/45">
                    Example: A lead-generating website for my architecture
                    studio...
                  </div>
                  <Link
                    href="/auth"
                    className="group flex h-12 shrink-0 items-center justify-center gap-3 bg-blue-700 px-6 text-sm font-semibold text-white transition hover:bg-[#07111e]"
                  >
                    Create my website{" "}
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                </div>
                <div
                  data-launch-sequence
                  className="mt-10 grid gap-3 sm:grid-cols-4"
                >
                  {sequence.map(([number, label], index) => (
                    <div
                      data-launch-step
                      key={number}
                      className="relative border-t border-[#07111e]/14 pt-4"
                    >
                      <span className="text-[9px] font-semibold text-blue-700">
                        {number}
                      </span>
                      <p className="mt-2 text-[10px] font-medium text-[#07111e]/58">
                        {label}
                      </p>
                      {index < sequence.length - 1 && (
                        <span
                          className="absolute -top-px left-0 h-px w-0 bg-blue-600"
                          data-launch-line
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 px-5 py-4 text-white sm:px-8">
        <div className="mx-auto max-w-[1320px]">
          <div className="hidden grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Image
                src="/lestow-logo.svg"
                alt="Lestow AI Website Builder"
                width={146}
                height={46}
                className="h-[46px] w-[146px] brightness-0 invert"
              />
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/42">
                The AI website builder that turns business context into
                strategy, design, copy, and a publish-ready website.
              </p>
              <Link
                href="/auth"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#b9ff66]"
              >
                Start building free <ArrowRight size={15} />
              </Link>
            </div>
            <FooterColumn
              title="Product"
              links={[
                ["AI Website Builder", "#workflow"],
                ["AI Build Crew", "#crew"],
                ["Visual Studio", "#studio"],
                ["Templates", "/dashboard"],
              ]}
            />
            <FooterColumn
              title="Resources"
              links={[
                ["Help center", "/dashboard"],
                ["Website strategy", "#workflow"],
                ["SEO essentials", "#crew"],
                ["Contact support", "/dashboard"],
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                ["Pricing", "/dashboard"],
                ["About Lestow", "/"],
                ["Sign in", "/auth"],
                ["Create account", "/auth"],
              ]}
            />
          </div>
          <div className="flex flex-col gap-4 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Copyright {new Date().getFullYear()} Lestow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-white">
                Terms & Conditions
              </Link>
              <Link href="/" className="hidden hover:text-white">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[.16em] text-white/75">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-white/38 transition hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
