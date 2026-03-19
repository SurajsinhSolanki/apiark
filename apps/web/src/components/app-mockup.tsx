"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── Types ───────────────────────────────────────────────────────────── */

interface RequestScene {
  protocol: string;
  protocolColor: string;
  method: string;
  methodColor: string;
  url: string;
  tabs: { method: string; name: string; color: string; active?: boolean }[];
  sidebar: { type: "folder" | "request"; name: string; method?: string; color?: string; indent?: number; active?: boolean }[];
  requestBody?: string;
  responseStatus: string;
  responseStatusColor: string;
  responseTime: string;
  responseSize: string;
  responseBody: string;
  headers?: { key: string; value: string }[];
}

/* ─── Scenes ──────────────────────────────────────────────────────────── */

const scenes: RequestScene[] = [
  {
    protocol: "REST",
    protocolColor: "#22c55e",
    method: "GET",
    methodColor: "#22c55e",
    url: "https://api.example.com/v1/users",
    tabs: [
      { method: "GET", name: "List Users", color: "#22c55e", active: true },
      { method: "POST", name: "Create User", color: "#eab308" },
      { method: "PUT", name: "Update Profile", color: "#3b82f6" },
    ],
    sidebar: [
      { type: "folder", name: "User Service", indent: 0 },
      { type: "request", name: "List Users", method: "GET", color: "#22c55e", indent: 1, active: true },
      { type: "request", name: "Create User", method: "POST", color: "#eab308", indent: 1 },
      { type: "request", name: "Get User", method: "GET", color: "#22c55e", indent: 1 },
      { type: "request", name: "Update User", method: "PUT", color: "#3b82f6", indent: 1 },
      { type: "request", name: "Delete User", method: "DEL", color: "#ef4444", indent: 1 },
      { type: "folder", name: "Products", indent: 0 },
      { type: "request", name: "List Products", method: "GET", color: "#22c55e", indent: 1 },
    ],
    responseStatus: "200 OK",
    responseStatusColor: "#22c55e",
    responseTime: "45ms",
    responseSize: "2.4 KB",
    responseBody: `{
  "users": [
    {
      "id": "usr_k8x2m",
      "name": "Sarah Chen",
      "email": "sarah@example.com",
      "role": "admin",
      "created_at": "2026-01-15T08:30:00Z"
    },
    {
      "id": "usr_p3n7q",
      "name": "Marcus Johnson",
      "email": "marcus@example.com",
      "role": "developer",
      "created_at": "2026-02-20T14:15:00Z"
    }
  ],
  "total": 2,
  "page": 1
}`,
  },
  {
    protocol: "GraphQL",
    protocolColor: "#ec4899",
    method: "GQL",
    methodColor: "#ec4899",
    url: "https://api.example.com/graphql",
    tabs: [
      { method: "GQL", name: "Get User Profile", color: "#ec4899", active: true },
      { method: "GQL", name: "Create Order", color: "#ec4899" },
      { method: "GET", name: "List Users", color: "#22c55e" },
    ],
    sidebar: [
      { type: "folder", name: "GraphQL Queries", indent: 0 },
      { type: "request", name: "Get User Profile", method: "GQL", color: "#ec4899", indent: 1, active: true },
      { type: "request", name: "List Orders", method: "GQL", color: "#ec4899", indent: 1 },
      { type: "request", name: "Create Order", method: "MUT", color: "#a855f7", indent: 1 },
      { type: "folder", name: "Subscriptions", indent: 0 },
      { type: "request", name: "Order Updates", method: "SUB", color: "#06b6d4", indent: 1 },
    ],
    requestBody: `query GetUserProfile($id: ID!) {
  user(id: $id) {
    id
    name
    email
    avatar
    orders {
      id
      total
      status
    }
  }
}`,
    responseStatus: "200 OK",
    responseStatusColor: "#22c55e",
    responseTime: "89ms",
    responseSize: "1.8 KB",
    responseBody: `{
  "data": {
    "user": {
      "id": "usr_k8x2m",
      "name": "Sarah Chen",
      "email": "sarah@example.com",
      "avatar": "https://i.pravatar.cc/150",
      "orders": [
        {
          "id": "ord_9x2k",
          "total": 149.99,
          "status": "delivered"
        }
      ]
    }
  }
}`,
  },
  {
    protocol: "gRPC",
    protocolColor: "#3b82f6",
    method: "RPC",
    methodColor: "#3b82f6",
    url: "grpc://api.example.com:50051",
    tabs: [
      { method: "RPC", name: "GetUser", color: "#3b82f6", active: true },
      { method: "RPC", name: "ListUsers", color: "#3b82f6" },
      { method: "GET", name: "List Users", color: "#22c55e" },
    ],
    sidebar: [
      { type: "folder", name: "UserService", indent: 0 },
      { type: "request", name: "GetUser", method: "RPC", color: "#3b82f6", indent: 1, active: true },
      { type: "request", name: "ListUsers", method: "RPC", color: "#3b82f6", indent: 1 },
      { type: "request", name: "CreateUser", method: "RPC", color: "#3b82f6", indent: 1 },
      { type: "request", name: "StreamUpdates", method: "STR", color: "#06b6d4", indent: 1 },
    ],
    requestBody: `{
  "user_id": "usr_k8x2m"
}`,
    responseStatus: "OK (0)",
    responseStatusColor: "#22c55e",
    responseTime: "12ms",
    responseSize: "340 B",
    responseBody: `{
  "user": {
    "user_id": "usr_k8x2m",
    "display_name": "Sarah Chen",
    "email": "sarah@example.com",
    "role": "ADMIN",
    "is_active": true,
    "last_login": "2026-03-05T22:15:00Z"
  }
}`,
  },
  {
    protocol: "WebSocket",
    protocolColor: "#eab308",
    method: "WS",
    methodColor: "#eab308",
    url: "wss://api.example.com/ws/chat",
    tabs: [
      { method: "WS", name: "Chat Stream", color: "#eab308", active: true },
      { method: "SSE", name: "Notifications", color: "#06b6d4" },
      { method: "GET", name: "List Users", color: "#22c55e" },
    ],
    sidebar: [
      { type: "folder", name: "Real-time", indent: 0 },
      { type: "request", name: "Chat Stream", method: "WS", color: "#eab308", indent: 1, active: true },
      { type: "request", name: "Notifications", method: "SSE", color: "#06b6d4", indent: 1 },
      { type: "request", name: "IoT Sensors", method: "MQTT", color: "#8b5cf6", indent: 1 },
    ],
    responseStatus: "Connected",
    responseStatusColor: "#22c55e",
    responseTime: "Live",
    responseSize: "Stream",
    responseBody: `▶ 22:15:01  {"type":"message","user":"Sarah","text":"Hey team!"}
▶ 22:15:03  {"type":"message","user":"Marcus","text":"Hi Sarah 👋"}
▶ 22:15:05  {"type":"typing","user":"Sarah"}
▶ 22:15:08  {"type":"message","user":"Sarah","text":"Deploy looks good"}
◀ 22:15:10  {"type":"message","text":"Confirmed ✓"}
▶ 22:15:12  {"type":"message","user":"Marcus","text":"🚀 Ship it!"}`,
  },
];

/* ─── Syntax Highlight Helpers ────────────────────────────────────────── */

function highlightJSON(code: string) {
  return code.split("\n").map((line, i) => {
    const highlighted = line
      .replace(/"([^"]+)":/g, '<span style="color:#818cf8">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span style="color:#34d399">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span style="color:#fbbf24">$1</span>')
      .replace(/: (true|false|null)/g, ': <span style="color:#f472b6">$1</span>')
      .replace(/(▶|◀)/g, '<span style="color:#6366f1">$1</span>')
      .replace(/(\d{2}:\d{2}:\d{2})/g, '<span style="color:#71717a">$1</span>');
    return (
      <div key={i} className="leading-relaxed">
        <span className="text-zinc-600 select-none mr-4 text-[10px] inline-block w-4 text-right">{i + 1}</span>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    );
  });
}

function highlightGQL(code: string) {
  return code.split("\n").map((line, i) => {
    const highlighted = line
      .replace(/(query|mutation|subscription|fragment)\b/g, '<span style="color:#f472b6">$1</span>')
      .replace(/(\$\w+)/g, '<span style="color:#fbbf24">$1</span>')
      .replace(/(ID|String|Int|Float|Boolean)(!?)/g, '<span style="color:#06b6d4">$1$2</span>')
      .replace(/(\w+)(\s*\()/g, '<span style="color:#818cf8">$1</span>$2')
      .replace(/(\w+)(\s*{)/g, '<span style="color:#34d399">$1</span>$2');
    return (
      <div key={i} className="leading-relaxed">
        <span className="text-zinc-600 select-none mr-4 text-[10px] inline-block w-4 text-right">{i + 1}</span>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    );
  });
}

/* ─── Activity Bar ────────────────────────────────────────────────────── */

function ActivityBar() {
  const icons = [
    { color: "#3b82f6", active: true },
    { color: "#22c55e", active: false },
    { color: "#eab308", active: false },
  ];
  return (
    <div className="w-10 flex flex-col items-center py-3 gap-2 bg-[var(--color-bg)] border-r border-[var(--color-border)] shrink-0">
      <div className="w-6 h-6 rounded-md overflow-hidden mb-2">
        <img src="/logo.png" alt="" className="w-full h-full" />
      </div>
      {icons.map((ic, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{
            background: ic.active ? `${ic.color}15` : "transparent",
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-sm"
            style={{
              background: ic.active ? ic.color : "#52525b",
              opacity: ic.active ? 1 : 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────── */

export function AppMockup({ autoPlay = true, className = "" }: { autoPlay?: boolean; className?: string }) {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveScene((s) => (s + 1) % scenes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const scene = scenes[activeScene];

  return (
    <div className={`relative ${className}`}>
      {/* Window chrome */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-zinc-600">ApiArk — {scene.protocol}</span>
          </div>
        </div>

        <div className="flex" style={{ height: 420 }}>
          {/* Activity Bar */}
          <ActivityBar />

          {/* Sidebar */}
          <div className="w-48 bg-[#0c0c12] border-r border-[var(--color-border)] py-2 overflow-hidden shrink-0 hidden md:block">
            <div className="px-3 pb-2 mb-1 border-b border-[var(--color-border)]">
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Collections</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScene}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {scene.sidebar.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] cursor-default"
                    style={{ paddingLeft: 12 + (item.indent ?? 0) * 12 }}
                  >
                    {item.type === "folder" ? (
                      <>
                        <span className="text-zinc-600 text-[10px]">▼</span>
                        <span className="text-zinc-400 font-medium">{item.name}</span>
                      </>
                    ) : (
                      <>
                        <span
                          className="text-[9px] font-bold w-7 shrink-0"
                          style={{ color: item.color }}
                        >
                          {item.method}
                        </span>
                        <span
                          className={item.active ? "text-white" : "text-zinc-500"}
                          style={
                            item.active
                              ? { background: "#6366f115", borderRadius: 4, padding: "1px 4px", margin: "-1px -4px" }
                              : {}
                          }
                        >
                          {item.name}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Main Panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {scene.tabs.map((tab, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[11px] border-r border-[var(--color-border)] ${
                        tab.active ? "bg-[var(--color-surface)] text-white" : "text-zinc-600"
                      }`}
                    >
                      <span className="font-bold text-[9px]" style={{ color: tab.color }}>
                        {tab.method}
                      </span>
                      <span className="truncate max-w-20">{tab.name}</span>
                      {tab.active && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#6366f1]" />}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* URL Bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ color: scene.methodColor, background: `${scene.methodColor}15` }}
                  >
                    {scene.method}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate flex-1 font-mono">{scene.url}</span>
                </motion.div>
              </AnimatePresence>
              <button className="px-3 py-1 rounded-md bg-[#6366f1] text-white text-[10px] font-semibold shrink-0">
                Send
              </button>
            </div>

            {/* Split: Request Body / Response */}
            <div className="flex-1 flex min-h-0">
              {/* Request body (left half) */}
              {scene.requestBody && (
                <div className="w-1/2 border-r border-[var(--color-border)] overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                    <span className="text-[10px] text-zinc-400 font-medium">Body</span>
                    <span className="text-[9px] text-zinc-600 px-1.5 rounded bg-zinc-800/50">
                      {scene.protocol === "GraphQL" ? "GraphQL" : "JSON"}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScene}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="p-3 font-mono text-[10px] overflow-hidden"
                      style={{ maxHeight: 300 }}
                    >
                      {scene.protocol === "GraphQL"
                        ? highlightGQL(scene.requestBody)
                        : highlightJSON(scene.requestBody)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Response (right half or full) */}
              <div className={scene.requestBody ? "w-1/2" : "w-full"}>
                {/* Response status bar */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScene}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[10px] font-bold" style={{ color: scene.responseStatusColor }}>
                        {scene.responseStatus}
                      </span>
                      <span className="text-[10px] text-zinc-600">{scene.responseTime}</span>
                      <span className="text-[10px] text-zinc-600">{scene.responseSize}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Response body */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScene}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="p-3 font-mono text-[10px] overflow-hidden"
                    style={{ maxHeight: 300 }}
                  >
                    {highlightJSON(scene.responseBody)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol selector dots */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {scenes.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveScene(i)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
            style={{
              background: i === activeScene ? `${s.protocolColor}15` : "transparent",
              color: i === activeScene ? s.protocolColor : "#52525b",
              border: `1px solid ${i === activeScene ? `${s.protocolColor}30` : "transparent"}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i === activeScene ? s.protocolColor : "#52525b" }}
            />
            {s.protocol}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Static Scene (for protocol pages) ───────────────────────────────── */

export function AppMockupStatic({ sceneIndex }: { sceneIndex: number }) {
  return <AppMockup autoPlay={false} className="" />;
}
