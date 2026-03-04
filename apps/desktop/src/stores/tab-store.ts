import { create } from "zustand";
import type {
  HttpMethod,
  KeyValuePair,
  RequestBody,
  AuthConfig,

  HttpError,
  Tab,
  RequestFile,
} from "@apiark/types";
import {
  sendRequest,
  readRequestFile,
  saveRequestFile,
  loadPersistedState,
  savePersistedState,
} from "@/lib/tauri-api";
import { useEnvironmentStore } from "./environment-store";
import { useSettingsStore } from "./settings-store";

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;

  // Tab management
  newTab: () => void;
  openTab: (filePath: string, collectionPath: string) => Promise<void>;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  // Active tab request mutations
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setHeaders: (headers: KeyValuePair[]) => void;
  setParams: (params: KeyValuePair[]) => void;
  setBody: (body: RequestBody) => void;
  setAuth: (auth: AuthConfig) => void;

  // Actions
  send: () => Promise<void>;
  save: () => Promise<void>;
  clearResponse: () => void;

  // Persistence
  persistTabs: () => void;
  restoreTabs: () => Promise<void>;
}

let tabCounter = 0;
function generateTabId(): string {
  return `tab_${Date.now()}_${++tabCounter}`;
}

const emptyKvRow = (): KeyValuePair => ({ key: "", value: "", enabled: true });

function createEmptyTab(overrides?: Partial<Tab>): Tab {
  return {
    id: generateTabId(),
    name: "Untitled Request",
    filePath: null,
    collectionPath: null,
    isDirty: false,
    method: "GET",
    url: "",
    headers: [emptyKvRow()],
    params: [emptyKvRow()],
    body: { type: "none", content: "", formData: [] },
    auth: { type: "none" },
    response: null,
    error: null,
    loading: false,
    ...overrides,
  };
}

function requestFileToTab(
  file: RequestFile,
  filePath: string,
  collectionPath: string,
): Tab {
  // Convert Record<string, string> headers to KeyValuePair[]
  const headers: KeyValuePair[] = Object.entries(file.headers || {}).map(
    ([key, value]) => ({ key, value, enabled: true }),
  );
  if (headers.length === 0) headers.push(emptyKvRow());

  // Convert Record<string, string> params to KeyValuePair[]
  const params: KeyValuePair[] = Object.entries(file.params || {}).map(
    ([key, value]) => ({ key, value, enabled: true }),
  );
  if (params.length === 0) params.push(emptyKvRow());

  // Convert body
  const body: RequestBody = file.body
    ? {
        type: file.body.type as RequestBody["type"],
        content: file.body.content || "",
        formData: [],
      }
    : { type: "none", content: "", formData: [] };

  return {
    id: generateTabId(),
    name: file.name,
    filePath,
    collectionPath,
    isDirty: false,
    method: file.method,
    url: file.url,
    headers,
    params,
    body,
    auth: file.auth || { type: "none" },
    response: null,
    error: null,
    loading: false,
  };
}

function tabToRequestFile(tab: Tab): RequestFile {
  // Convert KeyValuePair[] to Record<string, string> (only enabled, non-empty)
  const headers: Record<string, string> = {};
  for (const h of tab.headers) {
    if (h.key.trim() && h.enabled) {
      headers[h.key] = h.value;
    }
  }

  const params: Record<string, string> = {};
  for (const p of tab.params) {
    if (p.key.trim() && p.enabled) {
      params[p.key] = p.value;
    }
  }

  return {
    name: tab.name,
    method: tab.method,
    url: tab.url,
    headers,
    params: Object.keys(params).length > 0 ? params : undefined,
    auth: tab.auth.type !== "none" ? tab.auth : undefined,
    body:
      tab.body.type !== "none"
        ? { type: tab.body.type, content: tab.body.content }
        : undefined,
  };
}

function updateActiveTab(
  state: TabState,
  updater: (tab: Tab) => Partial<Tab>,
): Partial<TabState> {
  if (!state.activeTabId) return {};
  return {
    tabs: state.tabs.map((t) =>
      t.id === state.activeTabId
        ? { ...t, ...updater(t), isDirty: true }
        : t,
    ),
  };
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  newTab: () => {
    const tab = createEmptyTab();
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    }));
  },

  openTab: async (filePath, collectionPath) => {
    // Check if already open
    const existing = get().tabs.find((t) => t.filePath === filePath);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }

    try {
      const file = await readRequestFile(filePath);
      const tab = requestFileToTab(file, filePath, collectionPath);
      set((state) => ({
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      }));
    } catch (err) {
      console.error("Failed to open request file:", err);
    }
  },

  closeTab: (id) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === id);
      const newTabs = state.tabs.filter((t) => t.id !== id);
      let newActive = state.activeTabId;
      if (state.activeTabId === id) {
        if (newTabs.length === 0) {
          newActive = null;
        } else if (idx >= newTabs.length) {
          newActive = newTabs[newTabs.length - 1].id;
        } else {
          newActive = newTabs[idx].id;
        }
      }
      return { tabs: newTabs, activeTabId: newActive };
    });
  },

  closeOtherTabs: (id) => {
    set((state) => ({
      tabs: state.tabs.filter((t) => t.id === id),
      activeTabId: id,
    }));
  },

  closeAllTabs: () => {
    set({ tabs: [], activeTabId: null });
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
  },

  reorderTabs: (fromIndex, toIndex) => {
    set((state) => {
      const newTabs = [...state.tabs];
      const [moved] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, moved);
      return { tabs: newTabs };
    });
  },

  // Request mutations (apply to active tab)
  setMethod: (method) => set((state) => updateActiveTab(state, () => ({ method }))),
  setUrl: (url) => set((state) => updateActiveTab(state, () => ({ url }))),
  setHeaders: (headers) => set((state) => updateActiveTab(state, () => ({ headers }))),
  setParams: (params) => set((state) => updateActiveTab(state, () => ({ params }))),
  setBody: (body) => set((state) => updateActiveTab(state, () => ({ body }))),
  setAuth: (auth) => set((state) => updateActiveTab(state, () => ({ auth }))),

  send: async () => {
    const { tabs, activeTabId } = get();
    const tab = tabs.find((t) => t.id === activeTabId);
    if (!tab || !tab.url.trim()) return;

    // Mark loading
    set({
      tabs: tabs.map((t) =>
        t.id === activeTabId
          ? { ...t, loading: true, error: null, response: null }
          : t,
      ),
    });

    // Get resolved variables from environment store
    const envStore = useEnvironmentStore.getState();
    const variables = await envStore.getResolvedVariables();

    // Get network settings
    const { settings } = useSettingsStore.getState();
    const proxy = settings.proxyUrl
      ? {
          url: settings.proxyUrl,
          username: settings.proxyUsername ?? undefined,
          password: settings.proxyPassword ?? undefined,
        }
      : undefined;

    try {
      const response = await sendRequest(
        {
          method: tab.method,
          url: tab.url.trim(),
          headers: tab.headers.filter((h) => h.key.trim() !== "" && h.enabled),
          params: tab.params.filter((p) => p.key.trim() !== "" && p.enabled),
          body: tab.body.type !== "none" ? tab.body : undefined,
          auth: tab.auth.type !== "none" ? tab.auth : undefined,
          proxy,
          timeoutMs: settings.timeoutMs,
          followRedirects: settings.followRedirects,
          verifySsl: settings.verifySsl,
        },
        variables,
        tab.collectionPath ?? undefined,
        tab.name !== "Untitled Request" ? tab.name : undefined,
      );
      set({
        tabs: get().tabs.map((t) =>
          t.id === activeTabId ? { ...t, response, loading: false } : t,
        ),
      });
    } catch (err) {
      set({
        tabs: get().tabs.map((t) =>
          t.id === activeTabId
            ? { ...t, error: err as HttpError, loading: false }
            : t,
        ),
      });
    }
  },

  save: async () => {
    const { tabs, activeTabId } = get();
    const tab = tabs.find((t) => t.id === activeTabId);
    if (!tab || !tab.filePath) return;

    try {
      const requestFile = tabToRequestFile(tab);
      await saveRequestFile(tab.filePath, requestFile);
      set({
        tabs: get().tabs.map((t) =>
          t.id === activeTabId ? { ...t, isDirty: false } : t,
        ),
      });
    } catch (err) {
      console.error("Failed to save request:", err);
    }
  },

  clearResponse: () => {
    set((state) => updateActiveTab(state, () => ({ response: null, error: null })));
  },

  persistTabs: () => {
    const { tabs, activeTabId } = get();
    // Only persist file-backed tabs
    const persistedTabs = tabs
      .filter((t) => t.filePath && t.collectionPath)
      .map((t) => ({ filePath: t.filePath!, collectionPath: t.collectionPath! }));
    const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
    savePersistedState({
      tabs: persistedTabs,
      activeTabIndex: activeIndex >= 0 ? activeIndex : null,
    }).catch((err) => console.error("Failed to persist tabs:", err));
  },

  restoreTabs: async () => {
    try {
      const persisted = await loadPersistedState();
      if (persisted.tabs.length === 0) return;

      for (const pt of persisted.tabs) {
        try {
          const file = await readRequestFile(pt.filePath);
          const tab = requestFileToTab(file, pt.filePath, pt.collectionPath);
          set((state) => ({
            tabs: [...state.tabs, tab],
            activeTabId: state.activeTabId ?? tab.id,
          }));
        } catch {
          // File may have been deleted, skip it
        }
      }

      // Set active tab by index
      if (persisted.activeTabIndex != null) {
        const { tabs } = get();
        if (persisted.activeTabIndex < tabs.length) {
          set({ activeTabId: tabs[persisted.activeTabIndex].id });
        }
      }
    } catch (err) {
      console.error("Failed to restore tabs:", err);
    }
  },
}));

// Selectors
export const useActiveTab = () => {
  const { tabs, activeTabId } = useTabStore();
  return tabs.find((t) => t.id === activeTabId) ?? null;
};
