/* ============================================================================
   YOUR IDENTITY — edit this file first.
   Everything on the site (nav, hero, SEO, terminal `about`, footer, contact)
   reads from here. No other file hard-codes your name or links.
   ============================================================================ */

export interface SocialLink {
  /** Shown as the label; keep it short. */
  label: string;
  href: string;
  /** Mono text rendered next to the label, e.g. a handle. */
  handle: string;
  icon: "github" | "mail" | "linkedin" | "x" | "rss" | "link";
}

export const profile = {
  /** Branding handle — used in nav, footer, terminal and SEO. */
  name: "Chingmony",
  /** Full name, shown large in the hero. */
  fullName: "Leng Chingmony",
  handle: "chingmony",
  /** Online alias, rendered in pixel art in the hero. */
  nickname: "darkhamster",
  /** Personal quote — paired with the pixel hamster-wheel. */
  quote: "always on a wheel to nowhere",
  /** Portrait in /public. Set to null to fall back to the typographic hero. */
  portrait: "/portrait.jpg",
  /** Primary one-line identity. Used in <title> and the hero role line. */
  role: "Cybersecurity Specialist & Penetration Tester",
  /** The oversized word set behind the hero. Keep it short and all-caps. */
  heroWord: "SECURITY",
  /** Script greeting above the hero name. */
  greeting: "Hello, I'm",

  /** Three-part personal brand — surfaced in the hero, philosophy and meta. */
  brand: {
    mission: "Build a safer digital world.",
    mindset: "Learn by building.",
    identity: "Penetration tester · Security researcher · Full-stack builder",
  },

  /** Rotated under the hero headline. Keep each under ~40 chars. */
  roleRotation: [
    "Cybersecurity Specialist",
    "Penetration Tester",
    "Security Researcher",
    "Full-Stack Builder",
  ],
  location: "Phnom Penh, Cambodia",
  timezone: "Asia/Phnom_Penh",

  /** Hero paragraph. Two to three sentences reads best. */
  intro:
    "Driven by curiosity and fueled by passion, I explore the ever-evolving world of cybersecurity — identifying vulnerabilities, protecting critical systems, and researching new frontiers. Penetration testing lets me uncover weaknesses and propose practical solutions, and I love sharing what I learn through teaching.",

  /** Longer bio for /about surfaces and the terminal `about` command. */
  bio: [
    "I'm a cybersecurity specialist focused on penetration testing and web exploitation. I find satisfaction in the challenge of identifying vulnerabilities, protecting critical systems, and diving headfirst into the digital realm to uncover weaknesses and propose innovative solutions.",
    "My background spans a Bachelor of Computer Science from The University of Cambodia and a Bachelor of Architectural Studies from Limkokwing University, followed by full-stack software engineering and advanced cybersecurity training at the Korea Software HRD Center.",
    "I led a team building an AI-powered security testing platform, and I enjoy sharing knowledge through teaching — inspiring others to think critically about security and contribute to building a safer digital world.",
  ],

  /** Short, factual highlights shown in the hero. */
  stats: [
    { value: "8", label: "Projects built" },
    { value: "3", label: "Languages spoken" },
    { value: "2", label: "Bachelor's degrees" },
  ],

  email: "lengchingmony1313@gmail.com",
  /** Phone. Set to null to hide the contact row. */
  phone: "098 226 505",
  /** Optional PGP fingerprint for the contact section. Set to null to hide. */
  pgp: null as string | null,

  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Chingmony",
      handle: "@Chingmony",
      icon: "github",
    },
    {
      label: "Email",
      href: "mailto:lengchingmony1313@gmail.com",
      handle: "lengchingmony1313@gmail.com",
      icon: "mail",
    },
    /* Add LinkedIn / X / your blog here — the icon set supports
       "linkedin" | "x" | "rss" | "link". */
  ] satisfies SocialLink[],

  /** Used for canonical URLs, sitemap and OG tags. Override with NEXT_PUBLIC_SITE_URL. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Shown in the contact section. */
  availability: {
    open: true,
    note: "Open to security research collaboration, application security reviews and teaching engagements.",
  },
} as const;

export type Profile = typeof profile;
