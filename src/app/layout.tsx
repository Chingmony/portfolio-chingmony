import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Anton, Sacramento, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TerminalProvider } from "@/components/terminal/terminal-provider";
import { CustomCursor } from "@/components/cursor";
import { BootSequence } from "@/components/boot-sequence";

// Clean grotesque for body, UI and labels.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

// Ultra-bold condensed display — the oversized editorial headlines and the
// giant background lettering.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Elegant monoline script for the hero greeting and the manifesto signature.
const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// 8-bit pixel font for the "darkhamster" handle.
const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

const siteUrl = profile.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.intro,
  keywords: [
    "cybersecurity",
    "security research",
    "web application security",
    "penetration testing",
    "CTF",
    profile.name,
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
    siteName: `${profile.name} · Security Research Lab`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrains.variable} ${anton.variable} ${sacramento.variable} ${pixel.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent"
        >
          Skip to content
        </a>
        {/* Faint film grain across the whole shell — subtle depth, no gradients. */}
        <div
          aria-hidden
          className="noise-overlay pointer-events-none fixed inset-0 z-[200]"
        />
        <BootSequence />
        <CustomCursor />
        <TerminalProvider>
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </TerminalProvider>
      </body>
    </html>
  );
}
