import { create } from "zustand";
import type { AppSettings } from "@apiark/types";
import { getSettings, updateSettings as updateSettingsApi } from "@/lib/tauri-api";

interface SettingsState {
  settings: AppSettings;
  loaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: "dark",
  proxyUrl: null,
  proxyUsername: null,
  proxyPassword: null,
  verifySsl: true,
  followRedirects: true,
  timeoutMs: 30000,
  sidebarWidth: 256,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  loaded: false,

  loadSettings: async () => {
    try {
      const settings = await getSettings();
      set({ settings, loaded: true });
    } catch (err) {
      console.error("Failed to load settings:", err);
      set({ loaded: true });
    }
  },

  updateSettings: async (patch) => {
    try {
      const settings = await updateSettingsApi(patch);
      set({ settings });
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  },
}));
