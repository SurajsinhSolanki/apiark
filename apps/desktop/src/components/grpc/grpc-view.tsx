import { useTranslation } from "react-i18next";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { grpcLoadProto, grpcCallUnary } from "@/lib/tauri-api";
import { open } from "@tauri-apps/plugin-dialog";
import type { GrpcState } from "@apiark/types";
import { Play, Upload } from "lucide-react";

export function GrpcView() {
  const { t } = useTranslation();
  const tab = useActiveTab();

  if (!tab || tab.protocol !== "grpc" || !tab.grpc) {
    return null;
  }

  const grpc = tab.grpc;

  const updateGrpc = (patch: Partial<GrpcState>) => {
    useTabStore.setState((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === state.activeTabId && t.grpc
          ? { ...t, grpc: { ...t.grpc!, ...patch } }
          : t,
      ),
    }));
  };

  const handleLoadProto = async () => {
    try {
      const selected = await open({
        filters: [{ name: "Proto Files", extensions: ["proto"] }],
        multiple: false,
      });
      if (!selected) return;

      const services = await grpcLoadProto(tab.id, selected as string);
      updateGrpc({
        services,
        selectedService: services[0]?.fullName ?? null,
        selectedMethod: services[0]?.methods[0]?.name ?? null,
        error: null,
      });
    } catch (err) {
      updateGrpc({ error: String(err) });
    }
  };

  const handleSend = async () => {
    if (!grpc.selectedService || !grpc.selectedMethod) return;

    updateGrpc({ loading: true, error: null, response: null });

    try {
      const metadata = grpc.metadata
        .filter((m) => m.key.trim() && m.enabled)
        .map((m) => ({ key: m.key, value: m.value }));

      const response = await grpcCallUnary(
        tab.id,
        tab.url,
        grpc.selectedService,
        grpc.selectedMethod,
        grpc.requestJson,
        metadata,
      );

      updateGrpc({ response, loading: false });
    } catch (err) {
      updateGrpc({ error: String(err), loading: false });
    }
  };

  const selectedSvc = grpc.services.find((s) => s.fullName === grpc.selectedService);
  const selectedMtd = selectedSvc?.methods.find((m) => m.name === grpc.selectedMethod);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* URL bar */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
        <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">
          gRPC
        </span>
        <input
          type="text"
          value={tab.url}
          onChange={(e) => useTabStore.getState().setUrl(e.target.value)}
          placeholder="grpc://localhost:50051"
          className="flex-1 rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleLoadProto}
          className="flex items-center gap-1 rounded bg-[var(--color-elevated)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
        >
          <Upload className="h-3 w-3" />
          {t("grpc.loadProto")}
        </button>
        <button
          onClick={handleSend}
          disabled={grpc.loading || !grpc.selectedMethod}
          className="flex items-center gap-1 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          {grpc.loading ? t("request.sending") : t("request.send")}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: service/method selection + request */}
        <div className="flex w-1/2 flex-col border-r border-[var(--color-border)]">
          {/* Service & Method selector */}
          {grpc.services.length > 0 && (
            <div className="flex gap-2 border-b border-[var(--color-border)] px-3 py-2">
              <select
                value={grpc.selectedService ?? ""}
                onChange={(e) => {
                  const svc = grpc.services.find((s) => s.fullName === e.target.value);
                  updateGrpc({
                    selectedService: e.target.value,
                    selectedMethod: svc?.methods[0]?.name ?? null,
                  });
                }}
                className="flex-1 rounded bg-[var(--color-elevated)] px-2 py-1 text-xs text-[var(--color-text-primary)] outline-none"
              >
                {grpc.services.map((s) => (
                  <option key={s.fullName} value={s.fullName}>{s.fullName}</option>
                ))}
              </select>
              <select
                value={grpc.selectedMethod ?? ""}
                onChange={(e) => updateGrpc({ selectedMethod: e.target.value })}
                className="flex-1 rounded bg-[var(--color-elevated)] px-2 py-1 text-xs text-[var(--color-text-primary)] outline-none"
              >
                {selectedSvc?.methods.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.callType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Method info */}
          {selectedMtd && (
            <div className="border-b border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]">
              Input: {selectedMtd.inputType} | Output: {selectedMtd.outputType}
            </div>
          )}

          {/* Request JSON editor */}
          <div className="flex-1 overflow-auto p-3">
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t("grpc.requestBody")}
            </label>
            <textarea
              value={grpc.requestJson}
              onChange={(e) => updateGrpc({ requestJson: e.target.value })}
              className="h-full w-full resize-none rounded bg-[var(--color-elevated)] p-3 font-mono text-sm text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-blue-500"
              placeholder='{ "field": "value" }'
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right panel: response */}
        <div className="flex w-1/2 flex-col">
          {grpc.error ? (
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <div>
                <p className="text-sm text-red-400">{grpc.error}</p>
              </div>
            </div>
          ) : grpc.response ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <span className={`text-sm font-semibold ${grpc.response.statusCode === 0 ? "text-green-500" : "text-red-400"}`}>
                  {grpc.response.statusCode === 0 ? "OK" : `Error ${grpc.response.statusCode}`}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{grpc.response.timeMs}ms</span>
              </div>
              <div className="flex-1 overflow-auto p-3">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm text-[var(--color-text-primary)]">
                  {tryFormatJson(grpc.response.body)}
                </pre>
              </div>
            </div>
          ) : grpc.loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                Sending gRPC request...
              </div>
            </div>
          ) : grpc.services.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-dimmed)]">
              {t("grpc.loadProtoToStart")}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-dimmed)]">
              {t("grpc.selectMethodToSend")}
            </div>
          )}
        </div>
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
