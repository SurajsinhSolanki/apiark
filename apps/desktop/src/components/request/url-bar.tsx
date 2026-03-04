import { useTabStore, useActiveTab } from "@/stores/tab-store";
import type { HttpMethod } from "@apiark/types";
import { Loader2, Send } from "lucide-react";

const METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  PATCH: "text-purple-500",
  DELETE: "text-red-500",
  HEAD: "text-cyan-500",
  OPTIONS: "text-gray-500",
};

export function UrlBar() {
  const tab = useActiveTab();
  const { setMethod, setUrl, send } = useTabStore();

  if (!tab) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      send();
    }
  };

  return (
    <div className="flex items-center gap-2 border-b border-[#2a2a2e] bg-[#141416] px-3 py-2">
      {/* Method selector */}
      <select
        value={tab.method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        className={`${METHOD_COLORS[tab.method]} cursor-pointer rounded bg-[#1c1c1f] px-2 py-1.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500`}
      >
        {METHODS.map((m) => (
          <option key={m} value={m} className="text-[#e4e4e7]">
            {m}
          </option>
        ))}
      </select>

      {/* URL input */}
      <input
        type="text"
        value={tab.url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Send button */}
      <button
        onClick={send}
        disabled={tab.loading || !tab.url.trim()}
        className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {tab.loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send
      </button>
    </div>
  );
}
