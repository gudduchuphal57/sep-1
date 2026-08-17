"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TemplateActions from "../template-actions";
import SiteStatusView, { type SiteFilter } from "./site-status-view";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Layers3,
  Plus,
  Sparkles,
} from "lucide-react";

const recentSites = [
  {
    name: "Blackbay Studio",
    image: "/blackbaypreview.png",
    status: "Published",
    updated: "Edited 2 hours ago",
    editorHref: "/editor/layout?templateId=template-1&category=Business",
    previewHref: "/published/template-1-business-77fa7a1c",
  },
  {
    name: "Haelli Homes",
    image: "/haellipreview.png",
    status: "Draft",
    updated: "Edited yesterday",
    editorHref: "/editor/layout?templateId=template-1&category=Realestate",
    previewHref: "/published/template-4-realestate-be551931",
  },
  {
    name: "Shaye School",
    image: "/shayepreview.png",
    status: "Published",
    updated: "Edited 3 days ago",
    editorHref: "/editor/layout?templateId=template-2&category=School",
    previewHref: "/published/template-2-school-a5c425ed",
  },
];

const summaryCards = [
  {
    label: "Total websites",
    filter: "all" as SiteFilter,
    count: 3,
    status: "All sites",
    detail: "2 published · 1 draft",
    footer: "3 active projects",
    icon: Layers3,
    surface: "border-[#d9ddfa] bg-[#e8e9ff]",
    accent: "text-[#2563eb]",
    tagStyle: "bg-white/65 text-[#2563eb]",
  },
  {
    label: "Live websites",
    filter: "published" as SiteFilter,
    count: 2,
    status: "Published",
    detail: "Available to visitors",
    footer: "All sites online",
    icon: CheckCircle2,
    surface: "border-[#ccebdd] bg-[#dcf5e9]",
    accent: "text-[#28805b]",
    tagStyle: "bg-white/65 text-[#2d8b63]",
  },
  {
    label: "Draft websites",
    filter: "draft" as SiteFilter,
    count: 1,
    status: "In progress",
    detail: "Haelli Homes",
    footer: "Edited yesterday",
    icon: Clock3,
    surface: "border-[#f1dfc5] bg-[#faebd7]",
    accent: "text-[#b96a22]",
    tagStyle: "bg-white/65 text-[#b96a22]",
  },
];

function SummaryCard({ card, onSelect }: { card: (typeof summaryCards)[number]; onSelect: (filter: SiteFilter) => void }) {
  const Icon = card.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(card.filter)}
      className={`${card.surface} group flex cursor-pointer flex-col rounded-2xl border p-3 text-left shadow-[0_8px_24px_rgba(45,40,65,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(45,40,65,0.1)]`}
    >
      <div className="flex justify-between items-center gap-2 ">
        <span
          className={`${card.tagStyle} grid size-8 place-items-center rounded-xl`}
        >
          <Icon size={15} />
        </span>
        <span
          className={`${card.tagStyle} rounded-md px-2 py-1 text-[8px] font-semibold uppercase tracking-wide`}
        >
          {card.status}
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-end gap-2">
          <strong className={`${card.accent} text-3xl leading-none`}>
            {card.count}
          </strong>
          <h3 className={`${card.accent} pb-0.5 text-sm font-medium`}>
            {card.label}
          </h3>
        </div>
        <p className="mt-2 text-[10px] text-zinc-600">{card.detail}</p>
      </div>
      <div className="mt-3 flex items-center border-t border-white/45 pt-2">
        <span className="text-[9px] text-zinc-600">{card.footer}</span>
        <span className={`${card.accent} ml-auto flex items-center gap-1 text-[9px] font-semibold`}>View websites <ArrowRight size={11} /></span>
      </div>
    </button>
  );
}

export default function DashboardTabContent({
  userName,
  onManageWebsites,
}: {
  userName: string;
  onManageWebsites: () => void;
}) {
  const [siteFilter, setSiteFilter] = useState<SiteFilter | null>(null);

  if (siteFilter) return <SiteStatusView filter={siteFilter} onBack={() => setSiteFilter(null)} />;

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6 sm:py-7 lg:px-9 lg:py-9">
      <div className="relative isolate overflow-hidden rounded-[26px] border border-blue-100 bg-[#eef2ff] p-4 shadow-[0_20px_55px_rgba(48,75,155,.10)] sm:p-6">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45"
        >
          <source src="/a2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,.96)_0%,rgba(248,248,255,.88)_36%,rgba(231,227,255,.55)_68%,rgba(255,255,255,.75)_100%)]" />
        <div className="absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-blue-300/20 blur-xl" />

        <div className="relative max-w-md py-2 sm:py-3">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] text-blue-700 backdrop-blur">
            <Sparkles size={11} /> AI workspace ready
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-950 sm:text-3xl 2xl:text-3xl">
            Welcome back,
            <br />
            {userName.split(" ")[0] || userName}.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">
            Create with AI, manage your drafts, and publish every website from
            one smart workspace.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/"
              className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-medium text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Plus size={15} /> Create website
            </Link>
            <button
              type="button"
              onClick={onManageWebsites}
              className="flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-white/90 px-4 text-xs font-medium text-blue-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300"
            >
              <Globe2 size={15} /> Manage websites
            </button>
          </div>
        </div>

        <div className="relative mt-6 rounded-2xl border border-white/80 bg-white/55 p-2.5 shadow-[0_10px_35px_rgba(42,52,94,.08)] backdrop-blur-md sm:mt-8 sm:p-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} card={card} onSelect={setSiteFilter} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent websites</h3>
        <span className="flex items-center gap-1 text-xs text-blue-700">
          View all <ArrowRight size={14} />
        </span>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recentSites.map((site) => (
          <article
            key={site.name}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative h-44 overflow-hidden bg-zinc-100">
              <Image
                src={site.image}
                alt={`${site.name} website preview`}
                fill
                className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-zinc-950/0 transition group-hover:bg-zinc-950/10" />
            </div>
            <div className="flex h-[68px] items-center gap-3 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Globe2 size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium group-hover:text-blue-700">
                  {site.name}
                </h4>
                <p className="mt-1 text-[10px] text-zinc-500">{site.updated}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[9px] ${site.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
              >
                {site.status}
              </span>
              <TemplateActions
                name={site.name}
                editorHref={site.editorHref}
                previewHref={site.previewHref}
                previewImage={site.image}
              />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
