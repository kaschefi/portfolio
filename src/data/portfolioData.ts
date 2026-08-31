export interface Chapter {
  number: string;
  title: string;
  subtitle: string;
  content: string;
  codeSnippet?: string;
  highlights: string[];
}

export interface VolumeProject {
  id: string;
  title: string;
  subtitle: string;
  roman: string;
  discipline: string;
  note: string;
  deck: string;
  binding: string;
  format: string;
  theme: string;
  motif: string;
  motifKey: string;
  paletteLabel: string;
  color: string;
  foil: string;
  accent: string;
  palette: {
    paper: string;
    paperDeep: string;
    paperPale: string;
    ink: string;
    inkSoft: string;
    wall: string;
    shelf: string;
    shelfDark: string;
    light: string;
    fill: string;
  };
  projectDetails: {
    name: string;
    category: string;
    timeframe: string;
    institution: string;
    role: string;
    summary: string;
    problem: string;
    solution: string;
    keyMetrics: { label: string; value: string }[];
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    architectureDescription: string;
  };
  chapters: Chapter[];
}

// The editable text for every book lives in its own JSON file under
// src/content/volumes/ (one file per book, named after the book's title).
// This is the ONLY shape a content file needs to match — edit freely.
type VolumeContent = Pick<
  VolumeProject,
  | 'id'
  | 'title'
  | 'subtitle'
  | 'discipline'
  | 'note'
  | 'deck'
  | 'binding'
  | 'format'
  | 'theme'
  | 'projectDetails'
  | 'chapters'
>;

// Everything below is "visual identity" — cover color, foil, glyph motif,
// and the palette used by the 3D renderer. This intentionally stays in
// code (not JSON) because it's tightly coupled to the shelf/cover shaders,
// not something you'd typically want to rewrite when just editing text.
// `id` is the join key that matches each entry to its content JSON file.
type VisualIdentity = Pick<
  VolumeProject,
  'id' | 'roman' | 'motif' | 'motifKey' | 'paletteLabel' | 'color' | 'foil' | 'accent' | 'palette'
>;

const VISUAL_IDENTITIES: VisualIdentity[] = [
  {
    id: "codex",
    roman: "I",
    motif: "MoKa Dual-Layer Matrix Glyph",
    motifKey: "moka",
    paletteLabel: "Ultramarine · bone · copper",
    color: "#182a43",
    foil: "#F0EBE3",
    accent: "#3884ff",
    palette: {
      paper: "#171a24",
      paperDeep: "#10131b",
      paperPale: "#f1eadf",
      ink: "#f4eee6",
      inkSoft: "#b9b4ae",
      wall: "#171a24",
      shelf: "#3a2118",
      shelfDark: "#1c0e0a",
      light: "#f4d7b9",
      fill: "#9fb3c9"
    }
  },
  {
    id: "figma",
    roman: "II",
    motif: "7-DoF Articulator",
    motifKey: "modules",
    paletteLabel: "Obsidian · charcoal · crimson",
    color: "#121417",
    foil: "#ff3344",
    accent: "#ff3344",
    palette: {
      paper: "#860d0d",
      paperDeep: "#540808",
      paperPale: "#ffe0df",
      ink: "#f4eee6",
      inkSoft: "#efb9b4",
      wall: "#860d0d",
      shelf: "#3a1c18",
      shelfDark: "#1c0d0a",
      light: "#efb0aa",
      fill: "#a82424"
    }
  },
  {
    id: "cursor",
    roman: "III",
    motif: "Directional caret",
    motifKey: "caret",
    paletteLabel: "Citron · ink · off-white",
    color: "#afc400",
    foil: "#171a16",
    accent: "#c5df13",
    palette: {
      paper: "#c3cf21",
      paperDeep: "#9eaa16",
      paperPale: "#f0f2c9",
      ink: "#171914",
      inkSoft: "#485015",
      wall: "#c3cf21",
      shelf: "#3b2418",
      shelfDark: "#1c0f09",
      light: "#fff6ce",
      fill: "#dce37e"
    }
  },
  {
    id: "antigravity",
    roman: "IV",
    motif: "Suspended orbits",
    motifKey: "orbits",
    paletteLabel: "Cobalt · sky · silver",
    color: "#1537a1",
    foil: "#dbe8f1",
    accent: "#4c75ff",
    palette: {
      paper: "#142a80",
      paperDeep: "#0b1953",
      paperPale: "#dbe8f1",
      ink: "#f3f5f2",
      inkSoft: "#b5c7e9",
      wall: "#142a80",
      shelf: "#3b2117",
      shelfDark: "#1a0d08",
      light: "#e5edf2",
      fill: "#5f85dc"
    }
  },
  {
    id: "claude-code",
    roman: "V",
    motif: "Interlaced paths",
    motifKey: "paths",
    paletteLabel: "Phthalo green · gold · emerald",
    color: "#123524",
    foil: "#efc16d",
    accent: "#f5c563",
    palette: {
      paper: "#123524",
      paperDeep: "#091c13",
      paperPale: "#e6f4ed",
      ink: "#f2faf6",
      inkSoft: "#a3cfbb",
      wall: "#123524",
      shelf: "#3a2016",
      shelfDark: "#1c0d08",
      light: "#82bca2",
      fill: "#0e2e20"
    }
  },
  {
    id: "xcode",
    roman: "VI",
    motif: "Drafting compass",
    motifKey: "compass",
    paletteLabel: "Violet · electric lime · slate",
    color: "#6830D1",
    foil: "#a3e635",
    accent: "#a3e635",
    palette: {
      paper: "#1a0b36",
      paperDeep: "#100624",
      paperPale: "#f3f4f6",
      ink: "#ffffff",
      inkSoft: "#a78bfa",
      wall: "#1a0b36",
      shelf: "#382017",
      shelfDark: "#1b0e09",
      light: "#f3f4f6",
      fill: "#6830D1"
    }
  }
];

// Eagerly load every JSON file in src/content/volumes/ at build time.
// Editing/adding a .json file there is all that's needed to change a
// book's text — no code change required.
const contentModules = import.meta.glob('../content/volumes/*.json', {
  eager: true
}) as Record<string, { default: VolumeContent }>;

const contentById = new Map<string, VolumeContent>();
for (const path in contentModules) {
  const content = contentModules[path].default;
  if (contentById.has(content.id)) {
    throw new Error(
      `Duplicate volume content id "${content.id}" found in ${path}. Each content JSON file must have a unique "id".`
    );
  }
  contentById.set(content.id, content);
}

export const VOLUMES_DATA: VolumeProject[] = VISUAL_IDENTITIES.map((visual) => {
  const content = contentById.get(visual.id);
  if (!content) {
    throw new Error(
      `Missing content JSON for volume id "${visual.id}". Add a file under src/content/volumes/ with "id": "${visual.id}".`
    );
  }
  return { ...visual, ...content };
});

export const STUDENT_PROFILE = {
  name: "M. Kashefirad",
  title: "Creative Technologist & Software Systems Engineer",
  institution: "FH Campus Wien",
  degree: "BSc / MSc Software Engineering & Autonomous Systems",
  location: "Vienna, Austria",
  bio: "Passionate engineer specializing in 3D WebGL graphics, autonomous agent architectures, robotics kinematics, distributed systems, and native mobile computing. Crafting high-performance digital experiences that merge technical rigor with visual excellence.",
  email: "mohammad.kashefirad@stud.hcw.ac.at",
  github: "https://github.com/kaschefi",
  linkedin: "https://www.linkedin.com/in/mkashefirad/",
  skills: {
    languages: ["Python", "Java", "Kotlin", "TypeScript / JavaScript", "React", "Rust", "C / C++", "Swift", "SQL", "GLSL / WGSL"],
    agentic_ai: ["LangGraph & LangChain", "n8n & Semantic Router", "Local LLMs (Ollama)", "Tool-Calling & Multi-Step Reasoning", "LangSmith Observability", "RAG (Pinecone, FAISS)", "PyTorch & CNNs"],
    backend_systems: ["FastAPI & RESTful APIs", "OAuth2 Integration", "Webhook Management", "PostgreSQL & Redis Streams", "ROS / ROS2 Middleware"],
    devops_graphics: ["Docker & Docker Compose", "Three.js & WebGL Shaders", "Computer Vision (OpenCV)", "Graph Theory (Dijkstra, MST)", "Blender 3D", "Figma Systems"]
  }
};
