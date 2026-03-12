import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApiArk vs Insomnia — Local-First by Design, Not Afterthought",
  description:
    "Compare ApiArk and Insomnia. Zero cloud dependency, no forced sync, no data uploaded without consent. Trust through architecture.",
  openGraph: {
    title: "ApiArk vs Insomnia",
    description: "Local-first by design, not by policy. Your data never leaves your machine.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
