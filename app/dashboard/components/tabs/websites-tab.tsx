import Image from "next/image";
import Link from "next/link";
import { Globe2, Plus } from "lucide-react";
import TemplateActions from "../template-actions";

const websites = [
  { name: "Blackbay Studio", image: "/blackbaypreview.png", status: "Published", category: "Business", templateId: "template-1", previewHref: "/published/template-1-business-77fa7a1c" },
  { name: "Haelli Homes", image: "/haellipreview.png", status: "Draft", category: "Realestate", templateId: "template-1", previewHref: "/published/template-4-realestate-be551931" },
  { name: "Shaye School", image: "/shayepreview.png", status: "Published", category: "School", templateId: "template-2", previewHref: "/published/template-2-school-a5c425ed" },
];

export default function WebsitesTab() {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-6 py-8 lg:px-9">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight">My Websites</h2><p className="mt-1 text-xs text-zinc-500">Manage drafts and published websites.</p></div>
        <Link href="/" className="flex h-10 items-center gap-2 rounded-xl bg-blue-700 px-4 text-xs font-medium text-white"><Plus size={16} /> New website</Link>
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {websites.map((site) => (
          <article key={site.name} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-48 overflow-hidden bg-zinc-100">
              <Image src={site.image} alt={`${site.name} preview`} fill className="object-cover object-top transition duration-500 hover:scale-[1.02]" />
            </div>
            <div className="flex h-[68px] items-center gap-3 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700"><Globe2 size={18} /></span>
              <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium group-hover:text-blue-700">{site.name}</h3><p className="mt-1 text-[10px] text-zinc-500">{site.category}</p></div>
              <span className={`rounded-full px-2 py-1 text-[9px] ${site.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{site.status}</span>
              <TemplateActions name={site.name} editorHref={`/editor/layout?templateId=${site.templateId}&category=${site.category}`} previewHref={site.previewHref} previewImage={site.image} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
