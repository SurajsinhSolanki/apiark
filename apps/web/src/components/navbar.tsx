"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Github, ChevronDown, Download } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Protocols", href: "/#protocols" },
  { label: "Performance", href: "/#performance" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

const compareLinks = [
  { label: "vs Postman", href: "/compare/postman" },
  { label: "vs Bruno", href: "/compare/bruno" },
  { label: "vs Insomnia", href: "/compare/insomnia" },
  { label: "vs Hoppscotch", href: "/compare/hoppscotch" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const compareTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();

  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.6, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, 100], [12, 20]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleCompareEnter = () => {
    if (compareTimeout.current) clearTimeout(compareTimeout.current);
    setCompareOpen(true);
  };

  const handleCompareLeave = () => {
    compareTimeout.current = setTimeout(() => setCompareOpen(false), 150);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links on the landing page
    if (!href.includes("#")) return;
    const hash = href.split("#")[1];
    if (!hash) return;

    // If we're on the landing page, smooth-scroll to the section
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Otherwise, let the browser navigate to /#section normally
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: useTransform(backdropBlur, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(backdropBlur, (v) => `blur(${v}px)`),
        }}
      >
        <motion.div
          className="absolute inset-0 border-b transition-colors"
          style={{
            backgroundColor: useTransform(
              backgroundOpacity,
              (v) => `rgba(10, 10, 11, ${v})`
            ),
            borderColor: useTransform(
              borderOpacity,
              (v) => `rgba(99, 102, 241, ${v * 0.15})`
            ),
          }}
        />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="ApiArk"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight text-white">
              Api
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">
                Ark
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}

            {/* Compare dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCompareEnter}
              onMouseLeave={handleCompareLeave}
            >
              <button
                className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setCompareOpen(!compareOpen)}
              >
                Compare
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    compareOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {compareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-1/2 top-full mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
                  >
                    {compareLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-indigo-500/10 hover:text-white"
                        onClick={() => setCompareOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://github.com/berbicanes/apiark"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span>Star</span>
            </a>

            <a
              href="/download"
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <Download className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Download</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="relative z-50 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-40 flex h-full w-80 max-w-[85vw] flex-col border-l border-white/[0.06] bg-zinc-950/98 pt-20 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile compare section */}
              <div className="mt-1 border-t border-white/[0.06] pt-2">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Compare
                </p>
                {compareLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile bottom actions */}
            <div className="flex flex-col gap-3 border-t border-white/[0.06] p-4">
              <a
                href="https://github.com/berbicanes/apiark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
              >
                <Github className="h-4 w-4" />
                <span>Star on GitHub</span>
              </a>

              <a
                href="/download"
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <Download className="h-4 w-4" />
                <span>Download ApiArk</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
