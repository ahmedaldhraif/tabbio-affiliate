import type { LucideIcon } from "lucide-react";

import { Card } from "@refref/ui/components/card";

export function DemoNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-[#eceef0] bg-[#fafafa] px-3 py-2 text-xs text-[#6b7280] ${className}`}
      role="status"
    >
      <span
        className="mt-1 size-2 shrink-0 rounded-full bg-[#5a2aff]"
        aria-hidden="true"
      />
      <span className="min-w-0 break-words">
        <strong className="text-[#512eff]">Demo data</strong> · Local simulation
        only. Nothing here is connected, submitted, tracked, or paid.
      </span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 border-b border-[#eceef0] pb-6 lg:flex-row lg:items-center">
      <div className="max-w-2xl">
        {eyebrow && <p className="sr-only">{eyebrow}</p>}
        <h1 className="text-[clamp(2rem,4vw,2.35rem)] font-medium leading-[1.12] tracking-[-.03em]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#788195]">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <Card
      className={`min-h-36 gap-3 rounded-2xl p-6 shadow-none ${accent ? "brand-gradient border-transparent text-white" : "border-[#e5e7eb] bg-[#fafafa]"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-sm font-medium ${accent ? "text-white/85" : "text-[#788195]"}`}
        >
          {label}
        </p>
        <span className="sr-only">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="tabular text-[clamp(2rem,3vw,2.7rem)] font-medium tracking-[-.035em]">
        {value}
      </p>
      <p
        className={`text-xs leading-5 ${accent ? "text-white/75" : "text-[#8a93a3]"}`}
      >
        {note}
      </p>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = /paid|payable|claimed|active/i.test(status)
    ? "bg-[#eaf7ef] text-[#28744f]"
    : /held|pending|viewed|demo/i.test(status)
      ? "bg-[#fff6df] text-[#8a6415]"
      : /reversed|expired|archived/i.test(status)
        ? "bg-[#f3f4f6] text-[#5e6470]"
        : "bg-[#eee9ff] text-[#4b23c6]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#d8dbe1] bg-white p-8 text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

export function ScenarioState() {
  return (
    <details className="fixed bottom-24 right-4 z-40 hidden max-w-xs rounded-xl border bg-white p-3 text-xs shadow-xl xl:block">
      <summary className="cursor-pointer font-semibold">
        Prototype states
      </summary>
      <p className="mt-2 leading-5 text-[#6b7280]">
        Append <code>?state=empty</code>, <code>loading</code>,{" "}
        <code>error</code>, <code>overflow</code>, or <code>rtl</code> to
        inspect UI states.
      </p>
    </details>
  );
}
