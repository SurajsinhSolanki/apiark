import { useState } from "react";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { KeyValueEditor } from "./key-value-editor";
import type { AuthConfig, BodyType } from "@apiark/types";

type Tab = "params" | "headers" | "body" | "auth";

const TABS: { id: Tab; label: string }[] = [
  { id: "params", label: "Params" },
  { id: "headers", label: "Headers" },
  { id: "body", label: "Body" },
  { id: "auth", label: "Auth" },
];

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "raw", label: "Raw" },
  { value: "urlencoded", label: "URL Encoded" },
  { value: "form-data", label: "Form Data" },
];

export function RequestPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("params");
  const tab = useActiveTab();
  const { setParams, setHeaders, setBody, setAuth } = useTabStore();

  if (!tab) return null;

  const { params, headers, body, auth } = tab;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-[#2a2a2e] bg-[#141416]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === t.id
                ? "border-b-2 border-blue-500 text-[#e4e4e7]"
                : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            {t.label}
            {t.id === "params" && params.filter((p) => p.key).length > 0 && (
              <span className="ml-1 text-xs text-[#52525b]">
                ({params.filter((p) => p.key).length})
              </span>
            )}
            {t.id === "headers" && headers.filter((h) => h.key).length > 0 && (
              <span className="ml-1 text-xs text-[#52525b]">
                ({headers.filter((h) => h.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "params" && (
          <KeyValueEditor
            pairs={params}
            onChange={setParams}
            keyPlaceholder="Parameter"
            valuePlaceholder="Value"
          />
        )}

        {activeTab === "headers" && (
          <KeyValueEditor
            pairs={headers}
            onChange={setHeaders}
            keyPlaceholder="Header"
            valuePlaceholder="Value"
          />
        )}

        {activeTab === "body" && (
          <BodyEditor body={body} onChange={setBody} />
        )}

        {activeTab === "auth" && (
          <AuthEditor auth={auth} onChange={setAuth} />
        )}
      </div>
    </div>
  );
}

function BodyEditor({
  body,
  onChange,
}: {
  body: { type: BodyType; content: string; formData: { key: string; value: string; enabled: boolean }[] };
  onChange: (body: { type: BodyType; content: string; formData: { key: string; value: string; enabled: boolean }[] }) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Body type selector */}
      <div className="flex gap-2">
        {BODY_TYPES.map((bt) => (
          <button
            key={bt.value}
            onClick={() => onChange({ ...body, type: bt.value })}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              body.type === bt.value
                ? "bg-blue-600 text-white"
                : "bg-[#1c1c1f] text-[#a1a1aa] hover:text-[#e4e4e7]"
            }`}
          >
            {bt.label}
          </button>
        ))}
      </div>

      {/* Body content */}
      {body.type !== "none" && body.type !== "form-data" && body.type !== "urlencoded" && (
        <textarea
          value={body.content}
          onChange={(e) => onChange({ ...body, content: e.target.value })}
          placeholder={body.type === "json" ? '{\n  "key": "value"\n}' : ""}
          className="h-48 w-full resize-y rounded bg-[#1c1c1f] p-3 font-mono text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      )}

      {(body.type === "form-data" || body.type === "urlencoded") && (
        <KeyValueEditor
          pairs={body.formData.length > 0 ? body.formData : [{ key: "", value: "", enabled: true }]}
          onChange={(formData) => onChange({ ...body, formData })}
          keyPlaceholder="Field"
          valuePlaceholder="Value"
        />
      )}
    </div>
  );
}

function AuthEditor({
  auth,
  onChange,
}: {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Auth type selector */}
      <select
        value={auth.type}
        onChange={(e) => {
          const type = e.target.value as AuthConfig["type"];
          switch (type) {
            case "none":
              onChange({ type: "none" });
              break;
            case "bearer":
              onChange({ type: "bearer", token: "" });
              break;
            case "basic":
              onChange({ type: "basic", username: "", password: "" });
              break;
            case "api-key":
              onChange({ type: "api-key", key: "", value: "", addTo: "header" });
              break;
          }
        }}
        className="rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="none">No Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic Auth</option>
        <option value="api-key">API Key</option>
      </select>

      {/* Auth fields */}
      {auth.type === "bearer" && (
        <input
          type="text"
          value={auth.token}
          onChange={(e) => onChange({ ...auth, token: e.target.value })}
          placeholder="Token"
          className="w-full rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      {auth.type === "basic" && (
        <div className="space-y-2">
          <input
            type="text"
            value={auth.username}
            onChange={(e) => onChange({ ...auth, username: e.target.value })}
            placeholder="Username"
            className="w-full rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            value={auth.password}
            onChange={(e) => onChange({ ...auth, password: e.target.value })}
            placeholder="Password"
            className="w-full rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {auth.type === "api-key" && (
        <div className="space-y-2">
          <input
            type="text"
            value={auth.key}
            onChange={(e) => onChange({ ...auth, key: e.target.value })}
            placeholder="Key name (e.g. X-API-Key)"
            className="w-full rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            value={auth.value}
            onChange={(e) => onChange({ ...auth, value: e.target.value })}
            placeholder="Value"
            className="w-full rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] placeholder-[#52525b] outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={auth.addTo}
            onChange={(e) =>
              onChange({ ...auth, addTo: e.target.value as "header" | "query" })
            }
            className="rounded bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#e4e4e7] outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="header">Header</option>
            <option value="query">Query Param</option>
          </select>
        </div>
      )}
    </div>
  );
}
