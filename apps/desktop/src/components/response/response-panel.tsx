import { useState } from "react";
import { useActiveTab } from "@/stores/tab-store";
import { AlertCircle } from "lucide-react";
import { CodeGenerationPanel } from "./code-generation-panel";

type ResponseTab = "body" | "headers" | "cookies" | "code";

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
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");

  if (!tab) return null;

  const { response, error, loading } = tab;

  // Code generation is always available (doesn't need a response)
  if (activeTab === "code") {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ResponseTabs activeTab={activeTab} setActiveTab={setActiveTab} response={response} />
        <CodeGenerationPanel />
      </div>
    );
  }

  // Empty state
  if (!response && !error && !loading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ResponseTabs activeTab={activeTab} setActiveTab={setActiveTab} response={null} />
        <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-dimmed)]">
          Send a request to see the response
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-muted)]">
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
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{error.suggestion}</p>
          )}
        </div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <span className={`text-sm font-semibold ${statusColor(response.status)}`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">{response.timeMs}ms</span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {formatSize(response.sizeBytes)}
        </span>
      </div>

      {/* Tabs */}
      <ResponseTabs activeTab={activeTab} setActiveTab={setActiveTab} response={response} />

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "body" && (
          <pre className="whitespace-pre-wrap break-all font-mono text-sm text-[var(--color-text-primary)]">
            {tryFormatJson(response.body)}
          </pre>
        )}

        {activeTab === "headers" && (
          <table className="w-full text-sm">
            <tbody>
              {response.headers.map((h, i) => (
                <tr key={i} className="border-b border-[var(--color-elevated)]">
                  <td className="py-1 pr-4 font-medium text-[var(--color-text-secondary)]">
                    {h.key}
                  </td>
                  <td className="py-1 text-[var(--color-text-primary)]">{h.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "cookies" && (
          <>
            {response.cookies.length === 0 ? (
              <p className="text-sm text-[var(--color-text-dimmed)]">No cookies</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[var(--color-text-muted)]">
                    <th className="pb-1 pr-4">Name</th>
                    <th className="pb-1 pr-4">Value</th>
                    <th className="pb-1 pr-4">Domain</th>
                    <th className="pb-1">Path</th>
                  </tr>
                </thead>
                <tbody>
                  {response.cookies.map((c, i) => (
                    <tr key={i} className="border-b border-[var(--color-elevated)]">
                      <td className="py-1 pr-4 font-medium text-[var(--color-text-secondary)]">
                        {c.name}
                      </td>
                      <td className="py-1 pr-4 text-[var(--color-text-primary)]">{c.value}</td>
                      <td className="py-1 pr-4 text-[var(--color-text-muted)]">
                        {c.domain ?? "—"}
                      </td>
                      <td className="py-1 text-[var(--color-text-muted)]">{c.path ?? "/"}</td>
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

function ResponseTabs({
  activeTab,
  setActiveTab,
  response,
}: {
  activeTab: ResponseTab;
  setActiveTab: (tab: ResponseTab) => void;
  response: { headers: { key: string; value: string }[]; cookies: { name: string }[] } | null;
}) {
  const tabs: ResponseTab[] = ["body", "headers", "cookies", "code"];

  return (
    <div className="flex gap-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`px-4 py-2 text-sm capitalize transition-colors ${
            activeTab === t
              ? "border-b-2 border-blue-500 text-[var(--color-text-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          }`}
        >
          {t}
          {t === "headers" && response && (
            <span className="ml-1 text-xs text-[var(--color-text-dimmed)]">
              ({response.headers.length})
            </span>
          )}
          {t === "cookies" && response && response.cookies.length > 0 && (
            <span className="ml-1 text-xs text-[var(--color-text-dimmed)]">
              ({response.cookies.length})
            </span>
          )}
        </button>
      ))}
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
