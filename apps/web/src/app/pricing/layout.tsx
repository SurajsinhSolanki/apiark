import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ApiArk | Free Core, Pro & Team Plans",
  description:
    "ApiArk is free for individuals with unlimited collections, all protocols, scripting, and CLI. Pro and Team tiers coming soon for mock servers, monitoring, and collaboration.",
  openGraph: {
    title: "ApiArk Pricing — Free Core, Pro & Team",
    description:
      "Free forever for core API development. Pro ($8/mo) and Team ($16/mo) coming soon.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
