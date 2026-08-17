import Link from "next/link";
import {
  LayoutDashboard,
  PanelLeftClose,
  LogOut,
  PanelLeftOpen,
  Shapes,
  UserRound,
  Gem,
  ReceiptText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BrandLogo from "../../../components/ui/brand-logo";

export type DashboardTab =
  | "Dashboard"
  | "My Websites"
  | "Plan"
  | "Billing"
  | "Profile"

type SidebarProps = {
  activeTab: DashboardTab;
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
  onSelect: (tab: DashboardTab) => void;
};

type NavItem = { label: DashboardTab; icon: LucideIcon };

const mainItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Profile", icon: UserRound },
  { label: "My Websites", icon: Shapes },
  { label: "Plan", icon: Gem },
  { label: "Billing", icon: ReceiptText },
];

const supportItems: NavItem[] = [];

export default function Sidebar({
  activeTab,
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
  onSelect,
}: SidebarProps) {
  const compact = collapsed && !mobileOpen;

  const renderItem = ({ label, icon: Icon }: NavItem) => {
    const active = activeTab === label;

    return (
      <button
        key={label}
        type="button"
        title={compact ? label : undefined}
        onClick={() => onSelect(label)}
        className={`flex h-11 w-full cursor-pointer items-center rounded-xl transition-colors ${compact ? "justify-center px-0" : "gap-3 px-3"
          } ${active ? "bg-white text-blue-700 shadow-[0_5px_22px_rgba(55,48,80,0.08)]" : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950"}`}
      >
        <Icon size={19} strokeWidth={1.8} />
        {!compact && <span className="text-sm">{label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[10000] flex h-dvh w-[min(86vw,300px)] min-w-0 flex-col overflow-hidden rounded-r-2xl border-r border-zinc-200/80 bg-[linear-gradient(180deg,#f6f9ff_0%,#f8fbff_62%,#ffffff_100%)] shadow-[18px_0_55px_rgba(15,23,42,.22)] transition-transform duration-300 md:relative md:z-30 md:w-auto md:translate-x-0 md:rounded-none md:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div
        className={`flex h-[72px] shrink-0 items-center ${compact ? "justify-center" : "justify-between px-5"}`}
      >
        <button
          type="button"
          onClick={() => onSelect("Dashboard")}
          aria-label="Dashboard home"
          className="flex cursor-pointer items-center gap-2.5 border-0 bg-transparent"
        >
          {!compact ? (
            <BrandLogo className="origin-left scale-90" />
          ) : (
            <BrandLogo compact />
          )}
        </button>

        {!compact && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
            className="hidden size-9 cursor-pointer place-items-center rounded-lg text-zinc-500 hover:bg-white hover:text-zinc-950 md:grid"
          >
            <PanelLeftClose size={19} />
          </button>
        )}
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close sidebar"
          className="grid size-9 place-items-center rounded-lg text-xl text-zinc-500 hover:bg-white md:hidden"
        >
          ×
        </button>
      </div>

      {compact && (
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Expand sidebar"
          className="mx-auto mb-4 hidden size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 hover:bg-white hover:text-zinc-950 md:grid"
        >
          <PanelLeftOpen size={19} />
        </button>
      )}

      <nav
        className={`flex min-h-0 flex-1 flex-col ${compact ? "px-2.5" : "px-4"}`}
      >
        <div className="space-y-1">{mainItems.map(renderItem)}</div>
        <div className="mt-auto space-y-1 pb-5">
          {supportItems.map(renderItem)}
          <Link href="/auth" title={compact ? "Log out" : undefined}
            className={`flex h-11 w-full cursor-pointer items-center rounded-xl text-red-600 transition-colors bg-red-50 hover:text-red-600 ${compact ? "justify-center px-0" : "gap-3 px-3"
              }`}>
            <LogOut size={19} />

            {!compact && <span className="text-sm">Log out</span>}
          </Link>

        </div>
      </nav>
    </aside>
  );
}
