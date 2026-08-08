import Link from "next/link";
import { Palette, Settings, Users } from "lucide-react";

import { PageHeader } from "@/components/shared";

const items = [
  {
    href: "/partner/clients",
    label: "Clients",
    detail: "Create CVs and manage claim links",
    icon: Users,
  },
  {
    href: "/partner/resources",
    label: "Resources",
    detail: "Brand files, approved copy, and guidance",
    icon: Palette,
  },
  {
    href: "/partner/settings",
    label: "Settings",
    detail: "Public profile, notifications, and checks",
    icon: Settings,
  },
];

export default function MorePage() {
  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Workspace"
        title="More"
        description="The remaining tools in your partner workspace."
      />
      <div className="grid gap-3">
        {items.map(({ href, label, detail, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="focus-ring flex min-h-20 items-center gap-4 rounded-2xl border bg-white p-4"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-[#eee9ff] text-[#5a2aff]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <strong className="block">{label}</strong>
              <span className="text-sm text-[#6b7280]">{detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
