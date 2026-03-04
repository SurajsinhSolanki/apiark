import { create } from "zustand";
import type { EnvironmentData } from "@apiark/types";
import {
  loadEnvironments as loadEnvironmentsApi,
  getResolvedVariables as getResolvedVariablesApi,
} from "@/lib/tauri-api";

interface EnvironmentState {
  environments: EnvironmentData[];
  activeEnvironmentName: string | null;
  activeCollectionPath: string | null;

  loadEnvironments: (collectionPath: string) => Promise<void>;
  setActiveEnvironment: (name: string | null) => void;
  setActiveCollectionPath: (path: string | null) => void;
  getResolvedVariables: () => Promise<Record<string, string>>;
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  environments: [],
  activeEnvironmentName: null,
  activeCollectionPath: null,

  loadEnvironments: async (collectionPath) => {
    try {
      const envs = await loadEnvironmentsApi(collectionPath);
      set({
        environments: envs,
        activeCollectionPath: collectionPath,
        // Auto-select first environment if none selected
        activeEnvironmentName:
          get().activeEnvironmentName ??
          (envs.length > 0 ? envs[0].name : null),
      });
    } catch (err) {
      console.error("Failed to load environments:", err);
    }
  },

  setActiveEnvironment: (name) => {
    set({ activeEnvironmentName: name });
  },

  setActiveCollectionPath: (path) => {
    set({ activeCollectionPath: path });
  },

  getResolvedVariables: async () => {
    const { activeCollectionPath, activeEnvironmentName } = get();
    if (!activeCollectionPath || !activeEnvironmentName) {
      return {};
    }
    try {
      return await getResolvedVariablesApi(
        activeCollectionPath,
        activeEnvironmentName,
      );
    } catch (err) {
      console.error("Failed to resolve variables:", err);
      return {};
    }
  },
}));
