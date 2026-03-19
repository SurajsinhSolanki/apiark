"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Github } from "lucide-react";
import { AppMockup } from "./app-mockup";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

function useLatestVersion() {
  const [version, setVersion] = useState("v0.3.0");
  useEffect(() => {
    fetch("https://api.github.com/repos/berbicanes/apiark/releases/latest")
      .then((r) => r.json())
      .then((data) => { if (data.tag_name) setVersion(data.tag_name); })
      .catch(() => {});
  }, []);
  return version;
}

export default function Hero() {
  const latestVersion = useLatestVersion();

  const badges = [
    { label: latestVersion, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/[0.06]" },
    { label: "Open Source", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.06]" },
    { label: "MIT License", color: "text-amber-400 border-amber-500/20 bg-amber-500/[0.06]" },
    { label: "Cross-Platform", color: "text-violet-400 border-violet-500/20 bg-violet-500/[0.06]" },
  ];
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-6"
      >
        {/* Badges row */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5 mb-10">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium font-mono ${badge.color}`}
            >
              {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
        >
          The API Platform That
          <br />
          Respects Your Privacy,
          <br />
          <span className="text-indigo-400">Your RAM, and Your Git</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center text-lg text-zinc-500 mb-8"
        >
          Local-first, native-speed. Send REST, GraphQL, gRPC,
          WebSocket &mdash; all from one interface.{" "}
          <span className="text-zinc-300">No login. No cloud. No bloat.</span>
        </motion.p>

        {/* Stats dots */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-zinc-500">
          {[
            { label: "~50MB RAM", color: "#fbbf24" },
            { label: "<2s Startup", color: "#22d3ee" },
            { label: "Zero Login", color: "#34d399" },
            { label: "Cross-Platform", color: "#a78bfa" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <a
            href="/download"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <a
            href="https://github.com/berbicanes/apiark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-7 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.05] hover:text-zinc-200"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </motion.div>
        <motion.p variants={fadeUp} className="text-center text-xs text-zinc-600 mb-16">
          Available for macOS, Windows, and Linux
        </motion.p>

        {/* App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <AppMockup autoPlay className="mx-auto max-w-5xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
