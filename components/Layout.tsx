"use client";

import { ReactNode, useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import {
  ArrowUp, Search, X, Moon, ChevronDown,
  Twitter, Linkedin, Youtube, Instagram, Facebook,
} from "lucide-react";
import { siteConfig } from "@/content/config";

// ── Google AdSense ad slot ──────────────────────────────────────────────────
// Replace data-ad-client and data-ad-slot with your real values.
// Format options: "leaderboard" (728×90), "rectangle" (300×250)
type AdFormat = "leaderboard" | "rectangle";
function AdSlot({ format = "leaderboard" }: { format?: AdFormat }) {
  useEffect(() => {
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); }
    catch {}
  }, []);

  const styles: Record<AdFormat, React.CSSProperties> = {
    leaderboard: { display: "block", minHeight: 90 },
    rectangle:   { display: "block", minHeight: 250 },
  };

  return (
    <div className={format === "leaderboard" ? "w-full flex justify-center my-4" : "w-full my-4"}>
      <ins
        className="adsbygoogle"
        style={styles[format]}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // ← replace
        data-ad-slot={format === "leaderboard" ? "1234567890" : "0987654321"} // ← replace
        data-ad-format={format === "leaderboard" ? "horizontal" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
export { AdSlot };

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
];

// Quick-links bar (V1)
const quickLinks = [
  { href: "/blog",           label: "Latest Articles" },
  { href: "/about",          label: "Our Story" },
  { href: "/contact",        label: "Work With Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

// Mega-menu columns — structured with hrefs (V2)
const megaMenuColumns = [
  {
    heading: "Topics",
    links: ["Technology", "Startups", "Finance", "Policy", "Culture", "Health"],
    hrefs: [
      "/blog?category=technology",
      "/blog?category=startups",
      "/blog?category=finance",
      "/blog?category=policy",
      "/blog?category=culture",
      "/blog?category=health",
    ],
  },
  {
    heading: "Series",
    links: ["Deep Dives", "Founder Files", "Money Matters", "The Weekly"],
    hrefs: ["/blog", "/blog", "/blog", "/blog"],
  },
  {
    heading: "More",
    links: ["Newsletter", "About", "Advertise", "Contact"],
    hrefs: ["/blog", "/about", "#", "/contact"],
  },
];

// Social links with icons (V2)
const socialLinks = [
  { icon: Twitter,   href: "#", label: "Twitter / X" },
  { icon: Linkedin,  href: "#", label: "LinkedIn" },
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube,   href: "#", label: "YouTube" },
];

// Footer category list (V2)
const footerCategories = ["Technology", "Startups", "Finance", "Policy", "Culture"];

export function Layout({ children }: LayoutProps) {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [scrolled,     setScrolled]     = useState(false);

  // Shadow on scroll (V2)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open (V2)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── SEO: JSON-LD WebSite schema ── */}
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteConfig.title,
          "description": siteConfig.description,
          "url": siteConfig.url ?? "https://example.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": `${siteConfig.url ?? "https://example.com"}/blog?search={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        })}}
      />

      {/* ── Google AdSense script ── */}
      <Script
        id="adsense-init"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      {/* ── Red accent line ── */}
      <div className="h-[3px] w-full bg-[#e8380d]" />

      {/* ── Header ── */}
      <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-0">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0 mr-5 group">
            <div className="bg-[#e8380d] text-white font-extrabold text-[11px] w-8 h-8 rounded-sm flex items-center justify-center select-none tracking-tight leading-none">
              GP
            </div>
            <span className="font-serif text-xl font-bold text-gray-950 tracking-tight group-hover:text-[#e8380d] transition-colors hidden sm:block">
              {siteConfig.title}
            </span>
          </a>

          {/* Quick Links — semantic nav (SEO) */}
          <span className="text-[13px] font-bold text-gray-900 flex-shrink-0 hidden md:block">
            Quick Links
          </span>
          <div className="hidden md:block w-px h-7 bg-gray-300 mx-4 flex-shrink-0" />
          <nav aria-label="Quick links" className="hidden md:flex items-center gap-5 overflow-hidden flex-1 min-w-0">
            <ul className="flex items-center gap-5">
            {quickLinks.map((link) => (
              <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] text-gray-600 hover:text-[#e8380d] whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
              </li>
            ))}
            </ul>
          </nav>

          <div className="hidden md:block w-px h-7 bg-gray-300 mx-4 flex-shrink-0" />

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0 flex-shrink-0">

            {/* Language selector (V1) */}
            <button className="hidden sm:flex items-center gap-1 text-[12px] font-bold text-gray-800 bg-gray-100 border-none rounded px-2.5 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
              EN
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Dark mode toggle stub (V1) */}
            <button
              aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Moon className="h-[14px] w-[14px]" />
            </button>

            {/* Live dot (V1) */}
            <span className="relative flex h-2.5 w-2.5 mx-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8380d] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e8380d]" />
            </span>

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="flex flex-col items-center justify-center px-2 py-1 rounded hover:bg-gray-100 transition-colors group"
            >
              <Search className="h-[18px] w-[18px] text-gray-600 group-hover:text-[#e8380d]" />
              <span className="text-[10px] text-gray-500 mt-0.5 leading-none hidden sm:block">Search</span>
            </button>

            {/* Menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="flex flex-col items-center justify-center px-2 py-1 rounded hover:bg-gray-100 transition-colors group"
            >
              {menuOpen ? (
                <X className="h-[18px] w-[18px] text-gray-700 group-hover:text-[#e8380d]" />
              ) : (
                <svg className="h-[18px] w-[18px] text-gray-700 group-hover:text-[#e8380d]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
              <span className="text-[10px] text-gray-500 mt-0.5 leading-none hidden sm:block"></span>
            </button>
          </div>
        </div>
        </div>

        {/* ── Search bar drop-down (V1 style, V2 keyboard nav) ── */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder="Search articles…"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
            <button onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4 text-gray-400 hover:text-gray-700" />
            </button>
          </div>
          </div>
        )}

        {/* ── Mega Menu — V1 dropdown layout, V2 scroll-lock & structured data ── */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[57px] bg-black/40 z-40"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <div className="relative z-50 bg-white border-t border-gray-100 shadow-xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">

                {/* Left — brand + search + socials */}
                <div>
                  <a href="/" className="flex items-center gap-2 mb-8" onClick={() => setMenuOpen(false)}>
                    <div className="bg-[#e8380d] text-white font-extrabold text-[11px] w-8 h-8 rounded-sm flex items-center justify-center">
                      GP
                    </div>
                    <span className="font-serif text-xl font-bold text-gray-950">
                      {siteConfig.title}
                    </span>
                  </a>

                  {/* Search in menu (V2 keyboard nav) */}
                  <p className="text-[11px] font-bold text-[#e8380d] uppercase tracking-wider mb-2">Search</p>
                  <div className="flex items-center border border-gray-200 rounded overflow-hidden w-full max-w-[200px]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                      placeholder="Search articles…"
                      className="flex-1 text-sm px-3 py-2 outline-none text-gray-800"
                    />
                    <button
                      onClick={handleSearchSubmit}
                      className="px-3 py-2 text-gray-500 hover:text-[#e8380d]"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Socials — icon-based (V2) */}
                  <hr className="my-6 border-gray-200" />
                  <div className="flex flex-col gap-3">
                    <span className="text-[11px] font-bold text-[#e8380d] uppercase tracking-wider">Follow us</span>
                    <div className="flex items-center gap-4">
                      {socialLinks.map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#e8380d] transition-colors"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — nav columns (V2 structured hrefs) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {megaMenuColumns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[11px] font-bold text-[#e8380d] uppercase tracking-wider mb-4">
                        {col.heading}
                      </p>
                      <ul className="space-y-3">
                        {col.links.map((item, i) => (
                          <li key={item}>
                            <a
                              href={col.hrefs[i]}
                              className="text-[14px] text-gray-700 hover:text-[#e8380d] transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mega footer bar */}
              <div className="border-t border-gray-100 px-4 sm:px-8 py-4 flex flex-wrap items-center gap-6">
                {[
                  { label: "About",          href: "/about" },
                  { label: "Advertise",      href: "#" },
                  { label: "Contact",        href: "/contact" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-[13px] font-semibold text-gray-700 hover:text-[#e8380d] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      {/* ── Google Ads: Leaderboard (728×90) above content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot format="leaderboard" />
      </div>

      {/* ── Page content ── */}
      <main id="main-content" aria-label="Main content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#0f0f0f] text-white mt-20">
        <div className="h-[3px] w-full bg-[#e8380d]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Brand column */}
            <div className="md:col-span-4">
              <a href="/" className="flex items-center gap-2.5 mb-4">
                <div className="bg-[#e8380d] text-white font-extrabold text-[11px] w-8 h-8 rounded-sm flex items-center justify-center">
                  GP
                </div>
                <span className="font-serif text-xl font-bold text-white">
                  {siteConfig.title}
                </span>
              </a>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                {siteConfig.description}
              </p>
              {/* Icon-based socials in footer (V2) */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Follow us</p>
                <div className="flex items-center gap-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigate */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Navigate</h4>
              <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              </nav>
            </div>

            {/* Topics (V2) */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Topics</h4>
              <nav aria-label="Topic categories">
              <ul className="space-y-3">
                {footerCategories.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/blog?category=${cat.toLowerCase()}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-4">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest stories straight to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#e8380d] placeholder-gray-600"
                />
                <button className="bg-[#e8380d] hover:bg-[#c72d08] text-white text-sm font-bold px-4 py-2.5 rounded-sm transition-colors flex-shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <a href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Advertise</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#e8380d] hover:bg-[#c72d08] text-white p-2.5 rounded-full shadow-xl transition-colors z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}