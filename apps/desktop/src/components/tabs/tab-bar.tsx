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
    <div className="flex items-center border-b border-[#2a2a2e] bg-[#0a0a0b]">
      <div className="flex flex-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex shrink-0 items-center gap-1.5 border-r border-[#2a2a2e] px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#141416] text-[#e4e4e7]"
                  : "bg-[#0a0a0b] text-[#71717a] hover:bg-[#141416] hover:text-[#a1a1aa]"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${METHOD_COLORS[tab.method]}`}
              >
                {tab.method}
              </span>
              <span className="max-w-[120px] truncate">{tab.name}</span>
              {tab.isDirty && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#71717a]" />
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-1 rounded p-0.5 opacity-0 hover:bg-[#2a2a2e] group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={newTab}
        className="shrink-0 p-2 text-[#71717a] hover:text-[#a1a1aa]"
        title="New Tab (Ctrl+T)"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
