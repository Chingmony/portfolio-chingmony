# Security Research Lab — personal site

A personal cybersecurity portfolio and research lab: project case studies, a
research journal, and a set of browser-based defensive security tools. Built as
a bespoke experience, not from a template.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion (Framer Motion).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (fully static)
npm run start        # serve the production build
npm run lint         # eslint
```

Node 20+ recommended (developed on Node 22).

---

## Make it yours

Everything you edit lives in **`src/data/`**. No component hard-codes your
identity or content.

| File | What it drives |
|---|---|
| `src/data/profile.ts` | **Start here.** Name, role, bio, stats, email, social links, site URL. Feeds the nav, hero, SEO tags, terminal `about`/`contact`, and footer. |
| `src/data/projects.ts` | Project cards and `/projects/[slug]` pages. Add a project by appending one object to the `projects` array. |
| `src/data/research.ts` | The research journal. `body` is GitHub-flavoured Markdown. Append one object to add an article. |
| `src/data/skills.ts` | The capability matrix (four domains, four-step proficiency scale). |
| `src/data/timeline.ts` | The chronology rail. |

### Re-skinning

All colours, surfaces and type scales are CSS variables at the top of
`src/app/globals.css` (the `:root` block). Change the six accent/surface tokens
and the whole site re-skins — no component edits.

### Linking a project to its repo

Projects default to `visibility: "private"`, which renders a
"source available on request" chip instead of a dead link. When you publish a
repo, set `visibility: "public"` and add to that project's `links` array:

```ts
links: [{ kind: "repo", label: "Repository", href: "https://github.com/you/repo" }],
```

---

## Architecture

```
src/
  app/
    layout.tsx              root shell: fonts, metadata, nav, footer, terminal provider
    page.tsx                homepage — composes the section components
    projects/               /projects and /projects/[slug]
    research/               /research and /research/[slug]
    lab/                    /lab (full-page Cyber Lab)
    sitemap.ts, robots.ts   SEO, generated from the data layer
    not-found.tsx           404
  components/
    sections/               homepage sections (hero, projects, lab, research, skills, timeline, contact)
    lab/                    the Cyber Lab tools (header analyzer, JWT inspector) + tabbed shell
    terminal/               the simulated terminal (provider, surface, command registry)
    network-graph.tsx       the hero's canvas network visual
    motion.tsx              Reveal / Stagger helpers (all respect reduced-motion)
    ui/primitives.tsx       buttons, tags, panels, labels
    icons.tsx               inline icon set (no icon dependency)
  data/                     ← all editable content
  lib/utils.ts              small helpers
```

### Creative interactions

- **Decrypting text** (`scramble-text.tsx`) — the hero headline resolves from
  random glyphs on load, and every section eyebrow decrypts as it scrolls into
  view. Reduced-motion renders the final text instantly; the real text is always
  in `aria-label` for screen readers.
- **Cursor spotlight** on project cards — a radial glow follows the pointer,
  driven by CSS variables so it never re-renders React.
- **Technology marquee** (`tech-marquee.tsx`) — a seamless scrolling band that
  pauses on hover and collapses to a static wrapped row under reduced-motion.

### Signature interaction — the terminal

Open it from the nav, the hero, or by pressing **`` ` ``** (or `Ctrl`/`Cmd` + `` ` ``).

Commands: `help`, `about`, `projects`, `research`, `lab`, `skills`,
`contact`, `clear` (plus `whoami`, `banner`, `exit`, and an easter egg).
Supports command history (↑/↓), `Tab` completion, `Ctrl+L` to clear, and `Esc`
to close.

It is **fully simulated and client-side**: commands resolve against the site's
own typed data and router. There is no server, no shell, and no `eval` — no
command can reach anything outside the command table in
`src/components/terminal/commands.ts`. Add a command by appending to that array.

### Cyber Lab — the tools

Both tools run **entirely in the browser**. Nothing entered is transmitted,
logged, or stored.

- **Header Analyzer** — grades the HTTP security headers of a response you
  paste. It makes *no requests of its own*, so it can never be pointed at a
  third party and there is no server-side fetch to be abused for SSRF. A
  copyable `curl -sI` is provided to fetch headers from a site you are
  authorised to test.
- **JWT Inspector** — decodes a token locally, and keeps **decoding** and
  **signature verification** as separate, clearly-labelled steps (conflating
  them is the most common JWT bug). Verification is HS256 via the Web Crypto
  API; the secret never leaves the page.

Add a tool by creating a client component in `src/components/lab/` and
registering it in `src/components/lab/lab-tools.tsx`.

---

## Accessibility & performance

- Every animation respects `prefers-reduced-motion` (the hero canvas renders a
  single static frame and stops its loop).
- The hero canvas also pauses when the tab is hidden or scrolled offscreen, and
  caps its frame rate and pixel ratio.
- Skip-to-content link, visible focus rings throughout, semantic landmarks,
  keyboard-operable terminal and lab.
- Fully static output — all 19 routes prerender; the terminal is code-split and
  only loaded when first opened.

---

## Environment variables

Only one, and it is optional:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.example   # canonical URLs, OG tags, sitemap
```

See `.env.example`. With it unset, URLs default to `http://localhost:3000`.
There are **no secret keys** — the site has no backend and no paid APIs.

---

## Deploy

Static-friendly; deploys cleanly to Vercel or any Node host.

**Vercel:** import the repo, set `NEXT_PUBLIC_SITE_URL`, deploy. Defaults are
correct.

**Any Node host:**

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
npm run start        # defaults to port 3000
```
