"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  initialClients,
  initialLinks,
  initialSettings,
  type ClientCv,
  type Draft,
  type LinkRow,
  type PartnerSettings,
} from "@/data/demo-data";

type DemoState = {
  clients: ClientCv[];
  links: LinkRow[];
  drafts: Draft[];
  settings: PartnerSettings;
};

type DemoContextValue = DemoState & {
  ready: boolean;
  addClient: (client: ClientCv) => void;
  addLink: (link: LinkRow) => void;
  updateLink: (id: string, patch: Partial<LinkRow>) => void;
  saveDraft: (draft: Draft) => void;
  saveSettings: (settings: PartnerSettings) => void;
  resetDemo: () => void;
};

const STORAGE_KEY = "tabbio-partner-demo-v1";
const ONBOARDING_STORAGE_KEY = "tabbio-partner-onboarding-local-v1";
export const DEMO_RESET_EVENT = "tabbio:demo-reset";

const clientStyles = new Set<ClientCv["style"]>([
  "Modern",
  "Classic",
  "Minimal",
]);
const clientStatuses = new Set<ClientCv["status"]>([
  "Draft",
  "Sent",
  "Viewed",
  "Claim pending",
  "Claimed",
  "Expired",
  "Archived",
]);
const draftFormats = new Set<Draft["format"]>(["Script", "Post", "Article"]);

function createInitialState(): DemoState {
  return {
    clients: initialClients.map((client) => ({ ...client })),
    links: initialLinks.map((link) => ({ ...link })),
    drafts: [],
    settings: { ...initialSettings },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function readBoundedText(value: unknown, fallback: string, maxLength: number) {
  if (!isString(value)) return fallback;
  const normalized = value.trim().slice(0, maxLength);
  return normalized || fallback;
}

function readClient(value: unknown): ClientCv | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isString(value.style) ||
    !clientStyles.has(value.style as ClientCv["style"]) ||
    !isString(value.status) ||
    !clientStatuses.has(value.status as ClientCv["status"]) ||
    !isString(value.edited) ||
    !isString(value.claimCode)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    style: value.style as ClientCv["style"],
    status: value.status as ClientCv["status"],
    edited: value.edited,
    claimCode: value.claimCode,
  };
}

function readLink(value: unknown): LinkRow | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.channel) ||
    !isString(value.campaign) ||
    !isString(value.destination) ||
    !isFiniteNumber(value.clicks) ||
    !isFiniteNumber(value.signups) ||
    !isFiniteNumber(value.paying) ||
    (value.archived !== undefined && typeof value.archived !== "boolean")
  ) {
    return null;
  }

  return {
    id: value.id,
    channel: value.channel,
    campaign: value.campaign,
    destination: value.destination,
    clicks: Math.max(0, value.clicks),
    signups: Math.max(0, value.signups),
    paying: Math.max(0, value.paying),
    ...(value.archived === undefined ? {} : { archived: value.archived }),
  };
}

function readDraft(value: unknown): Draft | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.format) ||
    !draftFormats.has(value.format as Draft["format"]) ||
    !isString(value.brief) ||
    !isString(value.body) ||
    !isString(value.createdAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    format: value.format as Draft["format"],
    brief: value.brief,
    body: value.body,
    createdAt: value.createdAt,
  };
}

function readSettings(value: unknown): PartnerSettings {
  if (!isRecord(value)) return { ...initialSettings };

  const storedSlug = isString(value.slug) ? value.slug.trim() : "";

  return {
    publicName: readBoundedText(
      value.publicName,
      initialSettings.publicName,
      80,
    ),
    audience: readBoundedText(value.audience, initialSettings.audience, 240),
    lane: readBoundedText(value.lane, initialSettings.lane, 80),
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(storedSlug)
      ? storedSlug.slice(0, 48)
      : initialSettings.slug,
    commissionChanges:
      typeof value.commissionChanges === "boolean"
        ? value.commissionChanges
        : initialSettings.commissionChanges,
    payoutUpdates:
      typeof value.payoutUpdates === "boolean"
        ? value.payoutUpdates
        : initialSettings.payoutUpdates,
    complianceReminders:
      typeof value.complianceReminders === "boolean"
        ? value.complianceReminders
        : initialSettings.complianceReminders,
    productResources:
      typeof value.productResources === "boolean"
        ? value.productResources
        : initialSettings.productResources,
  };
}

function readList<Item>(
  value: unknown,
  fallback: readonly Item[],
  readItem: (item: unknown) => Item | null,
): Item[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value.slice(0, 250).flatMap((item) => {
    const parsed = readItem(item);
    return parsed ? [parsed] : [];
  });
}

function readStoredState(value: unknown): DemoState {
  if (!isRecord(value)) return createInitialState();

  return {
    clients: readList(value.clients, initialClients, readClient),
    links: readList(value.links, initialLinks, readLink),
    drafts: readList(value.drafts, [], readDraft),
    // Older prototypes called this record `profile`; accept it during migration.
    settings: readSettings(value.settings ?? value.profile),
  };
}

const initialState = createInitialState();
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState(readStoredState(JSON.parse(stored) as unknown));
    } catch {
      // Storage can be unavailable or contain invalid demo data. State remains
      // fully usable in memory so public and partner routes still render.
      setState(createInitialState());
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Keep the React state as the in-memory fallback when persistence fails.
    }
  }, [ready, state]);

  const addClient = useCallback(
    (client: ClientCv) =>
      setState((current) => ({
        ...current,
        clients: [client, ...current.clients],
      })),
    [],
  );
  const addLink = useCallback(
    (link: LinkRow) =>
      setState((current) => ({ ...current, links: [link, ...current.links] })),
    [],
  );
  const updateLink = useCallback(
    (id: string, patch: Partial<LinkRow>) =>
      setState((current) => ({
        ...current,
        links: current.links.map((link) =>
          link.id === id ? { ...link, ...patch } : link,
        ),
      })),
    [],
  );
  const saveDraft = useCallback(
    (draft: Draft) =>
      setState((current) => ({
        ...current,
        drafts: [
          draft,
          ...current.drafts.filter((item) => item.id !== draft.id),
        ],
      })),
    [],
  );
  const saveSettings = useCallback(
    (settings: PartnerSettings) =>
      setState((current) => ({ ...current, settings })),
    [],
  );
  const resetDemo = useCallback(() => {
    setState(createInitialState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Reset remains effective for the current tab when storage is blocked.
    }
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // The mounted onboarding screen is reset through the event below.
    }
    window.dispatchEvent(new Event(DEMO_RESET_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      addClient,
      addLink,
      updateLink,
      saveDraft,
      saveSettings,
      resetDemo,
    }),
    [
      state,
      ready,
      addClient,
      addLink,
      updateLink,
      saveDraft,
      saveSettings,
      resetDemo,
    ],
  );
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
