"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  ["AI Builder", "#workflow"],
  ["Templates", "#studio"],
  ["Solutions", "#crew"],
  ["Resources", "#workflow"],
  ["Pricing", "#studio"],
];

export default function HomeNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 sm:px-8 2xl:max-w-[1580px]">
        <Link
          href="/"
          aria-label="Lestow home"
          className="relative block h-10 w-[132px] shrink-0 brightness-0 invert"
        >
          <Image
            src="/lestow-logo.svg"
            alt="Lestow AI Website Builder"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/auth"
            className="rounded-lg bg-white px-8 py-3 text-[14px] font-medium text-[#173fdb] shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[#dfffb7] hover:text-black"
          >
            Sign up
          </Link>
          <Link
            href="/auth"
            className="text-[13px] font-medium bg-black text-white hover:text-white px-8 py-3 rounded-lg transition hover:-translate-y-0.5 hover:bg-black/70"
          >
            Get Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-lg border border-white/20 bg-white/10 lg:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {open && (
        <div className="mx-3 grid gap-1 rounded-b-2xl border border-t-0 border-white/15 bg-[#173fdb]/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/10"
            >
              {label}
            </a>
          ))}
          <Link
            href="/auth"
            className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[#173fdb]"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
