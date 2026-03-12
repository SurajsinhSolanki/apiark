import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download ApiArk — Free API Client for macOS, Windows, Linux",
  description:
    "Download ApiArk for free. ~50MB RAM, <2s startup, zero data collection. Available as .dmg, .exe, .msi, .AppImage, .deb, and .rpm. No account required.",
  openGraph: {
    title: "Download ApiArk — Free API Client",
    description:
      "The open-source Postman alternative. 50MB RAM. <2s startup. Available for macOS, Windows, and Linux.",
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
