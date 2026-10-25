/* ============================================================================
   TIMELINE — career & education chronology, from the CV.
   Sorted by `date` descending. `kind` drives the marker style.
   ============================================================================ */

export type TimelineKind = "project" | "research" | "milestone" | "role";

export interface TimelineEntry {
  /** ISO day. Drives order. Use the first of the month if the day is unknown. */
  date: string;
  period: string;
  kind: TimelineKind;
  title: string;
  detail: string;
  href?: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: "2025-11-01",
    period: "Nov — Dec 2025",
    kind: "project",
    title: "PentraBox — AI-powered security testing platform",
    detail:
      "Led a team building an AI-driven black-box / white-box security testing platform (FastAPI, Next.js, Keycloak, Docker, Ollama) as the Advanced Course final project at Korea Software HRD Center.",
  },
  {
    date: "2025-07-02",
    period: "Jul — Dec 2025",
    kind: "milestone",
    title: "Advanced Cybersecurity Course — Korea Software HRD Center",
    detail:
      "Penetration testing, web exploitation, reconnaissance & OSINT, and security fundamentals, with Kali Linux, Metasploit, Burp Suite and Wireshark.",
  },
  {
    date: "2025-05-01",
    period: "May — Jul 2025",
    kind: "project",
    title: "LUMNOV — rental community platform",
    detail:
      "A Spring Boot + Next.js rental platform with combined billing, GPS discovery, chat and emergency alerts, built as the Basic Course team final project.",
  },
  {
    date: "2025-02-01",
    period: "Feb — Jul 2025",
    kind: "milestone",
    title: "Software Engineering Course — Korea Software HRD Center",
    detail:
      "Full-stack foundations across Java, the Spring ecosystem, PostgreSQL and Next.js.",
  },
  {
    date: "2024-11-01",
    period: "2021 — 2024",
    kind: "role",
    title: "Bachelor of Computer Science — The University of Cambodia",
    detail: "Completed a Bachelor of Computer Science, alongside a Bachelor of Architectural Studies at Limkokwing University.",
  },
  {
    date: "2024-06-01",
    period: "Jun — Aug 2024",
    kind: "milestone",
    title: "Architectural Designer — Internship at Kurt A&D",
    detail: "A three-month internship in architectural design.",
  },
  {
    date: "2023-01-01",
    period: "Jan — Mar 2023",
    kind: "milestone",
    title: "Software Tester — Internship at Technovage Solution",
    detail: "A three-month internship in software testing and quality assurance.",
  },
];

export const sortedTimeline = [...timeline].sort((a, b) => b.date.localeCompare(a.date));
