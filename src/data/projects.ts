/* ============================================================================
   PROJECTS
   ----------------------------------------------------------------------------
   Add a project by appending one object to `projects`. Nothing else needs to
   change: the homepage grid, /projects, /projects/[slug], the sitemap and the
   terminal `projects` command all derive from this array.

   LINKS: none of these repositories have a public remote yet, so each entry
   below is `visibility: "private"` with an empty `links` array — the UI then
   renders a "source on request" chip instead of a dead link. When you push one,
   set `visibility: "public"` and add:

       links: [{ kind: "repo", label: "Repository", href: "https://github.com/Chingmony/..." }]

   The descriptions are drawn from the actual codebases, so they are accurate as
   written — adjust the framing to taste, not the facts.
   ============================================================================ */

export type ProjectKind = "platform" | "tool" | "research" | "library";
export type ProjectStatus = "shipped" | "active" | "archived";

export interface ProjectLink {
  kind: "repo" | "demo" | "writeup" | "docs";
  label: string;
  href: string;
}

/** One box in the architecture diagram on a project page. */
export interface ArchitectureNode {
  label: string;
  detail: string;
  tech?: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** Short showcase category, e.g. "Cryptography Toolkit". Falls back to kind. */
  category?: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Display year or range, e.g. "2025" or "2025 — present". */
  year: string;
  featured: boolean;
  /** One or two sentences. Used on cards and in search results. */
  summary: string;
  /** Why this exists. Paragraphs. */
  problem: string[];
  /** How it is built. Paragraphs. */
  approach: string[];
  architecture: ArchitectureNode[];
  stack: { group: string; items: string[] }[];
  /** Hard numbers. Rendered as a spec table. */
  highlights: { label: string; value: string }[];
  /** Security design decisions — the part most portfolios skip. */
  security: string[];
  links: ProjectLink[];
  visibility: "public" | "private";
}

export const projects: Project[] = [
  {
    slug: "cryptonexus",
    category: "Cryptography Toolkit",
    title: "CryptoNexus",
    tagline: "A hands-on cryptography toolkit — AES, RSA, hashing and password analysis",
    kind: "tool",
    status: "shipped",
    year: "2025",
    featured: true,
    summary:
      "A full-stack cryptography workbench that lets you encrypt and decrypt with AES-256-GCM and RSA-2048, hash and verify file integrity, and measure real password strength — each primitive exposed as its own interactive module.",
    problem: [
      "Cryptography is taught as formulas and then used as a black box. People copy an AES call from the first search result without knowing what a nonce is for, why GCM authenticates, or why rolling your own padding is a mistake.",
      "I wanted a place to actually turn the handles: generate a real 256-bit key, watch the nonce change every call, see an RSA key pair serialized to PEM, and get an honest verdict on a password — so the concepts stop being abstract.",
    ],
    approach: [
      "A FastAPI backend wraps Python's `cryptography` library and exposes each primitive as a small, auditable endpoint. AES uses AES-256-GCM (an AEAD construction, so it authenticates as well as encrypts) with a fresh 96-bit nonce per message; RSA uses 2048-bit keys with OAEP padding and PEM serialization.",
      "Password tooling is built on the right primitives rather than invented ones: bcrypt for hashing and zxcvbn for strength estimation, so the strength score reflects real guessability, not a naive character-class checklist.",
      "The Next.js frontend gives every capability its own route and component — AES encrypt/decrypt, RSA encrypt/decrypt, a file hash scanner, an integrity vault, and the password strength, hash and validation modules — with copy-to-clipboard on every output and motion that makes the transforms feel tangible.",
    ],
    architecture: [
      {
        label: "API",
        detail:
          "FastAPI service with one module per primitive (encryption, hash, password) behind a thin tool router. Each endpoint is small enough to read and reason about.",
        tech: ["FastAPI", "Uvicorn", "Python"],
      },
      {
        label: "Crypto core",
        detail:
          "AES-256-GCM with per-message nonces, RSA-2048 with OAEP, SHA family hashing — all via the audited `cryptography` library, never hand-rolled.",
        tech: ["cryptography", "AES-GCM", "RSA-OAEP"],
      },
      {
        label: "Password analysis",
        detail:
          "bcrypt for hashing and zxcvbn for strength estimation, so feedback is based on real guessability.",
        tech: ["bcrypt", "zxcvbn"],
      },
      {
        label: "Frontend",
        detail:
          "Next.js app with a route and component per tool, form handling via react-hook-form and animated state transitions.",
        tech: ["Next.js", "React Hook Form", "Framer Motion", "axios"],
      },
    ],
    stack: [
      { group: "Backend", items: ["Python", "FastAPI", "Uvicorn", "cryptography", "bcrypt", "zxcvbn"] },
      { group: "Frontend", items: ["Next.js", "React", "React Hook Form", "Framer Motion", "axios"] },
      { group: "Crypto", items: ["AES-256-GCM", "RSA-2048 OAEP", "SHA-2"] },
    ],
    highlights: [
      { label: "Symmetric", value: "AES-256-GCM" },
      { label: "Asymmetric", value: "RSA-2048 OAEP" },
      { label: "Password model", value: "bcrypt + zxcvbn" },
      { label: "Tool modules", value: "7" },
    ],
    security: [
      "Every primitive uses an audited library (`cryptography`, bcrypt, zxcvbn) — nothing cryptographic is hand-rolled, which is the whole lesson the tool teaches.",
      "AES is AES-256-GCM, an authenticated (AEAD) mode, with a fresh random nonce per message so identical plaintexts never produce identical ciphertext.",
      "RSA uses OAEP padding rather than textbook RSA, and keys are 2048-bit and PEM-serialized.",
      "Password strength uses zxcvbn's guessability model instead of a character-class checklist, so the feedback matches how passwords are actually attacked.",
    ],
    links: [
      { kind: "repo", label: "Repository", href: "https://github.com/Chingmony/cryptonexus" },
    ],
    visibility: "public",
  },

  {
    slug: "strokesense",
    category: "Security Awareness",
    title: "StrokeSense",
    tagline: "An interactive site that makes keylogging visible",
    kind: "platform",
    status: "shipped",
    year: "2025",
    featured: true,
    summary:
      "A security-awareness experience about keyloggers. Instead of warning people in the abstract, it shows them — a live visualizer renders keystroke capture as it happens, backed by an awareness hub and a practical protection checklist.",
    problem: [
      "Most people have no mental model for a keylogger. 'Something could be recording your keystrokes' is an abstraction that changes no behaviour, so the warning slides off.",
      "The gap is not information, it is vividness. If someone watches their own typing being captured and reconstructed in front of them, the threat stops being hypothetical and the protective habits suddenly make sense.",
    ],
    approach: [
      "A keystroke visualizer is the centrepiece: it demonstrates, in real time and entirely in the browser, how typing can be observed and reconstructed — turning an invisible threat into something you can watch.",
      "An awareness hub explains the real delivery paths — malicious downloads, bundled software, physical hardware loggers — so the demonstration connects to how compromise actually happens.",
      "A protection suite closes the loop with a concrete, plain-language checklist of defences, so a visitor leaves with actions rather than anxiety. The whole thing is wrapped in a deliberately striking neon interface to hold attention on an easily-ignored topic.",
    ],
    architecture: [
      {
        label: "Visualizer",
        detail:
          "Client-side keystroke capture demo that renders input events as a live feed — the illustration never leaves the browser.",
        tech: ["React", "Browser events"],
      },
      {
        label: "Awareness hub",
        detail: "Content modules explaining infection vectors and what a keylogger can and cannot see.",
        tech: ["Next.js"],
      },
      {
        label: "Protection suite",
        detail: "A structured, actionable checklist of defensive steps for a non-technical audience.",
        tech: ["Next.js", "Tailwind CSS"],
      },
    ],
    stack: [
      { group: "Framework", items: ["Next.js", "React"] },
      { group: "Interface", items: ["Tailwind CSS"] },
    ],
    highlights: [
      { label: "Focus", value: "Keylogger awareness" },
      { label: "Centrepiece", value: "Live visualizer" },
      { label: "Audience", value: "Non-technical" },
      { label: "Posture", value: "Defensive" },
    ],
    security: [
      "The keystroke demonstration runs entirely client-side and captures nothing beyond the demo surface — it illustrates the threat without becoming one.",
      "The goal is behavioural: the protection suite converts the demonstration into specific defensive habits rather than vague caution.",
      "Framed throughout as education and defence — recognising keyloggers in order to resist them.",
    ],
    links: [
      { kind: "repo", label: "Repository", href: "https://github.com/Chingmony/strokesense" },
    ],
    visibility: "public",
  },

  {
    slug: "web-exploitation-ctf",
    category: "CTF Training Range",
    title: "Web Exploitation CTF Platform",
    tagline: "A containerised, identity-backed CTF range for web application security",
    kind: "platform",
    status: "active",
    year: "2025 — present",
    featured: false,
    summary:
      "A self-hosted capture-the-flag platform where every challenge is a real, isolated vulnerable web application rather than a static puzzle. Twenty-two challenge apps, OIDC authentication, and per-challenge container isolation.",
    problem: [
      "Most web security training is either a slide deck or a hosted scoreboard wrapping trivia questions. Neither teaches the thing that matters: driving a real request at a real application and watching the trust boundary give way.",
      "I wanted a range where a learner proxies genuine traffic through Burp, breaks a genuine login flow, and extracts a flag that only exists because the vulnerability is actually present. That requires real applications, real isolation between them, and an identity layer strong enough that solve attribution can be trusted.",
    ],
    approach: [
      "The platform is a Docker Compose stack: a TypeScript API, PostgreSQL for users and solves, Keycloak as the identity provider, a React single-page frontend, and a fleet of small Python challenge applications each bound to its own port in the 9001–9022 range.",
      "Authentication is delegated entirely. The platform issues no passwords of its own — learners register and sign in against Keycloak over OpenID Connect using the Authorization Code flow with PKCE, and the API only ever verifies access tokens. Instructor privilege is a realm role carried in the token, not a column someone can flip in the database. Local user rows are created just-in-time on the first authenticated request, so the identity provider stays the single source of truth.",
      "Challenges are grouped into tracks that mirror how the subject is actually taught: HTTP and recon fundamentals, then injection, then client-side, then session and identity, then a Burp Suite workflow sequence, and finally a set of LLM application security challenges.",
    ],
    architecture: [
      {
        label: "Frontend",
        detail:
          "React SPA served by Vite. Holds no secrets — the Keycloak adapter manages the PKCE flow and tokens live in memory.",
        tech: ["React", "React Router", "keycloak-js", "Vite"],
      },
      {
        label: "API",
        detail:
          "Express in TypeScript. Verifies OIDC access tokens with jose against the realm JWKS, validates every request body with Zod schemas, and rate-limits submission endpoints.",
        tech: ["Express", "TypeScript", "jose", "Zod", "helmet"],
      },
      {
        label: "Identity",
        detail:
          "Keycloak with a version-controlled realm imported on first boot. Self-registration enabled, email as username, instructor role gated.",
        tech: ["Keycloak", "OIDC", "PKCE"],
      },
      {
        label: "Data",
        detail:
          "PostgreSQL with migration and seed scripts. Stores users, challenge metadata, solves and the scoreboard projection.",
        tech: ["PostgreSQL", "node-postgres"],
      },
      {
        label: "Challenge fleet",
        detail:
          "Twenty-two independent Python web applications, one per vulnerability class, each in its own container with its own flag injected from the environment at boot.",
        tech: ["Python", "Flask", "Docker"],
      },
    ],
    stack: [
      { group: "Backend", items: ["TypeScript", "Express", "PostgreSQL", "Zod", "jose", "argon2"] },
      { group: "Frontend", items: ["React", "Vite", "React Router", "keycloak-js"] },
      { group: "Identity", items: ["Keycloak", "OpenID Connect", "PKCE"] },
      { group: "Challenges", items: ["Python", "Flask", "Docker Compose"] },
      { group: "Testing", items: ["Vitest", "Supertest"] },
    ],
    highlights: [
      { label: "Challenge applications", value: "22" },
      { label: "Vulnerability classes", value: "11" },
      { label: "Auth model", value: "OIDC + PKCE" },
      { label: "Isolation", value: "1 container per challenge" },
      { label: "Services in stack", value: "5" },
    ],
    security: [
      "No platform-issued credentials. Keycloak owns authentication; the API is a pure resource server that verifies tokens against the realm JWKS.",
      "Authorisation is role-based and token-derived — a user is an instructor if and only if the access token carries the `instructor` realm role.",
      "Flags are injected per container from an environment file that is kept outside the application images, so rotating a flag is a redeploy rather than a code change.",
      "Every challenge runs in its own container on its own port. A learner who achieves code execution inside one deliberately broken app reaches neither the platform API nor another challenge.",
      "Standard hardening on the API surface: helmet headers, CORS pinned to the frontend origin, argon2 for any local secret material, Zod validation at every boundary, and rate limiting on flag submission to blunt brute-forcing.",
      "The whole range is designed to run on localhost or an isolated lab network. It is intentionally not internet-facing.",
    ],
    links: [],
    visibility: "private",
  },

  {
    slug: "vapt-readiness-assessment",
    category: "Assessment Tool",
    title: "VAPT Readiness Assessment",
    tagline: "A diagnostic instrument, not a quiz",
    kind: "tool",
    status: "shipped",
    year: "2025",
    featured: false,
    summary:
      "A sixty-question assessment across nine security knowledge areas that produces a prioritised knowledge-gap report instead of a score. Fully static, no backend, no telemetry — every answer stays in the browser.",
    problem: [
      "Before a vulnerability assessment and penetration testing course, I needed to know what a cohort actually knew — not what they would answer if the correct answer were obvious. And I needed the output to be useful to the learner, not just to me.",
      "A percentage tells someone nothing actionable. A ranked list of their weakest knowledge areas, mapped onto the professional workflow they are about to be assessed against, tells them exactly where to spend the next week.",
    ],
    approach: [
      "Sixty multiple-choice questions, presented one at a time, spread across nine knowledge areas. Correctness is never revealed during the assessment — a learner cannot pattern-match their way forward, which keeps the diagnostic signal clean.",
      "The report is the product. It renders a score ring, a nine-axis radar of knowledge areas, a per-category breakdown, explicit strongest and weakest areas, a prioritised knowledge-gap queue, and the full professional VAPT workflow — reconnaissance, discovery, identification, validation, CVE/CWE/CVSS mapping, risk assessment, reporting, remediation, retest — so the gaps are positioned against real practice.",
      "Deliberately architected with no server: every page is statically prerendered, all state lives in `localStorage`, and the results page has a print stylesheet so a learner can export a clean light-theme PDF to keep.",
    ],
    architecture: [
      {
        label: "Question bank",
        detail:
          "A typed data module as the single source of truth — questions, options, correct index and knowledge area. Adding a question is appending an object.",
        tech: ["TypeScript"],
      },
      {
        label: "Assessment shell",
        detail:
          "One question at a time with a navigator grouped by knowledge area and a sixty-segment progress rail. Answers remain editable until submission.",
        tech: ["Next.js App Router", "React"],
      },
      {
        label: "Persistence",
        detail:
          "Progress autosaved to localStorage so a learner can close the tab and resume. Reset and retake both supported.",
        tech: ["localStorage"],
      },
      {
        label: "Report engine",
        detail:
          "Pure functions scoring the response set into per-area results, a ranked gap queue, and radar geometry. No network round-trip.",
        tech: ["TypeScript"],
      },
    ],
    stack: [
      { group: "Framework", items: ["Next.js 16", "App Router", "TypeScript"] },
      { group: "Interface", items: ["Tailwind CSS v4", "shadcn/ui", "Lucide"] },
      { group: "State", items: ["localStorage", "React state"] },
    ],
    highlights: [
      { label: "Questions", value: "60" },
      { label: "Knowledge areas", value: "9" },
      { label: "Backend services", value: "0" },
      { label: "Rendering", value: "Fully prerendered" },
      { label: "Data leaving browser", value: "None" },
    ],
    security: [
      "No database, no authentication, no environment variables and no external API. There is no server-side state to breach because there is no server-side state.",
      "Responses never leave the browser. The assessment is usable offline after first load and collects no analytics.",
      "Accessibility treated as a correctness requirement: full keyboard operation (A–D or 1–4 to answer, arrow keys to navigate), visible focus states, semantic controls, and status conveyed through shape and text rather than colour alone.",
    ],
    links: [],
    visibility: "private",
  },

  {
    slug: "virtual-lab-trainer",
    category: "Interactive Trainer",
    title: "Virtual Lab Trainer",
    tagline: "Seven interactive missions that build a security lab before you build it",
    kind: "platform",
    status: "shipped",
    year: "2025",
    featured: false,
    summary:
      "A mission-based trainer that walks someone through designing an isolated security lab — hypervisor choices, network topology, target selection, tooling — through interactive exercises rather than instructions to follow.",
    problem: [
      "Standing up a first virtual lab is where most people learning security quietly give up. The usual guide is a wall of steps, so a learner either follows it without understanding the topology or stalls on an error the steps never anticipated.",
      "I wanted the reasoning to come first. If someone can explain why the attacker VM and the target sit on a host-only network, the installation steps become obvious. If they cannot, no amount of screenshots will save them.",
    ],
    approach: [
      "Seven missions, each a self-contained interactive exercise: assembling the virtualisation stack, Linux command-line investigation, choosing legitimate practice targets, designing the lab network, weighing virtualisation trade-offs, surveying the Kali toolset, and finally deploying the design.",
      "Interaction is built from drag-and-drop composition, guided investigation and decision exercises with immediate feedback — the learner constructs each answer rather than recognising it. Progress and earned badges persist locally, so the trainer can be worked through across several sittings.",
      "A shared mission scaffold holds the common chrome — header, feedback banner, completion state — so a new mission is one component plus one data entry, which is what has kept the set extensible.",
    ],
    architecture: [
      {
        label: "Mission registry",
        detail:
          "Mission metadata, ordering and badge definitions in typed data modules; each mission is a component resolved from that registry.",
        tech: ["TypeScript"],
      },
      {
        label: "Mission scaffold",
        detail:
          "Shared layout, feedback banner and completion flow, so individual missions contain only their own interaction logic.",
        tech: ["React"],
      },
      {
        label: "Progress store",
        detail:
          "Local progress and badge state with a storage abstraction, surviving reloads and partial completion.",
        tech: ["localStorage", "React context"],
      },
      {
        label: "Interaction kit",
        detail:
          "Drag-and-drop composition, a simulated terminal panel, badge cards and onboarding — reused across all seven missions.",
        tech: ["React", "Framer Motion"],
      },
    ],
    stack: [
      { group: "Framework", items: ["Next.js", "App Router", "TypeScript"] },
      { group: "Interface", items: ["Tailwind CSS", "Framer Motion"] },
      { group: "State", items: ["React context", "localStorage"] },
    ],
    highlights: [
      { label: "Missions", value: "7" },
      { label: "Interaction modes", value: "4" },
      { label: "Backend services", value: "0" },
      { label: "Progress model", value: "Local, resumable" },
    ],
    security: [
      "The trainer teaches lab isolation as its core content: host-only networking, no bridged interfaces to a production LAN, and snapshot discipline before any destructive exercise.",
      "Target selection is a mission in its own right — learners are taught to practise only against systems they own or ranges that explicitly authorise testing.",
      "The application itself is static and stores nothing but local progress.",
    ],
    links: [],
    visibility: "private",
  },

  {
    slug: "defensive-security-toolkit",
    category: "Defensive Tooling",
    title: "Defensive Security Toolkit",
    tagline: "Localhost-only automation, built to be read",
    kind: "tool",
    status: "shipped",
    year: "2025",
    featured: false,
    summary:
      "A small Python toolkit for defensive checks — HTTP posture, log analysis, open ports, HTML attack surface — hard-scoped to the local machine and written so each module demonstrates one concept clearly.",
    problem: [
      "Security tooling for people who are learning to program tends to be either a black box they cannot read or a script that will get them in trouble the first time they point it at something they do not own.",
      "I wanted a toolkit where every module is short enough to read in one sitting, each one teaches a distinct programming concept, and the target is constrained to 127.0.0.1 by design rather than by warning label.",
    ],
    approach: [
      "Five composable modules, each mapped to one concept: an HTTP checker covering requests and exception handling, a log analyser built on regular expressions and frequency counting, a port checker over raw sockets, an HTML parser that enumerates attack surface, and a report writer covering file handling.",
      "A deliberately vulnerable local Flask application ships alongside them — reflected XSS and SQL injection — so the toolkit has something real to find without anyone touching a third-party host.",
      "A shell wrapper composes the modules into a single run with meaningful exit codes, which turns a pile of scripts into something that can sit in a pipeline.",
    ],
    architecture: [
      {
        label: "Modules",
        detail:
          "Five single-purpose modules with a uniform interface, importable individually or composed by the runner.",
        tech: ["requests", "BeautifulSoup", "socket", "re"],
      },
      {
        label: "Local target lab",
        detail:
          "A Flask application with intentional reflected-XSS and SQL-injection endpoints, bound to loopback.",
        tech: ["Flask"],
      },
      {
        label: "Reporter",
        detail: "Writes findings to timestamped report files for diffing between runs.",
        tech: ["Python stdlib"],
      },
      {
        label: "Automation",
        detail: "Bash wrapper composing a full check with exit codes suitable for CI.",
        tech: ["Bash"],
      },
    ],
    stack: [
      { group: "Language", items: ["Python 3.11"] },
      { group: "Libraries", items: ["requests", "BeautifulSoup4", "Flask"] },
      { group: "Automation", items: ["Bash"] },
    ],
    highlights: [
      { label: "Modules", value: "5" },
      { label: "Permitted target", value: "127.0.0.1 only" },
      { label: "Posture", value: "Defensive" },
      { label: "Runtime deps", value: "3" },
    ],
    security: [
      "Scope is enforced in the code, not in the documentation — the checks are built around the local host and the bundled lab application.",
      "Entirely defensive in posture: it inspects configuration, logs, exposed ports and markup. There is no exploitation capability in the toolkit.",
      "The vulnerable Flask lab binds to loopback and is meant to be run, broken and discarded on the learner's own machine.",
    ],
    links: [],
    visibility: "private",
  },

  {
    slug: "gatherly",
    category: "Full-Stack Platform",
    title: "Gatherly",
    tagline: "Event operations with three-tier role-based access control",
    kind: "platform",
    status: "active",
    year: "2025 — present",
    featured: true,
    summary:
      "A full-stack platform for running events end to end — organizations, agendas, attendance, supplies, dynamic forms — built on a strict three-tier RBAC model so every action is checked against the caller's role at the API boundary.",
    problem: [
      "Event tooling tends to grow a tangle of ad-hoc permission checks scattered through the UI, where the real authority — the API — trusts whatever the client sends. That is exactly how privilege-escalation bugs are born.",
      "I wanted authorization to be a first-class, server-side concern: a coherent role model enforced in one place, with the frontend merely reflecting what the backend already guarantees.",
    ],
    approach: [
      "A Spring Boot (Java 21) backend with a strict `Controller → Service → Repository` layering and a central Spring Security configuration. Roles are enforced at the API, not assumed from the UI, across a wide controller surface — auth, organizations, events, agendas, attendance, assignments, forms and templates, materials, supplies and storage.",
      "A three-tier RBAC model is the cross-cutting backbone: every endpoint resolves the caller's role and authorizes before acting, so the client can never grant itself capabilities it was not given.",
      "A Next.js frontend mirrors the model with route groups for admin and application surfaces — organization, team and supply management for admins; dashboard, event detail, guest lists and a form builder for operators — plus a Telegram integration for notifications.",
    ],
    architecture: [
      {
        label: "API",
        detail:
          "Spring Boot 4 on Java 21, strict Controller → Service → Repository layering, MapStruct for DTO mapping and Lombok for boilerplate.",
        tech: ["Spring Boot", "Java 21", "MapStruct"],
      },
      {
        label: "Authorization",
        detail:
          "Central Spring Security config enforcing a three-tier RBAC model; every controller authorizes against the caller's role before acting.",
        tech: ["Spring Security", "RBAC", "JWT"],
      },
      {
        label: "Frontend",
        detail:
          "Next.js App Router with admin and application route groups, an event form builder and guest management.",
        tech: ["Next.js", "React", "TypeScript"],
      },
      {
        label: "Integrations",
        detail: "Telegram notifications and file/material storage endpoints.",
        tech: ["Telegram", "Storage API"],
      },
    ],
    stack: [
      { group: "Backend", items: ["Java 21", "Spring Boot 4", "Spring Security", "MapStruct", "Lombok", "Gradle"] },
      { group: "Frontend", items: ["Next.js", "React", "TypeScript"] },
      { group: "Security", items: ["Three-tier RBAC", "JWT"] },
      { group: "Integrations", items: ["Telegram"] },
    ],
    highlights: [
      { label: "Auth model", value: "Three-tier RBAC" },
      { label: "Backend", value: "Spring Boot 4 / Java 21" },
      { label: "Controllers", value: "16+" },
      { label: "Enforcement", value: "Server-side" },
    ],
    security: [
      "Authorization is enforced server-side in a central Spring Security configuration — the frontend reflects permissions but never grants them.",
      "A three-tier RBAC model is treated as cross-cutting and canonical: every endpoint resolves and checks the caller's role before acting.",
      "Strict layering (Controller → Service → Repository) keeps authorization and data access from leaking into the wrong tier, which is where permission bugs usually hide.",
    ],
    links: [
      { kind: "repo", label: "Repository", href: "https://github.com/Chingmony/Gatherly" },
    ],
    visibility: "public",
  },

  {
    slug: "pcap-ftp-analysis",
    category: "Network Forensics",
    title: "PCAP FTP Traffic Analysis",
    tagline: "Reading FTP activity straight out of packet captures",
    kind: "tool",
    status: "shipped",
    year: "2025",
    featured: false,
    summary:
      "A small network-forensics script that parses raw PCAP captures with dpkt, isolates FTP control traffic on port 21, and plots the activity over time with Plotly — turning a binary capture file into a readable timeline.",
    problem: [
      "A packet capture is a wall of binary. Answering a simple question — when was this service actually being used? — means parsing frames by hand or clicking through a GUI one packet at a time.",
      "I wanted a repeatable, scriptable way to pull a single protocol out of a capture and see its activity as a shape over time, as a foundation for lightweight traffic analysis.",
    ],
    approach: [
      "The script reads a PCAP with `dpkt`, walks each frame down the stack — Ethernet, IP, TCP/UDP — and keeps only packets whose source or destination port is 21, i.e. FTP control traffic.",
      "Each matching packet's timestamp is collected and the series is rendered with Plotly as an activity-over-time chart, so bursts and gaps in FTP usage become visible at a glance.",
      "Parsing is defensive — malformed or non-IP frames are skipped rather than crashing the run — so it tolerates the messiness of real captures.",
    ],
    architecture: [
      {
        label: "Capture parser",
        detail: "dpkt reader that decodes Ethernet → IP → TCP/UDP and filters to FTP (port 21).",
        tech: ["Python", "dpkt"],
      },
      {
        label: "Time series",
        detail: "Collects per-packet timestamps into an activity series tolerant of malformed frames.",
        tech: ["Python"],
      },
      {
        label: "Visualization",
        detail: "Plotly scatter/time chart rendering FTP activity over the capture window.",
        tech: ["Plotly"],
      },
    ],
    stack: [
      { group: "Language", items: ["Python"] },
      { group: "Parsing", items: ["dpkt"] },
      { group: "Visualization", items: ["Plotly"] },
    ],
    highlights: [
      { label: "Input", value: "PCAP capture" },
      { label: "Protocol", value: "FTP (port 21)" },
      { label: "Output", value: "Activity timeline" },
      { label: "Parsing", value: "Fault-tolerant" },
    ],
    security: [
      "Operates on capture files you already hold — it reads PCAPs offline and performs no live capture or network access of its own.",
      "Frame parsing is defensive: malformed and non-IP packets are skipped so a single bad frame cannot abort the analysis.",
      "A building block for protocol-level traffic analysis — the same shape extends to other ports and protocols.",
    ],
    links: [
      { kind: "repo", label: "Repository", href: "https://github.com/Chingmony/PLOTLY" },
    ],
    visibility: "public",
  },
];

/* --------------------------------- helpers -------------------------------- */

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const projectSlugs = projects.map((p) => p.slug);
