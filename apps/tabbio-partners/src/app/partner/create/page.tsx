"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clipboard,
  Download,
  FileClock,
  FileText,
  Info,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@refref/ui/components/alert";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import { Checkbox } from "@refref/ui/components/checkbox";
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
import { Textarea } from "@refref/ui/components/textarea";

import { useDemo } from "@/components/demo-provider";
import { EmptyState, PageHeader } from "@/components/shared";
import {
  copyText,
  downloadText,
  readScenarioState,
} from "@/components/tools/browser-actions";
import { createLocalDraft, type Draft } from "@/data/demo-data";

const disclosure =
  "I may earn a commission if you subscribe through this link.";
const formats: Draft["format"][] = ["Script", "Post", "Article"];

const audienceOpeners: Record<string, string> = {
  "Job seekers":
    "For job seekers who want one clearer way to share their work:",
  "Career professionals":
    "For career professionals helping clients present their work:",
  "Hiring teams": "For hiring teams reviewing candidate work:",
};

const ctaLines: Record<string, string> = {
  explore: "Explore Tabbio and decide whether a live CV fits your workflow.",
  example: "View the live CV example before you decide.",
  none: "",
};

function CreateSkeleton() {
  return (
    <div className="app-page space-y-5" aria-label="Loading draft builder">
      <Skeleton className="h-24 max-w-2xl rounded-2xl" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
        <Skeleton className="h-[540px] rounded-2xl" />
        <Skeleton className="h-[540px] rounded-2xl" />
      </div>
    </div>
  );
}

export default function CreatePage() {
  const { drafts, saveDraft } = useDemo();
  const [scenario, setScenario] = useState("default");
  const [format, setFormat] = useState<Draft["format"]>("Post");
  const [brief, setBrief] = useState(
    "Show fresh graduates how to turn a PDF CV into one live link.",
  );
  const [audience, setAudience] = useState("Job seekers");
  const [cta, setCta] = useState("explore");
  const [includeDisclosure, setIncludeDisclosure] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [body, setBody] = useState("");
  const [briefError, setBriefError] = useState("");
  const [actionError, setActionError] = useState("");
  const [artifactNotice, setArtifactNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setScenario(readScenarioState()), []);

  const visibleDrafts = scenario === "empty" ? [] : drafts;
  const wordCount = useMemo(
    () => (body.trim() ? body.trim().split(/\s+/).length : 0),
    [body],
  );

  const invalidateGeneratedArtifact = (notice: string) => {
    if (!draft) return;
    setDraft(null);
    setBody("");
    setCopied(false);
    setActionError("");
    setArtifactNotice(notice);
  };

  const createDraft = () => {
    if (!brief.trim()) {
      setBriefError("Add a clear brief before creating a local draft.");
      briefRef.current?.focus();
      return;
    }

    const generated = createLocalDraft(format, brief.trim());
    const base = generated.body.replace(` ${disclosure}`, "");
    const parts = [
      audienceOpeners[audience],
      base,
      ctaLines[cta],
      includeDisclosure ? disclosure : "",
    ].filter(Boolean);
    const nextDraft = { ...generated, body: parts.join("\n\n") };
    setDraft(nextDraft);
    setBody(nextDraft.body);
    setBriefError("");
    setActionError("");
    setArtifactNotice("");
    setCopied(false);
  };

  const saveCurrentDraft = () => {
    if (!draft || !body.trim()) return;
    const next = { ...draft, brief: brief.trim(), body: body.trim() };
    saveDraft(next);
    setDraft(next);
    setActionError("");
    toast.success("Draft saved in this browser");
  };

  const copyCurrentDraft = async () => {
    if (!body.trim()) return;
    try {
      await copyText(body);
      setCopied(true);
      setActionError("");
      toast.success("Draft copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      setActionError(
        copyError instanceof Error
          ? copyError.message
          : "Copy is unavailable in this browser.",
      );
    }
  };

  const downloadCurrentDraft = () => {
    if (!draft || !body.trim()) return;
    try {
      downloadText(`tabbio-${draft.format.toLowerCase()}-draft.txt`, body);
      setActionError("");
      toast.success("Draft download started");
    } catch (downloadError) {
      setActionError(
        downloadError instanceof Error
          ? downloadError.message
          : "Download is unavailable in this browser.",
      );
    }
  };

  const openHistoryDraft = (item: Draft) => {
    setDraft(item);
    setFormat(item.format);
    setBrief(item.brief);
    setBody(item.body);
    setBriefError("");
    setActionError("");
    setArtifactNotice("");
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (scenario === "loading") return <CreateSkeleton />;

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Local content tool"
        title="Content Builder"
        description="Create a UGC script, social post, or article"
      />

      {scenario === "error" && (
        <Alert variant="destructive" className="mb-5 rounded-xl">
          <Info aria-hidden="true" />
          <AlertTitle>Draft service is not connected</AlertTitle>
          <AlertDescription>
            The local template still works. No AI service, account, or
            publishing destination is configured.
          </AlertDescription>
        </Alert>
      )}

      <div
        className={`grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-5 ${draft ? "lg:grid-cols-[minmax(0,.84fr)_minmax(0,1.16fr)]" : ""}`}
      >
        <Card className="min-w-0 rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-6">
          <div>
            <h2 className="text-xl font-semibold">Draft setup</h2>
            <p className="mt-1 text-sm leading-6 text-[#6b7280]">
              Choose a format and give the local template one clear job.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Format</legend>
            <div className="grid grid-cols-1 rounded-xl bg-[#f3f4f6] p-1 min-[600px]:grid-cols-3">
              {formats.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={format === item}
                  onClick={() => {
                    if (format === item) return;
                    setFormat(item);
                    invalidateGeneratedArtifact(
                      "Format changed. Create a new local draft before saving or exporting.",
                    );
                  }}
                  className={`focus-ring min-h-11 min-w-0 rounded-lg px-2 text-sm font-semibold transition-colors min-[600px]:px-3 ${format === item ? "bg-white text-[#4721bd] shadow-sm" : "text-[#59606c] hover:text-[#2b2b2b]"}`}
                >
                  {item === "Script" ? "UGC script" : item}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="draft-brief">Brief</Label>
            <Textarea
              id="draft-brief"
              ref={briefRef}
              value={brief}
              onChange={(event) => {
                setBrief(event.target.value);
                setBriefError("");
              }}
              aria-invalid={Boolean(briefError)}
              aria-describedby={briefError ? "draft-error" : "draft-help"}
              className="min-h-28 rounded-xl"
              placeholder="What should this draft help someone understand?"
            />
            <p
              id={briefError ? "draft-error" : "draft-help"}
              role={briefError ? "alert" : undefined}
              className={`text-xs leading-5 ${briefError ? "font-medium text-[#b42318]" : "text-[#6b7280]"}`}
            >
              {briefError ||
                "The local template stores this brief with your saved draft."}
            </p>
          </div>

          <details
            className="min-w-0 rounded-xl border border-[#e5e7eb] p-4"
            open
          >
            <summary className="cursor-pointer text-sm font-semibold">
              Draft options
            </summary>
            <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="draft-audience">Opening audience</Label>
                <Select
                  value={audience}
                  onValueChange={(value) => {
                    setAudience(value);
                    invalidateGeneratedArtifact(
                      "Audience changed. Create a new local draft to apply it.",
                    );
                  }}
                >
                  <SelectTrigger
                    id="draft-audience"
                    className="h-11 w-full min-w-0 rounded-xl"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(audienceOpeners).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="draft-cta">Closing action</Label>
                <Select
                  value={cta}
                  onValueChange={(value) => {
                    setCta(value);
                    invalidateGeneratedArtifact(
                      "Closing action changed. Create a new local draft to apply it.",
                    );
                  }}
                >
                  <SelectTrigger
                    id="draft-cta"
                    className="h-11 w-full min-w-0 rounded-xl"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="explore">Explore Tabbio</SelectItem>
                    <SelectItem value="example">View an example</SelectItem>
                    <SelectItem value="none">No closing action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl bg-[#f6f6f7] p-3">
                <Checkbox
                  className="mt-0.5"
                  checked={includeDisclosure}
                  onCheckedChange={(checked) => {
                    setIncludeDisclosure(Boolean(checked));
                    invalidateGeneratedArtifact(
                      "Disclosure option changed. Create a new local draft to apply it.",
                    );
                  }}
                />
                <span>
                  <span className="block text-sm font-semibold">
                    Include the prototype disclosure
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#59606c]">
                    Review local rules and approved wording before publishing.
                  </span>
                </span>
              </label>
            </div>
          </details>

          <Button
            size="lg"
            className="min-h-12 w-full rounded-xl"
            onClick={createDraft}
          >
            <Sparkles />
            Create local draft
          </Button>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#6b7280]">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Fixed browser template only. No AI, review service, or social
            account is connected.
          </p>
          {artifactNotice && (
            <p
              className="rounded-xl bg-[#fff7e8] p-3 text-xs font-medium leading-5 text-[#7a4d00]"
              role="status"
            >
              {artifactNotice}
            </p>
          )}
        </Card>

        <Card
          className={`${draft ? "" : "hidden"} min-h-[540px] min-w-0 rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-6`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Draft editor</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                {draft
                  ? `${draft.format} · ${wordCount} words`
                  : "Your editable result appears here"}
              </p>
            </div>
            {draft && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf7ef] px-3 py-1.5 text-xs font-semibold text-[#28744f]">
                <Check className="size-3.5" aria-hidden="true" />
                Local result
              </span>
            )}
          </div>

          {draft ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="draft-title">Internal brief</Label>
                <Input
                  id="draft-title"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="draft-body">Draft text</Label>
                <Textarea
                  id="draft-body"
                  value={body}
                  onChange={(event) => {
                    setBody(event.target.value);
                    setCopied(false);
                    setActionError("");
                  }}
                  className="min-h-72 resize-y rounded-xl leading-7"
                />
                <p className="text-xs leading-5 text-[#6b7280]">
                  You are responsible for checking claims, disclosure wording,
                  and where this is published.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="min-h-11 rounded-xl"
                  onClick={saveCurrentDraft}
                  disabled={!body.trim()}
                >
                  <Save />
                  Save draft
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11 rounded-xl"
                  onClick={copyCurrentDraft}
                  disabled={!body.trim()}
                >
                  {copied ? <Check /> : <Clipboard />}
                  {copied ? "Copied" : "Copy text"}
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11 rounded-xl"
                  onClick={downloadCurrentDraft}
                  disabled={!body.trim()}
                >
                  <Download />
                  Download .txt
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-11 rounded-xl"
                  onClick={createDraft}
                >
                  <RotateCcw />
                  Rebuild
                </Button>
              </div>
              <p
                className={`text-xs ${actionError ? "font-medium text-[#b42318]" : "text-[#6b7280]"}`}
                role={actionError ? "alert" : undefined}
                aria-live="polite"
              >
                {actionError ||
                  (copied
                    ? "Draft copied to your clipboard."
                    : "Edits remain in this tab until you save the draft.")}
              </p>
            </>
          ) : (
            <EmptyState
              title="Start with a useful brief"
              description="Choose a format, adjust the options, and create a deterministic local draft. You can edit every word before saving."
              action={
                <FileText
                  className="mx-auto size-8 text-[#5a2aff]"
                  aria-hidden="true"
                />
              }
            />
          )}
        </Card>
      </div>

      <section className="mt-8" aria-labelledby="history-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="history-title" className="text-xl font-semibold">
              Saved draft history
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Saved locally in this browser.
            </p>
          </div>
          <span className="text-sm tabular text-[#6b7280]">
            {visibleDrafts.length} saved
          </span>
        </div>
        {visibleDrafts.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleDrafts.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => openHistoryDraft(item)}
                className="focus-ring group min-h-32 rounded-2xl border border-[#e5e7eb] bg-white p-4 text-left transition-colors hover:border-[#b8a6ff] hover:bg-[#faf9ff]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <FileClock
                      className="size-4 text-[#5a2aff]"
                      aria-hidden="true"
                    />
                    {item.format}
                  </span>
                  <span className="text-xs text-[#6b7280]">Local</span>
                </span>
                <span className="mt-3 line-clamp-2 block text-sm leading-6 text-[#4a4a4d]">
                  {item.brief}
                </span>
                <span className="mt-3 block text-xs font-semibold text-[#4b23c6] group-hover:underline">
                  Open draft
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved drafts yet"
            description="Create a draft and choose Save draft. Your history stays in this browser only."
          />
        )}
      </section>
    </div>
  );
}
