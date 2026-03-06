import { Github, Twitter } from "lucide-react";

const navigation = {
  product: {
    title: "Product",
    links: [
      { name: "Download", href: "/download" },
      { name: "Changelog", href: "/changelog" },
      { name: "Roadmap", href: "/roadmap" },
      { name: "Docs", href: "/docs" },
    ],
  },
  compare: {
    title: "Compare",
    links: [
      { name: "vs Postman", href: "/compare/postman" },
      { name: "vs Bruno", href: "/compare/bruno" },
      { name: "vs Insomnia", href: "/compare/insomnia" },
      { name: "vs Hoppscotch", href: "/compare/hoppscotch" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "GitHub", href: "https://github.com/apiark/apiark" },
      { name: "Documentation", href: "/docs" },
      { name: "CLI", href: "/docs/cli" },
      { name: "API Docs", href: "/docs/api" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "GDPR", href: "/gdpr" },
    ],
  },
};

const sections = [
  navigation.product,
  navigation.compare,
  navigation.resources,
  navigation.legal,
];

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/apiark/apiark",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://x.com/apiark",
    icon: Twitter,
  },
  {
    name: "Discord",
    href: "https://discord.gg/apiark",
    icon: DiscordIcon,
  },
];

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            {/* Logo + tagline */}
            <div className="col-span-2">
              <a href="/" className="inline-flex items-center gap-2.5 group">
                <img
                  src="/app-icon.png"
                  alt="ApiArk"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold text-white">ApiArk</span>
              </a>
              <p className="mt-4 text-sm text-zinc-500 max-w-xs leading-relaxed">
                Local-first API development. No login. No cloud. No bloat.
              </p>
              {/* Social links */}
              <div className="mt-6 flex items-center gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation columns */}
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-zinc-300 tracking-wide">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} ApiArk. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built with Tauri, React, and Rust.
          </p>
        </div>
      </div>
    </footer>
  );
}
