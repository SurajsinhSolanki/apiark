import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { KeyValueEditor } from "@/components/request/key-value-editor";
import { ResponsePanel } from "@/components/response/response-panel";
import { CodeEditor } from "@/components/ui/code-editor";
import { Download } from "lucide-react";
import type { AuthConfig } from "@apiark/types";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { UrlBar } from "@/components/request/url-bar";

type GqlTab = "query" | "variables" | "headers" | "auth";

const INTROSPECTION_QUERY = `query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
      fields(includeDeprecated: false) {
        name
        type { name kind ofType { name kind } }
      }
    }
    queryType { name }
    mutationType { name }
    subscriptionType { name }
  }
}`;

export function GraphQLView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<GqlTab>("query");
  const [schemaTypes, setSchemaTypes] = useState<{ name: string; kind: string }[]>([]);
  const [fetchingSchema, setFetchingSchema] = useState(false);
  const tab = useActiveTab();
  const {
    setHeaders,
    setAuth,
    setGraphQLQuery,
    setGraphQLVariables,
    setGraphQLOperationName,
    setGraphQLSchema,
    send,
  } = useTabStore();

  if (!tab || !tab.graphql) return null;

  const handleFetchSchema = async () => {
    if (!tab.url.trim()) return;
    setFetchingSchema(true);
    // Temporarily set graphql query to introspection, send, then restore
    const originalQuery = tab.graphql!.query;
    setGraphQLQuery(INTROSPECTION_QUERY);
    setGraphQLOperationName("IntrospectionQuery");
    await send();
    // Restore original query
    setGraphQLQuery(originalQuery);
    setGraphQLOperationName(tab.graphql!.operationName);

    // Parse schema from response
    const updated = useTabStore.getState().tabs.find((t) => t.id === tab.id);
    if (updated?.response?.body) {
      try {
        const data = JSON.parse(updated.response.body);
        const types = data?.data?.__schema?.types?.filter(
          (t: { name: string }) => !t.name.startsWith("__"),
        ) ?? [];
        setSchemaTypes(types);
        setGraphQLSchema(updated.response.body);
      } catch {
        setSchemaTypes([]);
      }
    }
    setFetchingSchema(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Breadcrumb />
      <UrlBar
        extraActions={
          <button
            onClick={handleFetchSchema}
            disabled={fetchingSchema || !tab.url.trim()}
            className="flex items-center gap-1 rounded-lg bg-[var(--color-elevated)] px-2.5 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] disabled:opacity-50"
            title={t("graphql.fetchSchema")}
          >
            <Download className="h-3 w-3" />
            {fetchingSchema ? t("graphql.fetchingSchema") : t("graphql.schema")}
          </button>
        }
      />

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Query editor */}
        <div className="flex min-h-0 w-1/2 flex-col border-r border-[var(--color-border)]">
          {/* Tab bar */}
          <div className="flex shrink-0 gap-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {(["query", "variables", "headers", "auth"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${
                  activeTab === t
                    ? "border-b-2 border-purple-500 text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col p-3">
            {activeTab === "query" && (
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div className="flex shrink-0 items-center justify-between">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {t("graphql.query")}
                  </label>
                  <input
                    type="text"
                    value={tab.graphql.operationName}
                    onChange={(e) => setGraphQLOperationName(e.target.value)}
                    placeholder={t("graphql.operationName")}
                    className="rounded bg-[var(--color-elevated)] px-2 py-1 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none"
                  />
                </div>
                <div className="min-h-0 flex-1">
                  <CodeEditor
                    value={tab.graphql.query}
                    onChange={(v) => setGraphQLQuery(v)}
                    language="graphql"
                    height="100%"
                    placeholder="query { users { id name } }"
                  />
                </div>
              </div>
            )}

            {activeTab === "variables" && (
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <label className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
                  {t("graphql.variablesJson")}
                </label>
                <div className="min-h-0 flex-1">
                  <CodeEditor
                    value={tab.graphql.variables}
                    onChange={(v) => setGraphQLVariables(v)}
                    language="json"
                    height="100%"
                    placeholder='{ "id": "123" }'
                  />
                </div>
              </div>
            )}

            {activeTab === "headers" && (
              <div className="overflow-auto">
                <KeyValueEditor
                  pairs={tab.headers}
                  onChange={setHeaders}
                  keyPlaceholder={t("request.header")}
                  valuePlaceholder={t("request.value")}
                />
              </div>
            )}

            {activeTab === "auth" && (
              <div className="overflow-auto">
                <AuthEditorCompact auth={tab.auth} onChange={setAuth} />
              </div>
            )}
          </div>

          {/* Schema types panel */}
          {schemaTypes.length > 0 && (
            <div className="max-h-32 overflow-auto border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
              <p className="mb-1 text-xs font-medium text-[var(--color-text-secondary)]">
                Schema Types ({schemaTypes.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {schemaTypes.slice(0, 50).map((t) => (
                  <span
                    key={t.name}
                    className="rounded bg-[var(--color-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]"
                    title={t.kind}
                  >
                    {t.name}
                  </span>
                ))}
                {schemaTypes.length > 50 && (
                  <span className="text-[10px] text-[var(--color-text-dimmed)]">
                    +{schemaTypes.length - 50} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Response */}
        <div className="flex w-1/2 flex-col">
          <ResponsePanel />
        </div>
      </div>
    </div>
  );
}

function AuthEditorCompact({
  auth,
  onChange,
}: {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <select
        value={auth.type}
        onChange={(e) => {
          const type = e.target.value as AuthConfig["type"];
          switch (type) {
            case "none": onChange({ type: "none" }); break;
            case "bearer": onChange({ type: "bearer", token: "" }); break;
            case "basic": onChange({ type: "basic", username: "", password: "" }); break;
            case "api-key": onChange({ type: "api-key", key: "", value: "", addTo: "header" }); break;
          }
        }}
        className="rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-purple-500"
      >
        <option value="none">{t("auth.none")}</option>
        <option value="bearer">{t("auth.bearer")}</option>
        <option value="basic">{t("auth.basic")}</option>
        <option value="api-key">{t("auth.apiKey")}</option>
      </select>

      {auth.type === "bearer" && (
        <input
          type="text"
          value={auth.token}
          onChange={(e) => onChange({ ...auth, token: e.target.value })}
          placeholder={t("auth.token")}
          className="w-full rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none focus:ring-1 focus:ring-purple-500"
        />
      )}

      {auth.type === "basic" && (
        <div className="space-y-2">
          <input type="text" value={auth.username} onChange={(e) => onChange({ ...auth, username: e.target.value })} placeholder={t("auth.username")} className="w-full rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none" />
          <input type="password" value={auth.password} onChange={(e) => onChange({ ...auth, password: e.target.value })} placeholder={t("auth.password")} className="w-full rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none" />
        </div>
      )}
    </div>
  );
}
