/*
THESIS: Money stays explainable, and the next useful action never competes with the balance.
OWN-WORLD: Quiet white work surfaces, one violet earning field, thin dividers, and tabular figures.
STORY: A partner sees what is payable, understands the acquisition path, checks the trend, and resumes useful client work.
FIRST VIEWPORT: The payable balance leads at left, while one specific next task sits at right above a single three-part metric strip.
FORM: An operate-mode financial brief that rejects a wall of equal dashboard cards and inherits the established Tabbio workspace.
*/
"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MousePointerClick,
  ReceiptText,
  RefreshCw,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@refref/ui/components/dialog";
import { Skeleton } from "@refref/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@refref/ui/components/table";

import { EmptyState, PageHeader, StatusBadge } from "@/components/shared";
import { useDemo } from "@/components/demo-provider";
import {
  activity,
  balances,
  formatUsd,
  periodTotals,
  trend,
} from "@/data/demo-data";

type ActivityItem = (typeof activity)[number];

const statusMeaning: Record<string, string> = {
  Payable: "Released and eligible for a future payout batch.",
  Pending: "Posted and waiting for the current commission rule to release it.",
  Held: "Temporarily delayed for the example hold or review period.",
  Paid: "Included in a provider-confirmed and reconciled example payout.",
};

function OverviewLoading() {
  return (
    <div
      className="app-page"
      aria-busy="true"
      aria-label="Loading example partner overview"
    >
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-72 max-w-full" />
        <Skeleton className="h-5 w-[34rem] max-w-full" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_.8fr]">
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="mt-4 h-36 rounded-2xl" />
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.85fr]">
        <Skeleton className="h-[28rem] rounded-2xl" />
        <Skeleton className="h-[28rem] rounded-2xl" />
      </div>
    </div>
  );
}

function OverviewError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Partner overview"
        title="We could not load the example overview"
        description="The local prototype hit its error state. No partner or payment data was changed."
      />
      <Card className="items-start gap-4 rounded-2xl border-[#ead8dc] bg-[#fff8f8] p-6 shadow-none">
        <span className="grid size-11 place-items-center rounded-xl bg-white text-[#a13246]">
          <RefreshCw className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            Example data is temporarily unavailable
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b4d54]">
            Retry this screen or remove <code>?state=error</code> from the URL.
            A real product would also preserve the last reconciled balance.
          </p>
        </div>
        <Button className="h-11 rounded-xl" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Retry example
        </Button>
      </Card>
    </div>
  );
}

function EarningsTrend() {
  const maximum = Math.max(...trend.map((point) => point.value));

  return (
    <section
      className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6"
      aria-labelledby="trend-title"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-[#5a2aff]">Example trend</p>
          <h2
            id="trend-title"
            className="mt-1 text-xl font-semibold tracking-[-.02em]"
          >
            Monthly payable commission
          </h2>
          <p
            id="trend-summary"
            className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]"
          >
            The example balance rises from {formatUsd(trend[0].value)} in March
            to {formatUsd(trend.at(-1)?.value ?? 0)} in August, with one dip in
            May.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#f1edff] px-3 py-1.5 text-xs font-semibold text-[#4b23c6]">
          USD · Mar to Aug 2026
        </span>
      </div>

      <div
        className="mt-7 flex h-64 items-end gap-2 border-b border-[#d8dbe1] px-1 pb-0 sm:gap-4"
        role="img"
        aria-labelledby="trend-title"
        aria-describedby="trend-summary"
      >
        {trend.map((point, index) => (
          <div
            key={point.label}
            className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"
            aria-hidden="true"
          >
            <span className="mb-2 truncate text-[11px] font-semibold tabular-nums text-[#5f6470] sm:text-xs">
              {formatUsd(point.value)}
            </span>
            <div
              className={`mx-auto w-full max-w-14 rounded-t-lg ${index === trend.length - 1 ? "bg-[#5a2aff]" : "bg-[#d9cffd]"}`}
              style={{
                height: `${Math.max(12, (point.value / maximum) * 78)}%`,
              }}
            />
            <span className="mt-2 pb-2 text-xs font-medium text-[#6b7280]">
              {point.label}
            </span>
          </div>
        ))}
      </div>

      <details className="mt-4 rounded-xl bg-[#f7f7f8] px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-[#4b23c6]">
          View chart data
        </summary>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <Table>
            <TableCaption className="px-4 pb-3 text-left">
              Example monthly payable commission in USD.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Month</TableHead>
                <TableHead className="px-4 text-right">
                  Payable commission
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trend.map((point) => (
                <TableRow key={point.label}>
                  <TableCell className="px-4 font-medium">
                    {point.label} 2026
                  </TableCell>
                  <TableCell className="px-4 text-right tabular-nums">
                    {formatUsd(point.value)} USD
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </details>
    </section>
  );
}

function OverviewContent() {
  const searchParams = useSearchParams();
  const { settings } = useDemo();
  const scenario = searchParams.get("state");
  const [retrySucceeded, setRetrySucceeded] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(
    null,
  );

  if (scenario === "loading") return <OverviewLoading />;
  if (scenario === "error" && !retrySucceeded)
    return <OverviewError onRetry={() => setRetrySucceeded(true)} />;

  if (scenario === "empty") {
    return (
      <div className="app-page">
        <PageHeader
          eyebrow="Partner overview"
          title={`Welcome, ${settings.publicName}`}
          description="This prototype state shows a new partner before any example links, customers, or commission entries exist."
        />
        <EmptyState
          title="Your example activity will appear here"
          description="Create a tracked link or a client CV to see how clicks, attribution, and commission would be explained. Nothing is published automatically."
          action={
            <Button asChild className="h-11 rounded-xl">
              <Link href="/partner/links">
                Create an example link
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const metrics = [
    {
      label: "Valid clicks",
      value: periodTotals.clicks.toLocaleString("en-US"),
      note: "Redirect events after the example bot policy",
      icon: MousePointerClick,
    },
    {
      label: "Attributed signups",
      value: periodTotals.signups.toLocaleString("en-US"),
      note: "Distinct accounts with accepted attribution",
      icon: UsersRound,
    },
    {
      label: "Paying customers",
      value: periodTotals.paying.toLocaleString("en-US"),
      note: "Attributed customers with an eligible settled payment",
      icon: UserRoundCheck,
    },
  ];

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Partner overview"
        title={`Good morning, ${settings.publicName}`}
        description="A labelled example for the last 30 days, ending August 9, 2026. Figures are local fixtures, not live performance."
        actions={
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl bg-white"
          >
            <Link href="/partner/earnings">
              <ReceiptText aria-hidden="true" />
              Reconcile earnings
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.45fr_.8fr]">
        <section
          className="relative isolate min-h-72 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_92%_10%,#fe97e9_0%,transparent_34%),linear-gradient(125deg,#3f19bd_0%,#5a2aff_72%)] p-6 text-white sm:p-8"
          aria-labelledby="payable-title"
        >
          <div className="relative z-10 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-white">
                Example payable balance
              </p>
              <span className="rounded-full bg-white/16 px-2.5 py-1 text-xs font-semibold text-white">
                USD
              </span>
            </div>
            <h2
              id="payable-title"
              className="mt-4 text-[clamp(3rem,8vw,5.25rem)] font-semibold leading-none tracking-[-.04em] tabular-nums"
            >
              {formatUsd(balances.payable)}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#f1ebff] sm:text-base">
              Released commission that can enter a future monthly batch. A
              payout still requires cutoff checks, finance approval, and
              provider confirmation.
            </p>
            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-[#2f118f]/65 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-0.5 size-5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Next example payout window
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-[#e6ddff]">
                    Monthly cadence · Minimum threshold exceeded
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="h-11 rounded-xl bg-white text-[#3f1db6] hover:bg-[#f5f2ff]"
              >
                <Link href="/partner/earnings">View balance details</Link>
              </Button>
            </div>
          </div>
        </section>

        <aside
          className="flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-[#fbfbfc] p-6"
          aria-labelledby="next-task-title"
        >
          <div>
            <div className="flex items-center gap-2 text-[#4b23c6]">
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <p className="text-sm font-semibold">Next useful task</p>
            </div>
            <h2
              id="next-task-title"
              className="mt-5 text-2xl font-semibold tracking-[-.025em]"
            >
              Finish Yousef&apos;s draft CV
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b7280]">
              A finished client CV creates something useful before you share a
              claim link. The draft remains private until you choose to send it.
            </p>
          </div>
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between text-xs text-[#6b7280]">
              <span>Draft last edited Aug 4</span>
              <span className="font-semibold text-[#4b23c6]">Local demo</span>
            </div>
            <Button asChild className="h-11 w-full rounded-xl">
              <Link href="/partner/clients">
                Open client CVs
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>

      <section
        className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
        aria-labelledby="acquisition-title"
      >
        <div className="flex flex-col gap-1 border-b border-[#eceef0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 id="acquisition-title" className="font-semibold">
            Example acquisition path
          </h2>
          <p className="text-xs text-[#6b7280]">Same scope · Last 30 days</p>
        </div>
        <dl className="grid sm:grid-cols-3">
          {metrics.map(({ label, value, note, icon: Icon }, index) => (
            <div
              key={label}
              className={`p-5 sm:p-6 ${index > 0 ? "border-t border-[#eceef0] sm:border-l sm:border-t-0" : ""}`}
            >
              <dt className="flex items-center gap-2 text-sm font-medium text-[#62666f]">
                <Icon className="size-4 text-[#5a2aff]" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-3 text-3xl font-semibold tracking-[-.03em] tabular-nums">
                {value}
              </dd>
              <dd className="mt-2 text-xs leading-5 text-[#6b7280]">{note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.85fr]">
        <EarningsTrend />

        <section
          className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white"
          aria-labelledby="activity-title"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#eceef0] p-5 sm:p-6">
            <div>
              <h2
                id="activity-title"
                className="text-xl font-semibold tracking-[-.02em]"
              >
                Recent ledger activity
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Customer-safe example descriptions
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="min-h-11 rounded-xl text-[#4b23c6]"
            >
              <Link href="/partner/earnings">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-[#eceef0]">
            {activity.map((item) => (
              <div key={item.id} className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      {item.date} · USD
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    {item.commission > 0 ? "+" : ""}
                    {formatUsd(item.commission)}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <StatusBadge status={item.status} />
                  <Button
                    variant="ghost"
                    className="min-h-11 rounded-xl px-3 text-[#4b23c6]"
                    onClick={() => setSelectedActivity(item)}
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog
        open={selectedActivity !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
          {selectedActivity && (
            <>
              <DialogHeader className="border-b border-[#eceef0] p-6 pr-14 text-left">
                <div className="mb-1">
                  <StatusBadge status={selectedActivity.status} />
                </div>
                <DialogTitle className="text-xl leading-7">
                  {selectedActivity.description}
                </DialogTitle>
                <DialogDescription>
                  Example ledger entry {selectedActivity.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[#6b7280]">
                    Eligible source amount
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatUsd(selectedActivity.source)} USD
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6b7280]">
                    Commission entry
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatUsd(selectedActivity.commission)} USD
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6b7280]">
                    Posted date
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedActivity.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6b7280]">
                    State meaning
                  </p>
                  <p className="mt-1 text-sm leading-5">
                    {statusMeaning[selectedActivity.status]}
                  </p>
                </div>
              </div>
              <p className="mx-6 rounded-xl bg-[#f5f1ff] p-4 text-sm leading-6 text-[#4823a8]">
                This is a local example. A production entry would also link to
                its immutable billing event, rule version, and audit evidence.
              </p>
              <DialogFooter className="p-6 pt-2">
                <DialogClose asChild>
                  <Button className="h-11 rounded-xl">Close details</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PartnerOverviewPage() {
  return (
    <Suspense fallback={<OverviewLoading />}>
      <OverviewContent />
    </Suspense>
  );
}
