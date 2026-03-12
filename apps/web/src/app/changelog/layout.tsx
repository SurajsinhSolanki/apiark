import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — ApiArk | Release History",
  description:
    "See what's new in ApiArk. Release notes, new features, bug fixes, and improvements across all versions.",
  openGraph: {
    title: "ApiArk Changelog",
    description: "Release history and what's new in each version of ApiArk.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
