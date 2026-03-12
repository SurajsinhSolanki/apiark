"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type CellValue =
  | { type: "yes" }
  | { type: "no" }
  | { type: "partial"; label?: string }
  | { type: "text"; label: string };

function CellIcon({ value }: { value: CellValue }) {
  switch (value.type) {
    case "yes":
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15">
          <Check className="w-4 h-4 text-emerald-400" />
        </span>
      );
    case "no":
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15">
          <X className="w-4 h-4 text-red-400" />
        </span>
      );
    case "partial":
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15">
            <Minus className="w-4 h-4 text-amber-400" />
          </span>
          {value.label && (
            <span className="text-xs text-amber-400/80">{value.label}</span>
          )}
        </span>
      );
    case "text":
      return <span className="text-sm text-zinc-300">{value.label}</span>;
  }
}

const yes: CellValue = { type: "yes" };
const no: CellValue = { type: "no" };
const partial = (label?: string): CellValue => ({ type: "partial", label });
const text = (label: string): CellValue => ({ type: "text", label });

interface ComparisonRow {
  feature: string;
  apiark: CellValue;
  postman: CellValue;
  bruno: CellValue;
  insomnia: CellValue;
  hoppscotch: CellValue;
}

const rows: ComparisonRow[] = [
  {
    feature: "Framework",
    apiark: text("Tauri v2"),
    postman: text("Electron"),
    bruno: text("Electron"),
    insomnia: text("Electron"),
    hoppscotch: text("Tauri"),
  },
  {
    feature: "RAM Usage",
    apiark: text("~50MB"),
    postman: text("300-800MB"),
    bruno: text("150-300MB"),
    insomnia: text("200-400MB"),
    hoppscotch: text("50-80MB"),
  },
  {
    feature: "Account Required",
    apiark: no,
    postman: yes,
    bruno: no,
    insomnia: partial("Optional"),
    hoppscotch: partial("Optional"),
  },
  {
    feature: "Data Storage",
    apiark: text("Filesystem"),
    postman: text("Cloud"),
    bruno: text("Filesystem"),
    insomnia: text("Cloud"),
    hoppscotch: text("IndexedDB"),
  },
  {
    feature: "REST",
    apiark: yes,
    postman: yes,
    bruno: yes,
    insomnia: yes,
    hoppscotch: yes,
  },
  {
    feature: "GraphQL",
    apiark: yes,
    postman: yes,
    bruno: yes,
    insomnia: yes,
    hoppscotch: yes,
  },
  {
    feature: "gRPC",
    apiark: yes,
    postman: yes,
    bruno: yes,
    insomnia: yes,
    hoppscotch: no,
  },
  {
    feature: "WebSocket",
    apiark: yes,
    postman: yes,
    bruno: no,
    insomnia: yes,
    hoppscotch: yes,
  },
  {
    feature: "SSE",
    apiark: yes,
    postman: yes,
    bruno: no,
    insomnia: yes,
    hoppscotch: yes,
  },
  {
    feature: "MQTT",
    apiark: yes,
    postman: no,
    bruno: no,
    insomnia: no,
    hoppscotch: no,
  },
  {
    feature: "Mock Servers",
    apiark: yes,
    postman: partial("Cloud only"),
    bruno: no,
    insomnia: partial("Basic"),
    hoppscotch: no,
  },
  {
    feature: "Monitoring",
    apiark: yes,
    postman: partial("Cloud only"),
    bruno: no,
    insomnia: no,
    hoppscotch: no,
  },
  {
    feature: "Collection Runner",
    apiark: yes,
    postman: yes,
    bruno: no,
    insomnia: no,
    hoppscotch: no,
  },
  {
    feature: "CLI Tool",
    apiark: yes,
    postman: text("Newman"),
    bruno: text("bru CLI"),
    insomnia: text("inso"),
    hoppscotch: text("hopp"),
  },
  {
    feature: "Plugin System",
    apiark: yes,
    postman: no,
    bruno: no,
    insomnia: partial("npm"),
    hoppscotch: no,
  },
  {
    feature: "Open Source",
    apiark: text("MIT"),
    postman: no,
    bruno: text("MIT"),
    insomnia: text("MIT"),
    hoppscotch: text("MIT"),
  },
  {
    feature: "Team Price",
    apiark: text("$8/user/mo"),
    postman: text("$19/user/mo"),
    bruno: text("$6/user/mo"),
    insomnia: text("$12/user/mo"),
    hoppscotch: text("Custom"),
  },
];

const competitors = ["apiark", "postman", "bruno", "insomnia", "hoppscotch"] as const;

const competitorLabels: Record<(typeof competitors)[number], string> = {
  apiark: "ApiArk",
  postman: "Postman",
  bruno: "Bruno",
  insomnia: "Insomnia",
  hoppscotch: "Hoppscotch",
};

const detailedLinks = [
  { name: "Postman", href: "/compare/postman" },
  { name: "Bruno", href: "/compare/bruno" },
  { name: "Insomnia", href: "/compare/insomnia" },
  { name: "Hoppscotch", href: "/compare/hoppscotch" },
];

export default function ComparisonTable() {
  return (
    <section id="compare" className="relative py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              See how we compare.
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Every feature. Every competitor. No asterisks.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="sticky left-0 z-20 bg-[var(--color-surface)] px-5 py-4 text-sm font-medium text-zinc-400 w-44 min-w-[176px]">
                    Feature
                  </th>
                  {competitors.map((key) => (
                    <th
                      key={key}
                      className={`px-5 py-4 text-sm font-semibold text-center min-w-[120px] ${
                        key === "apiark"
                          ? "bg-indigo-500/[0.08] text-indigo-300"
                          : "text-zinc-300"
                      }`}
                    >
                      {key === "apiark" && (
                        <span className="block text-[10px] uppercase tracking-widest text-indigo-400 mb-1 font-medium">
                          Our pick
                        </span>
                      )}
                      {competitorLabels[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-[var(--color-surface)] px-5 py-3.5 text-sm font-medium text-zinc-300 w-44 min-w-[176px]">
                      <span className="relative">
                        {row.feature}
                        {/* Match the alternating row bg on the sticky cell */}
                        <span
                          className={`absolute inset-0 -z-10 -mx-5 -my-3.5 px-5 py-3.5 ${
                            i % 2 !== 0 ? "bg-white/[0.01]" : ""
                          }`}
                        />
                      </span>
                    </td>
                    {competitors.map((key) => (
                      <td
                        key={key}
                        className={`px-5 py-3.5 text-center ${
                          key === "apiark" ? "bg-indigo-500/[0.06]" : ""
                        }`}
                      >
                        <span className="inline-flex justify-center">
                          <CellIcon value={row[key]} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detailed comparison links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <span className="text-sm text-zinc-500">Detailed comparison: </span>
          {detailedLinks.map((link, i) => (
            <span key={link.name}>
              <a
                href={link.href}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-400/30 hover:decoration-indigo-300/50"
              >
                {link.name}
              </a>
              {i < detailedLinks.length - 1 && (
                <span className="text-zinc-600 mx-2">|</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
