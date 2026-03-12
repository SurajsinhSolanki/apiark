"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Download,
  Apple,
  Monitor,
  Terminal,
  Check,
  Cpu,
  HardDrive,
  Clock,
  Shield,
  ExternalLink,
  ChevronDown,
  Github,
  Star,
  Loader2,
} from "lucide-react";

const REPO = "berbicanes/apiark";
const RELEASE_URL = `https://github.com/${REPO}/releases/latest`;
const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

type Platform = "macos-arm" | "macos-intel" | "windows" | "linux" | null;
type FetchStatus = "loading" | "success" | "no-release" | "error";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  published_at: string;
  assets: ReleaseAsset[];
}

const PLATFORM_CONFIG = {
  "macos-arm": {
    label: "macOS (Apple Silicon)",
    icon: Apple,
    color: "from-zinc-400 to-zinc-300",
    description: "For M1, M2, M3, and M4 Macs",
    files: [
      { pattern: "aarch64.dmg", label: ".dmg Installer", primary: true },
      { pattern: "aarch64.app.tar.gz", label: ".app.tar.gz Archive", primary: false },
    ],
    cli: { pattern: "cli-macos-arm64", label: "apiark CLI (ARM64)" },
    installSteps: [
      "Open the downloaded .dmg file",
      "Drag ApiArk to your Applications folder",
      "Launch from Applications or Spotlight",
    ],
  },
  "macos-intel": {
    label: "macOS (Intel)",
    icon: Apple,
    color: "from-zinc-400 to-zinc-300",
    description: "For Intel-based Macs",
    files: [
      { pattern: "x64.dmg", label: ".dmg Installer", primary: true },
      { pattern: "x64.app.tar.gz", label: ".app.tar.gz Archive", primary: false },
    ],
    cli: { pattern: "cli-macos-x86_64", label: "apiark CLI (x86_64)" },
    installSteps: [
      "Open the downloaded .dmg file",
      "Drag ApiArk to your Applications folder",
      "Launch from Applications or Spotlight",
    ],
  },
  windows: {
    label: "Windows",
    icon: Monitor,
    color: "from-blue-400 to-blue-300",
    description: "Windows 10 and later",
    files: [
      { pattern: "x64-setup.exe", label: ".exe Installer", primary: true },
      { pattern: "x64_en-US.msi", label: ".msi Installer", primary: false },
    ],
    cli: { pattern: "cli-windows-x86_64.exe", label: "apiark CLI (.exe)" },
    installSteps: [
      "Run the downloaded .exe installer",
      "Follow the installation wizard",
      "Launch ApiArk from the Start menu",
    ],
  },
  linux: {
    label: "Linux",
    icon: Terminal,
    color: "from-amber-400 to-orange-300",
    description: "Ubuntu, Fedora, Arch, and more",
    files: [
      { pattern: "amd64.AppImage", label: ".AppImage (Universal)", primary: true },
      { pattern: "amd64.deb", label: ".deb (Ubuntu/Debian)", primary: false },
      { pattern: "x86_64.rpm", label: ".rpm (Fedora/RHEL)", primary: false },
    ],
    cli: { pattern: "cli-linux-x86_64", label: "apiark CLI (x86_64)" },
    installSteps: [
      "AppImage: chmod +x ApiArk.AppImage && ./ApiArk.AppImage",
      "Debian/Ubuntu: sudo dpkg -i apiark.deb",
      "Fedora/RHEL: sudo rpm -i apiark.rpm",
    ],
  },
} as const;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform?.toLowerCase() ?? navigator.platform?.toLowerCase() ?? "";

  if (ua.includes("mac") || platform.includes("mac")) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer.includes("Apple") && !renderer.includes("Intel")) {
            return "macos-arm";
          }
        }
      }
    } catch {
      // fallback
    }
    return "macos-arm";
  }
  if (ua.includes("win") || platform.includes("win")) return "windows";
  if (ua.includes("linux") || platform.includes("linux")) return "linux";
  return null;
}

function findAsset(assets: ReleaseAsset[], pattern: string): ReleaseAsset | undefined {
  return assets.find((a) => a.name.includes(pattern));
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [release, setRelease] = useState<Release | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    fetch(RELEASE_API)
      .then((r) => {
        if (r.status === 404) {
          setFetchStatus("no-release");
          return null;
        }
        if (!r.ok) {
          setFetchStatus("error");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.tag_name) {
          setRelease(data);
          setFetchStatus("success");
        } else {
          setFetchStatus("no-release");
        }
      })
      .catch(() => {
        setFetchStatus("error");
      });
  }, []);

  const version = release?.tag_name ?? "v0.1.0";
  const publishedAt = release?.published_at ? formatDate(release.published_at) : "";
  const assets = release?.assets ?? [];
  const hasAssets = assets.length > 0;

  const platformOrder: (keyof typeof PLATFORM_CONFIG)[] = [
    ...(platform ? [platform] : []),
    ...((["macos-arm", "macos-intel", "windows", "linux"] as const).filter((p) => p !== platform)),
  ];

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="text-indigo-400">Download ApiArk</span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto mb-4">
              Free, open-source, and available for every platform.
              <br />
              No account required. No strings attached.
            </p>
            {fetchStatus === "loading" && (
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking for latest release...
              </div>
            )}
            {fetchStatus === "success" && release && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Latest: <span className="text-[var(--color-accent)] font-medium">{version}</span>
                {publishedAt && <> &middot; Released {publishedAt}</>}
              </p>
            )}
          </motion.div>
        </section>

        {/* Quick stats */}
        <section className="mx-auto max-w-3xl px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Cpu, label: "~50MB RAM", sub: "at idle" },
              { icon: Clock, label: "<2s", sub: "startup time" },
              { icon: HardDrive, label: "~20MB", sub: "download size" },
              { icon: Shield, label: "Zero", sub: "data collection" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex flex-col items-center p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
              >
                <stat.icon className="w-5 h-5 text-[var(--color-accent)] mb-2" />
                <span className="text-lg font-bold">{stat.label}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{stat.sub}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* No release yet — coming soon state */}
        {(fetchStatus === "no-release" || fetchStatus === "error") && (
          <section className="mx-auto max-w-3xl px-6 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent p-8 text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                <Download className="w-8 h-8 text-[var(--color-accent)]" />
              </div>

              <h2 className="text-2xl font-bold mb-3">First Release Coming Soon</h2>
              <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                We&apos;re putting the finishing touches on ApiArk. Star us on GitHub to get notified when the first release drops.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`https://github.com/${REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[var(--color-accent)] to-indigo-400 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Star className="w-4 h-4" />
                  Star on GitHub
                </a>
                <a
                  href={`https://github.com/${REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-all"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              </div>

              {fetchStatus === "error" && (
                <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                  Could not reach GitHub. Check{" "}
                  <a
                    href={`https://github.com/${REPO}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    releases directly
                  </a>.
                </p>
              )}
            </motion.div>
          </section>
        )}

        {/* Detected platform primary download */}
        {hasAssets && platform && (
          <section className="mx-auto max-w-3xl px-6 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent p-8"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] mb-1">
                    <Check className="w-4 h-4" />
                    Detected your platform
                  </div>
                  <h2 className="text-2xl font-bold">{PLATFORM_CONFIG[platform].label}</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {PLATFORM_CONFIG[platform].description}
                  </p>
                </div>
                {(() => {
                  const Icon = PLATFORM_CONFIG[platform].icon;
                  return <Icon className="w-10 h-10 text-[var(--color-text-muted)]" />;
                })()}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {PLATFORM_CONFIG[platform].files.map((file) => {
                  const asset = findAsset(assets, file.pattern);
                  const url = asset?.browser_download_url ?? RELEASE_URL;
                  return (
                    <a
                      key={file.pattern}
                      href={url}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        file.primary
                          ? "bg-gradient-to-r from-[var(--color-accent)] to-indigo-400 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20"
                          : "bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]/40"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {file.label}
                      {asset && (
                        <span className="text-xs opacity-70">({formatSize(asset.size)})</span>
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Installation instructions */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  Installation
                </p>
                <ol className="space-y-1">
                  {PLATFORM_CONFIG[platform].installSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="text-[var(--color-accent)] font-mono text-xs mt-0.5">{i + 1}.</span>
                      <span className={step.includes(":") && platform === "linux" ? "font-mono text-xs leading-relaxed" : ""}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </section>
        )}

        {/* All platforms toggle */}
        {hasAssets && (
          <section className="mx-auto max-w-3xl px-6 mb-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 mx-auto text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              {showAll ? "Hide" : "Show"} all platforms & downloads
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </section>
        )}

        {/* All platforms grid */}
        <AnimatePresence>
          {hasAssets && showAll && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-auto max-w-4xl px-6 mb-20 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {platformOrder.map((key) => {
                  const config = PLATFORM_CONFIG[key];
                  const Icon = config.icon;
                  const isDetected = key === platform;

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-6 ${
                        isDetected
                          ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5"
                          : "border-[var(--color-border)] bg-[var(--color-card)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-6 h-6 text-[var(--color-text-muted)]" />
                        <div>
                          <h3 className="font-semibold">{config.label}</h3>
                          <p className="text-xs text-[var(--color-text-muted)]">{config.description}</p>
                        </div>
                        {isDetected && (
                          <span className="ml-auto text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded-full">
                            Your platform
                          </span>
                        )}
                      </div>

                      {/* Desktop app downloads */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Desktop App
                        </p>
                        {config.files.map((file) => {
                          const asset = findAsset(assets, file.pattern);
                          const url = asset?.browser_download_url ?? RELEASE_URL;
                          return (
                            <a
                              key={file.pattern}
                              href={url}
                              className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                                <span className="text-sm">{file.label}</span>
                              </div>
                              {asset && (
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  {formatSize(asset.size)}
                                </span>
                              )}
                            </a>
                          );
                        })}
                      </div>

                      {/* CLI download */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          CLI Tool
                        </p>
                        {(() => {
                          const asset = findAsset(assets, config.cli.pattern);
                          const url = asset?.browser_download_url ?? RELEASE_URL;
                          return (
                            <a
                              href={url}
                              className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                                <span className="text-sm">{config.cli.label}</span>
                              </div>
                              {asset && (
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  {formatSize(asset.size)}
                                </span>
                              )}
                            </a>
                          );
                        })()}
                      </div>

                      {/* Install instructions */}
                      <div className="border-t border-[var(--color-border)] pt-3">
                        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                          Install
                        </p>
                        <ol className="space-y-1">
                          {config.installSteps.map((step, i) => (
                            <li key={i} className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                              <span className="text-[var(--color-accent)] font-mono">{i + 1}.</span>{" "}
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* System requirements */}
        <section className="mx-auto max-w-3xl px-6 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">System Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-3">
                <Apple className="w-5 h-5 text-zinc-400" />
                <h3 className="font-semibold">macOS</h3>
              </div>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>macOS 11 (Big Sur) or later</li>
                <li>Apple Silicon or Intel</li>
                <li>~100MB disk space</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Windows</h3>
              </div>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>Windows 10 (1803) or later</li>
                <li>x86_64 architecture</li>
                <li>~100MB disk space</li>
                <li>WebView2 runtime</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Linux</h3>
              </div>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>Ubuntu 22.04+, Fedora 38+</li>
                <li>x86_64 architecture</li>
                <li>~100MB disk space</li>
                <li>WebKitGTK 4.1</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Previous releases + source */}
        <section className="mx-auto max-w-3xl px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a
              href={`https://github.com/${REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--color-text)] transition-colors"
            >
              All releases <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <a
              href={`https://github.com/${REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--color-text)] transition-colors"
            >
              Source code <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <a
              href="/changelog"
              className="inline-flex items-center gap-1 hover:text-[var(--color-text)] transition-colors"
            >
              Changelog
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
