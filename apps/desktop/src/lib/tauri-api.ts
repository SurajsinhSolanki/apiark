import { invoke } from "@tauri-apps/api/core";
import type {
  SendRequestParams,
  ResponseData,
  HttpError,
  CollectionNode,
  RequestFile,
  EnvironmentData,
  HistoryEntry,
} from "@apiark/types";

// ── Error handling ──

function handleTauriError(err: unknown): never {
  if (typeof err === "string") {
    try {
      const httpError: HttpError = JSON.parse(err);
      throw httpError;
    } catch (parseErr) {
      if ((parseErr as HttpError).errorType) {
        throw parseErr;
      }
      throw {
        errorType: "unknown",
        message: err,
      } satisfies HttpError;
    }
  }
  throw {
    errorType: "unknown",
    message: String(err),
  } satisfies HttpError;
}

// ── HTTP ──

export async function sendRequest(
  params: SendRequestParams,
  variables?: Record<string, string>,
  collectionPath?: string,
  requestName?: string,
): Promise<ResponseData> {
  try {
    return await invoke<ResponseData>("send_request", {
      params,
      variables: variables ?? null,
      collectionPath: collectionPath ?? null,
      requestName: requestName ?? null,
    });
  } catch (err) {
    handleTauriError(err);
  }
}

// ── Collections ──

export async function openCollection(path: string): Promise<CollectionNode> {
  return await invoke<CollectionNode>("open_collection", { path });
}

export async function readRequestFile(path: string): Promise<RequestFile> {
  return await invoke<RequestFile>("read_request_file", { path });
}

export async function saveRequestFile(
  path: string,
  request: RequestFile,
): Promise<void> {
  return await invoke<void>("save_request_file", { path, request });
}

export async function createRequest(
  dir: string,
  filename: string,
  name: string,
): Promise<string> {
  return await invoke<string>("create_request", {
    dir,
    filename,
    name,
    method: "GET",
    url: "",
  });
}

export async function createFolder(
  parent: string,
  name: string,
): Promise<string> {
  return await invoke<string>("create_folder", { parent, name });
}

export async function deleteItem(
  path: string,
  collectionName: string,
): Promise<void> {
  return await invoke<void>("delete_item", { path, collectionName });
}

export async function renameItem(
  path: string,
  newName: string,
): Promise<string> {
  return await invoke<string>("rename_item", { path, newName });
}

// ── Environments ──

export async function loadEnvironments(
  collectionPath: string,
): Promise<EnvironmentData[]> {
  return await invoke<EnvironmentData[]>("load_environments", {
    collectionPath,
  });
}

export async function getResolvedVariables(
  collectionPath: string,
  environmentName: string,
): Promise<Record<string, string>> {
  return await invoke<Record<string, string>>("get_resolved_variables", {
    collectionPath,
    environmentName,
  });
}

// ── History ──

export async function getHistory(): Promise<HistoryEntry[]> {
  return await invoke<HistoryEntry[]>("get_history", {});
}

export async function searchHistory(query: string): Promise<HistoryEntry[]> {
  return await invoke<HistoryEntry[]>("search_history", { query });
}

export async function clearHistory(): Promise<void> {
  return await invoke<void>("clear_history", {});
}
