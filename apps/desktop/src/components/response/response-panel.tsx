import { useState } from "react";
import { useActiveTab } from "@/stores/tab-store";
import { AlertCircle } from "lucide-react";

type Tab = "body" | "headers" | "cookies";

function statusColor(status: number): string {
  if (status < 200) return "text-blue-400";
  if (status < 300) return "text-green-500";
  if (status < 400) return "text-yellow-500";
  if (status < 500) return "text-red-400";
  return "text-red-500";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResponsePanel() {
  const tab = useActiveTab();
  const [activeTab, setActiveTab] = useState<Tab>("body");

  if (!tab) return null;

  const { response, error, loading } = tab;

  // Empty state
  if (!response && !error && !loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#52525b]">
        Send a request to see the response
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#71717a]">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          Sending request...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-400">{error.message}</p>
          {error.suggestion && (
            <p className="mt-1 text-xs text-[#71717a]">{error.suggestion}</p>
          )}
        </div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 border-b border-[#2a2a2e] bg-[#141416] px-3 py-2">
        <span className={`text-sm font-semibold ${statusColor(response.status)}`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-xs text-[#71717a]">{response.timeMs}ms</span>
        <span className="text-xs text-[#71717a]">
          {formatSize(response.sizeBytes)}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#2a2a2e] bg-[#141416]">
        {(["body", "headers", "cookies"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors ${
              activeTab === t
                ? "border-b-2 border-blue-500 text-[#e4e4e7]"
                : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            {t}
            {t === "headers" && (
              <span className="ml-1 text-xs text-[#52525b]">
                ({response.headers.length})
              </span>
            )}
            {t === "cookies" && response.cookies.length > 0 && (
              <span className="ml-1 text-xs text-[#52525b]">
                ({response.cookies.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "body" && (
          <pre className="whitespace-pre-wrap break-all font-mono text-sm text-[#e4e4e7]">
            {tryFormatJson(response.body)}
          </pre>
        )}

        {activeTab === "headers" && (
          <table className="w-full text-sm">
            <tbody>
              {response.headers.map((h, i) => (
                <tr key={i} className="border-b border-[#1c1c1f]">
                  <td className="py-1 pr-4 font-medium text-[#a1a1aa]">
                    {h.key}
                  </td>
                  <td className="py-1 text-[#e4e4e7]">{h.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "cookies" && (
          <>
            {response.cookies.length === 0 ? (
              <p className="text-sm text-[#52525b]">No cookies</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#71717a]">
                    <th className="pb-1 pr-4">Name</th>
                    <th className="pb-1 pr-4">Value</th>
                    <th className="pb-1 pr-4">Domain</th>
                    <th className="pb-1">Path</th>
                  </tr>
                </thead>
                <tbody>
                  {response.cookies.map((c, i) => (
                    <tr key={i} className="border-b border-[#1c1c1f]">
                      <td className="py-1 pr-4 font-medium text-[#a1a1aa]">
                        {c.name}
                      </td>
                      <td className="py-1 pr-4 text-[#e4e4e7]">{c.value}</td>
                      <td className="py-1 pr-4 text-[#71717a]">
                        {c.domain ?? "—"}
                      </td>
                      <td className="py-1 text-[#71717a]">{c.path ?? "/"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function tryFormatJson(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}
