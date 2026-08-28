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
    id: "figma",
    title: "Sawyer Robot",
    subtitle: "Implementation of Waving Task, Shell Game, and Tracking Methods",
    roman: "II",
    discipline: "Robotics & Vision",
    note: "Dynamic perception, multi-object tracking, and MoveIt motion planning.",
    deck: "A comprehensive robotics engineering treatise on the 7-DoF Rethink Robotics Sawyer cobot: real-time teleoperation waving routines, high-speed vision tracking for the classic Shell Game, Kalman filter momentum estimation, occlusion tethering, and collision-free MoveIt trajectory generation.",
    binding: "Obsidian cloth · crimson foil",
    format: "150 × 220 mm · FH Campus Wien Edition",
    theme: "Sawyer Robot · visual servoing & cobots",
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
    },
    projectDetails: {
      name: "Sawyer Robot: Waving Task & Shell Game",
      category: "Autonomous Robotics & Visual Servoing",
      timeframe: "June 2026",
      institution: "Hochschule Campus Wien · Computer Science and Digital Communications",
      role: "Robotics Systems & Computer Vision Engineer",
      summary: "Implementation of interactive collaborative robotic behaviors on the 7-DoF Rethink Robotics Sawyer cobot: a full-stack WebSocket teleoperation waving task and an autonomous vision-driven Shell Game featuring Kalman Filter momentum tracking, occlusion tethering, Gazebo digital twin simulation, and collision-free MoveIt trajectory execution.",
      problem: "Traditional robotic manipulators operate blindly on pre-programmed joint trajectories, making them incapable of dynamic environmental awareness, real-time object tracking through occlusions, or safe collision-free trajectory planning in human-interactive workspaces.",
      solution: "Developed a modular ROS 1 Noetic visual servoing architecture combining low-latency HSV color segmentation, a custom Kalman Filter multi-object tracker with cosine momentum penalties and occlusion tethering (<10% ID switch rate), an S-curve Gazebo simulation twin, and MoveIt RRT-Connect motion planning with live Intera SDK quaternion orientation stabilization.",
      keyMetrics: [
        { label: "Tracking Success", value: "90% (9/10 Trials)" },
        { label: "ID Switch Rate", value: "< 10% (vs 50% Base)" },
        { label: "Planning Time", value: "~1.0s (RRT-Connect)" },
        { label: "Manipulator DoF", value: "7 Degrees of Freedom" }
      ],
      techStack: ["ROS 1 Noetic", "MoveIt 1", "Gazebo 11", "Python 3", "OpenCV", "YOLOv8", "Intera SDK", "OMPL (RRT-Connect)", "scipy / numpy", "Node.js (rosbridge)", "WSL 2 / Ubuntu 20.04"],
      githubUrl: "https://github.com/kaschefi/sawyerRobot-ShellGame",
      liveUrl: "https://github.com/kaschefi/sawyerRobot-ShellGame",
      architectureDescription: "Modular distributed ROS node ecosystem bridging camera streaming, OpenCV/YOLOv8 perception, Kalman momentum tracking with Hungarian data association, and MoveIt RRT-Connect motion planning with live Intera SDK quaternion pose stabilization."
    },
    chapters: [
      {
        number: "01",
        title: "System Architecture & Waving Task",
        subtitle: "Distributed ROS Nodes & WebSocket Teleoperation",
        content: "Bridges a Node.js web interface with the 7-DoF Sawyer cobot via rosbridge_suite WebSockets. A hierarchical Design Tree enforces safe baseline postures, looping containers (5 continuous wave cycles), and linear Cartesian waypoints executed smoothly via standard trajectory controllers.",
        codeSnippet: `# Waving Task Logic Node & Trajectory Execution\nclass SawyerWavingNode:\n    def on_wave_triggered(self, msg):\n        self.limb.move_to_neutral()\n        for cycle in range(5):\n            self.execute_waypoint_sweep("left", duration=0.8)\n            self.execute_waypoint_sweep("right", duration=0.8)\n        self.limb.move_to_neutral()`,
        highlights: ["7-DoF Sawyer cobot with series elastic actuators", "Asynchronous rosbridge_suite WebSocket teleoperation", "Hierarchical Design Tree motion architecture"]
      },
      {
        number: "02",
        title: "Object Detection & Vision Benchmark",
        subtitle: "YOLOv8 Deep Learning vs. Classical HSV Filtering",
        content: "Evaluated OpenCV HSV color filtering against a custom YOLOv8 model trained on Roboflow's Red Solo Cups dataset. While YOLOv8 achieved 96% static accuracy, inference latency reduced dynamic tracking to 6/10 trials. Classical HSV filtering provided near-zero latency, achieving 100% detection and 9/10 successful tracking runs.",
        highlights: ["Empirical benchmark: YOLOv8 (96% static) vs. HSV (100% controlled)", "Sub-millisecond HSV contour centroid extraction", "Inference latency analysis in closed-loop visual servoing"]
      },
      {
        number: "03",
        title: "Kalman MOT & Occlusion Tethering",
        subtitle: "Momentum State Vectors & Hungarian Assignment",
        content: "Integrates independent 4D linear Kalman Filters ([x, y, dx, dy]) with Hungarian bipartite matching. An augmented cost matrix introduces a cosine similarity velocity penalty to enforce momentum continuity, while dynamic tethering (80px overlap threshold) prevents identity swaps during close-quarters cup crossings, reducing ID switches from 50% to <10%.",
        codeSnippet: `# Augmented Hungarian Cost Matrix with Momentum Penalty\nfor trk in trackers:\n    for det in detections:\n        cos_sim = np.dot(trk.vel, det - trk.pos) / (trk.vel_norm * disp_norm)\n        cost[i, j] = dist + lambda_vel * (1.0 - cos_sim)`,
        highlights: ["4D state vector Kalman filter ([x, y, dx, dy]) with 0.85 velocity decay", "Augmented Hungarian assignment with cosine velocity penalty", "Dynamic occlusion tethering reducing ID switches from 50% to <10%"]
      },
      {
        number: "04",
        title: "MoveIt Kinematics & Gazebo Twin",
        subtitle: "S-Curve Shuffling & RRT-Connect Trajectory Planning",
        content: "Constructed a ROS Noetic / Gazebo 11 digital twin with S-curve velocity profiles and 0.16m radial arc separation. Maps 500x500 pixel camera coordinates to Sawyer's 0.5x0.5m Cartesian frame. MoveIt's RRT-Connect planner computes collision-free trajectories in ~1.0s, with live Intera SDK quaternion injection stabilizing downward gripper orientation.",
        codeSnippet: `# MoveIt Cartesian Goal with Intera Quaternion Injection\npose_goal = PoseStamped()\npose_goal.pose.position.x, pose_goal.pose.position.y = pixel_to_world(u, v)\npose_goal.pose.position.z = table_z + 0.04 # 4cm hover\npose_goal.pose.orientation = limb.endpoint_pose()['orientation']\ngroup.set_pose_target(pose_goal)\ngroup.execute(group.plan())`,
        highlights: ["Gazebo digital twin with collision-free S-curve shuffling", "2D pixel to 3D Cartesian base frame transformation matrix", "MoveIt RRT-Connect planning (~1.0s solve time) with quaternion pose stabilization"]
      },
      {
        number: "05",
        title: "Deployment Pipeline & Reachability",
        subtitle: "WSL 2 Multi-Node Orchestration & Future Outlook",
        content: "Documents the 5-terminal deployment runbook for Ubuntu 20.04 WSL 2 environments with explicit IP networking. Proposes a dynamic MoveIt Reachability Filter that pre-validates target coordinates against Sawyer's kinematic reach envelope before motion dispatch, preventing Inverse Kinematics solver failures.",
        highlights: ["5-terminal synchronized ROS launch sequence on WSL 2", "Python 3 compatibility layer resolving exit code 127 crashes", "Dynamic reachability envelope filter preventing IK solver failures"]
      }
    ]
  },
  {
    id: "cursor",
    title: "Semantic-ETL-Pipeline",
    subtitle: "Multi-Modal Ingestion & Grounded RAG Microservice",
    roman: "III",
    discipline: "Distributed Data Systems",
    note: "High-density multi-modal document extraction, VLM transcription, and hybrid vector retrieval.",
    deck: "An enterprise-grade, containerized multi-modal ETL and grounded RAG microservice: layout-aware document extraction via Docling v2, Groq LPU Vision Language Modeling, 70/30 hybrid dense-lexical vector retrieval, and Cross-Encoder reranking.",
    binding: "Citron cloth · black gloss foil",
    format: "140 × 210 mm · FH Campus Wien Edition",
    theme: "Semantic ETL · multi-modal document intelligence",
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
      name: "Semantic-ETL-Pipeline: Multi-Modal Ingestion & Grounded RAG",
      category: "Distributed Systems & Vector Computing",
      timeframe: "2026",
      institution: "FH Campus Wien · Enterprise AI Systems",
      role: "Lead Data & AI Systems Architect",
      summary: "An enterprise-grade, containerized multi-modal ETL and grounded RAG microservice. Replaces fragile character slicing with Docling v2 layout parsing, Groq Vision Language Models for schematic transcription, 1024-d dense vector embeddings, calibrated 70/30 hybrid retrieval, and Groq GPT-OSS-120B Cross-Encoder reranking.",
      problem: "Traditional PDF extraction flattens relational tables into noise, discards diagram image bytes, and fractures sentences with naive character chunking, causing massive downstream hallucination.",
      solution: "Engineered an asynchronous 6-stage ETL lifecycle with structural breakpoint chunking, Groq LPU VLM processing, deterministic MD5 deduplication, and 70/30 hybrid vector fusion delivering +50% Recall@5 lift.",
      keyMetrics: [
        { label: "Recall@5 Lift", value: "+50.0% (0.20 → 0.30)" },
        { label: "Table Fractures", value: "0 (100% Intact)" },
        { label: "Concurrency Scaling", value: "14.75x (c=10)" },
        { label: "Vector Index", value: "1024-d Dense (Pinecone)" }
      ],
      techStack: ["Python 3.13", "FastAPI", "Docling v2", "RapidOCR", "Groq LPU (Qwen-27B / GPT-OSS-120B)", "Pinecone Serverless", "Llama-Text-Embed-v2", "Pydantic", "Redis"],
      githubUrl: "https://github.com/kaschefi",
      liveUrl: "https://github.com/kaschefi",
      architectureDescription: "6-stage asynchronous microservice pipeline: layout-aware Docling extraction, parallel Groq VLM diagram transcription, structural breakpoint chunking, Pydantic metadata synthesis, 1024-d dense vectorization, and 70/30 hybrid Pinecone search with Cross-Encoder reranking."
    },
    chapters: [
      {
        number: "01",
        title: "Multi-Modal Ingestion Architecture",
        subtitle: "Layout-Aware Parsing & Sub-Second Async Ingestion",
        content: "Traditional PDF parsing collapses relational tables into unparseable single-column noise and ignores visual schematics. Semantic-ETL-Pipeline introduces a 6-stage lifecycle: Docling v2 layout parsing with RapidOCR (1.5x scale), parallel Groq Qwen-27B Vision transcription, structural breakpoint chunking (<1500 chars), Pydantic metadata synthesis, and 1024-d Pinecone upserts with non-blocking HTTP 202 job tracking.",
        highlights: ["Docling v2 layout engine preserving markdown grid syntax", "Parallel Groq LPU Vision Language Modeling (Qwen-27B)", "Asynchronous HTTP 202 ingestion with deterministic UUID tracking", "Cryptographic MD5 content hashing for idempotent vector IDs"]
      },
      {
        number: "02",
        title: "Stream Processing & Concurrency",
        subtitle: "Adaptive Backpressure, Redis JobStore & Dead-Letter Queues",
        content: "Heavy document transformations create volatile compute demands. FastAPI async semaphores (CONCURRENCY_LIMIT=5) throttle LPU requests, pull-based token bucket rate limiting prevents worker OOM crashes, and multi-model fallback chains (GPT-OSS-120B -> 20B -> Allam-7B -> Qwen-27B) eliminate 429 rate-limit downtime during API quota exhaustion.",
        highlights: ["Monotonic JobLifecycle state engine tracking real-time 0.0%–100.0% progress", "Adaptive pull-based backpressure preventing worker OOM crashes", "Multi-model fallback chain with exponential backoff", "Dead-Letter Queue (DLQ) isolation preserving stack traces and file provenance"]
      },
      {
        number: "03",
        title: "Semantic Boundary Chunking & VLMs",
        subtitle: "Structural Breakpoints, Vision Transcriptions & Vector IDs",
        content: "Rather than slicing text by arbitrary character counts, the chunker groups text by structural DOM elements (Headers, Sections, Tables). Chunks accumulate up to 1500 characters, triggering instant boundaries on new headers (>300 chars) with element-level overlap (N >= 1) to eliminate sentence truncation and preserve context.",
        highlights: ["Structural breakpoint grouping eliminating table fracturing", "Element-level sliding overlap preserving section hierarchy", "Strict Pydantic JSON schema generating summaries and categories", "Deterministic MD5 vector hashing guaranteeing zero duplicate embeddings"]
      },
      {
        number: "04",
        title: "Hybrid Retrieval & Cross-Encoder Rerank",
        subtitle: "70/30 Dense-Lexical Fusion & Groq LPU Scoring",
        content: "Pure dense retrieval misses exact alphanumeric technical tokens, while lexical search lacks semantic generalization. The engine computes S_hybrid = 0.70 * S_dense + 0.30 * S_keyword, expanding candidates to K_fetch = max(2*top_k, 16) for deep Groq GPT-OSS-120B Cross-Encoder reranking, doubling top-1 precision.",
        highlights: ["Calibrated 70% dense semantic / 30% lexical token score fusion", "Decoupled polyglot storage combining TTL scratchpad caches with Pinecone", "Groq LPU Cross-Encoder reranking evaluating full context snippets", "Digit-decomposition fallback parser preventing malformed JSON ranking drops"]
      },
      {
        number: "05",
        title: "Production Benchmarks & Grounded RAG",
        subtitle: "Empirical Retrieval Lifts & Zero-Hallucination Guardrails",
        content: "Production benchmarks demonstrate a +50.0% Recall@5 lift (0.20 -> 0.30) and +25.62% NDCG@5 lift over naive baselines, with 0 table fractures and 14.75x throughput scaling under concurrency (0.04 to 0.59 RPS). Retrieved contexts feed a grounded RAG agent operating at temperature 0.1 with mandatory page citations.",
        highlights: ["+50.0% Recall@5 lift and +25.62% NDCG@5 lift over naive baselines", "14.75x throughput scaling under concurrency with 100% request success", "0 table fractures across benchmark corpora", "Grounded RAG agent enforcing strict page provenance citations"]
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
    id: "claude-code",
    title: "Cat-breed-recognition",
    subtitle: "Deep Learning Multi-Class Vision & Breed Classification",
    roman: "V",
    discipline: "Vision & Deep Learning",
    note: "Multi-class convolutional classification, fine-grained feature extraction, and real-time inference.",
    deck: "An annotated volume on deep learning vision architectures: fine-grained feline breed recognition, spatial feature attention, and real-time edge classification.",
    binding: "Phthalo-green cloth · gold foil",
    format: "156 × 228 mm · FH Campus Wien Edition",
    theme: "Cat-breed-recognition · vision classification",
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
    id: "xcode",
    title: "JoinApp",
    subtitle: "Scalable Community Event Hub & Distributed Coordination Engine",
    roman: "VI",
    discipline: "Full-Stack Web Systems",
    note: "A measured path from blueprint to living platform.",
    deck: "A modern full-stack web platform engineering hyperlocal event discovery, atomic participation lifecycles, and automated transactional dispatch across Vienna's metropolitan districts.",
    binding: "Violet cloth · neon lime foil",
    format: "158 × 232 mm · FH Campus Wien Edition",
    theme: "JoinApp · blueprint into living form",
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
