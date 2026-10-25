/* ============================================================================
   RESEARCH JOURNAL
   ----------------------------------------------------------------------------
   Add an article by appending one object. `body` is GitHub-flavoured Markdown
   (tables, fenced code and task lists all render). The index page, article
   page, sitemap and terminal `research` command all read from this array.

   Keep `date` as an ISO day string — it drives ordering and the <time> tags.
   ============================================================================ */

export type ArticleKind = "writeup" | "research" | "note" | "experiment";

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  /** ISO day, e.g. "2026-02-18". Drives sort order. */
  date: string;
  kind: ArticleKind;
  tags: string[];
  featured: boolean;
  /** One or two sentences for cards and meta description. */
  summary: string;
  /** GitHub-flavoured Markdown. */
  body: string;
}

export const articles: Article[] = [
  {
    slug: "a-ctf-platform-should-not-own-passwords",
    title: "A CTF platform should not own passwords",
    subtitle: "What delegating identity to Keycloak changed about the trust model",
    date: "2026-03-02",
    kind: "research",
    tags: ["OIDC", "Identity", "PKCE", "Architecture"],
    featured: true,
    summary:
      "Building a CTF range forced a decision about identity early. Delegating it entirely to an OIDC provider removed a whole class of problems — and introduced exactly one interesting new one.",
    body: `Every training platform reaches the same fork within a week of existing: do you store passwords, or do you let something else do it?

The tempting answer is to store them. It is a users table, a password hash and a session cookie — a day of work, no extra container in the stack. I went the other way, and the reasoning is worth writing down because it generalises well beyond CTF platforms.

## The platform issues no credentials

In the range I built, learners register and sign in against **Keycloak** over OpenID Connect, using the Authorization Code flow with PKCE. The platform API never sees a password. It is a pure resource server: a request arrives with a bearer token, the API verifies that token against the realm's JWKS, and that is the entire authentication story.

\`\`\`text
Browser ──(Auth Code + PKCE)──> Keycloak
   │                               │
   │  <────── access token ────────┘
   │
   └──(Bearer token)──> Platform API ──(JWKS verify)──> Keycloak
\`\`\`

Three things fell out of this that I did not fully anticipate.

**Credential handling stopped being my problem.** Password policy, reset flows, lockout, email verification, session revocation — all of it moved behind a boundary maintained by people who do that for a living. The amount of security-critical code I own dropped sharply, and the code I do own is all verification rather than storage.

**Privilege became a claim rather than a column.** A user is an instructor if and only if their access token carries the \`instructor\` realm role. There is no \`is_admin\` boolean in my database for someone to flip. This matters more than it sounds: on a platform whose entire purpose is hosting exploitable applications, the authorisation decision should not be reachable from anything an exercise touches.

**The realm is version-controlled.** The Keycloak realm is imported from a JSON file on first boot. Roles, registration settings and clients are reviewable in a diff, and a corrupted environment is fixed by discarding a volume and booting again — not by clicking through an admin console trying to remember what the configuration used to be.

## The interesting new problem

Delegating identity means the platform no longer has a user row until someone authenticates. But solves, scoreboards and progress all need a local foreign key.

The fix is **just-in-time provisioning**: on the first authenticated request, if no local row matches the token subject, create one from the token's claims. It is a few lines, but it has a sharp edge worth stating explicitly.

> The token subject — not the email — must be the join key.

Email is mutable. If a learner changes their address in the identity provider and you keyed on email, you have silently created a second user and orphaned their history. Key on the immutable subject claim, treat email as display data, and the problem disappears.

| Concern | Platform-owned auth | Delegated OIDC |
|---|---|---|
| Password storage | Yours to get right | Not present |
| Reset / lockout flows | Yours to build | Provider |
| Privilege check | Database column | Token claim |
| Config reviewability | Migrations | Realm JSON in git |
| User provisioning | At registration | Just-in-time |

## When I would not do this

Honesty matters here. Delegation costs you a container, a startup dependency and a harder local-development story — a dead identity provider means nobody can log in, including you. For a single-user tool or a static assessment with no accounts at all, it is the wrong trade; the VAPT assessment I built deliberately has no authentication whatsoever, because it has nothing worth attributing.

The rule I have settled on: **if a privilege boundary exists, delegate identity. If no privilege boundary exists, do not add accounts to acquire one.**`,
  },

  {
    slug: "designing-isolation-for-a-vulnerable-app-range",
    title: "Designing isolation for a range of deliberately vulnerable apps",
    subtitle: "How to host twenty-two exploitable applications without any one of them becoming a foothold",
    date: "2026-02-11",
    kind: "research",
    tags: ["Isolation", "Docker", "Defensive Design", "Architecture"],
    featured: true,
    summary:
      "A training range is a building full of unlocked doors on purpose. The engineering problem is making sure an unlocked door opens onto a single empty room, never onto the building's wiring.",
    body: `A capture-the-flag range is an unusual thing to operate: you are deliberately hosting software that is supposed to be broken. The security work is not in the challenges — those are meant to fall. It is in the blast radius when they do.

I treat the design as answering one question for each exploitable app: **when a learner succeeds, what can they reach?** The correct answer is always "the inside of this one challenge, and nothing else."

## One container, one port, one flag

Each of the twenty-two challenge applications runs in its own container, bound to its own port, with its flag injected from the environment at boot rather than baked into the image. That gives three independent properties:

- **Lateral isolation.** Compromising one challenge's process does not place the learner on a network segment with the platform API or any other challenge. The interesting outcome of an exploit stays contained to the box that was meant to yield it.
- **Flag portability.** Because flags come from an environment file kept outside the images, rotating every flag in the range is a redeploy, not a source-code change. If a flag leaks to a write-up, it is cheap to invalidate.
- **Reproducibility.** A challenge that gets wedged — a learner left it in a bad state — is reset by recreating one container, not by restarting the stack.

## The platform is not in the blast radius

The deliberate vulnerabilities live entirely in the challenge fleet. The platform API that tracks solves and scoreboards is a separate service with none of them, and the two tiers only ever communicate through flag submission, which is validated and rate-limited.

This is the structural version of a principle I keep returning to: **the component that enforces a rule should never share a process with the component that is allowed to break rules.** On this range, the rule-enforcer (auth, scoring, authorisation) and the rule-breakers (the challenges) are different containers with different exposure, and only one of them is reachable from the other, in one direction, through one narrow endpoint.

## Not internet-facing, by design

The entire range is built to run on localhost or an isolated lab network. That is not a limitation I apologise for — it is a security decision. A library of known-vulnerable applications is exactly the thing you do not expose to the public internet, and designing for an isolated network from the first commit means no accidental default ever ships it somewhere reachable.

> A training environment inherits the ethics of a shooting range: the danger is the point, so the walls are the engineering.

## What I would tell someone building their first range

- Decide the blast radius per challenge **before** writing the challenge. Retrofitting isolation is much harder than designing for it.
- Keep the thing that scores separate from the thing that is attackable, always.
- Make reset cheap. You will need it constantly, and a range that is painful to reset becomes a range nobody maintains.
- Assume a flag will leak and make rotation trivial, rather than assuming it will not.`,
  },

  {
    slug: "assessment-that-returns-a-plan-not-a-score",
    title: "An assessment that returns a plan, not a score",
    subtitle: "Why the VAPT readiness tool hides correctness and ranks gaps instead",
    date: "2026-01-20",
    kind: "experiment",
    tags: ["Assessment", "Pedagogy", "Privacy", "Frontend"],
    featured: false,
    summary:
      "A percentage is a dead end. The useful output of a diagnostic is a ranked list of what to study next, positioned against the workflow the learner is about to be measured on.",
    body: `I built a sixty-question readiness assessment for a vulnerability-assessment and penetration-testing course. The most consequential design decisions were about what it refuses to do.

## It refuses to reveal correctness mid-assessment

Answers stay editable until submission, and the tool never tells a learner whether a given answer was right while they work. This keeps the diagnostic signal clean: nobody can pattern-match forward from feedback, so the final picture reflects what they knew walking in, not what they inferred from the interface.

## It refuses to return a score as the headline

The output is a **prioritised knowledge-gap queue**. Sixty questions spread across nine knowledge areas become a per-area breakdown, a radar across all nine axes, explicit strongest and weakest areas, and a ranked list of what to study first. That list is then positioned against the professional VAPT workflow — reconnaissance, discovery, identification, validation, CVE/CWE/CVSS mapping, risk assessment, reporting, remediation, retest — so a gap is not an abstract weak spot but a specific stage of real practice the learner is not yet ready for.

A score tells someone they are at 68%. A gap queue tells them to spend this week on validation and CVSS mapping. Only one of those changes what happens next.

## It refuses to send anything to a server

This was a privacy decision as much as an architectural one. There is **no database, no authentication, no environment variables and no external API.** Every page is statically prerendered, all state lives in \`localStorage\`, and the results page carries a print stylesheet so a learner can export a clean PDF to keep.

The consequence worth stating plainly:

> An assessment that stores nothing cannot leak anything.

The responses never leave the browser. I am not trusting myself to secure a store of people's knowledge gaps — I am declining to create the store.

## Accessibility as correctness

I treated accessibility as a requirement the tool either meets or fails, not a nicety. Full keyboard operation (letter or number keys to answer, arrows to move), visible focus throughout, semantic controls, and status conveyed through shape and text rather than colour alone. A diagnostic that some learners cannot operate is not measuring knowledge; it is measuring interface compatibility.`,
  },

  {
    slug: "defensive-tooling-should-be-honest-about-scope",
    title: "Defensive tooling should be honest about its scope",
    subtitle: "Scoping to localhost in the code, not the README, and why decode is not verify",
    date: "2025-12-09",
    kind: "note",
    tags: ["Defensive", "Tooling", "Python", "Design"],
    featured: false,
    summary:
      "A tool aimed at people learning to program should make the safe thing the only thing. Two small design choices — scope in code, and never conflating decoding with verification — do most of that work.",
    body: `I maintain a small defensive toolkit for people learning both security and programming. Two decisions in it have held up better than anything else, and both are about honesty rather than capability.

## Scope belongs in the code, not the documentation

Every check in the toolkit is built around the local host and a bundled, deliberately vulnerable Flask application that binds to loopback. The permitted target is \`127.0.0.1\`, and that is expressed in how the modules are written, not in a warning paragraph nobody reads.

The difference is not pedantic. A README that says "only use this on systems you own" is advice. A tool whose checks are constructed around the local host makes the unsafe action require deliberate rewriting. For someone's first security tool, the safe path should be the path of least resistance.

| Approach | What stops misuse |
|---|---|
| Warning in the README | The user's judgement, on a bad day |
| Scope enforced in code | A deliberate decision to rewrite the tool |

## Decode is not verify

This one recurs everywhere and is worth stating as a rule. When a tool reads a structured token — a JWT being the common case — **decoding the contents and verifying the signature are completely different operations, and conflating them is a security bug.**

Decoding is reading. Anyone can read a JWT; it is Base64URL and nothing more. It tells you what the token *claims*. It tells you nothing about whether those claims are *trustworthy*.

Verification is checking the signature against a key you trust. Only verification answers the question that matters — did the issuer I expect actually produce this, and has it been altered since.

> A decoder that presents claims as if they were trusted facts has quietly taught its user to accept forged tokens.

So any inspector I build keeps the two visibly separate: decoding is immediate and local and always available; verification is a distinct, explicit step that requires a key and reports a clear verified-or-not result. The user should never be able to confuse "I can read this" with "I have confirmed this is genuine." That separation is exactly how the JWT inspector in the Cyber Lab on this site is built.

## The general principle

Both decisions are the same idea wearing different clothes: **a tool should not let its user believe something stronger than what the tool actually established.** Scope honestly, separate reading from trusting, and report only what you can stand behind.`,
  },
];

/* --------------------------------- helpers -------------------------------- */

export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export const featuredArticles = sortedArticles.filter((a) => a.featured);

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export const articleSlugs = articles.map((a) => a.slug);
