"use client";

import { motion } from "framer-motion";
import {
  Globe,
  FileJson,
  FolderOpen,
  Variable,
  Braces,
  Server,
  Wifi,
  Radio,
  ArrowDownToLine,
  ArrowUpFromLine,
  Terminal,
  Shield,
  Play,
  Code2,
  Layers,
  Clock,
  FileText,
  Puzzle,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/* ------------------------------------------------------------------ */
/*  Release data                                                       */
/* ------------------------------------------------------------------ */

interface ChangelogEntry {
  version: string;
  date: string;
  label?: string;
  description: string;
  categories: {
    title: string;
    items: { text: string; icon: React.ElementType }[];
  }[];
}

const releases: ChangelogEntry[] = [
  {
    version: "0.1.0",
    date: "March 2026",
    label: "Initial Release",
    description:
      "The first public release of ApiArk. A complete, local-first API development platform with support for multiple protocols, advanced authentication, testing, and more.",
    categories: [
      {
        title: "Core HTTP Client",
        items: [
          {
            text: "Full HTTP client (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)",
            icon: Globe,
          },
          {
            text: "Request body: JSON, XML, Form Data, URL-encoded, Raw, Binary",
            icon: FileJson,
          },
          {
            text: "Collections stored as YAML files on filesystem",
            icon: FolderOpen,
          },
          {
            text: "Environment variables with {{variable}} syntax",
            icon: Variable,
          },
        ],
      },
      {
        title: "Protocol Support",
        items: [
          {
            text: "GraphQL support with schema introspection",
            icon: Braces,
          },
          {
            text: "gRPC support with proto loading and reflection",
            icon: Server,
          },
          {
            text: "WebSocket and SSE real-time connections",
            icon: Wifi,
          },
          {
            text: "MQTT publish/subscribe",
            icon: Radio,
          },
        ],
      },
      {
        title: "Import & Export",
        items: [
          {
            text: "Import from Postman, Bruno, Insomnia, OpenAPI",
            icon: ArrowDownToLine,
          },
          {
            text: "Export to Postman, OpenAPI, cURL",
            icon: ArrowUpFromLine,
          },
          {
            text: "CLI tool (apiark run, import, export)",
            icon: Terminal,
          },
        ],
      },
      {
        title: "Authentication",
        items: [
          {
            text: "OAuth 2.0, Digest, AWS Sig v4, NTLM auth",
            icon: Shield,
          },
        ],
      },
      {
        title: "Testing & Scripting",
        items: [
          {
            text: "Collection runner with data-driven testing",
            icon: Play,
          },
          {
            text: "Pre/post request scripts (JavaScript/TypeScript)",
            icon: Code2,
          },
        ],
      },
      {
        title: "Enterprise Features",
        items: [
          {
            text: "Local mock servers",
            icon: Layers,
          },
          {
            text: "Scheduled testing with notifications",
            icon: Clock,
          },
          {
            text: "API documentation generation",
            icon: FileText,
          },
          {
            text: "Plugin system (JS + WASM)",
            icon: Puzzle,
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            New updates and improvements to ApiArk.
          </p>
        </motion.div>

        {/* Releases */}
        <div className="mt-16 space-y-20">
          {releases.map((release) => (
            <motion.article
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              {/* Version header */}
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-white">
                  v{release.version}
                </h2>
                {release.label && (
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-medium text-indigo-400">
                    {release.label}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-zinc-500">{release.date}</p>

              <p className="mt-4 leading-relaxed text-zinc-400">
                {release.description}
              </p>

              {/* Categories */}
              <div className="mt-10 space-y-8">
                {release.categories.map((category, catIdx) => (
                  <div key={category.title}>
                    <motion.h3
                      className="text-sm font-semibold uppercase tracking-wider text-zinc-500"
                      custom={catIdx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-40px" }}
                      variants={fadeUp}
                    >
                      {category.title}
                    </motion.h3>

                    <ul className="mt-3 space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <motion.li
                          key={item.text}
                          className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.03]"
                          custom={catIdx + itemIdx + 1}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-40px" }}
                          variants={fadeUp}
                        >
                          <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                          <span className="text-sm leading-relaxed text-zinc-300">
                            {item.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
