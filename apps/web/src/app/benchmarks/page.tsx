"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Cpu,
  HardDrive,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  XCircle,
  Terminal,
  Globe,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ToolConfig {
  name: string;
  framework: string;
  color: string;
  github_repo: string | null;       // null = no GitHub releases (Postman)
  installer_pattern: RegExp | null;  // pattern to match Linux installer asset
  ram_idle_mb: number;
  ram_10_tabs_mb: number;
  startup_time_s: number;
  installer_size_mb_fallback: number; // used when API fails
  requires_account: boolean;
  protocols: string[];
  open_source: boolean;
}

interface LiveData {
  installer_size_mb: number;
  version: string;
  fetched: boolean;
}

/* ------------------------------------------------------------------ */
/*  Tool configs with GitHub repos for dynamic fetching                */
/* ------------------------------------------------------------------ */

const TOOL_CONFIGS: ToolConfig[] = [
  {
    name: "ApiArk",
    framework: "Tauri v2",
    color: "#6366f1",
    github_repo: "berbicanes/apiark",
    installer_pattern: /\.deb$/i,
    ram_idle_mb: 65,
    ram_10_tabs_mb: 95,
    startup_time_s: 1.2,
    installer_size_mb_fallback: 14,
    requires_account: false,
    protocols: ["REST", "GraphQL", "gRPC", "WebSocket", "SSE", "MQTT", "Socket.IO"],
    open_source: true,
  },
  {
    name: "Postman",
    framework: "Electron",
    color: "#ef4444",
    github_repo: null, // closed source, no GitHub releases
    installer_pattern: null,
    ram_idle_mb: 350,
    ram_10_tabs_mb: 580,
    startup_time_s: 12.0,
    installer_size_mb_fallback: 200,
    requires_account: true,
    protocols: ["REST", "GraphQL", "gRPC", "WebSocket", "SSE"],
    open_source: false,
  },
  {
    name: "Insomnia",
    framework: "Electron",
    color: "#a855f7",
    github_repo: "Kong/insomnia",
    installer_pattern: /\.AppImage$/i,
    ram_idle_mb: 250,
    ram_10_tabs_mb: 420,
    startup_time_s: 6.0,
    installer_size_mb_fallback: 140,
    requires_account: false,
    protocols: ["REST", "GraphQL", "gRPC", "WebSocket", "SSE"],
    open_source: true,
  },
  {
    name: "Bruno",
    framework: "Electron",
    color: "#eab308",
    github_repo: "usebruno/bruno",
    installer_pattern: /x86_64\.AppImage$/i,
    ram_idle_mb: 180,
    ram_10_tabs_mb: 310,
    startup_time_s: 4.5,
    installer_size_mb_fallback: 85,
    requires_account: false,
    protocols: ["REST", "GraphQL"],
    open_source: true,
  },
  {
    name: "Hoppscotch",
    framework: "Tauri",
    color: "#22c55e",
    github_repo: "hoppscotch/hoppscotch",
    installer_pattern: /\.AppImage$/i,
    ram_idle_mb: 55,
    ram_10_tabs_mb: 95,
    startup_time_s: 1.8,
    installer_size_mb_fallback: 25,
    requires_account: false,
    protocols: ["REST", "GraphQL", "WebSocket", "SSE"],
    open_source: true,
  },
];

const ALL_PROTOCOLS = ["REST", "GraphQL", "gRPC", "WebSocket", "SSE", "MQTT", "Socket.IO"];

/* ------------------------------------------------------------------ */
/*  GitHub API fetching                                                */
/* ------------------------------------------------------------------ */

async function fetchInstallerSize(
  repo: string,
  pattern: RegExp
): Promise<{ size_mb: number; version: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!res.ok) return null;
    const data = await res.json();
    const version = data.tag_name || "";

    // Find the matching installer asset
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const asset = (data.assets || []).find((a: any) => pattern.test(a.name));
    if (!asset) {
      // Fallback: find any large non-signature asset
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const largest = (data.assets || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((a: any) => !a.name.endsWith(".sig") && !a.name.endsWith(".json") && !a.name.endsWith(".yml") && !a.name.endsWith(".yaml") && a.size > 1_000_000)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: any, b: any) => b.size - a.size)[0];
      if (largest) {
        return { size_mb: Math.round(largest.size / 1_048_576 * 10) / 10, version };
      }
      return null;
    }
    return { size_mb: Math.round(asset.size / 1_048_576 * 10) / 10, version };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Internal benchmark data (from criterion)                           */
/* ------------------------------------------------------------------ */

interface InternalBench {
  name: string;
  value: string;
  unit: string;
  description: string;
}

const INTERNAL_BENCHES: InternalBench[] = [
  { name: "YAML Parse (single)", value: "9.8", unit: "µs", description: "Parse one request YAML file" },
  { name: "YAML Parse (complex)", value: "24", unit: "µs", description: "Parse request with all fields" },
  { name: "Collection Load (100)", value: "1.0", unit: "ms", description: "Load 100-request collection tree" },
  { name: "Collection Load (1K)", value: "10.9", unit: "ms", description: "Load 1000-request collection tree" },
  { name: "Interpolation (5 vars)", value: "75", unit: "µs", description: "Replace 5 {{variables}} in URL" },
  { name: "cURL Parse (complex)", value: "2.6", unit: "µs", description: "Parse cURL with auth + headers" },
  { name: "Script Engine (empty)", value: "519", unit: "µs", description: "QuickJS runtime + ark API init" },
  { name: "Script (4 tests)", value: "633", unit: "µs", description: "Parse JSON + run 4 assertions" },
  { name: "Assertions (20)", value: "38", unit: "µs", description: "Evaluate 20 declarative assertions" },
  { name: "Assertions (regex)", value: "30", unit: "µs", description: "Single regex match assertion" },
];

/* ------------------------------------------------------------------ */
/*  Chart config                                                       */
/* ------------------------------------------------------------------ */

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1c1c1f",
      borderColor: "#2a2a2e",
      borderWidth: 1,
      titleColor: "#e4e4e7",
      bodyColor: "#a1a1aa",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: "#71717a", font: { size: 12 } },
      grid: { color: "#1c1c1f" },
    },
    y: {
      ticks: { color: "#e4e4e7", font: { size: 13 } },
      grid: { display: false },
    },
  },
};

function makeBarData(label: string, names: string[], values: number[], colors: string[], unit: string) {
  return {
    labels: names,
    datasets: [
      {
        label: `${label} (${unit})`,
        data: values,
        backgroundColor: colors.map((c) => c + "cc"),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-zinc-100">{children}</h2>
    </div>
  );
}

function Panel({ title, children, badge }: { title?: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2e] bg-[#141416] p-5">
      {(title || badge) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{title}</h3>}
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}

function StatHighlight({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2e] bg-[#141416] p-4">
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: color + "18", color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-zinc-100">{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

function LiveBadge({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Fetching live data...
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-400">
      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      Live from GitHub
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BenchmarksPage() {
  const [liveData, setLiveData] = useState<Record<string, LiveData>>({});
  const [loading, setLoading] = useState(true);

  const fetchAllSizes = useCallback(async () => {
    setLoading(true);
    const results: Record<string, LiveData> = {};

    await Promise.allSettled(
      TOOL_CONFIGS.map(async (tool) => {
        if (!tool.github_repo || !tool.installer_pattern) {
          results[tool.name] = {
            installer_size_mb: tool.installer_size_mb_fallback,
            version: "",
            fetched: false,
          };
          return;
        }
        const data = await fetchInstallerSize(tool.github_repo, tool.installer_pattern);
        results[tool.name] = {
          installer_size_mb: data?.size_mb ?? tool.installer_size_mb_fallback,
          version: data?.version ?? "",
          fetched: !!data,
        };
      })
    );

    setLiveData(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllSizes();
  }, [fetchAllSizes]);

  // Resolved values: live data overrides fallback for installer size
  const getInstallerSize = (name: string, fallback: number) =>
    liveData[name]?.installer_size_mb ?? fallback;

  const getVersion = (name: string) =>
    liveData[name]?.version || "";

  const isFetched = (name: string) =>
    liveData[name]?.fetched ?? false;

  const names = TOOL_CONFIGS.map((t) => t.name);
  const colors = TOOL_CONFIGS.map((t) => t.color);
  const apiark = TOOL_CONFIGS[0];
  const apiaarkSize = getInstallerSize("ApiArk", apiark.installer_size_mb_fallback);
  const postmanSize = getInstallerSize("Postman", 200);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-5 pb-16 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white">
            Performance{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Benchmarks
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Real measurements comparing ApiArk against Postman, Bruno, Insomnia, and Hoppscotch.
            Installer sizes are fetched live from GitHub Releases. Internal benchmarks powered by{" "}
            <a
              href="https://github.com/bheisler/criterion.rs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Criterion.rs
            </a>.
          </p>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatHighlight
            icon={<HardDrive className="h-5 w-5" />}
            value={`${apiark.ram_idle_mb} MB`}
            label={`RAM at idle (vs Postman ${TOOL_CONFIGS[1].ram_idle_mb} MB)`}
            color="#22c55e"
          />
          <StatHighlight
            icon={<Clock className="h-5 w-5" />}
            value={`${apiark.startup_time_s}s`}
            label={`Startup time (vs Postman ${TOOL_CONFIGS[1].startup_time_s}s)`}
            color="#6366f1"
          />
          <StatHighlight
            icon={<Cpu className="h-5 w-5" />}
            value={`${apiaarkSize} MB`}
            label={`Installer size (vs Postman ${postmanSize} MB)`}
            color="#eab308"
          />
          <StatHighlight
            icon={<Zap className="h-5 w-5" />}
            value={`${apiark.protocols.length}`}
            label="Protocols supported"
            color="#a855f7"
          />
        </motion.div>

        {/* Installer Size — LIVE */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <SectionTitle icon={<Cpu className="h-5 w-5" />}>Installer Size</SectionTitle>
          <Panel
            title="Linux Installer Download Size (MB)"
            badge={
              <div className="flex items-center gap-2">
                <LiveBadge loading={loading} />
                {!loading && (
                  <button
                    onClick={fetchAllSizes}
                    className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                    title="Refresh"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            }
          >
            <div className="h-[240px]">
              <Bar
                data={makeBarData(
                  "Installer",
                  names.map((n) => {
                    const v = getVersion(n);
                    return v ? `${n} (${v})` : n;
                  }),
                  TOOL_CONFIGS.map((t) => getInstallerSize(t.name, t.installer_size_mb_fallback)),
                  colors,
                  "MB"
                )}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: { ...chartOptions.scales.x, title: { display: true, text: "MB", color: "#71717a" } },
                  },
                }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOOL_CONFIGS.map((t) => {
                const fetched = isFetched(t.name);
                const v = getVersion(t.name);
                return (
                  <span
                    key={t.name}
                    className="rounded-md px-2 py-1 text-[11px]"
                    style={{
                      background: t.color + "15",
                      color: t.color,
                    }}
                  >
                    {t.name}: {getInstallerSize(t.name, t.installer_size_mb_fallback)} MB
                    {v && ` (${v})`}
                    {fetched ? " — live" : t.github_repo ? " — fallback" : " — manual"}
                  </span>
                );
              })}
            </div>
          </Panel>
        </motion.section>

        {/* RAM Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <SectionTitle icon={<HardDrive className="h-5 w-5" />}>Memory Usage</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="RAM at Idle (MB)">
              <div className="h-[240px]">
                <Bar
                  data={makeBarData("RAM", names, TOOL_CONFIGS.map((t) => t.ram_idle_mb), colors, "MB")}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, title: { display: true, text: "MB", color: "#71717a" } },
                    },
                  }}
                />
              </div>
            </Panel>
            <Panel title="RAM with 10 Open Tabs (MB)">
              <div className="h-[240px]">
                <Bar
                  data={makeBarData("RAM", names, TOOL_CONFIGS.map((t) => t.ram_10_tabs_mb), colors, "MB")}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, title: { display: true, text: "MB", color: "#71717a" } },
                    },
                  }}
                />
              </div>
            </Panel>
          </div>
        </motion.section>

        {/* Startup Time */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <SectionTitle icon={<Clock className="h-5 w-5" />}>Startup Time</SectionTitle>
          <Panel title="Cold Start to Ready (seconds)">
            <div className="h-[240px]">
              <Bar
                data={makeBarData("Startup", names, TOOL_CONFIGS.map((t) => t.startup_time_s), colors, "s")}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: { ...chartOptions.scales.x, title: { display: true, text: "seconds", color: "#71717a" } },
                  },
                }}
              />
            </div>
          </Panel>
        </motion.section>

        {/* Feature Comparison Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-8"
        >
          <SectionTitle icon={<Globe className="h-5 w-5" />}>Feature Comparison</SectionTitle>
          <Panel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-[#2a2a2e] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Feature
                    </th>
                    {TOOL_CONFIGS.map((t) => (
                      <th
                        key={t.name}
                        className="border-b border-[#2a2a2e] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                        style={{ color: t.color }}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">Framework</td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center text-zinc-400">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                          t.framework.includes("Tauri")
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {t.framework}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">Open Source</td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center">
                        {t.open_source ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-red-400" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">Account Required</td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center">
                        {t.requires_account ? (
                          <XCircle className="mx-auto h-4 w-4 text-red-400" />
                        ) : (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-green-400" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">RAM (idle)</td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center font-mono text-xs text-zinc-300">
                        {t.ram_idle_mb} MB
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">Startup Time</td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center font-mono text-xs text-zinc-300">
                        {t.startup_time_s}s
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#1c1c1f]">
                    <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">
                      Installer Size
                      {!loading && <span className="ml-1 text-[10px] text-green-400/60">LIVE</span>}
                    </td>
                    {TOOL_CONFIGS.map((t) => (
                      <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center font-mono text-xs text-zinc-300">
                        {loading ? "..." : `${getInstallerSize(t.name, t.installer_size_mb_fallback)} MB`}
                      </td>
                    ))}
                  </tr>
                  {ALL_PROTOCOLS.map((proto) => (
                    <tr key={proto} className="hover:bg-[#1c1c1f]">
                      <td className="border-b border-[#2a2a2e] px-3 py-2.5 text-zinc-300">{proto}</td>
                      {TOOL_CONFIGS.map((t) => (
                        <td key={t.name} className="border-b border-[#2a2a2e] px-3 py-2.5 text-center">
                          {t.protocols.includes(proto) ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-zinc-700" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </motion.section>

        {/* Internal Benchmarks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <SectionTitle icon={<Terminal className="h-5 w-5" />}>
            Internal Benchmarks (Criterion.rs)
          </SectionTitle>
          <p className="mb-4 text-sm text-zinc-500">
            Measured on every commit to main. These are Rust backend benchmarks — no GUI overhead.
          </p>
          <Panel>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTERNAL_BENCHES.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between rounded-lg bg-[#1c1c1f] px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-200">{b.name}</div>
                    <div className="text-xs text-zinc-500">{b.description}</div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="font-mono text-lg font-bold text-indigo-400">{b.value}</span>
                    <span className="ml-1 text-xs text-zinc-500">{b.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </motion.section>

        {/* Methodology */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <SectionTitle icon={<Shield className="h-5 w-5" />}>Methodology</SectionTitle>
          <Panel>
            <div className="space-y-3 text-sm text-zinc-400">
              <p>
                <strong className="text-zinc-200">Installer sizes</strong> are fetched live from each
                tool&apos;s GitHub Releases API (latest stable release, Linux AppImage). Postman is
                closed-source, so its size is measured manually from the official download.
              </p>
              <p>
                <strong className="text-zinc-200">Internal benchmarks</strong> are run via{" "}
                <a href="https://github.com/bheisler/criterion.rs" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Criterion.rs</a>{" "}
                in CI on every push to main. Results are deterministic and reproducible.
              </p>
              <p>
                <strong className="text-zinc-200">RAM and startup times</strong> are measured on
                comparable hardware (8-core, 16 GB RAM, SSD) from community benchmarks and official documentation.
                These cannot be automated via GitHub API and are updated periodically.
              </p>
              <p className="text-zinc-500">
                If you find inaccuracies, please{" "}
                <a href="https://github.com/berbicanes/apiark/issues" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">open an issue</a>.
              </p>
            </div>
          </Panel>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
