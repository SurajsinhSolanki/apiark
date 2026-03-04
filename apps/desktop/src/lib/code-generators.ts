import type { Tab } from "@apiark/types";

export function generateCurl(tab: Tab): string {
  const parts = [`curl -X ${tab.method}`];
  parts.push(`'${tab.url}'`);

  for (const h of tab.headers) {
    if (h.key.trim() && h.enabled) {
      parts.push(`-H '${h.key}: ${h.value}'`);
    }
  }

  if (tab.auth.type === "bearer") {
    parts.push(`-H 'Authorization: Bearer ${tab.auth.token}'`);
  } else if (tab.auth.type === "basic") {
    parts.push(`-u '${tab.auth.username}:${tab.auth.password}'`);
  } else if (tab.auth.type === "api-key" && tab.auth.addTo === "header") {
    parts.push(`-H '${tab.auth.key}: ${tab.auth.value}'`);
  }

  if (tab.body.type !== "none" && tab.body.content.trim()) {
    const escaped = tab.body.content.replace(/'/g, "'\\''");
    parts.push(`-d '${escaped}'`);
  }

  // Add query params to URL
  const enabledParams = tab.params.filter((p) => p.key.trim() && p.enabled);
  if (enabledParams.length > 0) {
    const qs = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
    const sep = tab.url.includes("?") ? "&" : "?";
    parts[1] = `'${tab.url}${sep}${qs}'`;
  }

  return parts.join(" \\\n  ");
}

export function generateJsFetch(tab: Tab): string {
  const enabledParams = tab.params.filter((p) => p.key.trim() && p.enabled);
  let url = tab.url;
  if (enabledParams.length > 0) {
    const qs = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}${qs}`;
  }

  const headers: Record<string, string> = {};
  for (const h of tab.headers) {
    if (h.key.trim() && h.enabled) {
      headers[h.key] = h.value;
    }
  }

  if (tab.auth.type === "bearer") {
    headers["Authorization"] = `Bearer ${tab.auth.token}`;
  } else if (tab.auth.type === "basic") {
    headers["Authorization"] = `Basic ${btoa(`${tab.auth.username}:${tab.auth.password}`)}`;
  } else if (tab.auth.type === "api-key" && tab.auth.addTo === "header") {
    headers[tab.auth.key] = tab.auth.value;
  }

  const hasHeaders = Object.keys(headers).length > 0;
  const hasBody = tab.body.type !== "none" && tab.body.content.trim();

  const options: string[] = [];
  options.push(`  method: "${tab.method}",`);

  if (hasHeaders) {
    options.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")},`);
  }

  if (hasBody) {
    if (tab.body.type === "json") {
      options.push(`  body: JSON.stringify(${tab.body.content.trim()}),`);
    } else {
      options.push(`  body: ${JSON.stringify(tab.body.content)},`);
    }
  }

  const lines = [
    `const response = await fetch("${url}", {`,
    ...options,
    `});`,
    ``,
    `const data = await response.json();`,
    `console.log(data);`,
  ];

  return lines.join("\n");
}

export function generatePythonRequests(tab: Tab): string {
  const enabledParams = tab.params.filter((p) => p.key.trim() && p.enabled);

  const headers: Record<string, string> = {};
  for (const h of tab.headers) {
    if (h.key.trim() && h.enabled) {
      headers[h.key] = h.value;
    }
  }

  if (tab.auth.type === "bearer") {
    headers["Authorization"] = `Bearer ${tab.auth.token}`;
  } else if (tab.auth.type === "api-key" && tab.auth.addTo === "header") {
    headers[tab.auth.key] = tab.auth.value;
  }

  const lines = ["import requests", ""];

  lines.push(`url = "${tab.url}"`);

  if (Object.keys(headers).length > 0) {
    lines.push(`headers = ${pythonDict(headers)}`);
  }

  if (enabledParams.length > 0) {
    const params: Record<string, string> = {};
    for (const p of enabledParams) params[p.key] = p.value;
    lines.push(`params = ${pythonDict(params)}`);
  }

  const hasBody = tab.body.type !== "none" && tab.body.content.trim();
  if (hasBody) {
    if (tab.body.type === "json") {
      lines.push(`json_data = ${tab.body.content.trim()}`);
    } else {
      lines.push(`data = ${JSON.stringify(tab.body.content)}`);
    }
  }

  // Build the request call
  const args = [`url`];
  if (Object.keys(headers).length > 0) args.push("headers=headers");
  if (enabledParams.length > 0) args.push("params=params");
  if (hasBody) {
    args.push(tab.body.type === "json" ? "json=json_data" : "data=data");
  }
  if (tab.auth.type === "basic") {
    args.push(`auth=("${tab.auth.username}", "${tab.auth.password}")`);
  }

  lines.push("");
  lines.push(`response = requests.${tab.method.toLowerCase()}(${args.join(", ")})`);
  lines.push(`print(response.status_code)`);
  lines.push(`print(response.json())`);

  return lines.join("\n");
}

function pythonDict(obj: Record<string, string>): string {
  const entries = Object.entries(obj).map(([k, v]) => `    "${k}": "${v}"`);
  return `{\n${entries.join(",\n")}\n}`;
}
