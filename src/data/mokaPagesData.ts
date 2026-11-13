// src/data/mokaPagesData.ts
// Comprehensive, production-grade architectural specifications and data models for the MoKa AI Assistant portfolio book.

export interface MokaPageContent {
  pageNumber: string;
  pageLabel: string;
  title: string;
  subtitle: string;
  discipline?: string;
  thesis?: string;
  overview?: string;
  description?: string; // Extended, comprehensive deep dive for the right-hand panel
  codeSnippet?: string; // Production code excerpt with explanatory comments
  metadata?: {
    binding: string;
    format: string;
    theme: string;
    motif: string;
  };
  keyMetrics?: Array<{ label: string; value: string }>;
  highlights?: string[];
  image?: string;
  imageCaption?: string;
}

export const mokaPagesData: MokaPageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS & SYSTEM OVERVIEW
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // SYSTEM OVERVIEW",
    title: "MOKA",
    subtitle: "Two-Tier Autonomous Robotics Assistant & Scalable Tool-Routing Ecosystem",
    discipline: "Autonomous Robotics & Agentic Systems",
    thesis: "Overcoming the Latency-Versatility Dilemma via Decoupled Sub-6ms Reflexes, LAYA Cross-Encoder Decision Routing, and Graph-Orchestrated SLMs",
    overview:
      "A local-first multimodal robotic companion and scientific tool-routing benchmark ecosystem for large tool registries (N = 20–100). Designed for dual deployment on physical Anki Cozmo hardware and 100% hardware-free in simulation, MoKa implements a two-tier cognitive routing pipeline: Layer 1 sub-6ms FastEmbed semantic reflexes for real-time motor kinematics and safety halts, paired with a Layer 2 filtered cognitive decision layer combining FAISS Top-k Tool RAG with the 135M parameter LAYA cross-encoder (95.8% accuracy, 0 generative output tokens) or local Ollama LLMs (qwen2.5:3b). Backed by dual-layer PostgreSQL persistence (PostgresSaver connection pooling + Mem0 pgvector memory reconciliation), Silero VAD / Kokoro-ONNX neural speech, and DINOv3 vision with sub-35ms Bidirectional A* path planning.",
    description:
      "Embodied conversational agents face a fundamental architectural dichotomy: physical hardware demands instantaneous, deterministic reaction times (<10ms) to ensure stability and user responsiveness, whereas open-domain linguistic reasoning and dynamic tool execution traditionally impose massive computational latency (1,500ms - 3,000ms), prompt pre-fill explosion (O(N) token bloat), and softmax attention dilution across large tool catalogs (20 to 100+ tools).\n\n" +
      "MoKa resolves this latency-versatility dilemma through a decoupled two-tier cognitive routing and control hierarchy:\n\n" +
      "1. The Spinal Reflex Plane (Tier 1): Implemented via FastEmbed (BAAI/bge-small-en-v1.5 384-D dense embeddings) executing in 5.5ms median P50 latency. Utterances matching physical actuation, safety stops, or local OS workstation setups are resolved in sub-6ms with 0 allocated LLM tokens and 100% accuracy on physical commands.\n\n" +
      "2. Filtered Cognitive Decision Layer (Tier 2): When Tier 1 yields no match, queries route into LangGraph's tool retrieval node where an in-memory FAISS index prunes candidates to Top-3 (O(k) constant space). The pruned candidates are evaluated by the 135M parameter LAYA cross-encoder (convaiinnovations/laya-typed-decisions), achieving 95.8% Top-1 accuracy with 0 generative output tokens—matching local Ollama qwen2.5:3b while slashing mean latency from 1,455.6ms to 205.3ms.\n\n" +
      "3. Dual-Layer PostgreSQL Persistence & Speech: Short-term dialogue state is committed to LangGraph PostgresSaver via an auto-reconnecting psycopg3 pool resilient to Neon serverless scale-to-zero idle disconnects. Long-term biographical facts are preserved by Mem0 backed by PostgreSQL pgvector (collection moka_user_memories) with intelligent few-shot reconciliation. Neural speech pairs Silero VAD (250ms silence window) with Kokoro-ONNX 24kHz zero-disk streaming audio (<50ms barge-in latency).\n\n" +
      "4. Hardware-Software Decoupling & Cyber-Physical Perception: The cognitive substrate interfaces with physical actuators via a 33Hz low-level PyCozmo packet loop safeguarded by ReflexSafetyGuard (cliff IR, >20° pitch bump, deceleration shock, and visual stasis detection). Spatial navigation utilizes foundational DINOv3 ViT patch embeddings (>=15 FPS) and sub-35ms Bidirectional A* path planning over a 10mm grid with 50mm safety clearance.",
    keyMetrics: [
      { label: "Reflex Latency", value: "5.5ms P50 (sub-6ms)" },
      { label: "Routing Accuracy", value: "95.8% (vs 87.5% baseline)" },
      { label: "Token Savings", value: "0 Output Tokens (100% elimination)" },
      { label: "Motion Planning", value: "<35ms Bidirectional A* (10mm grid)" }
    ],
    highlights: [
      "Sub-6ms FastEmbed reflex arc guarantees instantaneous physical reactions for safety halts, battery docking, and motor kinematics.",
      "Two-layer tool routing with FAISS top-k candidate pruning and 135M LAYA cross-encoder achieves 95.8% accuracy with 0 output tokens.",
      "Dual-layer PostgreSQL persistence combines PostgresSaver connection pooling with Mem0 pgvector long-term biographical memory.",
      "Foundational DINOv3 vision extraction with SVD PCA heatmaps and sub-35ms Bidirectional A* path planning with 50mm safety buffer."
    ],
    codeSnippet:
`# High-Level Decoupled Two-Tier Dispatch Pipeline (main.py / cozmo_mode.py)
import asyncio
from core.routing.layer1.semantic_layer import check_layer_1, execute_reflex
from core.routing.layer2.router import run_cozmo_agent

async def process_user_utterance(user_input: str, thread_id: str = "cozmo_default_session") -> str:
    """
    Decoupled Two-Tier Dispatch: Evaluates Tier 1 sub-6ms FastEmbed reflex arc
    before allocating computational cycles to Tier 2 FAISS + LAYA Cross-Encoder / LangGraph.
    """
    # 1. Tier 1: Sub-6ms FastEmbed semantic similarity reflex check (0 LLM tokens)
    reflex_route = check_layer_1(user_input)
    if reflex_route:
        success, response_text = await execute_reflex(reflex_route)
        if success:
            return response_text

    # 2. Tier 2: FAISS Top-k candidate pruning + LAYA 135M cross-encoder / LangGraph
    # Evaluates Tool RAG, dual-tier PostgreSQL memory, and Kokoro-ONNX streaming speech
    return await asyncio.to_thread(run_cozmo_agent, user_input, thread_id)`
  },

  // =========================================================================================
  // PAGE 02: THE TWO-TIER REFLEX HIERARCHY
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "ROUTING SUBSYSTEM // TWO-TIER HIERARCHY",
    title: "The Two-Tier Reflex Hierarchy",
    subtitle: "Sub-6ms Semantic Reflexes & Hardware Safety Interceptor",
    discipline: "Reflex Kinematics & Sub-6ms Edge Routing",
    thesis: "Overcoming Physical Robotics Latency Dilemma via Sub-6ms FastEmbed Reflexes and Event-Driven Motor Interception",
    image: "/moka/router_benchmark.webp",
    imageCaption: "LangSmith 57-Case Benchmark: Monolithic LLM Baseline (A) vs. MoKa Two-Layer Router (B) achieving 93.0% routing accuracy, 83% token reduction, and ~45ms P50 latency.",
    overview:
      "Physical robotic assistants cannot afford the 1,500ms+ latency of standard LLM reasoning loops for motor safety. MoKa implements a Layer 1 FastEmbed semantic router (BAAI/bge-small-en-v1.5) executing in 5.5ms (median P50), intercepting physical kinematics, emergency halts, and system utilities with 0 LLM tokens and 100% accuracy on physical commands.",
    description:
      "Physical robotic assistants cannot afford the 1,500ms+ latency of standard LLM reasoning loops for motor safety. MoKa implements a Layer 1 FastEmbed semantic router (BAAI/bge-small-en-v1.5) executing in 5.5ms (median P50), intercepting physical kinematics, emergency halts, and system utilities with 0 LLM tokens and 100% accuracy on physical commands.\n\n" +
      "Completely decoupled from host AI lag, the ReflexSafetyGuard intercepts PyCozmo motor methods, monitoring 4 infrared cliff sensors, desk pick-up, upward pitch bumps (>20° / 0.35 rad), deceleration shocks (<-2200 mm/s²), and camera visual motion stasis to halt motors in <10ms and trigger autonomous evasive maneuvers before table falls or motor stalls occur.",
    keyMetrics: [
      { label: "Reflex P50 Latency", value: "5.5 ms (sub-6ms)" },
      { label: "Physical Command Acc", value: "100%" },
      { label: "Safety Cut Latency", value: "<10 ms" },
      { label: "Token Allocation", value: "0 Tokens" }
    ],
    highlights: [
      "5.5ms median reflex path (over 200x faster than LLM)",
      "100% accuracy on physical robot movement commands",
      "<10ms hardware cliff cut & event-driven motor interception",
      "Sliding-window accelerometer shock & OpenCV visual stasis detection"
    ],
    codeSnippet:
`# Layer 1 Sub-6ms Reflex Interceptor & PyCozmo Safety Guard
class ReflexSafetyGuard:
    def __init__(self, cli: pycozmo.Client):
        self.cli = cli
        self.safety_tripped = threading.Event()
        self.PITCH_BUMP_THRESHOLD = 0.35  # ~20° tilt upward
        self.ACCEL_SHOCK_DELTA_THRESHOLD = -2200.0  # mm/s² deceleration
        self.cli.add_handler(pycozmo.event.EvtCliffDetectedChange, self._on_cliff)
        self.cli.add_handler(pycozmo.event.EvtRobotPickedUpChange, self._on_pickup)
        self._patch_client_motor_methods()

    def guarded_drive_wheels(self, lwheel_speed=0.0, rwheel_speed=0.0):
        if self.safety_tripped.is_set() or self.is_evasive_active:
            return  # Instant hardware lock-out (<10ms)
        self._orig_drive_wheels(lwheel_speed, rwheel_speed)`
  },

  // =========================================================================================
  // PAGE 03: SCALABLE TOOL ROUTING & LANGGRAPH
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "COGNITIVE DECISION // SCALABLE TOOL ROUTING",
    title: "Scalable Tool Routing & LangGraph",
    subtitle: "FAISS Top-k Pruning & Zero-Token LAYA Cross-Encoder",
    discipline: "Information Retrieval & Cross-Encoder Decision Routing",
    thesis: "Eliminating Tool Crowding, Softmax Attention Dilution, and O(N) Context Pre-Fill via O(k) Vector Filtering and Typed Decision Models",
    image: "/moka/cozmo_hardware_sketch.webp",
    imageCaption: "Physical Schematic & Dimensions: Anki Cozmo robotic chassis with 4-DOF articulators, drop IR sensors, 3-axis IMU pitch tilt guards, and 33Hz packet-level safety interceptors.",
    overview:
      "In conventional LLM architectures, passing 15 to 100+ tool schemas into a monolithic prompt degrades classification accuracy, bloats prompt pre-fill latency to 2,000–8,000ms, and causes softmax attention dilution (dropping monolithic LAYA to 60.4%). MoKa solves this via a Two-Layer Top-K architecture: an in-memory FAISS vector index with BAAI/bge-small-en-v1.5 pre-filters the catalog to top-k (k=3) candidates, reducing input complexity to O(k) constant space. The pruned choices are evaluated by the 135M parameter LAYA cross-encoder (convaiinnovations/laya-typed-decisions), achieving 95.8% Top-1 accuracy with 0 generative output tokens—matching local Ollama qwen2.5:3b while slashing mean latency from 1,455.6ms to 205.3ms.",
    description:
      "In conventional LLM architectures, passing 15 to 100+ tool schemas into a monolithic prompt degrades classification accuracy, bloats prompt pre-fill latency to 2,000–8,000ms, and causes softmax attention dilution (dropping monolithic LAYA to 60.4%).\n\n" +
      "MoKa solves this via a Two-Layer Top-K architecture:\n\n" +
      "• FAISS Top-k Pruning: An in-memory FAISS vector index with BAAI/bge-small-en-v1.5 pre-filters the catalog to top-k (k=3) candidates, reducing input complexity to O(k) constant space.\n\n" +
      "• Zero-Token LAYA Cross-Encoder: The pruned choices are evaluated by the 135M parameter LAYA cross-encoder (convaiinnovations/laya-typed-decisions), achieving 95.8% Top-1 accuracy with 0 generative output tokens—matching local Ollama qwen2.5:3b while slashing mean latency from 1,455.6ms to 205.3ms.\n\n" +
      "• Graph Orchestration: LangGraph manages conditional state execution, tool fallback chains, and dynamic execution against a unified single-node Python registry.",
    keyMetrics: [
      { label: "Routing Accuracy", value: "95.8% (Top-1)" },
      { label: "Output Tokens", value: "0 Tokens (Eliminated)" },
      { label: "Complexity Scaling", value: "O(k) Bounded Space" },
      { label: "Mean Latency", value: "205.3ms (vs 1,455.6ms)" }
    ],
    highlights: [
      "95.8% routing accuracy (matching 3B LLM, +8.3% over monolithic baseline)",
      "0 generative output tokens via 135M LAYA cross-encoder",
      "O(k) constant context complexity scaling across 20 to 100 tools",
      "Mean latency slashed from 1,455.6ms to 205.3ms (P50: 5.5ms)"
    ],
    codeSnippet:
`# Layer 2 Bounded O(k) Tool RAG & LAYA Typed Decision Cross-Encoder
def route_query(state: AgentState):
    active_tools = state.get("active_tools", []) # Pre-filtered to Top-3 by FAISS
    if not active_tools or is_conversational_query(state["messages"][-1].content):
        return {"next_route": "none"}
        
    criteria = {t["name"]: t["description"] for t in active_tools}
    criteria["none"] = "Core conversational channel for casual chat and personal facts."
    
    questions = {"tool_selection": {
        "type": "choice",
        "instructions": "Select the appropriate tool or 'none' for conversational chat.",
        "criteria": criteria
    }}
    
    laya_agent = get_laya_agent("convaiinnovations/laya-typed-decisions")
    decision = laya_agent.predict(state["messages"][-1].content, questions)
    return {"next_route": decision["answers"]["tool_selection"]["choice"]}`
  },

  // =========================================================================================
  // PAGE 04: DUAL-TIER MEMORY & MULTIMODAL VOICE
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "STATE & AUDIO // DUAL PERSISTENCE & VOICE",
    title: "Dual-Tier Memory & Multimodal Voice",
    subtitle: "Pooled PostgresSaver Checkpoints & Mem0 pgvector Reconciliation",
    discipline: "State Persistence, Vector Embeddings & Neural Audio",
    thesis: "Decoupling State Durability and Contextual Memory from Cloud Lock-In via Resilient Neon Connection Pools and Intelligent Biographical Reconciliation",
    overview:
      "MoKa maintains contextual continuity without cloud lock-in through a dual memory substrate. Short-term dialogue threads are preserved via LangGraph PostgresSaver backed by an auto-reconnecting psycopg3 connection pool that effortlessly survives serverless scale-to-zero idle disconnects on Neon. When sessions exceed 6 turns, older messages are summarized and pruned via RemoveMessage, bounding context bloat. Long-term biographical facts are managed by Mem0 backed by PostgreSQL pgvector (collection moka_user_memories, 384-D FastEmbed vectors), featuring an Intelligent Memory Reconciliation engine that runs few-shot dialogue evaluation to execute in-place UPDATEs, explicit DELETEs (forgetting negated facts), and ADDs, synchronized two-way with user_profile.md. Multimodal voice pairs Silero VAD (250ms silence threshold) with faster-whisper and Kokoro-ONNX 24kHz neural synthesis, executing conversational barge-in with sub-50ms audio queue flushing.",
    description:
      "MoKa maintains contextual continuity without cloud lock-in through a dual memory substrate:\n\n" +
      "1. Short-Term Context Management (LangGraph + PostgresSaver):\n" +
      "   • Preserved via an auto-reconnecting psycopg3 connection pool that effortlessly survives serverless scale-to-zero idle disconnects on Neon.\n" +
      "   • When sessions exceed 6 turns, older messages are summarized and pruned via RemoveMessage, bounding context bloat and preserving constant inference speed.\n\n" +
      "2. Long-Term Biographical Memory (Mem0 + pgvector):\n" +
      "   • Managed by Mem0 backed by PostgreSQL pgvector (collection moka_user_memories, 384-D FastEmbed vectors).\n" +
      "   • Features an Intelligent Memory Reconciliation engine that runs few-shot dialogue evaluation to execute in-place UPDATEs, explicit DELETEs (forgetting negated facts), and ADDs, synchronized two-way with user_profile.md.\n\n" +
      "3. Multimodal Voice Substrate:\n" +
      "   • Pairs Silero VAD (250ms silence threshold) with faster-whisper and Kokoro-ONNX 24kHz neural synthesis.\n" +
      "   • Executes conversational barge-in with sub-50ms audio queue flushing.",
    keyMetrics: [
      { label: "Connection Pool", value: "Psycopg3 (Neon Resilient)" },
      { label: "Biographical Memory", value: "Mem0 pgvector (384-D)" },
      { label: "Rolling Summarizer", value: "Prunes Active History >6 Turns" },
      { label: "Barge-in Latency", value: "<50ms Audio Queue Flush" }
    ],
    highlights: [
      "Resilient Neon PostgreSQL connection pool surviving serverless idle disconnections",
      "Mem0 pgvector persistent profile with intelligent UPDATE/DELETE/ADD reconciliation",
      "Rolling summarizer pruning active history beyond 6 messages via RemoveMessage",
      "Silero VAD + faster-whisper + Kokoro-ONNX TTS with <50ms conversational barge-in"
    ],
    codeSnippet:
`# Dual-Layer Persistence: Resilient Checkpointer & Mem0 pgvector
pool = ConnectionPool(
    conninfo=os.getenv("DATABASE_URL"),
    min_size=1, max_size=10,
    check=ConnectionPool.check_connection, max_idle=300
)
checkpointer = PostgresSaver(pool) # Neon serverless scale-to-zero resilient

# Intelligent Few-Shot Biographical Memory Reconciliation
def _reconcile_dialogue(self, dialogue_text: str, user_id: str = "cozmo_owner"):
    existing_records = self.get_all_memories_with_details(user_id=user_id)
    # LLM reconciliation pass evaluates dialogue against existing traits
    reconciliation = self.llm.invoke(format_reconcile_prompt(existing_records, dialogue_text))
    for op in reconciliation["operations"]:
        if op["action"] == "UPDATE": self.client.update(memory_id=op["id"], data=op["new_fact"])
        elif op["action"] == "DELETE": self.client.delete(memory_id=op["id"])
        elif op["action"] == "ADD": self.client.add(messages=op["fact"], user_id=user_id)`
  },

  // =========================================================================================
  // PAGE 05: PERCEPTION & PATH PLANNING
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "PERCEPTION & NAVIGATION // FOUNDATIONAL VISION & A*",
    title: "Cyber-Physical Perception & Path Planning",
    subtitle: "Foundational DINOv3 Vision & Sub-35ms Bidirectional A*",
    discipline: "Foundational Vision Models & Discretized Path Planning",
    thesis: "Robust Desktop Cyber-Physical Navigation via Dense ViT Feature Maps, Landmark SLAM Drift Verification, and Bidirectional A* Grid Search",
    overview:
      "Embodied desktop robotics requires spatial awareness and robust navigation under real-world track slip and lighting variations. MoKa integrates a foundational DINOv3 Vision Transformer backbone extracting 384-dimensional dense patch embeddings at >=15 FPS. A TemporalDebouncer verifies visual landmarks across 3 consecutive frames (cosine similarity > 0.75) to anchor features in Landmark SLAM, compensating for odometry drift. Motion planning runs over a 10mm discretized 2D occupancy grid using a Bidirectional A* search algorithm: expanding frontiers simultaneously from Cozmo's start pose and the charger pre-dock approach point, reducing state-space complexity to O(b^(d/2)) and converging in <35ms with a strict 50mm obstacle buffer. The system seamlessly degrades to simulated autonomy (--dry-run and --source webcam) when physical hardware is detached.",
    description:
      "Embodied desktop robotics requires spatial awareness and robust navigation under real-world track slip and lighting variations:\n\n" +
      "1. Foundational DINOv3 Vision Transformer:\n" +
      "   • Extracts 384-dimensional dense patch embeddings at >=15 FPS with SVD PCA heatmaps.\n" +
      "   • A TemporalDebouncer verifies visual landmarks across 3 consecutive frames (cosine similarity > 0.75) to anchor features in Landmark SLAM, compensating for odometry drift.\n\n" +
      "2. Sub-35ms Bidirectional A* Path Planning:\n" +
      "   • Motion planning runs over a 10mm discretized 2D occupancy grid.\n" +
      "   • Expands frontiers simultaneously from Cozmo's start pose and the charger pre-dock approach point, reducing state-space complexity to O(b^(d/2)) and converging in <35ms with a strict 50mm obstacle buffer.\n\n" +
      "3. Simulation Dry-Run & Webcam Fallback:\n" +
      "   • The system seamlessly degrades to simulated autonomy (--dry-run and --source webcam) when physical hardware is detached, enabling 100% hardware-free development and automated CI testing.",
    keyMetrics: [
      { label: "Vision Backbone", value: "DINOv3 ViT (384-D @ 15fps)" },
      { label: "Landmark Verification", value: "3-Frame TemporalDebouncer" },
      { label: "Path Planning Convergence", value: "<35ms Bidirectional A*" },
      { label: "Grid Resolution / Buffer", value: "10mm Grid / 50mm Clearance" }
    ],
    highlights: [
      "DINOv3 ViT dense 384-D patch embeddings at >=15 FPS with SVD PCA heatmaps",
      "TemporalDebouncer (3-frame verification) & Landmark SLAM drift compensation",
      "Sub-35ms Bidirectional A* path planning over 10mm grid with 50mm safety clearance",
      "100% hardware-free execution via simulation dry-run & webcam fallback"
    ],
    codeSnippet:
`# Sub-35ms Bidirectional A* Motion Planning with 50mm Safety Clearance
def plan_bidirectional_astar(start: Tuple[float, float], goal: Tuple[float, float],
                             obstacles: List[BlockObstacle]) -> PathPlanningResult:
    # Inflate blocks with 50mm safety buffer + robot track radius (35mm)
    grid = OccupancyGrid(resolution_mm=10.0, clearance_mm=50.0 + 35.0)
    grid.rasterize_obstacles(obstacles)
    
    # Simultaneous forward & backward search -> O(b^(d/2)) convergence (<35ms)
    forward_frontier, backward_frontier = PriorityQueue(), PriorityQueue()
    intersect_node = search_frontiers(forward_frontier, backward_frontier, grid)
    
    smooth_waypoints = decimate_string_pulling(reconstruct_path(intersect_node))
    return PathPlanningResult(success=True, waypoints=smooth_waypoints)`
  }
];

// Map lookup dictionary for easy index access (page01 .. page05)
export const MOKA_PAGES_DATA: Record<string, MokaPageContent> = mokaPagesData.reduce(
  (acc, page) => {
    acc[`page${page.pageNumber}`] = page;
    return acc;
  },
  {} as Record<string, MokaPageContent>
);
