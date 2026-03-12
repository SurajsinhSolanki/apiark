"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Native Speed",
    tag: "PERF",
    accent: "#06b6d4",
    description: "50MB RAM. <2s startup. Tauri v2 + Rust — not Electron bloat.",
    lines: [
      { text: "$ apiark --version", color: "#a1a1aa" },
      { text: "ApiArk v0.1.0 (Tauri v2, Rust)", color: "#22c55e" },
      { text: "", color: "" },
      { text: "$ ps aux | grep -i api", color: "#a1a1aa" },
      { text: "  ApiArk .............. 48MB", color: "#06b6d4" },
      { text: "  Postman ............. 812MB", color: "#ef4444" },
      { text: "  Insomnia ............ 397MB", color: "#f97316" },
    ],
  },
  {
    title: "Local-First Forever",
    tag: "FS",
    accent: "#22c55e",
    description: "Your data never leaves your machine. No login. No cloud. No telemetry.",
    lines: [
      { text: "~/my-api/", color: "#818cf8" },
      { text: "  .apiark/", color: "#a1a1aa" },
      { text: "    apiark.yaml", color: "#22c55e" },
      { text: "    environments/", color: "#a1a1aa" },
      { text: "      dev.yaml", color: "#34d399" },
      { text: "      prod.yaml", color: "#34d399" },
      { text: "  users/", color: "#a1a1aa" },
      { text: "    get-all.yaml", color: "#fbbf24" },
      { text: "    create.yaml", color: "#fbbf24" },
      { text: "  .env  # gitignored", color: "#ef4444" },
    ],
  },
  {
    title: "Git-Native Storage",
    tag: "DIFF",
    accent: "#8b5cf6",
    description: "YAML files. One per request. Fully diffable, mergeable, versionable.",
    lines: [
      { text: "$ git diff users/create.yaml", color: "#a1a1aa" },
      { text: "  name: Create User", color: "#71717a" },
      { text: "- method: PUT", color: "#ef4444" },
      { text: "+ method: POST", color: "#22c55e" },
      { text: '  url: "{{baseUrl}}/api/users"', color: "#71717a" },
      { text: "- body: {}", color: "#ef4444" },
      { text: "+ body:", color: "#22c55e" },
      { text: "+   type: json", color: "#22c55e" },
      { text: "+   content: |", color: "#22c55e" },
      { text: '+     {"name": "{{name}}"}', color: "#22c55e" },
    ],
  },
  {
    title: "TypeScript Scripting",
    tag: "TS",
    accent: "#eab308",
    description: "Pre/post scripts in TS. Chai assertions, CryptoJS, Lodash, Faker built-in.",
    lines: [
      { text: "// post-response script", color: "#6b7280" },
      { text: 'ark.test("user created", () => {', color: "#e4e4e7" },
      { text: "  const body = ark.response.json();", color: "#e4e4e7" },
      { text: '  ark.expect(body).to.have.property("id");', color: "#e4e4e7" },
      { text: "  ark.expect(body.role).to.eq('admin');", color: "#e4e4e7" },
      { text: '  ark.env.set("userId", body.id);', color: "#fbbf24" },
      { text: "});", color: "#e4e4e7" },
      { text: "", color: "" },
      { text: "// Result: PASS (12ms)", color: "#22c55e" },
    ],
  },
  {
    title: "AI-Powered",
    tag: "AI",
    accent: "#ec4899",
    description: "Generate requests from natural language. Auto-generate tests. Your API key.",
    lines: [
      { text: '> "Create a POST to register a user', color: "#ec4899" },
      { text: '   with email validation"', color: "#ec4899" },
      { text: "", color: "" },
      { text: "Generated:", color: "#a1a1aa" },
      { text: "  method: POST", color: "#818cf8" },
      { text: '  url: "{{baseUrl}}/auth/register"', color: "#818cf8" },
      { text: "  body: { email, password }", color: "#818cf8" },
      { text: "  assert:", color: "#22c55e" },
      { text: "    status: 201", color: "#22c55e" },
      { text: "    body.token: { type: string }", color: "#22c55e" },
    ],
  },
  {
    title: "Plugin Ecosystem",
    tag: "EXT",
    accent: "#f97316",
    description: "Extend with JavaScript or WASM plugins. Custom auth, transformers, integrations.",
    lines: [
      { text: "// my-auth-plugin.js", color: "#6b7280" },
      { text: "export default {", color: "#e4e4e7" },
      { text: '  name: "custom-hmac-auth",', color: "#e4e4e7" },
      { text: '  hook: "pre-request",', color: "#e4e4e7" },
      { text: "  run(req) {", color: "#e4e4e7" },
      { text: "    const sig = hmac(req.body);", color: "#fbbf24" },
      { text: '    req.setHeader("X-Sig", sig);', color: "#fbbf24" },
      { text: "  }", color: "#e4e4e7" },
      { text: "};", color: "#e4e4e7" },
    ],
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative overflow-hidden px-6 py-32">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need.{" "}
            <span className="text-zinc-500">Nothing you don&apos;t.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
            See every feature working inside the app.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[#3a3a45]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
                  style={{
                    color: feature.accent,
                    background: `${feature.accent}12`,
                  }}
                >
                  {feature.tag}
                </span>
                <h3 className="text-sm font-semibold text-zinc-200">
                  {feature.title}
                </h3>
              </div>

              {/* Mini terminal */}
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 font-mono text-[10px] leading-relaxed">
                {feature.lines.map((line, i) => (
                  <div key={i} style={{ color: line.color || "transparent" }}>
                    {line.text || "\u00A0"}
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
