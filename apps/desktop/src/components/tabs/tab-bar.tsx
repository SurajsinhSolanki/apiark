import type { HttpMethod } from "@apiark/types";
import { useTabStore } from "@/stores/tab-store";
import { Plus, X } from "lucide-react";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  PATCH: "text-purple-500",
  DELETE: "text-red-500",
  HEAD: "text-cyan-500",
  OPTIONS: "text-gray-500",
};

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, newTab } = useTabStore();

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="flex flex-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex shrink-0 items-center gap-1.5 border-r border-[var(--color-border)] px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                  : "bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${METHOD_COLORS[tab.method]}`}
              >
                {tab.method}
              </span>
              <span className="max-w-[120px] truncate">{tab.name}</span>
              {tab.isDirty && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]" />
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-1 rounded p-0.5 opacity-0 hover:bg-[var(--color-border)] group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={newTab}
        className="shrink-0 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
        title="New Tab (Ctrl+T)"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
