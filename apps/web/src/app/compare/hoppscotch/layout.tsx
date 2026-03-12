import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApiArk vs Hoppscotch — All the Beauty, More Power",
  description:
    "Compare ApiArk and Hoppscotch. Desktop-first with filesystem storage, gRPC support, mock servers, monitoring, collection runner, and plugin system.",
  openGraph: {
    title: "ApiArk vs Hoppscotch",
    description: "Match the design quality. Triple the features. Git-native storage.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
