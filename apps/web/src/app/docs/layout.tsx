import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — ApiArk | Getting Started & Reference",
  description:
    "Learn how to use ApiArk. Collections, environments, YAML request format, scripting, authentication, protocols, CLI, and import/export guides.",
  openGraph: {
    title: "ApiArk Documentation",
    description:
      "Getting started guide, YAML format reference, scripting API, CLI tool, and more.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
