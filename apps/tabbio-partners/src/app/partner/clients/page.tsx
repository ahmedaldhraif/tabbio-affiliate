/*
THESIS: Client work is useful before it is promotional, so handoff state is always clearer than referral mechanics.
OWN-WORLD: A restrained working table, complete mobile records, violet actions, and full-text status markers.
STORY: A partner finds a client, understands the CV and claim state, inspects the handoff, or creates a private draft.
FIRST VIEWPORT: Search and two practical filters sit directly under one Create CV action, followed by the current result count.
FORM: An operate-mode client registry that favors familiar list-detail behavior over a gallery of decorative profile cards.
*/
"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Copy,
  FilePlus2,
  FileText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
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
  DialogTrigger,
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

import { useDemo } from "@/components/demo-provider";
import { EmptyState, PageHeader, StatusBadge } from "@/components/shared";
import type { ClientCv } from "@/data/demo-data";

const statuses: ClientCv["status"][] = [
  "Draft",
  "Sent",
  "Viewed",
  "Claim pending",
  "Claimed",
  "Expired",
  "Archived",
];

const styles: ClientCv["style"][] = ["Modern", "Classic", "Minimal"];

const statusDefinitions: Record<ClientCv["status"], string> = {
  Draft: "Private work in progress. No claim link has been sent.",
  Sent: "An example claim link was sent, but has not been opened yet.",
  Viewed: "The client opened the example handoff and has not accepted it.",
  "Claim pending":
    "The client started the claim flow and still has a step to finish.",
  Claimed: "The client accepted the approved ownership and access handoff.",
  Expired:
    "The example claim link passed its validity window and needs a new link.",
  Archived: "The CV is retained in history and removed from active work.",
};

function claimState(status: ClientCv["status"]) {
  if (status === "Draft") return "Not created";
  if (status === "Sent" || status === "Viewed" || status === "Claim pending")
    return "Active";
  if (status === "Claimed") return "Accepted";
  if (status === "Expired") return "Expired";
  return "Archived";
}

function ClientsLoading() {
  return (
    <div
      className="app-page"
      aria-busy="true"
      aria-label="Loading example clients"
    >
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-64 max-w-full" />
        <Skeleton className="h-5 w-[36rem] max-w-full" />
      </div>
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="mt-4 h-[30rem] rounded-2xl" />
    </div>
  );
}

function ClientsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Client CVs"
        title="We could not load the example clients"
        description="The prototype is showing its recoverable error state. Your locally saved demo clients remain untouched."
      />
      <Card className="items-start gap-4 rounded-2xl border-[#ead8dc] bg-[#fff8f8] p-6 shadow-none">
        <span className="grid size-11 place-items-center rounded-xl bg-white text-[#a13246]">
          <RefreshCw className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            Client records are unavailable
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b4d54]">
            Retry the local view or remove <code>?state=error</code> from the
            URL. No claim link was created or sent.
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

function CreateClientDialog({
  open,
  onOpenChange,
  openerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openerRef: React.MutableRefObject<HTMLButtonElement | null>;
}) {
  const { addClient, clients } = useDemo();
  const headerTriggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [style, setStyle] = useState<ClientCv["style"]>("Modern");
  const [nameError, setNameError] = useState("");

  function resetForm() {
    setName("");
    setStyle("Modern");
    setNameError("");
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) resetForm();
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setNameError("Enter at least two characters for the client name.");
      nameInputRef.current?.focus();
      return;
    }

    const slug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 28) || "client";
    const client: ClientCv = {
      id: `cv-local-${Date.now()}`,
      name: cleanName,
      style,
      status: "Draft",
      edited: "Aug 9, 2026",
      claimCode: `${slug}-${clients.length + 1}`,
    };

    addClient(client);
    toast.success(`${cleanName} was added to this local demo`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          ref={headerTriggerRef}
          className="h-11 rounded-xl"
          onClick={(event) => {
            openerRef.current = event.currentTarget;
          }}
        >
          <FilePlus2 aria-hidden="true" />
          Create CV
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-lg"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          window.requestAnimationFrame(() => {
            const actualOpener = openerRef.current;
            const focusTarget = actualOpener?.isConnected
              ? actualOpener
              : headerTriggerRef.current;
            focusTarget?.focus();
            openerRef.current = null;
          });
        }}
      >
        <form onSubmit={handleCreate}>
          <DialogHeader className="border-b border-[#eceef0] p-6 pr-14 text-left">
            <DialogTitle className="text-xl leading-7">
              Create a client CV
            </DialogTitle>
            <DialogDescription>
              Add a private draft to this browser only. Nothing is sent to the
              client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client name</Label>
              <Input
                id="client-name"
                ref={nameInputRef}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="For example, Noor Hassan"
                className="h-11 rounded-xl bg-white"
                aria-invalid={Boolean(nameError)}
                aria-describedby={
                  nameError ? "client-name-error" : "client-name-help"
                }
                autoFocus
              />
              {nameError ? (
                <p
                  id="client-name-error"
                  className="text-sm text-[#a13246]"
                  role="alert"
                >
                  {nameError}
                </p>
              ) : (
                <p
                  id="client-name-help"
                  className="text-xs leading-5 text-[#6b7280]"
                >
                  Use the name you already have permission to work with.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-style">CV style</Label>
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as ClientCv["style"])}
              >
                <SelectTrigger
                  id="client-style"
                  className="h-11 w-full rounded-xl bg-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs leading-5 text-[#6b7280]">
                You can change the example style before any handoff.
              </p>
            </div>
            <div className="rounded-xl bg-[#f5f1ff] p-4 text-sm leading-6 text-[#4823a8]">
              New CVs start as Draft. Creating one does not publish a page,
              generate a live claim, or contact a client.
            </div>
          </div>
          <DialogFooter className="border-t border-[#eceef0] p-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-11 rounded-xl">
              Create private draft
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ClientsContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("state");
  const { clients, ready } = useDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [style, setStyle] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const createDialogOpenerRef = useRef<HTMLButtonElement | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientCv | null>(null);
  const [retrySucceeded, setRetrySucceeded] = useState(false);

  const filteredClients = useMemo(() => {
    const sourceClients = scenario === "empty" ? [] : clients;
    const normalized = query.trim().toLowerCase();
    return sourceClients.filter((client) => {
      const matchesQuery =
        !normalized ||
        client.name.toLowerCase().includes(normalized) ||
        client.claimCode.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || client.status === status;
      const matchesStyle = style === "all" || client.style === style;
      return matchesQuery && matchesStatus && matchesStyle;
    });
  }, [clients, query, scenario, status, style]);

  const hasFilters =
    Boolean(query.trim()) || status !== "all" || style !== "all";

  if (!ready || scenario === "loading") return <ClientsLoading />;
  if (scenario === "error" && !retrySucceeded)
    return <ClientsError onRetry={() => setRetrySucceeded(true)} />;

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setStyle("all");
  }

  async function copyClaimLink(client: ClientCv) {
    const exampleUrl = `https://tabbio.example/claim/${client.claimCode}`;
    try {
      await navigator.clipboard.writeText(exampleUrl);
      toast.success("Example claim link copied");
    } catch {
      toast.error("The browser could not copy this example link");
    }
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Client CVs"
        title="Clients"
        description="Create useful CV work, then follow the handoff without exposing private client content. Every row below is example data."
        actions={
          <CreateClientDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            openerRef={createDialogOpenerRef}
          />
        }
      />

      <section
        className="rounded-2xl border border-[#e5e7eb] bg-[#fbfbfc] p-4 sm:p-5"
        aria-label="Find and filter example clients"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <div className="space-y-2">
            <Label htmlFor="client-search">Search clients</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]"
                aria-hidden="true"
              />
              <Input
                id="client-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name or claim code"
                className="h-11 rounded-xl bg-white pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-status-filter">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="client-status-filter"
                className="h-11 w-full rounded-xl bg-white"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-style-filter">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger
                id="client-style-filter"
                className="h-11 w-full rounded-xl bg-white"
              >
                <SelectValue placeholder="All styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All styles</SelectItem>
                {styles.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eceef0] pt-4">
          <p className="text-sm text-[#6b7280]" role="status">
            <span className="font-semibold text-[#2b2b2b]">
              {filteredClients.length}
            </span>{" "}
            {filteredClients.length === 1
              ? "example client"
              : "example clients"}
          </p>
          {hasFilters && (
            <Button
              variant="ghost"
              className="min-h-11 rounded-xl text-[#4b23c6]"
              onClick={clearFilters}
            >
              <SlidersHorizontal aria-hidden="true" />
              Clear filters
            </Button>
          )}
        </div>
      </section>

      {filteredClients.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={
              hasFilters ? "No example clients match" : "No client CVs yet"
            }
            description={
              hasFilters
                ? "Try a different name, status, or style. Your saved demo records have not changed."
                : "Create a private draft when you have permission to work with a client. No link is sent automatically."
            }
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  className="h-11 rounded-xl"
                  onClick={(event) => {
                    createDialogOpenerRef.current = event.currentTarget;
                    setCreateOpen(true);
                  }}
                >
                  <FilePlus2 aria-hidden="true" />
                  Create first CV
                </Button>
              )
            }
          />
        </div>
      ) : (
        <section
          className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
          aria-labelledby="client-results-title"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#eceef0] px-5 py-4 sm:px-6">
            <div>
              <h2 id="client-results-title" className="font-semibold">
                Client CV records
              </h2>
              <p className="mt-1 text-xs text-[#6b7280]">
                Claim state is shown separately from CV status.
              </p>
            </div>
            <span className="rounded-full bg-[#f1edff] px-3 py-1.5 text-xs font-semibold text-[#4b23c6]">
              Local demo
            </span>
          </div>

          <div className="hidden md:block">
            <Table>
              <TableCaption className="px-6 pb-4 text-left">
                Example client CVs with complete handoff status.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Client</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>CV status</TableHead>
                  <TableHead>Claim link</TableHead>
                  <TableHead>Last edit</TableHead>
                  <TableHead className="px-6 text-right">
                    <span className="visually-hidden">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-[#f1edff] text-[#4b23c6]">
                          <UserRound className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="mt-0.5 text-xs text-[#6b7280]">
                            Example record
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.style}</TableCell>
                    <TableCell>
                      <StatusBadge status={client.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {claimState(client.status)}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums text-[#5f6470]">
                      {client.edited}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button
                        variant="ghost"
                        className="min-h-11 rounded-xl text-[#4b23c6]"
                        onClick={() => setSelectedClient(client)}
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
            {filteredClients.map((client) => (
              <article
                key={client.id}
                className="p-5"
                aria-labelledby={`${client.id}-name`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1edff] text-[#4b23c6]">
                      <UserRound className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3
                        id={`${client.id}-name`}
                        className="truncate font-semibold"
                      >
                        {client.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        {client.style} style
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={client.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f7f7f8] p-4 text-sm">
                  <div>
                    <dt className="text-xs text-[#6b7280]">Claim link</dt>
                    <dd className="mt-1 font-semibold">
                      {claimState(client.status)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6b7280]">Last edit</dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {client.edited}
                    </dd>
                  </div>
                </dl>
                <Button
                  variant="outline"
                  className="mt-4 h-11 w-full rounded-xl"
                  onClick={() => setSelectedClient(client)}
                >
                  <FileText aria-hidden="true" />
                  View details
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}

      <details className="mt-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <summary className="cursor-pointer font-semibold text-[#4b23c6]">
          Status guide
        </summary>
        <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {statuses.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="shrink-0">
                <StatusBadge status={item} />
              </div>
              <p className="text-sm leading-6 text-[#5f6470]">
                {statusDefinitions[item]}
              </p>
            </div>
          ))}
        </div>
      </details>

      <Dialog
        open={selectedClient !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedClient(null);
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
          {selectedClient && (
            <>
              <DialogHeader className="border-b border-[#eceef0] p-6 pr-14 text-left">
                <div className="mb-1">
                  <StatusBadge status={selectedClient.status} />
                </div>
                <DialogTitle className="text-xl leading-7">
                  {selectedClient.name}
                </DialogTitle>
                <DialogDescription>Example client CV detail</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      CV style
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {selectedClient.style}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Last edited
                    </dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {selectedClient.edited}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Claim link state
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {claimState(selectedClient.status)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      Example claim code
                    </dt>
                    <dd className="mt-1 break-all font-semibold">
                      {selectedClient.claimCode}
                    </dd>
                  </div>
                </dl>
                <div className="rounded-xl bg-[#f7f7f8] p-4">
                  <p className="text-sm font-semibold">
                    What {selectedClient.status} means
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5f6470]">
                    {statusDefinitions[selectedClient.status]}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f5f1ff] p-4 text-sm leading-6 text-[#4823a8]">
                  This prototype displays handoff metadata only. A real claim
                  must transfer only approved ownership and access, never
                  private CV data from the referral engine.
                </div>
              </div>
              <DialogFooter className="border-t border-[#eceef0] p-6">
                <DialogClose asChild>
                  <Button variant="outline" className="h-11 rounded-xl">
                    Close
                  </Button>
                </DialogClose>
                {selectedClient.status !== "Draft" &&
                  selectedClient.status !== "Archived" && (
                    <Button
                      className="h-11 rounded-xl"
                      onClick={() => copyClaimLink(selectedClient)}
                    >
                      <Copy aria-hidden="true" />
                      Copy example link
                    </Button>
                  )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsLoading />}>
      <ClientsContent />
    </Suspense>
  );
}
