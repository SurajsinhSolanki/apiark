import { create } from "zustand";

export interface ConsoleLogEntry {
  id: number;
  timestamp: number;
  level: "log" | "info" | "warn" | "error";
  source: string;
  message: string;
}

interface ConsoleState {
  entries: ConsoleLogEntry[];
  open: boolean;
  height: number;
  filter: "all" | "log" | "info" | "warn" | "error";

  log: (source: string, message: string, level?: ConsoleLogEntry["level"]) => void;
  clear: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setHeight: (height: number) => void;
  setFilter: (filter: ConsoleState["filter"]) => void;
}

let nextId = 1;

export const useConsoleStore = create<ConsoleState>((set) => ({
  entries: [],
  open: false,
  height: 200,
  filter: "all",

  log: (source, message, level = "log") => {
    set((state) => ({
      entries: [
        ...state.entries.slice(-999),
        { id: nextId++, timestamp: Date.now(), level, source, message },
      ],
    }));
  },

  clear: () => set({ entries: [] }),
  toggle: () => set((s) => ({ open: !s.open })),
  setOpen: (open) => set({ open }),
  setHeight: (height) => set({ height: Math.max(100, Math.min(500, height)) }),
  setFilter: (filter) => set({ filter }),
}));
