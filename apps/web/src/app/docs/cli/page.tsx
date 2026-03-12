"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const commands = [
  {
    name: "apiark run",
    usage: "apiark run <collection-path>",
    description: "Run all requests in a collection or folder sequentially.",
    flags: [
      { flag: "--env <name>", desc: "Use a specific environment" },
      { flag: "--data <file>", desc: "Data-driven testing with CSV, JSON, or YAML file" },
      { flag: "--reporter <type>", desc: "Output format: json, junit, html (default: json)" },
      { flag: "--delay <ms>", desc: "Delay between requests in milliseconds" },
      { flag: "--iterations <n>", desc: "Number of times to run the collection" },
      { flag: "--bail", desc: "Stop on first failure" },
    ],
    example: `$ apiark run ./my-api --env production --reporter junit
$ apiark run ./my-api/users --data users.csv --iterations 3`,
  },
  {
    name: "apiark import",
    usage: "apiark import <file>",
    description: "Import a collection from another tool.",
    flags: [
      { flag: "--format <type>", desc: "Source format: postman, insomnia, openapi, bruno, har, curl" },
      { flag: "--output <dir>", desc: "Output directory (default: current directory)" },
    ],
    example: `$ apiark import postman-collection.json --format postman
$ apiark import openapi.yaml --format openapi --output ./my-api`,
  },
  {
    name: "apiark export",
    usage: "apiark export <collection-path>",
    description: "Export a collection to another format.",
    flags: [
      { flag: "--format <type>", desc: "Target format: postman, openapi" },
      { flag: "--output <file>", desc: "Output file path" },
    ],
    example: `$ apiark export ./my-api --format postman --output my-api.postman.json
$ apiark export ./my-api --format openapi --output openapi.yaml`,
  },
  {
    name: "apiark lint",
    usage: "apiark lint <collection-path>",
    description: "Validate collection YAML files for errors and warnings.",
    flags: [],
    example: `$ apiark lint ./my-api`,
  },
  {
    name: "apiark mock",
    usage: "apiark mock <collection-path>",
    description: "Start a local mock server based on collection examples.",
    flags: [
      { flag: "--port <number>", desc: "Port to listen on (default: 4000)" },
    ],
    example: `$ apiark mock ./my-api --port 8080`,
  },
];

const exitCodes = [
  { code: 0, meaning: "All tests passed" },
  { code: 1, meaning: "One or more tests failed" },
  { code: 2, meaning: "Collection or file not found" },
  { code: 3, meaning: "Invalid configuration" },
  { code: 4, meaning: "Network error" },
];

export default function CLIPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">CLI Reference</h1>
            <p className="text-zinc-400 mb-4">
              Run collections, import/export, and integrate with CI/CD.
            </p>
            <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono text-sm text-zinc-400 mb-12">
              npm install -g @apiark/cli
            </pre>
          </motion.div>

          <div className="space-y-16">
            {commands.map((cmd, i) => (
              <motion.div
                key={cmd.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <h2 className="text-lg font-semibold text-white mb-1 font-mono">
                  {cmd.name}
                </h2>
                <p className="text-sm text-zinc-400 mb-3">{cmd.description}</p>

                <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono text-xs text-zinc-500 mb-4">
                  {cmd.usage}
                </pre>

                {cmd.flags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Flags</h3>
                    <div className="space-y-1">
                      {cmd.flags.map((f) => (
                        <div key={f.flag} className="flex gap-4 text-sm">
                          <code className="text-indigo-400 font-mono shrink-0 w-40">{f.flag}</code>
                          <span className="text-zinc-400">{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Example</h3>
                  <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono text-xs text-zinc-400 leading-relaxed">
                    {cmd.example}
                  </pre>
                </div>
              </motion.div>
            ))}

            {/* Exit Codes */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-white mb-4">Exit Codes</h2>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
                {exitCodes.map((ec) => (
                  <div key={ec.code} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0">
                    <code className="text-sm font-mono text-indigo-400 w-8">{ec.code}</code>
                    <span className="text-sm text-zinc-400">{ec.meaning}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
