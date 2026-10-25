/* ============================================================================
   Simulated terminal — command registry.

   This is entirely client-side. Commands resolve against the site's own typed
   data and router. There is NO server, NO shell, NO eval, and no command can
   reach anything beyond this table. Adding a command is appending to `commands`.
   ============================================================================ */

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { sortedArticles } from "@/data/research";
import { techStack } from "@/data/skills";

export type LineKind = "out" | "dim" | "accent" | "cyan" | "warn" | "error" | "head" | "gap";

export interface TermLine {
  kind: LineKind;
  text: string;
  /** If set, the line renders as an internal link to this path. */
  href?: string;
  /** If set, external link. */
  external?: boolean;
}

export interface CommandResult {
  lines: TermLine[];
  /** Internal path to navigate to after printing. */
  navigate?: string;
  /** External URL to open. */
  openUrl?: string;
  /** Clear the screen instead of printing. */
  clear?: boolean;
  /** Close the terminal overlay. */
  close?: boolean;
}

export interface CommandContext {
  args: string[];
}

export interface Command {
  name: string;
  summary: string;
  usage?: string;
  hidden?: boolean;
  run: (ctx: CommandContext) => CommandResult;
}

const L = (text: string, kind: LineKind = "out", extra?: Partial<TermLine>): TermLine => ({
  kind,
  text,
  ...extra,
});
const GAP: TermLine = { kind: "gap", text: "" };

/* ------------------------------------------------------------------ commands */

const help: Command = {
  name: "help",
  summary: "List available commands",
  run: () => ({
    lines: [
      L("Available commands", "head"),
      GAP,
      ...commands
        .filter((c) => !c.hidden)
        .map((c) => L(`  ${c.name.padEnd(12)} ${c.summary}`, "out")),
      GAP,
      L("  Tab to autocomplete · ↑ ↓ history · Esc to close", "dim"),
    ],
  }),
};

const about: Command = {
  name: "about",
  summary: "Who I am",
  run: () => ({
    lines: [
      L(`${profile.name} — ${profile.role}`, "head"),
      L(`${profile.location} · ${profile.timezone}`, "dim"),
      GAP,
      ...profile.bio.flatMap((p) => [L(p, "out"), GAP]),
      L("Type `projects`, `research`, `lab` or `contact` to go deeper.", "dim"),
    ],
  }),
};

const whoami: Command = {
  name: "whoami",
  summary: "Print the current identity",
  hidden: true,
  run: () => ({ lines: [L(profile.handle, "accent")] }),
};

const projectsCmd: Command = {
  name: "projects",
  summary: "List projects (projects <slug> to open)",
  usage: "projects [slug]",
  run: ({ args }) => {
    if (args[0]) {
      const p = projects.find((x) => x.slug === args[0]);
      if (!p) {
        return {
          lines: [
            L(`No project "${args[0]}".`, "error"),
            L(`Known slugs: ${projects.map((x) => x.slug).join(", ")}`, "dim"),
          ],
        };
      }
      return {
        lines: [
          L(p.title, "head"),
          L(p.tagline, "dim"),
          GAP,
          L(p.summary, "out"),
          GAP,
          L(`Stack: ${p.stack.flatMap((g) => g.items).slice(0, 8).join(", ")}`, "cyan"),
          L(`Opening /projects/${p.slug} …`, "accent"),
        ],
        navigate: `/projects/${p.slug}`,
      };
    }
    return {
      lines: [
        L("Projects", "head"),
        GAP,
        ...projects.flatMap((p) => [
          L(`  ${p.slug}`, "accent", { href: `/projects/${p.slug}` }),
          L(`    ${p.tagline}`, "dim"),
        ]),
        GAP,
        L("Run `projects <slug>` to open one.", "dim"),
      ],
    };
  },
};

const research: Command = {
  name: "research",
  summary: "List research & write-ups",
  usage: "research [slug]",
  run: ({ args }) => {
    if (args[0]) {
      const a = sortedArticles.find((x) => x.slug === args[0]);
      if (!a) return { lines: [L(`No article "${args[0]}".`, "error")] };
      return {
        lines: [L(a.title, "head"), L(`Opening /research/${a.slug} …`, "accent")],
        navigate: `/research/${a.slug}`,
      };
    }
    return {
      lines: [
        L("Research journal", "head"),
        GAP,
        ...sortedArticles.flatMap((a) => [
          L(`  ${a.date}  ${a.slug}`, "accent", { href: `/research/${a.slug}` }),
          L(`              ${a.title}`, "dim"),
        ]),
        GAP,
        L("Run `research <slug>` to open one.", "dim"),
      ],
    };
  },
};

const lab: Command = {
  name: "lab",
  summary: "Open the Cyber Lab",
  run: () => ({
    lines: [
      L("Cyber Lab — browser-based defensive utilities", "head"),
      L("Security-header analyzer · JWT inspector (decode ≠ verify)", "dim"),
      L("Opening /lab …", "accent"),
    ],
    navigate: "/lab",
  }),
};

const skills: Command = {
  name: "skills",
  summary: "Show the technology stack",
  run: () => ({
    lines: [
      L("Core technologies", "head"),
      GAP,
      L(`  ${techStack.join("  ·  ")}`, "cyan"),
      GAP,
      L("Full proficiency matrix on the homepage.", "dim"),
    ],
  }),
};

const contact: Command = {
  name: "contact",
  summary: "How to reach me",
  run: () => ({
    lines: [
      L("Contact", "head"),
      GAP,
      ...profile.socials.map((s) =>
        L(`  ${s.label.padEnd(10)} ${s.handle}`, "accent", {
          href: s.href,
          external: s.href.startsWith("http"),
        }),
      ),
      GAP,
      L(profile.availability.open ? "Status: open to collaboration." : "Status: limited availability.", profile.availability.open ? "accent" : "warn"),
    ],
  }),
};

const social: Command = {
  name: "github",
  summary: "Open my GitHub profile",
  hidden: true,
  run: () => {
    const gh = profile.socials.find((s) => s.icon === "github");
    return {
      lines: [L(`Opening ${gh?.href} …`, "accent")],
      openUrl: gh?.href,
    };
  },
};

const banner: Command = {
  name: "banner",
  summary: "Print the welcome banner",
  hidden: true,
  run: () => ({ lines: welcomeLines() }),
};

const clear: Command = {
  name: "clear",
  summary: "Clear the screen",
  run: () => ({ lines: [], clear: true }),
};

const exit: Command = {
  name: "exit",
  summary: "Close the terminal",
  run: () => ({ lines: [], close: true }),
};

const sudo: Command = {
  name: "sudo",
  summary: "",
  hidden: true,
  run: () => ({
    lines: [
      L("We trust you have received the usual lecture from the local System", "dim"),
      L("Administrator. It usually boils down to these three things:", "dim"),
      GAP,
      L("    #1) This terminal is a simulation.", "out"),
      L("    #2) There is no server shell behind it.", "out"),
      L("    #3) That is the whole point.", "out"),
      GAP,
      L("Nice try, though.", "accent"),
    ],
  }),
};

export const commands: Command[] = [
  help,
  about,
  projectsCmd,
  research,
  lab,
  skills,
  contact,
  clear,
  whoami,
  social,
  banner,
  sudo,
  exit,
];

export function findCommand(name: string): Command | undefined {
  return commands.find((c) => c.name === name.toLowerCase());
}

export function commandNames(): string[] {
  return commands.map((c) => c.name);
}

export function runInput(raw: string): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [] };
  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = findCommand(name);
  if (!cmd) {
    return {
      lines: [
        L(`command not found: ${name}`, "error"),
        L("Type `help` for the list of commands.", "dim"),
      ],
    };
  }
  return cmd.run({ args });
}

export function welcomeLines(): TermLine[] {
  return [
    L(`${profile.handle}@lab : simulated shell`, "accent"),
    L(`${profile.role} · ${profile.location}`, "dim"),
    GAP,
    L("This is a sandboxed, client-side terminal — no real system is exposed.", "dim"),
    L("Type `help` to begin. Try `about`, `projects`, `research`, `lab`.", "out"),
    GAP,
  ];
}
