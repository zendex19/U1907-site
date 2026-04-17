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
    id: "termophone",
    title: "Termophone",
    description: "A terminal-based P2P voice call application.",
    image: "https://raw.githubusercontent.com/zendex19/U1907-site-images/refs/heads/main/projects/termophone.png", 
    repo: "https://github.com/Starry-Night-Studios/termophone",
    tags: ["terminal", "cli"],
    year: "2026"
  },
    {
    id: "snake_bfs",
    title: "Snake BFS",
    description: "An implementation of the classic Snake game automated using Breadth-First Search.",
    image: "https://raw.githubusercontent.com/zendex19/U1907-site-images/refs/heads/main/projects/snake_bfs.png", 
    repo: "https://github.com/zendex19/snake_bfs",
    tags: ["algorithms", "python", "pathfinding"],
    year: "2026"
  },
  {
    id: "gcsv",
    title: "GCSV",
    description: "A simple tool for handling CSV data.",
    image: "https://raw.githubusercontent.com/zendex19/U1907-site-images/refs/heads/main/projects/gcsv.png", 
    repo: "https://github.com/zendex19/gcsv",
    tags: ["data", "tooling"],
    year: "2025"
  },
  {
    id: "simpletools",
    title: "SimpleTools",
    description: "A collection of useful web-based utilities.",
    image: "https://raw.githubusercontent.com/zendex19/U1907-site-images/refs/heads/main/projects/simpletools.png", 
    repo: "https://github.com/zendex19/simpletools",
    tags: ["utilities", "website"],
    year: "2025"
  },
];