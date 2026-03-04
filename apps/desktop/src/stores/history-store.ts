import { create } from "zustand";
import type { HistoryEntry } from "@apiark/types";
import {
  getHistory as getHistoryApi,
  searchHistory as searchHistoryApi,
  clearHistory as clearHistoryApi,
} from "@/lib/tauri-api";

interface HistoryState {
  entries: HistoryEntry[];
  loading: boolean;

  loadHistory: () => Promise<void>;
  searchHistory: (query: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  entries: [],
  loading: false,

  loadHistory: async () => {
    set({ loading: true });
    try {
      const entries = await getHistoryApi();
      set({ entries, loading: false });
    } catch (err) {
      console.error("Failed to load history:", err);
      set({ loading: false });
    }
  },

  searchHistory: async (query) => {
    set({ loading: true });
    try {
      const entries = await searchHistoryApi(query);
      set({ entries, loading: false });
    } catch (err) {
      console.error("Failed to search history:", err);
      set({ loading: false });
    }
  },

  clearHistory: async () => {
    try {
      await clearHistoryApi();
      set({ entries: [] });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  },
}));
