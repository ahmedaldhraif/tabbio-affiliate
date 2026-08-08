"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FileText,
  Home,
  Link2,
  MoreHorizontal,
  Palette,
  Plus,
  RotateCcw,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import { Suspense, useEffect } from "react";

import { Button } from "@refref/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@refref/ui/components/tooltip";
import { toast } from "sonner";

import { BrandMark } from "@/components/brand-mark";
import { DemoNotice, ScenarioState } from "@/components/shared";
import { useDemo } from "@/components/demo-provider";

const routes = [
  { href: "/partner", label: "Overview", icon: Home, exact: true },
  {
    href: "/partner/clients",
    label: "CV Builder",
    mobileLabel: "Clients",
    icon: Users,
    exact: false,
  },
  {
    href: "/partner/create",
    label: "Content Builder",
    mobileLabel: "Create",
    icon: FileText,
    exact: false,
  },
  { href: "/partner/links", label: "Links", icon: Link2, exact: false },
  {
    href: "/partner/earnings",
    label: "Earnings",
    icon: WalletCards,
    exact: false,
  },
  {
    href: "/partner/resources",
    label: "Resources",
    icon: Palette,
    exact: false,
  },
  {
    href: "/partner/settings",
    label: "Settings",
    icon: Settings,
    exact: false,
  },
] as const;
const mobileMain = routes.filter((route) =>
  ["Overview", "Content Builder", "Links", "Earnings"].includes(route.label),
);

function StateController() {
  const params = useSearchParams();
  useEffect(() => {
    document.documentElement.dir =
      params.get("state") === "rtl" ? "rtl" : "ltr";
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [params]);
  return null;
}

export function PartnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo, settings } = useDemo();
  const partnerInitials = settings.publicName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
  const mobileMoreActive = [
    "/partner/clients",
    "/partner/resources",
    "/partner/settings",
    "/partner/more",
  ].some((href) => pathname === href || pathname.startsWith(`${href}/`));

  // Direction contract: this product is a left-to-right partner workspace by default.
  // In RTL prototype mode the document direction flips, navigation order stays logical,
  // and copy/data remain readable. Brand marks and numeric metrics are not mirrored.
  // Directional chevrons should follow the inherited inline direction.
  return (
    <TooltipProvider>
      <Suspense>
        <StateController />
      </Suspense>
      <div className="min-h-screen bg-[#f4f4f4] min-[840px]:p-2">
        <aside className="fixed inset-y-2 left-2 z-30 hidden w-[240px] flex-col rounded-[20px] border border-[#e9e9e9] bg-[#fafafa] px-4 py-5 min-[840px]:flex">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BrandMark compact />
              <span className="rounded-full border border-[#d1d5db] bg-[#eff2f5] px-3 py-1 text-xs font-medium text-[#4a4a4d]">
                Partner
              </span>
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-11 rounded-full border border-[#e5e7eb] text-[#687080] hover:bg-white"
            >
              <Link href="/partner/create" aria-label="Create partner content">
                <Plus className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <nav
            className="mt-8 flex flex-1 flex-col gap-1"
            aria-label="Partner workspace"
          >
            {routes.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                aria-current={active(href, exact) ? "page" : undefined}
                className={`focus-ring flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-medium transition-colors ${active(href, exact) ? "bg-[#eee9ff] text-[#512eff]" : "text-[#4a4a4d] hover:bg-white hover:text-[#2b2b2b]"}`}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="space-y-2 border-t border-[#eceef0] pt-4">
            <div className="flex min-h-11 items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-2">
              <span className="grid size-9 place-items-center rounded-full bg-[#241153] text-xs font-bold text-white">
                {partnerInitials || "YP"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {settings.publicName}
                </p>
                <p className="text-xs text-[#8a93a3]">Partner account</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="min-h-11 w-full justify-start rounded-xl text-[#6b7280]"
                  onClick={() => {
                    resetDemo();
                    toast.success("Local demo reset");
                  }}
                >
                  <RotateCcw />
                  Reset demo
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Restore the deterministic fixtures
              </TooltipContent>
            </Tooltip>
          </div>
        </aside>
        <div className="min-h-[calc(100vh-16px)] bg-white min-[840px]:ml-[248px] min-[840px]:rounded-[20px]">
          <div className="border-b border-[#eceef0] px-4 py-3 min-[840px]:hidden">
            <div className="flex items-center justify-between">
              <BrandMark />
              <span className="rounded-full bg-[#f1edff] px-3 py-1 text-xs font-semibold text-[#4b24c5]">
                Demo mode
              </span>
            </div>
          </div>
          <div className="px-4 pt-4 min-[840px]:px-8 min-[840px]:pt-5">
            <DemoNotice />
          </div>
          <main id="main-content">{children}</main>
        </div>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#e5e7eb] bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur min-[840px]:hidden"
        aria-label="Partner mobile navigation"
      >
        {mobileMain.map(({ href, label, icon: Icon, exact, ...route }) => (
          <Link
            key={href}
            href={href}
            aria-current={active(href, exact) ? "page" : undefined}
            className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold ${active(href, exact) ? "bg-[#eee9ff] text-[#4b23c6]" : "text-[#6b7280]"}`}
          >
            <Icon className="size-5" aria-hidden="true" />
            {"mobileLabel" in route ? route.mobileLabel : label}
          </Link>
        ))}
        <Link
          href="/partner/more"
          aria-current={mobileMoreActive ? "page" : undefined}
          className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold ${mobileMoreActive ? "bg-[#eee9ff] text-[#4b23c6]" : "text-[#6b7280]"}`}
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
          More
        </Link>
      </nav>
      <ScenarioState />
    </TooltipProvider>
  );
}
