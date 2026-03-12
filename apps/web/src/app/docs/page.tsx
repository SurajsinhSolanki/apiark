"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const sections = [
  {
    title: "Getting Started",
    content: [
      "Download ApiArk from the download page for macOS, Windows, or Linux.",
      "Launch the app — no account or signup required.",
      "Create a collection: a folder on your filesystem with a .apiark/ directory inside.",
      "Create your first request: Ctrl+N, pick a method, enter a URL, hit Ctrl+Enter to send.",
      "Your requests are saved as individual .yaml files — version them with Git.",
    ],
  },
  {
    title: "Collections & Storage",
    content: [
      "Each collection is a directory on your filesystem containing .apiark/apiark.yaml.",
      "Every request is a single .yaml file. Folders map directly to directories.",
      "Collection structure: .apiark/ holds config and environments, request files sit alongside.",
      "Open any folder containing .apiark/apiark.yaml to load it as a collection.",
      "Drag and drop to reorder requests and folders. Changes write to disk immediately.",
    ],
    code: `my-api/
  .apiark/
    apiark.yaml
    environments/
      dev.yaml
      prod.yaml
  users/
    get-all.yaml
    create.yaml
  products/
    list.yaml`,
  },
  {
    title: "Environment Variables",
    content: [
      "Define variables in .apiark/environments/*.yaml files.",
      "Reference variables in requests with {{variableName}} syntax.",
      "Switch environments with Ctrl+E or the dropdown in the header.",
      "Secret variables go in .env files (gitignored) — never committed to source control.",
      "Global environment applies across all collections.",
    ],
    code: `# environments/dev.yaml
name: Development
variables:
  baseUrl: http://localhost:3000
  apiKey: dev-key-12345
secrets:
  - accessToken`,
  },
  {
    title: "Request Format",
    content: [
      "Each request is a YAML file with method, URL, headers, body, auth, and tests.",
      "Supports JSON, XML, Form Data, URL-encoded, Raw, and Binary body types.",
      "Path variables are auto-detected from :paramName in the URL.",
      "Declarative assertions in the assert block, scripted tests in the tests block.",
    ],
    code: `name: Create User
method: POST
url: "{{baseUrl}}/api/users"

headers:
  X-Request-ID: "{{$uuid}}"

auth:
  type: bearer
  token: "{{adminToken}}"

body:
  type: json
  content: |
    {"name": "{{userName}}"}

assert:
  status: 201
  body.id: { type: string }`,
  },
  {
    title: "Authentication",
    content: [
      "None, Bearer Token, Basic Auth, API Key — available in Free tier.",
      "OAuth 2.0 (Authorization Code, Client Credentials, PKCE, Implicit, Password).",
      "Digest Auth, AWS Signature v4, NTLM, JWT Bearer.",
      "Auth inheritance: Collection -> Folder -> Request. Each level can override.",
    ],
  },
  {
    title: "Scripting",
    content: [
      "Pre-request and post-response scripts in JavaScript or TypeScript.",
      "Use the ark API object: ark.request, ark.response, ark.env, ark.test, ark.expect.",
      "Built-in libraries: Chai.js (assertions), CryptoJS, Lodash, Faker, Ajv (JSON Schema).",
      "Scripts execute in order: Collection pre -> Folder pre -> Request pre -> HTTP -> Request post -> Folder post -> Collection post -> Assertions -> Tests.",
    ],
    code: `// Post-response script
ark.test("returns users", () => {
  const body = ark.response.json();
  ark.expect(body.users).to.have.length.above(0);
  ark.expect(body.total).to.be.a("number");
});

// Set variable for next request
const id = ark.response.json().users[0].id;
ark.env.set("userId", id);`,
  },
  {
    title: "Protocols",
    content: [
      "REST: Full HTTP client with all methods, headers, params, auth, cookies, body types.",
      "GraphQL: Schema introspection, auto-complete, variables editor, schema explorer.",
      "gRPC: Load .proto files or use server reflection. Unary, streaming, bidirectional.",
      "WebSocket: Bidirectional messaging, auto-reconnect, message history.",
      "SSE: Server-Sent Events with real-time stream viewer and event filtering.",
      "MQTT: Publish/subscribe with topic management, QoS levels, retained messages.",
    ],
  },
  {
    title: "CLI",
    content: [
      "Install: npm install -g @apiark/cli",
      "Run collections from the command line, perfect for CI/CD pipelines.",
      "Supports JSON, JUnit XML, and HTML reporters.",
    ],
    link: { label: "Full CLI Reference", href: "/docs/cli" },
  },
  {
    title: "Import & Export",
    content: [
      "Import from: Postman (Collection v2.1), Bruno, Insomnia, OpenAPI 3.x, HAR, cURL.",
      "Export to: Postman, OpenAPI, cURL, HAR, ApiArk YAML.",
      "Import auto-detects format and shows a preview before converting.",
      "Post-import summary shows converted requests, environments, and any warnings.",
    ],
  },
];

export default function DocsPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
            <p className="text-zinc-400 mb-12">
              Everything you need to know to use ApiArk.
            </p>
          </motion.div>

          <div className="space-y-16">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                id={section.title.toLowerCase().replace(/[^a-z]+/g, "-")}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-2 mb-4">
                  {section.content.map((item, j) => (
                    <li key={j} className="text-sm text-zinc-400 leading-relaxed flex gap-2">
                      <span className="text-zinc-600 shrink-0">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {section.code && (
                  <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto">
                    {section.code}
                  </pre>
                )}
                {section.link && (
                  <a
                    href={section.link.href}
                    className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {section.link.label} &rarr;
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
