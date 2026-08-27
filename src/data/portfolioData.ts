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

export const VOLUMES_DATA: VolumeProject[] = [
  {
    id: "codex",
    title: "MOKA",
    subtitle: "Two-Tier Autonomous Physical & Digital AI Assistant",
    roman: "I",
    discipline: "AI Assistant",
    note: "Two-tier cognitive hierarchy: 45ms reflexes and dynamic LangGraph brain.",
    deck: "An AI-powered robotic assistant built around the Anki Cozmo robot. Features a dual-layer cognitive pipeline: Layer 1 fast semantic reflexes (50ms) for hardware safety and laptop automation, and Layer 2 dynamic LangGraph AI brain with FAISS Tool RAG, local Ollama LLMs, and persistent dual-tier PostgreSQL memory.",
    binding: "Ultramarine cloth · copper foil",
    format: "148 × 216 mm · Anki Cozmo Edition",
    theme: "MoKa · two-tier intelligence pipeline",
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
    },
    projectDetails: {
      name: "MoKa AI Assistant (Anki Cozmo)",
      category: "Autonomous Robotics & Agentic Systems",
      timeframe: "2026",
      institution: "FH Campus Wien · Autonomous AI Systems",
      role: "Lead AI Architect & Robotics Systems Engineer",
      summary: "An AI-powered robotic assistant built around the Anki Cozmo robot featuring a two-layer intelligence pipeline: Layer 1 fast semantic reflexes (~45ms) for real-time hardware safety and OS automation, and Layer 2 dynamic LangGraph AI brain with FAISS Tool RAG, local LLMs (qwen2.5:3b via Ollama), and persistent dual-tier PostgreSQL memory.",
      problem: "Traditional conversational LLM assistants suffer from 1.5s+ latency, prompt bloat when managing dozens of tools, zero hardware safety rails, and cloud dependency for physical robot interactions.",
      solution: "Architected a hybrid two-tier routing hierarchy: Layer 1 sub-50ms FastEmbed semantic reflexes for critical motor safety (anti-fall, anti-dump, visual stasis) & PC routines, paired with a Layer 2 stateful LangGraph brain with FAISS vector tool retrieval, Kokoro-ONNX local TTS, and dual-mode PostgreSQL session memory.",
      keyMetrics: [
        { label: "Reflex Latency", value: "45ms (~30x faster)" },
        { label: "Routing Accuracy", value: "93.0% (vs 89.5% baseline)" },
        { label: "Token Savings", value: "83% reduction" },
        { label: "Safety Loop Rate", value: "33Hz real-time" }
      ],
      techStack: ["Python", "LangGraph", "PyCozmo", "FAISS", "FastEmbed", "FastAPI", "Ollama (qwen2.5 / ornith)", "PostgreSQL", "OpenCV", "Kokoro-ONNX", "Tavily MCP", "n8n"],
      githubUrl: "https://github.com/kaschefi/cozmo_ai_assistant",
      liveUrl: "https://github.com/kaschefi/cozmo_ai_assistant",
      architectureDescription: "Two-Tier Fallback Hierarchy: Layer 1 Semantic Router (FastEmbed) directly triggers PyCozmo motor actions & PC routines in ~45ms; Layer 2 routes complex multi-step reasoning through LangGraph with FAISS dynamic Tool RAG, dual-tier PostgreSQL memory, and Kokoro-ONNX TTS."
    },
    chapters: [
      {
        number: "01",
        title: "The Two-Tier Reflex Hierarchy",
        subtitle: "Sub-50ms Spinal Reflexes & 33Hz Hardware Safety",
        content: "Physical robotic assistants cannot afford the 1.5s+ latency of standard LLM reasoning loops for motor safety. MoKa implements a Layer 1 FastEmbed semantic router executing in 45ms (~30x faster), intercepting commands to trigger PyCozmo motor routines directly. At 33Hz, the ReflexSafetyGuard actively evaluates IMU pitch tilt (>20°), true forward deceleration, cliff sensors, and OpenCV optical flow visual stasis to autonomously trigger evasive backup maneuvers before table falls or motor stalls occur.",
        codeSnippet: `# Layer 1 Reflex Safety & Anti-Fall Interceptor\n@reflex_guard.intercept_motion(rate_hz=33)\ndef handle_motor_step(telemetry: CozmoTelemetry):\n    if telemetry.cliff_detected or telemetry.is_falling:\n        emergency_stop_motors()\n        spawn_evasive_thread(reverse_sec=1.2, turn_deg=180)\n        return SafetyStatus.TRIPPED\n    if telemetry.imu_pitch > 0.35 or detect_visual_stasis(telemetry.camera_frame):\n        emergency_stop_motors()\n        spawn_obstacle_backoff(reverse_sec=1.0)\n        return SafetyStatus.OBSTACLE_AVOIDANCE\n    return SafetyStatus.NOMINAL`,
        highlights: ["~45ms direct reflex path (30x faster than LLM)", "33Hz real-time multi-modal hardware safety guards", "OpenCV visual stasis & optical tilt detection"]
      },
      {
        number: "02",
        title: "Dynamic Tool RAG & LangGraph",
        subtitle: "FAISS Vector Selection & Local Ollama Reasoning",
        content: "Instead of bloating LLM prompts with 19+ static tool schemas—which degrades classification accuracy to 89.5% on local 3B models—MoKa leverages an in-memory FAISS vector index with BAAI/bge-small-en-v1.5 embeddings to dynamically inject only the top 2 candidate tool schemas into the qwen2.5:3b supervisor. The graph routes via a unified tool executor node scaling to 100+ tools, interfacing Tavily MCP stdio client subprocesses, n8n Google Calendar integrations, and an isolated ornith:9b Python sandbox for deterministic code execution.",
        codeSnippet: `# Layer 2 LangGraph Dynamic Tool RAG Selection\ndef tool_retrieval_node(state: AgentState):\n    query_vector = embed_model.embed_query(state["user_query"])\n    top_tools = faiss_index.similarity_search_by_vector(query_vector, k=2)\n    \n    # Inject only relevant schemas into local Ollama supervisor prompt\n    prompt = build_dynamic_prompt(candidate_tools=top_tools)\n    decision = router_llm.invoke(prompt) # qwen2.5:3b\n    return {"next_route": decision.route_key}`,
        highlights: ["93.0% routing accuracy (+3.5% over monolithic baseline)", "83% prompt token reduction via dynamic FAISS RAG", "Isolated ornith:9b deterministic Python sandbox"]
      },
      {
        number: "03",
        title: "Dual-Tier Memory & Voice Engine",
        subtitle: "PostgresSaver Checkpoints & Local Kokoro-ONNX TTS",
        content: "MoKa maintains stateful continuity without cloud lock-in through a dual memory substrate. Short-term dialogue is preserved with LangGraph PostgresSaver and rolling context summarization (pruning historical turns beyond 4 messages). Long-term biographical facts are stored in native PostgreSQL float arrays (REAL[]), evaluated with NumPy cosine similarity at a 0.82 deduplication threshold, and updated with O(1) dynamic entity resolution. Voice responses stream locally via Kokoro-ONNX for near-studio audio with zero disk I/O.",
        codeSnippet: `# Long-Term Semantic Fact Deduplication & Retrieval\ndef update_biographical_memory(new_fact: str, category: str):\n    if category in O1_ENTITY_CATEGORIES:\n        return postgres_db.upsert_entity(category, new_fact)\n    \n    fact_emb = fastembed.embed(new_fact)\n    similarities = [np.dot(fact_emb, row.emb) / (norm(fact_emb)*norm(row.emb)) \n                    for row in postgres_db.get_facts()]\n    \n    if max(similarities, default=0) >= 0.82:\n        return postgres_db.update_fact(idx=argmax(similarities), text=new_fact)\n    return postgres_db.insert_fact(fact=new_fact, embedding=fact_emb)`,
        highlights: ["Native PostgreSQL REAL[] array storage without pgvector binaries", "0.82 cosine similarity deduplication & O(1) entity resolution", "Zero-disk I/O Kokoro-ONNX local voice synthesis"]
      }
    ]
  },
  {
    id: "claude-code",
    title: "Claude Code",
    subtitle: "Contextual Reasoning & Clinical AI",
    roman: "II",
    discipline: "Contextual reasoning",
    note: "Long context, held with deliberation and care.",
    deck: "An annotated volume on context-first practice: read the project, reason across files, preserve the surrounding work, and make every intervention explainable.",
    binding: "Burnt-orange cloth · antique-gold foil",
    format: "156 × 228 mm · FH Campus Wien Edition",
    theme: "Claude Code · context before intervention",
    motif: "Interlaced paths",
    motifKey: "paths",
    paletteLabel: "Burnt orange · cream · burgundy",
    color: "#c24d24",
    foil: "#efc16d",
    accent: "#ff7a45",
    palette: {
      paper: "#762f1b",
      paperDeep: "#572113",
      paperPale: "#ffe4c5",
      ink: "#fff0df",
      inkSoft: "#e3bfa8",
      wall: "#762f1b",
      shelf: "#402015",
      shelfDark: "#1d0d08",
      light: "#ffd19a",
      fill: "#dc8c6b"
    },
    projectDetails: {
      name: "HugoMed Medical Diagnostic & Clinical RAG",
      category: "Healthcare & AI Knowledge Systems",
      timeframe: "2026",
      institution: "FH Campus Wien · Master Project",
      role: "Full-Stack AI Developer",
      summary: "A clinical decision support platform utilizing high-density RAG (Retrieval Augmented Generation) over ICD-10 medical ontologies, clinical trial registries, and patient telemetry.",
      problem: "Physicians face cognitive overload when synthesizing multi-source patient records with continuously updated clinical guidelines.",
      solution: "Developed an explainable clinical assistant with citation grounding, HIPAA/GDPR-compliant local processing, and dynamic diagnostic decision trees.",
      keyMetrics: [
        { label: "Diagnostic Recall", value: "99.2%" },
        { label: "Citation Accuracy", value: "100%" },
        { label: "Query Latency", value: "180ms" }
      ],
      techStack: ["React", "Python", "LangChain", "Qdrant Vector DB", "PostgreSQL", "Tailwind CSS", "FastAPI"],
      githubUrl: "https://github.com",
      liveUrl: "https://hugomed.demo.at",
      architectureDescription: "Hybrid dense-sparse retrieval pipeline with cross-encoder re-ranking and clinical ontology graph validation."
    },
    chapters: [
      {
        number: "01",
        title: "Clinical Grounding",
        subtitle: "Eliminating Hallucinations in High-Stakes Domains",
        content: "In clinical engineering, hallucination is intolerable. Every LLM assertion must point to an indexed medical source, validated against PubMed and Europe PMC open access ontologies.",
        codeSnippet: `// Citation-Enforced Clinical Synthesis\nexport async function synthesizeDiagnosis(caseData: PatientCase) {\n  const evidence = await clinicalRetriever.search(caseData.symptoms);\n  return await strictCitationChain.invoke({\n    patient: caseData,\n    evidenceSources: evidence.filter(e => e.score > 0.88)\n  });\n}`,
        highlights: ["100% verifiable source linking", "Cross-checked contraindications", "Strict structured JSON schemas"]
      },
      {
        number: "02",
        title: "Deliberation & Care",
        subtitle: "Multi-Step Medical Reasoning",
        content: "Complex differential diagnosis demands reasoning across chronologically ordered patient notes, lab panels, and imaging reports to uncover latent comorbidities.",
        highlights: ["Temporal patient graph", "Biomarker threshold tracking", "Differential diagnostic tree"]
      },
      {
        number: "03",
        title: "Explainable Interventions",
        subtitle: "Empowering Physicians",
        content: "Rather than providing black-box recommendations, the system highlights clinical guidelines, confidence scores, and potential alternative hypotheses directly in the UI.",
        highlights: ["Interactive decision support", "GDPR-compliant anonymization", "Real-time doctor feedback loops"]
      }
    ]
  },
  {
    id: "cursor",
    title: "Cursor",
    subtitle: "High-Speed Realtime Dispatch System",
    roman: "III",
    discipline: "Directed editing",
    note: "A fast line between the thought and the file.",
    deck: "A compact handbook for high-momentum editing: navigate living systems quickly, keep the active context close, and change the right surface without disturbing the rest.",
    binding: "Citron cloth · black gloss foil",
    format: "140 × 210 mm · FH Campus Wien Edition",
    theme: "Cursor · navigation with momentum",
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
    },
    projectDetails: {
      name: "ResQ Emergency Response & Dispatch Suite",
      category: "Real-Time Distributed Systems",
      timeframe: "2025 - 2026",
      institution: "FH Campus Wien · Mobile & Distributed Systems",
      role: "Backend & Real-Time Protocol Architect",
      summary: "A sub-second emergency response coordination platform integrating real-time GPS telemetry, automated triage queues, and instant volunteer notification networks.",
      problem: "Fragmented emergency response channels lead to critical delays in first-responder arrival times during acute medical emergencies.",
      solution: "Architected a WebRTC + WebSocket real-time mesh with geospatial indexing (Uber H3), automated route optimization, and fail-safe offline sync.",
      keyMetrics: [
        { label: "Dispatch Latency", value: "< 240ms" },
        { label: "Concurrent Responders", value: "10,000+" },
        { label: "Offline Resilience", value: "100%" }
      ],
      techStack: ["Node.js", "WebSockets", "H3 Geospatial", "Redis Streams", "React Native", "Mapbox GL", "PostGIS"],
      githubUrl: "https://github.com",
      liveUrl: "https://resq.demo.at",
      architectureDescription: "Distributed microservices with Redis Pub/Sub geospatial clustering and optimistic offline-first local database replication."
    },
    chapters: [
      {
        number: "01",
        title: "Sub-Second Dispatch",
        subtitle: "Geospatial Indexing with Uber H3",
        content: "When seconds dictate survival, traditional relational radius queries are too slow. We discretize city maps into hexagonal H3 cells, allowing O(1) proximity queries and instant responder dispatching.",
        codeSnippet: `// O(1) Proximity Dispatch Matching\nexport function findNearestResponders(lat: number, lng: number, radiusK: number) {\n  const centerH3 = latLngToCell(lat, lng, 9);\n  const kRingCells = gridDisk(centerH3, radiusK);\n  return responderIndex.queryCells(kRingCells);\n}`,
        highlights: ["Sub-50ms geospatial lookup", "Dynamic grid density scaling", "Battery-optimized GPS pinging"]
      },
      {
        number: "02",
        title: "Resilient Offline Sync",
        subtitle: "CRDTs in First-Responder Kits",
        content: "Cellular blackouts cannot halt emergency response. We utilize Conflict-Free Replicated Data Types (CRDTs) to allow seamless peer-to-peer ad-hoc sync over Bluetooth Low Energy.",
        highlights: ["Zero-conflict offline merging", "Peer-to-peer BLE mesh", "Cryptographic signature validation"]
      },
      {
        number: "03",
        title: "Operator Telemetry Console",
        subtitle: "Real-Time Mission Control",
        content: "A glassmorphic, high-contrast mission dashboard delivering live vehicle speeds, heart-rate vitals, and traffic routing with zero UI lag.",
        highlights: ["WebGL map rendering", "Instant unit reallocation", "Automated incident post-mortems"]
      }
    ]
  },
  {
    id: "antigravity",
    title: "Antigravity",
    subtitle: "Spatial 3D Kinematics & Robotics",
    roman: "IV",
    discipline: "Spatial systems",
    note: "Ideas released from the flatness of the page.",
    deck: "A speculative atlas for Antigravity’s spatial way of working: let agents move across tools, make complex structures visible, and understand the system through motion.",
    binding: "Cobalt cloth · cool-silver foil",
    format: "162 × 240 mm · FH Campus Wien Edition",
    theme: "Antigravity · structure in motion",
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
    },
    projectDetails: {
      name: "Sawyer 7-DOF Collaborative Robot Digital Twin",
      category: "Robotics & Spatial Computing",
      timeframe: "2026",
      institution: "FH Campus Wien · Robotics Lab",
      role: "Kinematics & WebGL Visualization Engineer",
      summary: "A real-time 3D digital twin and inverse kinematics solver for the Sawyer 7-Degree-of-Freedom collaborative robotic arm with collision avoidance and trajectory simulation.",
      problem: "Testing physical robotic trajectories risks hardware collisions and costly downtime in factory automation environments.",
      solution: "Built a browser-based WebGL URDF visualizer with WebAssembly-compiled analytical IK solvers, interactive waypoint controllers, and live ROS2 telemetry streaming.",
      keyMetrics: [
        { label: "IK Solve Time", value: "< 0.4ms" },
        { label: "Framerate", value: "60 FPS solid" },
        { label: "Collision Tolerance", value: "±0.5mm" }
      ],
      techStack: ["Three.js", "WebAssembly (C++)", "ROS2 Bridge", "TypeScript", "GLSL Shaders", "URDF Loader"],
      githubUrl: "https://github.com",
      liveUrl: "https://sawyer-robot.demo.at",
      architectureDescription: "WebAssembly-accelerated Jacobian pseudoinverse IK solver piped through WebGL shader pipelines with zero memory allocations per frame."
    },
    chapters: [
      {
        number: "01",
        title: "7-DOF Inverse Kinematics",
        subtitle: "Solving Redundant Arm Geometries in Realtime",
        content: "Sawyer features 7 revolute joints, creating kinematic redundancy. By compiling numerical Damped Least Squares (DLS) Jacobian solvers to WebAssembly, we compute collision-free joint angles in sub-millisecond cycles.",
        codeSnippet: `// WebAssembly-Accelerated Damped Least Squares IK\nexport function solveSawyerIK(targetPose: Matrix4, currentJoints: Float64Array): Float64Array {\n  const J = computeJacobian(currentJoints);\n  const lambda = 0.05; // Damping factor\n  const deltaTheta = J.transpose().multiply(\n    J.multiply(J.transpose()).add(Matrix.identity(6).scale(lambda * lambda)).inverse()\n  ).multiply(computePoseError(targetPose));\n  return currentJoints.add(deltaTheta);\n}`,
        highlights: ["Damped Least Squares IK", "Singularity avoidance", "Zero garbage collection overhead"]
      },
      {
        number: "02",
        title: "Spatial Digital Twin",
        subtitle: "Streaming ROS2 Joint States to Three.js",
        content: "Using lightweight binary WebSocket protocols, the 3D twin mirrors the physical robot with less than 15 milliseconds of end-to-end network lag.",
        highlights: ["Binary ArrayBuffer streaming", "URDF visual mesh parsing", "Physical gripper state sync"]
      },
      {
        number: "03",
        title: "Interactive Trajectory Planning",
        subtitle: "Spatial Waypoint Interpolation",
        content: "Users can drag 3D Gizmo transforms directly in the browser viewport to construct B-spline trajectories, previewing velocity and torque profiles prior to robot execution.",
        highlights: ["Cubic B-spline curves", "Torque limit visualization", "Automated safety envelope checks"]
      }
    ]
  },
  {
    id: "figma",
    title: "Figma",
    subtitle: "Design Systems & Component Architecture",
    roman: "V",
    discipline: "Collaborative form",
    note: "Components, conversations, and systems in common.",
    deck: "A modular reader on designing in Figma: move from loose frames to shared components, invite critique into the canvas, and leave behind a system others can extend.",
    binding: "Vermilion cloth · rose-gold foil",
    format: "150 × 220 mm · FH Campus Wien Edition",
    theme: "Figma · a shared visual language",
    motif: "Connected modules",
    motifKey: "modules",
    paletteLabel: "Vermilion · plum · blush",
    color: "#c83222",
    foil: "#efb0aa",
    accent: "#ff4d4f",
    palette: {
      paper: "#a62c21",
      paperDeep: "#7f1e17",
      paperPale: "#ffe0d5",
      ink: "#fff0e8",
      inkSoft: "#e9bbb2",
      wall: "#a62c21",
      shelf: "#432016",
      shelfDark: "#1f0d08",
      light: "#ffd1bc",
      fill: "#d66d66"
    },
    projectDetails: {
      name: "Aegis Enterprise Design System & UI Kit",
      category: "Design Engineering & Tokens",
      timeframe: "2025",
      institution: "FH Campus Wien · UI/UX & Web Engineering",
      role: "Design Systems Lead",
      summary: "A unified cross-platform design token architecture supporting web, mobile (Flutter/React Native), and embedded displays with strict WCAG AAA accessibility compliance.",
      problem: "Inconsistent component APIs and fragmented styling between Figma prototypes and production codebases cause severe design debt.",
      solution: "Built an automated token synchronization pipeline from Figma Variables to CSS Custom Properties and TypeScript type definitions.",
      keyMetrics: [
        { label: "Components Built", value: "65+" },
        { label: "Token Sync Speed", value: "Instant" },
        { label: "WCAG Rating", value: "AAA 100%" }
      ],
      techStack: ["Figma Plugin API", "Style Dictionary", "Vanilla CSS", "React", "Storybook", "TypeScript"],
      githubUrl: "https://github.com",
      liveUrl: "https://aegis-design.demo.at",
      architectureDescription: "Multi-tier design token hierarchy (Global, Semantic, Component) exported via Style Dictionary into CSS variables and TypeScript constants."
    },
    chapters: [
      {
        number: "01",
        title: "Token Architecture",
        subtitle: "From Primitive Values to Semantic Intent",
        content: "Tokens are the contract between design and engineering. By structuring tokens into Global, Semantic, and Component tiers, redesigning brand palettes takes seconds without changing component logic.",
        codeSnippet: `:root {\n  /* Semantic Color Tokens */\n  --color-surface-elevated: hsl(220 15% 12% / 0.85);\n  --color-border-subtle: hsl(220 15% 90% / 0.12);\n  --color-accent-glow: hsl(210 100% 65% / 0.35);\n  --backdrop-blur-hud: blur(24px);\n}`,
        highlights: ["Automated Figma-to-Code sync", "Sub-pixel layout alignment", "Fluid typography clamp scales"]
      },
      {
        number: "02",
        title: "Accessibility by Default",
        subtitle: "WCAG AAA Color Contrast & Focus Rings",
        content: "Every interactive surface features high-visibility focus indicators, ARIA live region announcements, and full keyboard navigation support.",
        highlights: ["Contrast ratio > 7:1", "Screen-reader optimized DOM", "Reduced-motion media query hooks"]
      },
      {
        number: "03",
        title: "Micro-Interactions & Haptics",
        subtitle: "The Psychology of Delight",
        content: "Spring-physics animations and subtle audio micro-ticks make digital interfaces feel physical and responsive to the user's touch.",
        highlights: ["Physics-based spring curves", "Haptic touch vibration feedback", "Glassmorphic light refraction"]
      }
    ]
  },
  {
    id: "framer",
    title: "Framer",
    subtitle: "Interactive Web Composition & Animation",
    roman: "VI",
    discipline: "Interactive composition",
    note: "Structure becomes rhythm when the page begins to move.",
    deck: "A studio notebook for Framer: compose responsive pages directly in the medium, then tune type, layout, and interaction until motion feels native to the structure.",
    binding: "Coral cloth · copper foil",
    format: "146 × 224 mm · FH Campus Wien Edition",
    theme: "Framer · composition through motion",
    motif: "Folded frames",
    motifKey: "frames",
    paletteLabel: "Coral · pink · oxblood",
    color: "#da3b2f",
    foil: "#ff8eab",
    accent: "#ff5252",
    palette: {
      paper: "#ae2830",
      paperDeep: "#7f1822",
      paperPale: "#ffe0df",
      ink: "#fff0e9",
      inkSoft: "#efb9b4",
      wall: "#ae2830",
      shelf: "#402016",
      shelfDark: "#1d0d08",
      light: "#ffc3bb",
      fill: "#e46d78"
    },
    projectDetails: {
      name: "BookNest Interactive Literary Discovery Platform",
      category: "Creative Web & Interactive Experience",
      timeframe: "2026",
      institution: "FH Campus Wien · Web Engineering",
      role: "Creative Developer & Frontend Lead",
      summary: "A rich 3D and motion-driven web application for discovering rare literature, showcasing dynamic page transitions, audio landscapes, and spatial reading rooms.",
      problem: "E-commerce book cataloguing is sterile and lacks the tactile joy of browsing physical books in a classic library.",
      solution: "Created an immersive digital bookstore with Three.js foil shaders, kinetic typography, and fluid layout morphing.",
      keyMetrics: [
        { label: "User Engagement", value: "4.8x avg" },
        { label: "Lighthouse Performance", value: "98/100" },
        { label: "Bundle Size", value: "< 95kB initial" }
      ],
      techStack: ["Next.js", "Three.js", "Framer Motion", "Vanilla CSS", "Tailwind CSS", "Web Audio API"],
      githubUrl: "https://github.com",
      liveUrl: "https://booknest.demo.at",
      architectureDescription: "Progressive Web App with zero-layout-shift image decoding, GPU-accelerated backdrop blur shaders, and custom scroll choreographies."
    },
    chapters: [
      {
        number: "01",
        title: "Kinetic Layouts",
        subtitle: "Orchestrating Motion with CSS & WebGL",
        content: "Motion is not decorative; it provides spatial orientation. When an element transforms from a shelf thumbnail to an open reading spread, shared layout animations maintain cognitive continuity.",
        codeSnippet: `// Smooth Viewport Transition Animation\nexport const bookTransition = {\n  type: "spring",\n  stiffness: 280,\n  damping: 32,\n  mass: 0.8\n};`,
        highlights: ["Shared element layout morphing", "GPU compositor layer isolation", "60fps zero-jank frame timing"]
      },
      {
        number: "02",
        title: "Tactile Digital Physicality",
        subtitle: "Simulating Weight and Friction",
        content: "By coupling inertial drag gestures with procedural paper rustle audio synthesis, user interactions feel grounded in real-world physics.",
        highlights: ["Inertial deceleration models", "Custom Bezier easing curves", "Dynamic cursor magnetics"]
      },
      {
        number: "03",
        title: "Responsive Choreography",
        subtitle: "Seamless Transitions Across Screen Sizes",
        content: "Using modern CSS Container Queries and dynamic camera perspective scaling, the bookshelf effortlessly adapts from ultrawide 4K monitors to handheld smartphones.",
        highlights: ["Container query inline sizing", "Viewport aspect ratio compensation", "Touch-optimized pinch-to-zoom"]
      }
    ]
  },
  {
    id: "xcode",
    title: "JoinApp",
    subtitle: "Scalable Community Event Hub & Distributed Coordination Engine",
    roman: "VII",
    discipline: "Full-Stack Web Systems",
    note: "A measured path from blueprint to living platform.",
    deck: "A modern full-stack web platform engineering hyperlocal event discovery, atomic participation lifecycles, and automated transactional dispatch across Vienna's metropolitan districts.",
    binding: "Royal purple cloth · neon lime foil",
    format: "158 × 232 mm · FH Campus Wien Edition",
    theme: "JoinApp · blueprint into living form",
    motif: "Drafting compass",
    motifKey: "compass",
    paletteLabel: "Royal purple · electric lime · slate",
    color: "#7c3aed",
    foil: "#a3e635",
    accent: "#a3e635",
    palette: {
      paper: "#1e1338",
      paperDeep: "#110924",
      paperPale: "#f3f4f6",
      ink: "#ffffff",
      inkSoft: "#a78bfa",
      wall: "#1e1338",
      shelf: "#382017",
      shelfDark: "#1b0e09",
      light: "#f3f4f6",
      fill: "#8b5cf6"
    },
    projectDetails: {
      name: "JoinApp Community Event Platform",
      category: "Full-Stack Web Systems & Distributed Application Architecture",
      timeframe: "2025 - 2026",
      institution: "FH Campus Wien · Software Engineering",
      role: "Lead Full-Stack Architect & Backend Engineer",
      summary: "A full-stack community event platform featuring 3-tier architecture (Express 5.x + PostgreSQL), stateless JWT/RBAC security, interactive Leaflet GIS discovery, automated 1-hour ticket dispatch via Node-Cron & Nodemailer, and real-time polling chat.",
      problem: "Modern event discovery platforms suffer from heavyweight dependencies, intrusive monetization models, and fragmented community communication with poor reliability in local coordination.",
      solution: "Architected a lightweight, decoupled 3-tier system (Controller-Service-Repository) on Express 5.x and PostgreSQL with atomic junction constraints, asynchronous background geocoding (Photon API), RFC 5545 iCalendar generation, and automated cron ticket pipelines.",
      keyMetrics: [
        { label: "Architecture", value: "3-Tier Layered" },
        { label: "API Latency", value: "< 85ms p95" },
        { label: "Relational Tables", value: "7 Entities" },
        { label: "Supported Locales", value: "DE-AT & EN-US" }
      ],
      techStack: ["Node.js", "Express 5.x", "PostgreSQL (pg.Pool)", "Leaflet.js", "JavaScript (ES6+)", "JWT & Bcrypt", "Node-Cron", "Nodemailer", "Photon Geocoding API", "HTML5/CSS3"],
      githubUrl: "https://github.com/kaschefi/joinApp",
      liveUrl: "https://github.com/kaschefi/joinApp",
      architectureDescription: "Decoupled 3-tier service-oriented architecture with stateless JWT authentication, atomic PostgreSQL unique constraints, non-blocking asynchronous GIS geocoding, and cron-driven transactional outbox email dispatch."
    },
    chapters: [
      {
        number: "01",
        title: "Clean Architecture & RBAC",
        subtitle: "Decoupled Express 5 Services & JWT",
        content: "Enforces single-responsibility boundaries across controllers, services, and parameterized PostgreSQL repositories. Reusable middleware interceptors enforce stateless JWT authentication and granular role-based authorization (USER vs ADMIN) across all protected routes.",
        highlights: ["Decoupled 3-tier architecture", "Stateless 7-day JWT token rotation", "Granular requireRole & requireSelfOrAdmin guards"]
      },
      {
        number: "02",
        title: "GIS Mapping & Live Chat",
        subtitle: "Interactive Leaflet Pins & Capacity Gating",
        content: "Synchronizes Vienna-wide event clusters on Leaflet.js with interactive search cards using bidirectional viewport panning. The event lifecycle prevents double-joining via PostgreSQL unique constraints (error 23505) and gates participant lists until 1 hour before kickoff.",
        highlights: ["60 FPS Leaflet.js map marker binding", "Atomic participant capacity validation", "Polling chat engine with auto-scroll threshold"]
      },
      {
        number: "03",
        title: "PostgreSQL & Cron Outbox",
        subtitle: "7-Entity Schema & Ticket Daemon",
        content: "A normalized 7-table schema with foreign-key cascades, array types (tags TEXT[]), and subquery aggregations. An automated background daemon polls upcoming events (NOW() + INTERVAL '1 hour') and dispatches personalized HTML tickets via Nodemailer.",
        highlights: ["7 normalized relational entities with ON DELETE CASCADE", "At-most-once ticket delivery via cron & PostgreSQL interval arithmetic", "Parallel attendee cancellation emails with Promise.allSettled"]
      },
      {
        number: "04",
        title: "Geocoding & Calendar Sync",
        subtitle: "Photon Spatial API & RFC 5545 iCal",
        content: "Offloads address coordinate resolution to Komoot's Photon API asynchronously without stalling HTTP responses. Implements a zero-dependency RFC 5545 iCalendar (.ics) generator on the client side with batch export and Google Calendar web intents.",
        highlights: ["Non-blocking asynchronous background geocoding", "Standards-compliant RFC 5545 iCalendar generator", "Bilingual client-side i18n runtime (DE-AT / EN-US)"]
      }
    ]
  }
];

export const STUDENT_PROFILE = {
  name: "M. Kashefirad",
  title: "Creative Technologist & Software Systems Engineer",
  institution: "FH Campus Wien",
  degree: "BSc / MSc Software Engineering & Autonomous Systems",
  location: "Vienna, Austria",
  bio: "Passionate engineer specializing in 3D WebGL graphics, autonomous agent architectures, robotics kinematics, distributed systems, and native mobile computing. Crafting high-performance digital experiences that merge technical rigor with visual excellence.",
  email: "m.kashefirad@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  skills: {
    languages: ["TypeScript / JavaScript", "Python", "Rust", "C / C++", "Swift", "GLSL / WGSL", "SQL", "Dart / Flutter"],
    threeD_creative: ["Three.js (r165)", "WebGL & WebGPU", "GLSL Shaders", "Blender 3D", "Figma Design Systems", "Framer Motion", "Canvas API"],
    ai_autonomous: ["Autonomous Agents (LangGraph / Codex)", "RAG & Vector Embeddings", "Contextual Reasoning", "OpenAI / Claude APIs", "PyTorch", "AST Code Analysis"],
    systems_robotics: ["Sawyer 7-DOF Kinematics", "ROS2 & WebSockets", "Docker & Kubernetes", "FastAPI & Node.js", "Redis & PostgreSQL", "FreeRTOS & Embedded IoT"]
  }
};
