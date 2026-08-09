/*
THESIS: CV work should feel as familiar as a Google file list, with reusable skills clearly separated from client records.
OWN-WORLD: Material 3 surfaces, primary tabs, tonal filter chips, emphasized type, and one violet creation action.
STORY: A partner finds a client CV or opens a reusable skill without learning a new workflow.
FIRST VIEWPORT: The page title, two clear tabs, and one task toolbar reveal every primary action immediately.
FORM: A restrained Material 3 Expressive workbench optimized for scanning, touch, and keyboard use.
*/
"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Copy,
  FilePlus2,
  FileText,
  Layers3,
  Plus,
  RefreshCw,
  Search,
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

type CvSkillSource = "Tabbio" | "Community" | "Mine";

type CvSkill = {
  id: string;
  name: string;
  source: CvSkillSource;
  summary: string;
  bestFor: string;
  instructions: readonly string[];
};

const cvSkills: readonly CvSkill[] = [
  {
    id: "tabbio-clear-story",
    name: "Clear career story",
    source: "Tabbio",
    summary:
      "Shapes scattered experience into one focused professional direction.",
    bestFor: "Career changes and broad experience",
    instructions: [
      "Choose one target direction before rewriting sections.",
      "Connect previous experience to the target through transferable proof.",
      "Keep the summary specific enough to guide the rest of the CV.",
    ],
  },
  {
    id: "tabbio-proof-first",
    name: "Proof before adjectives",
    source: "Tabbio",
    summary:
      "Turns vague responsibility statements into concise evidence of work.",
    bestFor: "Specialists, managers, and portfolio-led roles",
    instructions: [
      "Lead with the change, output, or result—not a personality adjective.",
      "Keep numbers only when the client can explain their source.",
      "Use plain verbs and remove duplicated responsibility language.",
    ],
  },
  {
    id: "community-first-role",
    name: "First-role confidence",
    source: "Community",
    summary:
      "Surfaces projects, coursework, and practical proof when job history is short.",
    bestFor: "Graduates and early-career candidates",
    instructions: [
      "Treat relevant projects as evidence, not filler.",
      "Explain the candidate's contribution before the project description.",
      "Use skills only when the CV also shows where they were applied.",
    ],
  },
  {
    id: "community-shortlist",
    name: "Recruiter shortlist",
    source: "Community",
    summary:
      "Keeps role fit, availability, and strongest evidence easy to scan.",
    bestFor: "Recruiters and candidate shortlists",
    instructions: [
      "Put role fit and strongest evidence in the opening screen.",
      "Keep dates, titles, and locations consistent across entries.",
      "Remove details that do not help a reviewer decide the next step.",
    ],
  },
];

const statusDefinitions: Record<ClientCv["status"], string> = {
  Draft: "Private work in progress. No claim link has been sent.",
  Sent: "The claim link was sent, but has not been opened yet.",
  Viewed: "The client opened the handoff and has not accepted it.",
  "Claim pending":
    "The client started the claim flow and still has a step to finish.",
  Claimed: "The client accepted the approved ownership and access handoff.",
  Expired: "The claim link passed its validity window and needs a new link.",
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
    <div className="app-page" aria-busy="true" aria-label="Loading clients">
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
        title="We could not load your clients"
        description="Try again. Your client records have not changed."
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
            Check your connection and retry. No claim link was created or sent.
          </p>
        </div>
        <Button className="h-11 rounded-xl" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Try again
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
      edited: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
      claimCode: `${slug}-${clients.length + 1}`,
    };

    addClient(client);
    toast.success(`${cleanName} was added`);
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
                placeholder="Noor Hassan"
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
              <Label htmlFor="client-style">CV layout</Label>
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
                You can change the layout before any handoff.
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

function CvSkillsLibrary() {
  const [source, setSource] = useState<"All" | CvSkillSource>("All");
  const [openSkillId, setOpenSkillId] = useState<string | null>(null);
  const [skillQuery, setSkillQuery] = useState("");
  const normalizedQuery = skillQuery.trim().toLowerCase();
  const visibleSkills = cvSkills.filter(
    (skill) =>
      (source === "All" || skill.source === source) &&
      (!normalizedQuery ||
        skill.name.toLowerCase().includes(normalizedQuery) ||
        skill.summary.toLowerCase().includes(normalizedQuery) ||
        skill.bestFor.toLowerCase().includes(normalizedQuery)),
  );

  return (
    <section
      id="cv-skills-panel"
      role="tabpanel"
      aria-labelledby="cv-skills-tab"
      className="mt-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-.025em]">
            CV Skills
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b6473]">
            Reusable instructions for any client CV.
          </p>
        </div>
        <Button
          className="min-h-11 rounded-full px-5"
          disabled
          title="Skill builder coming soon"
        >
          <Plus aria-hidden="true" /> Create skill
        </Button>
      </div>

      <div className="mt-6 rounded-2xl bg-[#f5f3f8] p-2 sm:flex sm:items-center sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6b6473]"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={skillQuery}
            onChange={(event) => setSkillQuery(event.target.value)}
            placeholder="Search skills"
            aria-label="Search CV Skills"
            className="h-12 rounded-xl border-transparent bg-white pl-11 shadow-none focus-visible:border-[#6d48ff]"
          />
        </div>
        <div
          className="mt-2 flex max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none] sm:mt-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter CV Skills by source"
        >
          {(["All", "Tabbio", "Community", "Mine"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={source === item}
              className={`focus-ring min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-[background-color,color,border-color] ${
                source === item
                  ? "border-[#5a2aff] bg-[#e9e1ff] text-[#3d169f]"
                  : "border-[#d6d0dd] bg-transparent text-[#514a58] hover:bg-white"
              }`}
              onClick={() => {
                setSource(item);
                setOpenSkillId(null);
              }}
            >
              {item === "Mine" ? "Yours" : item}
            </button>
          ))}
        </div>
      </div>

      {visibleSkills.length === 0 ? (
        <div className="mt-5 grid min-h-64 place-items-center rounded-2xl bg-[#f8f7fa] px-5 py-12 text-center">
          <div className="max-w-md">
            <Layers3
              className="mx-auto size-8 text-[#5a2aff]"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-xl font-semibold">
              {skillQuery ? "No matching skills" : "No skills here yet"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b6473]">
              {skillQuery
                ? "Try another search or source."
                : "Create a method you can reuse across client CVs."}
            </p>
            {!skillQuery && (
              <Button
                className="mt-5 min-h-11 rounded-full px-5"
                disabled
                title="Skill builder coming soon"
              >
                <Plus aria-hidden="true" /> Create skill
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#e3dee8] bg-white">
          {visibleSkills.map((skill) => {
            const isOpen = openSkillId === skill.id;
            return (
              <article
                key={skill.id}
                className="border-b border-[#ebe7ef] last:border-b-0"
              >
                <button
                  type="button"
                  className="focus-ring grid w-full gap-3 p-5 text-left transition-colors hover:bg-[#faf9fc] sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-6"
                  aria-expanded={isOpen}
                  aria-controls={`${skill.id}-details`}
                  onClick={() => setOpenSkillId(isOpen ? null : skill.id)}
                >
                  <span className="hidden size-11 place-items-center rounded-[14px] bg-[#eee9ff] text-[#512eff] sm:grid">
                    <Layers3 className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-base font-semibold text-[#2f2933] sm:text-lg">
                        {skill.name}
                      </span>
                      <span className="text-xs font-medium text-[#655d6c]">
                        {skill.source === "Mine" ? "Yours" : skill.source}
                      </span>
                    </span>
                    <span className="mt-1 block max-w-2xl text-sm leading-6 text-[#655d6c]">
                      {skill.summary}
                    </span>
                    <span className="mt-1 block text-xs text-[#7a7281]">
                      {skill.bestFor}
                    </span>
                  </span>
                  <ChevronRight
                    className={`size-5 justify-self-end text-[#6b6473] transition-transform ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`${skill.id}-details`}
                    className="border-t border-[#ebe7ef] bg-[#f7f4fc] p-5 sm:pl-[5.25rem] sm:pr-16"
                  >
                    <p className="text-sm font-semibold">Instructions</p>
                    <ul className="mt-3 space-y-3" role="list">
                      {skill.instructions.map((instruction) => (
                        <li
                          key={instruction}
                          className="grid grid-cols-[18px_minmax(0,1fr)] gap-2 text-sm leading-6 text-[#514a58]"
                        >
                          <Check
                            className="mt-1 size-4 text-[#5a2aff]"
                            aria-hidden="true"
                          />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ClientsContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("state");
  const { clients, ready } = useDemo();
  const [activeTab, setActiveTab] = useState<"clients" | "skills">("clients");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
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
      return matchesQuery && matchesStatus;
    });
  }, [clients, query, scenario, status]);

  const hasFilters = Boolean(query.trim()) || status !== "all";

  if (!ready || scenario === "loading") return <ClientsLoading />;
  if (scenario === "error" && !retrySucceeded)
    return <ClientsError onRetry={() => setRetrySucceeded(true)} />;

  function clearFilters() {
    setQuery("");
    setStatus("all");
  }

  async function copyClaimLink(client: ClientCv) {
    const claimUrl = `${window.location.origin}/claim/${client.claimCode}`;
    try {
      await navigator.clipboard.writeText(claimUrl);
      toast.success("Claim link copied");
    } catch {
      toast.error("The browser could not copy this link");
    }
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Partner workspace"
        title="CV Builder"
        description="Create client CVs and reuse your best methods."
        actions={
          activeTab === "clients" ? (
            <CreateClientDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              openerRef={createDialogOpenerRef}
            />
          ) : undefined
        }
      />

      <div
        className="mb-6 flex gap-2 border-b border-[#ded8e4]"
        role="tablist"
        aria-label="CV Builder views"
      >
        {[
          { id: "clients", label: "Client CVs" },
          { id: "skills", label: "CV Skills" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`${tab.id === "clients" ? "client-cvs" : "cv-skills"}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id === "clients" ? "client-cvs" : "cv-skills"}-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`relative min-h-12 rounded-t-xl px-5 text-sm font-semibold transition-colors focus-visible:bg-[#f3efff] focus-visible:outline-none ${
                isActive
                  ? "text-[#3f199f] after:absolute after:inset-x-2 after:bottom-[-1px] after:h-[3px] after:rounded-t-full after:bg-[#5a2aff]"
                  : "text-[#6b6473] hover:text-[#322b39]"
              }`}
              onClick={() => setActiveTab(tab.id as "clients" | "skills")}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                  return;
                event.preventDefault();
                const nextTab =
                  event.key === "ArrowRight"
                    ? tab.id === "clients"
                      ? "skills"
                      : "clients"
                    : tab.id === "skills"
                      ? "clients"
                      : "skills";
                setActiveTab(nextTab);
                window.requestAnimationFrame(() => {
                  document
                    .getElementById(
                      `${nextTab === "clients" ? "client-cvs" : "cv-skills"}-tab`,
                    )
                    ?.focus();
                });
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "clients" ? (
        <div
          id="client-cvs-panel"
          role="tabpanel"
          aria-labelledby="client-cvs-tab"
        >
          <section
            className="rounded-2xl bg-[#f5f3f8] p-2"
            aria-label="Find and filter clients"
          >
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_12rem]">
              <div>
                <Label htmlFor="client-search" className="sr-only">
                  Search clients
                </Label>
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
                    placeholder="Search clients"
                    className="h-12 rounded-xl border-transparent bg-white pl-10 shadow-none focus-visible:border-[#6d48ff]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="client-status-filter" className="sr-only">
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger
                    id="client-status-filter"
                    className="h-12 w-full rounded-xl border-transparent bg-white px-4 shadow-none"
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
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-3">
              <p className="text-sm text-[#6b7280]" role="status">
                <span className="font-semibold text-[#2b2b2b]">
                  {filteredClients.length}
                </span>{" "}
                {filteredClients.length === 1 ? "client" : "clients"}
              </p>
              {hasFilters && (
                <Button
                  variant="ghost"
                  className="min-h-10 rounded-full px-4 text-[#4b23c6]"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </section>

          {filteredClients.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={hasFilters ? "No clients match" : "No client CVs yet"}
                description={
                  hasFilters
                    ? "Try a different name or status."
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
              <div className="border-b border-[#eceef0] px-5 py-4 sm:px-6">
                <div>
                  <h2
                    id="client-results-title"
                    className="text-lg font-semibold"
                  >
                    Client CVs
                  </h2>
                  <p className="mt-1 text-xs text-[#6b7280]">
                    Claim state is shown separately from CV status.
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableCaption className="visually-hidden">
                    Client CVs and their handoff status.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Client</TableHead>
                      <TableHead>Layout</TableHead>
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
                              <UserRound
                                className="size-4"
                                aria-hidden="true"
                              />
                            </span>
                            <div>
                              <p className="font-semibold">{client.name}</p>
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
                            {client.style} layout
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
        </div>
      ) : (
        <CvSkillsLibrary />
      )}

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
                <DialogDescription>Client CV details</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-[#6b7280]">
                      CV layout
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
                      Claim code
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
                  Claim links transfer only approved ownership and access. CV
                  content stays separate from referral data.
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
                      Copy claim link
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
