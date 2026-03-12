"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const protocols = [
  {
    name: "REST",
    color: "#22c55e",
    method: "GET",
    url: "/api/users",
    description: "Full HTTP client with every method, headers, params, auth, cookies, and body type. Color-coded methods. cURL import/export.",
    response: `{
  "users": [
    { "id": 1, "name": "Sarah Chen", "role": "admin" },
    { "id": 2, "name": "Marcus J.", "role": "dev" }
  ],
  "total": 2
}`,
    status: "200 OK",
    time: "45ms",
  },
  {
    name: "GraphQL",
    color: "#ec4899",
    method: "GQL",
    url: "/graphql",
    description: "Schema introspection, auto-complete, variables editor, and schema explorer. Write queries with full IDE support.",
    response: `{
  "data": {
    "user": {
      "name": "Sarah Chen",
      "orders": [
        { "id": "ord_9x2k", "total": 149.99 }
      ]
    }
  }
}`,
    status: "200 OK",
    time: "89ms",
  },
  {
    name: "gRPC",
    color: "#3b82f6",
    method: "RPC",
    url: "grpc://api:50051",
    description: "Load .proto files or use server reflection. Unary, server streaming, client streaming, and bidirectional calls.",
    response: `{
  "user": {
    "user_id": "usr_k8x2m",
    "display_name": "Sarah Chen",
    "role": "ADMIN",
    "is_active": true
  }
}`,
    status: "OK (0)",
    time: "12ms",
  },
  {
    name: "WebSocket",
    color: "#eab308",
    method: "WS",
    url: "wss://api/ws",
    description: "Real-time bidirectional messaging with auto-reconnect, message history, and formatted message viewer.",
    response: `▶ {"type":"msg","user":"Sarah","text":"Hey!"}
▶ {"type":"msg","user":"Marcus","text":"Hi"}
◀ {"type":"msg","text":"Confirmed"}
▶ {"type":"msg","user":"Marcus","text":"Ship it"}`,
    status: "Connected",
    time: "Live",
  },
  {
    name: "SSE",
    color: "#06b6d4",
    method: "SSE",
    url: "/events/stream",
    description: "Server-Sent Events with real-time stream viewer, event type filtering, and auto-reconnect.",
    response: `event: update
data: {"cpu": 45.2, "memory": 62.1}

event: update
data: {"cpu": 43.8, "memory": 61.9}

event: alert
data: {"level": "warn", "msg": "High load"}`,
    status: "Streaming",
    time: "Live",
  },
  {
    name: "MQTT",
    color: "#8b5cf6",
    method: "PUB",
    url: "mqtt://broker:1883",
    description: "Publish/subscribe messaging with topic management, QoS levels, and retained message support.",
    response: `Topic: sensors/temp/living-room
QoS: 1
Payload: {"temp": 22.5, "unit": "C"}

Topic: sensors/temp/bedroom
QoS: 1
Payload: {"temp": 20.1, "unit": "C"}`,
    status: "Subscribed",
    time: "Live",
  },
];

function MiniAppWindow({ protocol }: { protocol: typeof protocols[0] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
        <div className="w-2 h-2 rounded-full bg-[#eab308]" />
        <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        <span className="ml-2 text-[9px] text-zinc-600">ApiArk</span>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--color-border)]">
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: protocol.color, background: `${protocol.color}15` }}
        >
          {protocol.method}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono truncate">{protocol.url}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[9px] font-bold" style={{ color: "#22c55e" }}>
            {protocol.status}
          </span>
          <span className="text-[9px] text-zinc-600">{protocol.time}</span>
        </div>
      </div>

      {/* Response */}
      <div className="p-3 font-mono text-[9px] leading-relaxed text-zinc-400 h-36 overflow-hidden">
        {protocol.response.split("\n").map((line, i) => (
          <div key={i}>
            <span className="text-zinc-700 select-none mr-2">{i + 1}</span>
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/"([^"]+)":/g, '<span style="color:#818cf8">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span style="color:#34d399">"$1"</span>')
                  .replace(/: (\d+\.?\d*)/g, ': <span style="color:#fbbf24">$1</span>')
                  .replace(/: (true|false)/g, ': <span style="color:#f472b6">$1</span>')
                  .replace(/(▶|◀)/g, '<span style="color:#6366f1">$1</span>')
                  .replace(/(event|data|Topic|QoS|Payload):/g, '<span style="color:#818cf8">$1</span>:'),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Protocols() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} id="protocols" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Every protocol. <span className="text-indigo-400">One interface.</span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            REST, GraphQL, gRPC, WebSocket, SSE, MQTT &mdash; all with the same experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Protocol list */}
          <div className="space-y-2">
            {protocols.map((proto, i) => (
              <motion.button
                key={proto.name}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => setActive(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  i === active
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ color: proto.color, background: `${proto.color}15` }}
                  >
                    {proto.method}
                  </span>
                  <span className={`font-medium ${i === active ? "text-white" : "text-zinc-400"}`}>
                    {proto.name}
                  </span>
                  <span className="ml-auto text-[10px] text-zinc-600 font-mono">{proto.url}</span>
                </div>
                {i === active && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-zinc-500 mt-2 leading-relaxed"
                  >
                    {proto.description}
                  </motion.p>
                )}
              </motion.button>
            ))}
          </div>

          {/* Right: Mini app window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="sticky top-32"
          >
            <MiniAppWindow protocol={protocols[active]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
