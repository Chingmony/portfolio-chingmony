/* ============================================================================
   ABOUT — experience, education, languages, work process and philosophy.
   Sourced from Leng Chingmony's CV. Everything here is editable.
   ============================================================================ */

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  detail: string;
  /** Optional tech stack chips. */
  tags?: string[];
}

/** Training, team projects and internships — from the CV, most recent first. */
export const experience: ExperienceEntry[] = [
  {
    role: "Advanced Cybersecurity Course",
    org: "Korea Software HRD Center",
    period: "Jul 2025 — Dec 2025",
    detail:
      "Penetration testing and exploitation: network hacking, reconnaissance & OSINT, brute-force and JWT cracking, web exploitation (SQLi, XSS, CSRF) and Python scripting, on top of security fundamentals (CIA, IAAA, NIST, OSI/TCP-IP).",
    tags: ["Kali Linux", "Metasploit", "Burp Suite", "Wireshark", "Python"],
  },
  {
    role: "PentraBox — Team Final Project",
    org: "Korea Software HRD Center · Team Leader",
    period: "Nov 2025 — Dec 2025",
    detail:
      "An AI-powered security testing platform combining black-box testing (AI web mapping, subdomain & directory enumeration, automated payload injection) and white-box testing (SAST parsing, SonarQube integration, fix management). Led the team on concept, workflow and frontend.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Keycloak", "Docker", "Ollama"],
  },
  {
    role: "LUMNOV — Team Final Project",
    org: "Korea Software HRD Center",
    period: "May 2025 — Jul 2025",
    detail:
      "A rental community platform for owners and renters: property listings, combined utility billing, GPS-based discovery, in-app chat, community pages and emergency alerts. Contributed concept, workflow analysis, UX/UI and frontend.",
    tags: ["Spring Boot", "Next.js", "PostgreSQL", "WebSocket"],
  },
  {
    role: "Basic Software Engineering Course",
    org: "Korea Software HRD Center",
    period: "Feb 2025 — Jul 2025",
    detail:
      "Full-stack foundations: Java (J2SE OOP, J2EE/Maven/MVC), the Spring ecosystem (Spring Boot, MyBatis, RESTful APIs, Spring Security, JWT), PostgreSQL data modeling, and web development with Next.js and Tailwind CSS.",
    tags: ["Java", "Spring Boot", "Next.js", "PostgreSQL"],
  },
  {
    role: "Software Tester — Internship",
    org: "Technovage Solution",
    period: "Jan 2023 — Mar 2023",
    detail: "Three-month internship in software testing and quality assurance.",
  },
  {
    role: "Architectural Designer — Internship",
    org: "Kurt A&D",
    period: "Jun 2024 — Aug 2024",
    detail: "Three-month internship in architectural design.",
  },
];

/* ---------------------------------- education ----------------------------- */

export interface EducationEntry {
  credential: string;
  org: string;
  year: string;
}

export const education: EducationEntry[] = [
  {
    credential: "Bachelor of Computer Science",
    org: "The University of Cambodia",
    year: "2021 — 2024",
  },
  {
    credential: "Bachelor of Architectural Studies",
    org: "Limkokwing University",
    year: "2021 — 2024",
  },
  {
    credential: "General Chinese Program (GEP7)",
    org: "Cam-Asean International Institute",
    year: "2021 — 2022",
  },
  {
    credential: "English — Advanced Course",
    org: "Australian Center for Education",
    year: "2020",
  },
  {
    credential: "High School Diploma",
    org: "Thmor Koul High School",
    year: "2017 — 2020",
  },
];

/* ---------------------------------- languages ----------------------------- */

export interface Language {
  name: string;
  /** 1–5 proficiency, shown as a compact meter. */
  level: number;
}
export const languages: Language[] = [
  { name: "English", level: 4 },
  { name: "Khmer", level: 5 },
  { name: "Chinese", level: 3 },
  { name: "Korean", level: 2 },
];

/* ----------------------------------- process ------------------------------ */

export interface ProcessStep {
  no: string;
  title: string;
  detail: string;
}

export const processSteps: ProcessStep[] = [
  {
    no: "01",
    title: "Discover",
    detail: "Understand the problem, the users, the requirements and the security context before writing anything.",
  },
  {
    no: "02",
    title: "Research",
    detail: "Explore existing solutions, investigate the threat model, and find where the real risk and opportunity sit.",
  },
  {
    no: "03",
    title: "Build",
    detail: "Develop a practical solution with the right technologies — small, auditable pieces over clever ones.",
  },
  {
    no: "04",
    title: "Validate",
    detail: "Test functionality, probe the security boundary, and prove what the system can and cannot guarantee.",
  },
  {
    no: "05",
    title: "Refine",
    detail: "Document the findings, sharpen the experience, and deliver something polished enough to learn from.",
  },
];

/* --------------------------------- philosophy ----------------------------- */

export const philosophy = {
  quote: "Technology should not only work. It should be trustworthy.",
  body:
    "I believe security is learned by building, not just reading — and that the most useful tools are the ones honest about their limits. My work tries to make defensive thinking practical, reproducible and accessible to the people learning it for the first time.",
  signoff: "Let's build something that earns trust.",
};
