// ── HTTP Methods & Body Types ──

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type BodyType =
  | "json"
  | "xml"
  | "form-data"
  | "urlencoded"
  | "raw"
  | "binary"
  | "none";

// ── Key-Value Pair ──

export interface KeyValuePair {
  key: string;
  value: string;
  enabled: boolean;
}

// ── Request Body ──

export interface RequestBody {
  type: BodyType;
  content: string;
  formData: KeyValuePair[];
}

// ── Auth (discriminated union matching Rust's tagged enum) ──

export type AuthConfig =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string }
  | {
      type: "api-key";
      key: string;
      value: string;
      addTo: "header" | "query";
    };

// ── Proxy ──

export interface ProxyConfig {
  url: string;
  username?: string;
  password?: string;
}

// ── Send Request Params (matches Rust SendRequestParams) ──

export interface SendRequestParams {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body?: RequestBody;
  auth?: AuthConfig;
  proxy?: ProxyConfig;
  timeoutMs?: number;
  followRedirects: boolean;
  verifySsl: boolean;
}

// ── Response (matches Rust ResponseData) ──

export interface CookieData {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  httpOnly: boolean;
  secure: boolean;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: KeyValuePair[];
  cookies: CookieData[];
  body: string;
  timeMs: number;
  sizeBytes: number;
}

// ── Error (matches Rust HttpError) ──

export interface HttpError {
  errorType: string;
  message: string;
  suggestion?: string;
}

// ── Collection Tree (matches Rust CollectionNode) ──

export type CollectionNode =
  | {
      type: "collection";
      name: string;
      path: string;
      children: CollectionNode[];
    }
  | {
      type: "folder";
      name: string;
      path: string;
      children: CollectionNode[];
    }
  | {
      type: "request";
      name: string;
      method: HttpMethod;
      path: string;
    };

// ── Request File (on-disk YAML format from Rust) ──

export interface RequestFile {
  name: string;
  method: HttpMethod;
  url: string;
  description?: string;
  headers: Record<string, string>;
  auth?: AuthConfig;
  body?: { type: string; content: string };
  params?: Record<string, string>;
}

// ── Environment ──

export interface EnvironmentData {
  name: string;
  variables: Record<string, string>;
  secrets: string[];
}

// ── History Entry (matches Rust HistoryEntry) ──

export interface HistoryEntry {
  id: number;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  timeMs?: number;
  sizeBytes?: number;
  timestamp: string;
  collectionPath?: string;
  requestName?: string;
  requestJson: string;
}

// ── Parsed cURL ──

export interface ParsedCurlRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  bodyType: string | null;
  authBasic: [string, string] | null;
  verifySsl: boolean;
  followRedirects: boolean;
}

// ── Settings ──

export interface AppSettings {
  theme: "dark" | "light" | "system";
  proxyUrl: string | null;
  proxyUsername: string | null;
  proxyPassword: string | null;
  verifySsl: boolean;
  followRedirects: boolean;
  timeoutMs: number;
  sidebarWidth: number;
}

// ── Persisted State ──

export interface PersistedTab {
  filePath: string;
  collectionPath: string;
}

export interface PersistedState {
  tabs: PersistedTab[];
  activeTabIndex: number | null;
}

// ── Tab ──

export interface Tab {
  id: string;
  name: string;
  filePath: string | null;
  collectionPath: string | null;
  isDirty: boolean;

  // Request state
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: RequestBody;
  auth: AuthConfig;

  // Response state
  response: ResponseData | null;
  error: HttpError | null;
  loading: boolean;
}
