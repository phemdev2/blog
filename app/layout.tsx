import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Blogstr",
  description: "A clean, fast, SEO-optimized blog platform for writers and creators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}