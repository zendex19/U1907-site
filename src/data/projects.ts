export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
  repo?: string;
  year?: string;
}

// Add new projects here. `image` can be a path under /public or an external URL.
export const projects: Project[] = [
  {
    id: "homelab",
    title: "Homelab Stack",
    description:
      "Self-hosted infrastructure running Proxmox, Nginx, and a fleet of containerized services for media, automation, and personal storage.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop",
    tags: ["proxmox", "docker", "self-hosted"],
    year: "2025",
  },
  {
    id: "malware-sandbox",
    title: "Malware Analysis Sandbox",
    description:
      "Isolated environment for static and dynamic analysis of suspicious binaries with automated artifact collection.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop",
    tags: ["security", "reversing"],
    year: "2025",
  },
  {
    id: "automation-bots",
    title: "Personal Automation Bots",
    description:
      "Collection of small scripts and bots that quietly handle the boring parts of life — backups, syncs, alerts, and reminders.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    tags: ["automation", "python"],
    year: "2024",
  },
];
