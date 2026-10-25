/* ============================================================================
   SKILLS & TECHNOLOGY — from the CV.
   Presented as compact bordered tags grouped by discipline. Edit freely.
   ============================================================================ */

export interface SkillDomain {
  id: string;
  title: string;
  skills: string[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: "offensive",
    title: "Offensive Security",
    skills: [
      "Web Exploitation",
      "SQL Injection",
      "XSS",
      "CSRF",
      "Network Hacking",
      "Brute-force Attacks",
      "JWT Cracking",
      "Reconnaissance & OSINT",
      "Python Scripting",
    ],
  },
  {
    id: "tools",
    title: "Security Tools & Platforms",
    skills: [
      "Kali Linux",
      "Nmap",
      "Metasploit",
      "Burp Suite",
      "Wireshark",
      "Netcat",
      "SonarQube",
      "Wordlist Generator",
    ],
  },
  {
    id: "engineering",
    title: "Programming & Backend",
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "Spring Boot",
      "MyBatis",
      "RESTful API",
      "Spring Security / JWT",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    id: "infra",
    title: "Infrastructure & Fundamentals",
    skills: [
      "Docker",
      "PostgreSQL",
      "Linux",
      "Git / GitHub",
      "OSI & TCP/IP",
      "NIST · CIA · IAAA",
      "SSL/TLS · VPN",
      "Prompt Engineering",
    ],
  },
  {
    id: "design",
    title: "Design",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator"],
  },
];

/** Compact technology list for the terminal and the homepage marquee. */
export const techStack = [
  "Kali Linux", "Metasploit", "Burp Suite", "Wireshark", "Nmap",
  "Python", "Java", "Next.js", "Spring Boot", "PostgreSQL", "Docker", "Keycloak",
];
