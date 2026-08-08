/*
THESIS: A partner should be able to explain every dollar without trusting a mysterious dashboard total.
OWN-WORLD: One violet earning field, a visible reconciliation equation, semantic ledgers, and calm full-text money states.
STORY: The partner checks payable funds, proves the lifetime balance, filters source entries, and inspects or exports example payouts.
FIRST VIEWPORT: Payable commission leads beside the exact four-part equation that produces lifetime earned.
FORM: An operate-mode account statement that rejects gamified earnings widgets and keeps immutable financial history legible.
*/
"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Banknote,
  Download,
  FileDown,
  HelpCircle,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@refref/ui/components/input";
import { Label } from "@refref/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refref/ui/components/select";
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
import { balances, formatUsd, ledger, partner } from "@/data/demo-data";

type LedgerEntry = (typeof ledger)[number];

type ExamplePayout = {
  id: string;
  period: string;
  amount: number;
  entries: number;
  submitted: string;
  paid: string;
  providerReference: string;
};

const payoutHistory: ExamplePayout[] = [
  {
    id: "TAB-DEMO-2026-08",
    period: "Jul 1 to Jul 31, 2026",
    amount: 3120,
    entries: 44,
    submitted: "Aug 3, 2026",
    paid: "Aug 5, 2026",
    providerReference: "demo_po_aug_2026",
  },
  {
    id: "TAB-DEMO-2026-07",
    period: "Jun 1 to Jun 30, 2026",
    amount: 2952,
    entries: 41,
    submitted: "Jul 3, 2026",
    paid: "Jul 6, 2026",
    providerReference: "demo_po_jul_2026",
  },
  {
    id: "TAB-DEMO-2026-06",
    period: "May 1 to May 31, 2026",
    amount: 2800,
    entries: 38,
    submitted: "Jun 3, 2026",
    paid: "Jun 5, 2026",
    providerReference: "demo_po_jun_2026",
  },
];

const ledgerStateDefinitions: Record<string, string> = {
  Payable:
    "Released commission eligible for a future batch and not yet scheduled.",
  Pending:
    "Posted commission waiting for the active rule to release or hold it.",
  Held: "Posted commission explicitly delayed for time or review.",
  Paid: "Provider-confirmed and reconciled payout history. The original entry remains paid.",
  Reversed:
    "A linked negative entry created before payout instead of editing the original history.",
};

const balanceDefinitions = [
  {
    label: "Pending",
    value: balances.pending,
    definition: "Posted commission not yet released or held.",
  },
  {
    label: "Held",
    value: balances.held,
    definition: "Commission delayed for the example hold or review.",
  },
  {
    label: "Payable",
    value: balances.payable,
    definition: "Released and eligible for a future payout batch.",
  },
  {
    label: "Scheduled",
    value: balances.scheduled,
    definition: "Assigned to an approved batch but not yet confirmed paid.",
  },
  {
    label: "Paid",
    value: balances.paid,
    definition: "Provider-confirmed and reconciled payout items.",
  },
  {
    label: "Recovery balance",
    value: balances.recovery,
    definition: "Outstanding post-payout negative entries still to recover.",
  },
] as const;

const recentLedgerSampleCommission = ledger.reduce(
  (total, entry) => total + entry.commission,
  0,
);

function downloadFile(filename: string, body: string, type: string) {
  const blob = new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadLedgerCsv() {
  const rows = [
    ["TABBIO PARTNER RECENT LEDGER SAMPLE"],
    ["Environment", "Local frontend demo only"],
    ["Scope", "Five recent example entries only"],
    [
      "Completeness",
      "This is not a complete lifetime ledger and does not reconcile to lifetime earned or paid payout totals",
    ],
    ["Sample commission total USD", recentLedgerSampleCommission],
    [],
    [
      "Entry ID",
      "Description",
      "Eligible source USD",
      "Commission USD",
      "Status",
      "Posted date",
      "Live data",
    ],
    ...ledger.map((entry) => [
      entry.id,
      entry.description,
      entry.source,
      entry.commission,
      entry.status,
      entry.date,
      "No",
    ]),
  ];
  downloadFile(
    "tabbio-recent-ledger-sample.csv",
    rows.map((row) => row.map(csvCell).join(",")).join("\n"),
    "text/csv;charset=utf-8",
  );
}

function downloadSummaryStatement() {
  const body = [
    "TABBIO PARTNER EXAMPLE STATEMENT",
    "LOCAL DEMO ONLY. NOT A PAYMENT OR TAX DOCUMENT.",
    "",
    `Example partner: ${partner.name}`,
    "Statement date: Aug 9, 2026",
    "Currency: USD",
    "",
    `Lifetime earned: ${formatUsd(balances.lifetime)}`,
    `Paid: ${formatUsd(balances.paid)}`,
    `Payable: ${formatUsd(balances.payable)}`,
    `Pending: ${formatUsd(balances.pending)}`,
    `Held: ${formatUsd(balances.held)}`,
    `Scheduled: ${formatUsd(balances.scheduled)}`,
    `Recovery balance: ${formatUsd(balances.recovery)}`,
    "",
    `Reconciliation: ${formatUsd(balances.paid)} + ${formatUsd(balances.payable)} + ${formatUsd(balances.pending)} + ${formatUsd(balances.held)} = ${formatUsd(balances.lifetime)}`,
    "",
    "RECENT LEDGER SAMPLE DISCLOSURE",
    `The on-screen and CSV sample contains ${ledger.length} recent entries totaling ${formatUsd(recentLedgerSampleCommission)} in commission.`,
    "It is not the complete lifetime ledger and does not reconcile to lifetime earned or paid payout totals.",
    `The complete example payout-history fixture contains ${payoutHistory.length} payouts totaling ${formatUsd(payoutHistory.reduce((total, payout) => total + payout.amount, 0))}.`,
    "",
    "This file was generated by a local frontend simulation. No provider is connected and no payout was submitted.",
  ].join("\n");
  downloadFile(
    "tabbio-example-balance-summary.txt",
    body,
    "text/plain;charset=utf-8",
  );
}

function downloadPayoutStatement(payout: ExamplePayout) {
  const body = [
    "TABBIO PARTNER EXAMPLE PAYOUT STATEMENT",
    "LOCAL DEMO ONLY. NOT PROOF OF PAYMENT.",
    "",
    `Payout ID: ${payout.id}`,
    `Covered period: ${payout.period}`,
    `Amount: ${formatUsd(payout.amount)} USD`,
    `Included entries: ${payout.entries}`,
    `Submitted: ${payout.submitted}`,
    `Provider-confirmed in fixture: ${payout.paid}`,
    `Example provider reference: ${payout.providerReference}`,
    "FX: None in this USD example",
    "Fees: $0 in this example",
  ].join("\n");
  downloadFile(
    `${payout.id.toLowerCase()}-statement.txt`,
    body,
    "text/plain;charset=utf-8",
  );
}

function EarningsLoading() {
  return (
    <div
      className="app-page"
      aria-busy="true"
      aria-label="Loading example earnings"
    >
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-64 max-w-full" />
        <Skeleton className="h-5 w-[38rem] max-w-full" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="mt-4 h-64 rounded-2xl" />
      <Skeleton className="mt-4 h-[32rem] rounded-2xl" />
    </div>
  );
}

function EarningsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Earnings"
        title="We could not load the example ledger"
        description="The prototype is showing its recoverable financial-data error state. No balance or payout record was changed."
      />
      <Card className="items-start gap-4 rounded-2xl border-[#ead8dc] bg-[#fff8f8] p-6 shadow-none">
        <span className="grid size-11 place-items-center rounded-xl bg-white text-[#a13246]">
          <RefreshCw className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            The example statement is unavailable
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b4d54]">
            Retry this local view or remove <code>?state=error</code> from the
            URL. A production screen would preserve the last reconciled snapshot
            and its timestamp.
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

function EarningsContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("state");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<ExamplePayout | null>(
    null,
  );
  const [retrySucceeded, setRetrySucceeded] = useState(false);

  const filteredLedger = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ledger.filter((entry) => {
      const matchesQuery =
        !normalized ||
        entry.description.toLowerCase().includes(normalized) ||
        entry.id.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || entry.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const hasFilters = Boolean(query.trim()) || status !== "all";
  const reconciledTotal =
    balances.paid + balances.payable + balances.pending + balances.held;
  const paidPayoutTotal = payoutHistory.reduce(
    (total, payout) => total + payout.amount,
    0,
  );

  if (scenario === "loading") return <EarningsLoading />;
  if (scenario === "error" && !retrySucceeded)
    return <EarningsError onRetry={() => setRetrySucceeded(true)} />;

  if (scenario === "empty") {
    return (
      <div className="app-page">
        <PageHeader
          eyebrow="Earnings"
          title="Earnings"
          description="This prototype state shows a new partner before any eligible settled payment creates an example commission entry."
        />
        <EmptyState
          title="No example commission yet"
          description="Clicks and signups do not create commission. An entry appears only after an attributed customer has an eligible settled payment."
        />
      </div>
    );
  }

  function clearFilters() {
    setQuery("");
    setStatus("all");
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Earnings"
        title="Earnings"
        description="See every commission and adjustment"
        actions={
          <>
            <Button
              variant="outline"
              className="h-auto min-h-11 w-full whitespace-normal rounded-xl bg-white min-[600px]:w-auto"
              onClick={downloadLedgerCsv}
            >
              <Download aria-hidden="true" />
              Download sample CSV
            </Button>
            <Button
              className="h-auto min-h-11 w-full whitespace-normal rounded-xl min-[600px]:w-auto"
              onClick={downloadSummaryStatement}
            >
              <FileDown aria-hidden="true" />
              Download balance summary
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Lifetime earned", balances.lifetime, true],
          ["Pending", balances.pending, false],
          ["Payable", balances.payable, false],
          ["Paid", balances.paid, false],
        ].map(([label, value, accent]) => (
          <section
            key={String(label)}
            className={`${accent ? "brand-gradient border-transparent text-white" : "border-[#e5e7eb] bg-[#fafafa]"} min-h-36 rounded-2xl border p-6`}
          >
            <p
              className={`text-sm font-medium ${accent ? "text-white/85" : "text-[#788195]"}`}
            >
              {String(label)}
            </p>
            <p className="mt-5 text-[clamp(2.15rem,3.5vw,2.8rem)] font-medium leading-none tracking-[-.035em] tabular-nums">
              {formatUsd(Number(value))}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
        <section className="hidden" aria-labelledby="earnings-payable-title">
          <div className="relative z-10 flex h-full min-h-64 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">Example payable balance</p>
                <span className="rounded-full bg-white/16 px-2.5 py-1 text-xs font-semibold">
                  USD
                </span>
              </div>
              <h2
                id="earnings-payable-title"
                className="mt-4 text-[clamp(3rem,7vw,5rem)] font-semibold leading-none tracking-[-.04em] tabular-nums"
              >
                {formatUsd(balances.payable)}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#f1ebff]">
                Released commission that may enter a future monthly batch.
                Finance approval and provider confirmation are still required.
              </p>
            </div>
            <div className="mt-8 grid gap-3 rounded-2xl bg-[#2f118f]/65 p-4 backdrop-blur-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#ddd2ff]">Proposed minimum</p>
                <p className="mt-1 font-semibold tabular-nums">
                  {formatUsd(50)} USD
                </p>
              </div>
              <div>
                <p className="text-xs text-[#ddd2ff]">Above minimum</p>
                <p className="mt-1 font-semibold tabular-nums">
                  {formatUsd(balances.payable - 50)} USD
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8"
          aria-labelledby="reconciliation-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#5a2aff]">
                Exact reconciliation
              </p>
              <h2
                id="reconciliation-title"
                className="mt-1 text-2xl font-semibold tracking-[-.025em]"
              >
                Why lifetime earned is {formatUsd(balances.lifetime)}
              </h2>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef8f1] text-[#28744f]">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6b7280]">
            The fixture&apos;s lifetime total is already net of approved
            pre-payout reversals. Current positive buckets and paid history add
            back to the same amount.
          </p>
          <div className="mt-7 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
            {[
              ["Paid", balances.paid],
              ["Payable", balances.payable],
              ["Pending", balances.pending],
              ["Held", balances.held],
            ].map(([label, value], index) => (
              <div key={String(label)} className="contents">
                <div className="rounded-xl bg-[#f7f7f8] p-3 text-center">
                  <p className="text-xs text-[#6b7280]">{label}</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatUsd(Number(value))}
                  </p>
                </div>
                {index < 3 && (
                  <span
                    className="hidden text-center text-[#8a8f98] sm:block"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#f5f1ff] p-4 text-center text-sm font-semibold leading-6 text-[#4823a8] tabular-nums">
            {formatUsd(balances.paid)} + {formatUsd(balances.payable)} +{" "}
            {formatUsd(balances.pending)} + {formatUsd(balances.held)} ={" "}
            {formatUsd(reconciledTotal)}
          </div>
          <p className="mt-3 text-center text-xs text-[#6b7280]" role="status">
            Reconciled exactly to the example lifetime balance.
          </p>
        </section>
      </div>

      <section
        className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
        aria-labelledby="balance-definitions-title"
      >
        <div className="border-b border-[#eceef0] px-5 py-4 sm:px-6">
          <h2 id="balance-definitions-title" className="font-semibold">
            Balance definitions
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#6b7280]">
            Each amount has one state. Released is an action, not another
            balance.
          </p>
        </div>
        <dl className="grid md:grid-cols-2 xl:grid-cols-3">
          {balanceDefinitions.map((item, index) => (
            <div
              key={item.label}
              className={`p-5 sm:p-6 ${index > 0 ? "border-t border-[#eceef0] md:border-l md:[&:nth-child(odd)]:border-l-0 xl:[&:nth-child(3n+1)]:border-l-0 xl:[&:nth-child(3)]:border-t-0 md:[&:nth-child(2)]:border-t-0" : ""}`}
            >
              <dt className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-lg font-semibold tabular-nums">
                  {formatUsd(item.value)}
                </span>
              </dt>
              <dd className="mt-2 text-xs leading-5 text-[#6b7280]">
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-[#eceef0] bg-[#fbfbfc] px-5 py-4 text-sm leading-6 text-[#5f6470] sm:px-6">
          <strong className="text-[#2b2b2b]">Reversed:</strong> the visible
          recent ledger sample includes a {formatUsd(-15)} pre-payout
          adjustment. The sample is not the complete lifetime ledger.{" "}
          <strong className="text-[#2b2b2b]">Recovery balance:</strong>{" "}
          {formatUsd(balances.recovery)}, so no post-payout offset is
          outstanding.
        </div>
      </section>

      <section
        className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
        aria-labelledby="ledger-title"
      >
        <div className="border-b border-[#eceef0] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2
                id="ledger-title"
                className="text-xl font-semibold tracking-[-.02em]"
              >
                Recent ledger sample
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Five recent immutable example entries only. This sample totals{" "}
                {formatUsd(recentLedgerSampleCommission)} and does not reconcile
                to lifetime earned or paid payout totals.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(14rem,1fr)_11rem]">
              <div className="space-y-2">
                <Label htmlFor="ledger-search">Search ledger</Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]"
                    aria-hidden="true"
                  />
                  <Input
                    id="ledger-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Source or entry ID"
                    className="h-11 rounded-xl bg-white pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledger-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger
                    id="ledger-status"
                    className="h-11 w-full rounded-xl bg-white"
                  >
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.keys(ledgerStateDefinitions).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eceef0] pt-4">
            <p className="text-sm text-[#6b7280]" role="status">
              <span className="font-semibold text-[#2b2b2b]">
                {filteredLedger.length}
              </span>{" "}
              sample {filteredLedger.length === 1 ? "entry" : "entries"}
            </p>
            {hasFilters && (
              <Button
                variant="ghost"
                className="min-h-11 rounded-xl text-[#4b23c6]"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {filteredLedger.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              title="No ledger entries match"
              description="Try another source phrase or money state. The underlying five-entry recent sample has not changed."
              action={
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableCaption className="px-6 pb-4 text-left">
                  Five-entry recent ledger sample in USD. It is not the complete
                  lifetime ledger and does not reconcile to balance or payout
                  totals.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Source</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      Eligible source
                    </TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="px-6 text-right">
                      <span className="visually-hidden">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="px-6 py-4">
                        <p className="font-semibold">{entry.description}</p>
                        <p className="mt-0.5 text-xs text-[#6b7280]">
                          {entry.id} · Example event
                        </p>
                      </TableCell>
                      <TableCell className="tabular-nums text-[#5f6470]">
                        {entry.date}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={entry.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatUsd(entry.source)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatUsd(entry.commission)}
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <Button
                          variant="ghost"
                          className="min-h-11 rounded-xl text-[#4b23c6]"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-[#eceef0] md:hidden">
              {filteredLedger.map((entry) => (
                <article
                  key={entry.id}
                  className="p-5"
                  aria-labelledby={`${entry.id}-title`}
                >
                  <div className="flex flex-col items-start gap-3 min-[600px]:flex-row min-[600px]:justify-between">
                    <div className="min-w-0">
                      <h3
                        id={`${entry.id}-title`}
                        className="break-words font-semibold leading-5"
                      >
                        {entry.description}
                      </h3>
                      <p className="mt-1 text-xs text-[#6b7280]">
                        {entry.id} · {entry.date}
                      </p>
                    </div>
                    <StatusBadge status={entry.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-[#f7f7f8] p-4 text-sm min-[600px]:grid-cols-2">
                    <div>
                      <dt className="text-xs text-[#6b7280]">
                        Eligible source
                      </dt>
                      <dd className="mt-1 font-semibold tabular-nums">
                        {formatUsd(entry.source)} USD
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#6b7280]">Commission</dt>
                      <dd className="mt-1 font-semibold tabular-nums">
                        {formatUsd(entry.commission)} USD
                      </dd>
                    </div>
                  </dl>
                  <Button
                    variant="outline"
                    className="mt-4 h-11 w-full rounded-xl"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <ReceiptText aria-hidden="true" />
                    View entry details
                  </Button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section
        className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
        aria-labelledby="payout-history-title"
      >
        <div className="flex flex-col justify-between gap-3 border-b border-[#eceef0] p-5 sm:flex-row sm:items-start sm:p-6">
          <div>
            <h2
              id="payout-history-title"
              className="text-xl font-semibold tracking-[-.02em]"
            >
              Example payout history (complete fixture)
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Provider-confirmed in the fixture only. No real transfer exists.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-[#6b7280]">Reconciled paid total</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {formatUsd(paidPayoutTotal)} USD
            </p>
          </div>
        </div>
        <div className="divide-y divide-[#eceef0]">
          {payoutHistory.map((payout) => (
            <article
              key={payout.id}
              className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
              aria-labelledby={`${payout.id}-title`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef8f1] text-[#28744f]">
                  <Banknote className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id={`${payout.id}-title`} className="font-semibold">
                      {payout.id}
                    </h3>
                    <StatusBadge status="Paid" />
                  </div>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {payout.period} · {payout.entries} example entries
                  </p>
                  <p className="mt-1 text-xs text-[#6b7280]">
                    Confirmed in fixture {payout.paid}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-4 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between lg:justify-end">
                <p className="text-lg font-semibold tabular-nums">
                  {formatUsd(payout.amount)} USD
                </p>
                <Button
                  variant="outline"
                  className="h-auto min-h-11 w-full whitespace-normal rounded-xl min-[600px]:w-auto"
                  onClick={() => setSelectedPayout(payout)}
                >
                  View payout
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-[#fbfbfc] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <HelpCircle
            className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">A money state does not look right?</p>
            <p className="mt-1 text-sm leading-6 text-[#6b7280]">
              In production, support would open a case against the exact entry
              or payout without editing financial history.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-xl bg-white"
          onClick={() =>
            toast.info("Demo only: support case creation is not connected")
          }
        >
          Contact demo support
        </Button>
      </div>

      <Dialog
        open={selectedEntry !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEntry(null);
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
          {selectedEntry && (
            <>
              <DialogHeader className="border-b border-[#eceef0] p-6 pr-14 text-left">
                <div className="mb-1">
                  <StatusBadge status={selectedEntry.status} />
                </div>
                <DialogTitle className="text-xl leading-7">
                  {selectedEntry.description}
                </DialogTitle>
                <DialogDescription>
                  Recent sample entry {selectedEntry.id}. This five-entry sample
                  is not the complete lifetime ledger.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Eligible source
                    </dt>
                    <dd className="mt-1 text-lg font-semibold tabular-nums">
                      {formatUsd(selectedEntry.source)} USD
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Commission
                    </dt>
                    <dd className="mt-1 text-lg font-semibold tabular-nums">
                      {formatUsd(selectedEntry.commission)} USD
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Posted date
                    </dt>
                    <dd className="mt-1 font-semibold">{selectedEntry.date}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Currency
                    </dt>
                    <dd className="mt-1 font-semibold">USD</dd>
                  </div>
                </dl>
                <div className="rounded-xl bg-[#f7f7f8] p-4">
                  <p className="text-sm font-semibold">
                    What {selectedEntry.status} means
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5f6470]">
                    {ledgerStateDefinitions[selectedEntry.status]}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f5f1ff] p-4 text-sm leading-6 text-[#4823a8]">
                  A production detail would trace the settled billing event, the
                  effective 30% rule version, linked adjustments, and audit
                  evidence. This local record has none of those live
                  connections.
                </div>
              </div>
              <DialogFooter className="border-t border-[#eceef0] p-6">
                <DialogClose asChild>
                  <Button className="h-11 rounded-xl">Close entry</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedPayout !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPayout(null);
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
          {selectedPayout && (
            <>
              <DialogHeader className="border-b border-[#eceef0] p-6 pr-14 text-left">
                <div className="mb-1">
                  <StatusBadge status="Paid · Demo" />
                </div>
                <DialogTitle className="text-xl leading-7">
                  {selectedPayout.id}
                </DialogTitle>
                <DialogDescription>
                  Example payout detail. Not proof of payment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-medium text-[#6b7280]">
                    Example amount
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-.03em] tabular-nums">
                    {formatUsd(selectedPayout.amount)} USD
                  </p>
                </div>
                <dl className="grid gap-4 rounded-xl bg-[#f7f7f8] p-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#6b7280]">Covered period</dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {selectedPayout.period}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">Included entries</dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {selectedPayout.entries}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">
                      Submitted in fixture
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {selectedPayout.submitted}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">
                      Confirmed in fixture
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {selectedPayout.paid}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">FX and fees</dt>
                    <dd className="mt-1 text-sm font-semibold">
                      No FX · {formatUsd(0)} example fees
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">
                      Provider reference
                    </dt>
                    <dd className="mt-1 break-all text-sm font-semibold">
                      {selectedPayout.providerReference}
                    </dd>
                  </div>
                </dl>
                <p className="rounded-xl bg-[#f5f1ff] p-4 text-sm leading-6 text-[#4823a8]">
                  This fixture labels the record Paid only to demonstrate the
                  final state. No payout provider, bank account, or real
                  reconciliation is connected.
                </p>
              </div>
              <DialogFooter className="border-t border-[#eceef0] p-6">
                <DialogClose asChild>
                  <Button variant="outline" className="h-11 rounded-xl">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  className="h-11 rounded-xl"
                  onClick={() => downloadPayoutStatement(selectedPayout)}
                >
                  <WalletCards aria-hidden="true" />
                  Download example statement
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <Suspense fallback={<EarningsLoading />}>
      <EarningsContent />
    </Suspense>
  );
}
