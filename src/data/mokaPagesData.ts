export interface MokaPageContent {
  pageNumber: string;
  pageLabel: string;
  title: string;
  subtitle: string;
  discipline?: string;
  thesis?: string;
  overview?: string;
  description?: string;
  codeSnippet?: string;
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

export const MOKA_PAGES_DATA: Record<string, MokaPageContent> = {
  page01: {
    pageNumber: "01",
    pageLabel: "Title Page & System Genesis",
    title: "MOKA",
    subtitle: "Two-Tier Autonomous Physical & Digital AI Assistant",
    discipline: "Autonomous Robotics & LangGraph Cognitive Systems",
    thesis:
      "Bridging embodied physical robotics (Anki Cozmo) and desktop AI orchestration via a dual-plane hybrid cognitive architecture: zero-latency spinal reflexes for immediate kinetic safety and workstation routines, coupled with a multi-turn LangGraph brain utilizing local LLMs and dynamic vector tool RAG.",
    metadata: {
      binding: "Ultramarine cloth · copper foil",
      format: "148 × 216 mm · Anki Cozmo Edition",
      theme: "MoKa · two-tier intelligence pipeline",
      motif: "MoKa Dual-Layer Matrix Glyph"
    },
    overview:
      "MoKa is an embodied personal assistant engineered around the Anki Cozmo robotic platform. The system resolves the fundamental latency-versatility dilemma of robotic AI by splitting cognition into two distinct tiers: an ultra-fast (~45ms) Layer 1 FastEmbed reflex layer for instant physical maneuvers and OS-level workstation automations, and a stateful Layer 2 LangGraph brain for contextual dialogue, Google Calendar scheduling, deterministic code execution, and real-time web retrieval. Operating entirely on local neural networks (Ollama qwen2.5:3b, ornith:9b, and ONNX TTS), MoKa provides studio-quality voice feedback, 33Hz packet-level hardware safety guards, and persistent dual-tier PostgreSQL memory.",
    keyMetrics: [
      { label: "Hardware Architecture", value: "Anki Cozmo (PyCozmo Protocol)" },
      { label: "Reflex Reaction Time", value: "~45ms (Layer 1 FastEmbed)" },
      { label: "Cognitive State Graph", value: "LangGraph + PostgresSaver" },
      { label: "Local LLM Inference", value: "Ollama (qwen2.5:3b & ornith:9b)" }
    ],
    highlights: [
      "Physical & Digital Dual Bridge: Seamlessly bridges physical hardware control (OpenCV HSV docking, 128×64 OLED graphics, 4-DOF articulators) with desktop digital automation (Steam, JetBrains IDEs, n8n, Google Calendar).",
      "Spinal Reflex vs. Deep Thought Split: Direct mathematical vector routing for latency-critical operations bypassing LLMs entirely, backed by a stateful multi-step agent graph for ambiguous conversational queries.",
      "100% Local Intelligence & Zero-Cloud Telemetry: Built entirely on local embeddings (BAAI/bge-small-en-v1.5), local speech recognition, zero-disk ONNX neural speech synthesis, and self-hosted PostgreSQL memory."
    ]
  },

  page02: {
    pageNumber: "02",
    pageLabel: "The Two-Tier Router",
    title: "The Two-Tier Router",
    subtitle: "50ms FastEmbed Reflexes & LangGraph Dynamic Tool RAG",
    image: "/router_benchmark.png",
    imageCaption: "LangSmith 57-Case Benchmark: Monolithic LLM Baseline (A) vs. MoKa Two-Layer Router (B) achieving 93.0% routing accuracy, 83% token reduction, and ~45ms P50 latency.",
    description:
      "The core cognitive routing engine of MoKa. Traditional monolithic LLM prompts suffer from attention dilution, high token overhead, and dangerous 1.5s+ latency when handling dozens of physical and digital tools. MoKa solves this with a two-tier hierarchy:\n\n1. Layer 1 Semantic Reflexes: Uses local FastEmbed embeddings (BAAI/bge-small-en-v1.5) to calculate cosine similarity against a local action registry (@reflex_registry.reflex). Matches execute in ~45ms without calling an LLM, providing instantaneous reaction for physical docking, movement, and OS workstation modes.\n\n2. Layer 2 Dynamic Tool RAG: For conversational and complex queries that bypass Layer 1, the query vector searches an in-memory FAISS vector index (ToolVectorRegistry) to dynamically retrieve only the top 2–3 relevant candidate tool schemas. A structured LLM supervisor (qwen2.5:3b) classifies the intent into a RouteDecision and dispatches execution to a single generic execute_tool_node mapping over TOOL_REGISTRY, scaling seamlessly to 100+ tools without graph recompilation.\n\nLangSmith Benchmark: Evaluated across a 57-case test suite, MoKa's Two-Tier Router achieved 93.0% routing accuracy (vs 89.5% monolithic baseline), slashed input token consumption by 83% (10,150 tokens vs 59,200 tokens), and reduced median P50 response latency by ~30x (~45ms vs 1,340ms).",
    codeSnippet: `# core/routing/layer1/semantic_layer.py & layer2/router.py
from semantic_router.routers import SemanticRouter
from core.routing.layer1.registry import reflex_registry
from core.routing.layer2.tool_vector_db import tool_rag_registry
from core.routing.layer2.worker_nodes import TOOL_REGISTRY

# 1. LAYER 1: FastEmbed Instant Reflex Lookup (~45ms)
def check_layer_1(user_input: str) -> str:
    global layer_1_router
    if layer_1_router is None:
        initialize_router()
    route_choice = layer_1_router(user_input)
    return route_choice.name

# 2. LAYER 2: FAISS Dynamic Tool RAG & Structured Supervisor
def tool_retrieval_node(state: AgentState):
    query = state["messages"][-1].content
    # Pull only the top 2-3 matching tool schemas from FAISS
    matched_tools = tool_rag_registry.search_relevant_tools(query, k=3)
    return {"active_tools": matched_tools}

def route_query(state: AgentState):
    active_tools = state.get("active_tools", [])
    if not active_tools:
        return {"next_route": "none"}
    
    tool_menu = "".join([f'- "{t["name"]}": {t["description"]}\\n' for t in active_tools])
    prompt = f"Classify intent using ONLY candidate tools:\\n{tool_menu}"
    decision = structured_router.invoke([SystemMessage(content=prompt), state["messages"][-1]])
    return {"next_route": decision.route}

# 3. UNIFIED GENERIC TOOL EXECUTOR (Scales to 100+ tools)
def execute_tool_node(state: AgentState):
    route = state.get("next_route", "none")
    handler = TOOL_REGISTRY.get(route)
    return handler(state) if handler else chat_node(state)`,
    keyMetrics: [
      { label: "Reflex Latency", value: "45ms (~30x faster)" },
      { label: "Routing Accuracy", value: "93.0% (vs 89.5% baseline)" },
      { label: "Prompt Token Reduction", value: "83% (10.1k vs 59.2k tokens)" },
      { label: "Benchmark Evaluation", value: "57 LangSmith Test Cases" }
    ],
    highlights: [
      "Attention-Preserving Tool RAG: Queries an in-memory FAISS index with BAAI/bge-small-en-v1.5 embeddings to pass only top candidate schemas to qwen2.5:3b, eliminating tool hallucination.",
      "Unified Tool Executor Node: Replaces O(N) LangGraph node boilerplate with a single generic execute_tool_node that resolves route keys against a Python TOOL_REGISTRY dictionary.",
      "Dual Fallback Safety Net: If creative user phrasing misses Layer 1 reflexes, the query is gracefully caught by Layer 2's semantic vector database rather than dropped."
    ]
  },

  page03: {
    pageNumber: "03",
    pageLabel: "33Hz Hardware Safety Guards",
    title: "Real-Time Hardware Reflex Safety",
    subtitle: "Sub-Packet Interception, Multi-Modal Stasis & Anti-Dump Protection",
    image: "/cozmo_hardware_sketch.png",
    imageCaption: "Physical Schematic & Dimensions: Anki Cozmo robotic chassis with 4-DOF articulators, drop IR sensors, 3-axis IMU pitch tilt guards, and 33Hz packet-level safety interceptors.",
    description:
      "Operating directly inside PyCozmo's low-level packet thread context (~33Hz / ~30ms cycle), ReflexSafetyGuard provides zero-latency hardware protection by monkey-patching motor dispatch methods (drive_wheels, drive_straight, turn_in_place, stop_all_motors) to lock out high-level host commands whenever dangerous conditions occur.\n\nMulti-Modal Guard Architecture:\n1. Anti-Fall Guard (Cliff & Freefall Protection): Listens to low-level hardware status flags (CLIFF_DETECTED, IS_FALLING). When triggered, it halts all motors immediately and launches an isolated daemon thread that executes an evasive maneuver (reversing for 1.2s and executing a 180° U-turn spin away from the edge).\n\n2. Anti-Dump & Anti-Stall Guard: Evaluates 3 multi-modal signals during forward movement: (a) IMU Pitch Tilt: Detects pitch angle spikes (>0.35 rad / ~20° tilt) caused by climbing objects or tipping upward; (b) Impact Deceleration: Measures true gravity-compensated deceleration (ax - g sin(theta) <= -3500 mm/s²); (c) Pose & OpenCV Visual Motion Stasis: Combines an 0.8s pose displacement window (<10mm moved) with a 1.0s sliding OpenCV frame difference (cv2.absdiff on downsampled, Gaussian-blurred camera frames with mean diff <3.5). If camera pixels remain static while wheels are driving forward, visual collision stasis trips the safety, stopping motors and reversing 1.0s.",
    codeSnippet: `# backend/core/hardware/safety.py
class ReflexSafetyGuard:
    def __init__(self, cli: pycozmo.Client):
        self.cli = cli
        self.safety_tripped = threading.Event()
        self.PITCH_BUMP_THRESHOLD = 0.35  # ~20 degrees tilt
        self.ACCEL_SHOCK_DELTA_THRESHOLD = -2200.0  # mm/s^2
        self.VISUAL_STALL_WINDOW_DURATION = 1.0  # 1.0s sliding window
        self.STALL_DIFF_THRESHOLD = 3.5  # Mean absdiff threshold
        self._patch_client_motor_methods()
        self.cli.add_handler(pycozmo.event.EvtRobotStateUpdated, self._on_robot_state)
        self.cli.add_handler(pycozmo.event.EvtNewRawCameraImage, self._on_camera_image)

    def _patch_client_motor_methods(self):
        orig_drive = self.cli.drive_wheels
        def guarded_drive_wheels(lwheel=0.0, rwheel=0.0, *args, **kwargs):
            if self.safety_tripped.is_set() and threading.get_ident() != self._evasive_thread_id:
                return  # Block incoming host movement commands
            return orig_drive(lwheel, rwheel, *args, **kwargs)
        self.cli.drive_wheels = guarded_drive_wheels

    def update_camera_frame(self, bgr_image, is_driving_forward: bool):
        small = cv2.resize(bgr_image, (80, 60))
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Sliding-window visual stasis calculation
        if time.time() - self.visual_window_start_time >= self.VISUAL_STALL_WINDOW_DURATION:
            diff = float(cv2.absdiff(blurred, self.visual_window_ref_frame).mean())
            if diff < self.STALL_DIFF_THRESHOLD and is_driving_forward:
                self._trigger_evasive_reflex("BUMP_DETECTED (Visual Stasis)")`,
    keyMetrics: [
      { label: "Packet Loop Rate", value: "33Hz (~30ms cycle)" },
      { label: "Pitch Tilt Limit", value: "0.35 rad (~20°)" },
      { label: "Visual Stasis Delta", value: "cv2.absdiff < 3.5" },
      { label: "Evasion Maneuver", value: "1.2s reverse + 180° U-turn" }
    ],
    highlights: [
      "Low-Level Method Interception: Overrides drive_wheels and stop_all_motors directly on PyCozmo Client to prevent asynchronous commands from overriding active safety states.",
      "Multi-Modal Sensor Fusion: Combines physical cliff IR sensors, IMU gravity-compensated accelerometer shocks, pose odometry, and blurred downsampled OpenCV frame differences.",
      "Non-Blocking Autonomous Evasion: Spawns dedicated daemon recovery threads to reverse away from table edges and execute 180° escape pivots without blocking the main event loop."
    ]
  },

  page04: {
    pageNumber: "04",
    pageLabel: "Dual-Tier Memory & Local Voice Pipeline",
    title: "Stateful Memory Substrate & Zero-Disk Voice Engine",
    subtitle: "PostgreSQL State Checkpoints, REAL[] Semantic Store & Kokoro-ONNX TTS",
    description:
      "MoKa features a persistent dual-tier memory substrate paired with a zero-disk streaming voice synthesis engine:\n\n1. Short-Term Memory (Session Checkpointing & Pruning):\nDriven by LangGraph's PostgresSaver, conversational sessions persist across reboots via thread tracking (thread_id='cozmo_default_session'). When sessions exceed 6 messages, summarize_conversation_node generates a rolling summary and emits RemoveMessage instructions to prune messages older than the last 4 exchanges (2 full turns), keeping LLM context windows razor small.\n\n2. Long-Term Memory (Permanent Semantic Core):\nPersists user biographical traits into native PostgreSQL float arrays (REAL[]), bypassing OS-level pgvector binary dependencies. Generates 384-dimensional dense vectors locally via LangChainFastEmbedBridge (BAAI/bge-small-en-v1.5). Implements O(1) Entity Resolution for unique categories (user_name, user_occupation, favorite_sports_team, favorite_programming_language, user_location) and mathematical 0.82 NumPy cosine similarity deduplication (Similarity = (A · B) / (||A|| ||B||)). Fact extraction runs asynchronously on a non-blocking background thread using qwen2.5:3b at temperature 0.0 with strict temporal noise filtering.\n\n3. Zero-Disk Streaming Voice Pipeline:\nIntegrates Kokoro-ONNX neural speech synthesis. Generates full phrase prosody in memory and chops float32 audio into 20ms chunks (480 samples @ 24kHz) for non-blocking PortAudio playback, supporting instant C-level ring buffer flushing on user interruption and 22050Hz 16-bit PCM resampling for Cozmo's onboard speaker.",
    codeSnippet: `# schemas/memory_db.py & actions/physical/speak.py
class LongTermMemoryManager:
    UNIQUE_CATEGORIES = {"user_name", "user_occupation", "favorite_sports_team", 
                         "favorite_programming_language", "user_location"}

    def save_memory(self, fact: str, category: str = None, user_id: str = "cozmo_owner"):
        new_embedding = np.array(self.embedder.embed_query(fact))
        
        # 1. O(1) Entity Resolution for unique biographical slots
        if category in self.UNIQUE_CATEGORIES:
            with connect(DB_URI) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM user_profile_memories WHERE category = %s;", (category,))
                    if row := cur.fetchone():
                        cur.execute("UPDATE user_profile_memories SET fact=%s, embedding=%s WHERE id=%s;",
                                    (fact, new_embedding.tolist(), row[0]))
                        return

        # 2. NumPy Cosine Similarity Deduplication (Threshold 0.82)
        for db_id, db_fact, db_emb, db_cat in self._get_all_memories_for_user(user_id):
            similarity = np.dot(new_embedding, np.array(db_emb)) / (
                np.linalg.norm(new_embedding) * np.linalg.norm(db_emb)
            )
            if similarity > 0.82:
                # Update existing memory rather than creating duplicate row
                return self._update_memory(db_id, fact, new_embedding, category)

# Kokoro-ONNX Zero-Disk Audio Callback
def _audio_callback(self, outdata, frames, time, status):
    if self._paused or self._audio_queue.empty():
        outdata[:] = 0.0
        return
    chunk = self._audio_queue.get_nowait()
    outdata[:len(chunk), 0] = chunk`,
    keyMetrics: [
      { label: "Memory Vector Dim", value: "384-d (BAAI/bge-small)" },
      { label: "Deduplication Threshold", value: "0.82 Cosine Similarity" },
      { label: "Summarization Threshold", value: ">6 messages (prunes to 4)" },
      { label: "Audio Chunk Size", value: "20ms (480 samples @ 24kHz)" }
    ],
    highlights: [
      "Native PostgreSQL REAL[] Array Storage: Eliminates compiled pgvector OS binary dependencies on Windows while preserving high-speed vector retrieval using vectorized NumPy dot products.",
      "Dual-Track Entity Resolution (O(1)): Automatically updates single-value profile slots (names, jobs, teams) without vector drift, while applying semantic cosine matching for general preferences.",
      "Zero-Disk Streaming Audio Engine: Delivers studio-quality Kokoro-ONNX neural speech directly to PortAudio ring buffers with immediate hardware abortion capability on user interruption."
    ]
  },

  page05: {
    pageNumber: "05",
    pageLabel: "Deterministic Sandbox & MCP Integration",
    title: "Sub-Agent Sandboxes & External Tools",
    subtitle: "Isolated Python Subprocess Execution, Tavily MCP & n8n Automation",
    description:
      "MoKa combines cognitive planning with deterministic, isolated execution tools to guarantee 100% accuracy for mathematical, logical, and real-time data tasks:\n\n1. Deterministic Code Execution Sub-Agent (code_executor.py):\nWhen complex calculations, algebra, date arithmetic, array filtering, or string reversals are required, the router delegates to a specialized sub-agent powered by local ornith:9b (via Ollama). Operating under a strict 'Tool first, answer second' contract, it drafts a minimal script and executes it inside an isolated subprocess sandbox (execute_python_sandbox) with an 8.0-second hard timeout. The raw sandbox stdout is treated as ground truth and translated into warm conversational prose.\n\n2. Standard Model Context Protocol (MCP) Client (MCPs.py):\nIntegrates real-time web search using the official Tavily Model Context Protocol server. Spawns an npx tavily-mcp@latest stdio subprocess, handles the client-server JSON-RPC handshake over asynchronous pipes (stdio_client), and retrieves advanced search results with zero cloud SDK bloat.\n\n3. Autonomous Visual Docking & n8n Workflows:\nFeatures autonomous charger docking via OpenCV HSV color segmentation (Hue 15–60, Sat 30–255, Val 80–255) and contour centroid tracking to acquire the charger's RGB(204, 255, 51) marker, steering Cozmo to back onto charging pins. Connects to n8n webhooks for Google Calendar management and weather lookups via wttr.in.",
    codeSnippet: `# backend/actions/digital/langchain/code_executor.py & MCPs.py
@tool
def execute_python_sandbox(code_string: str) -> str:
    """Executes raw Python inside an isolated local subprocess sandbox."""
    temp_file = "moka_isolated_sandbox.py"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(code_string.strip())
    try:
        res = subprocess.run([sys.executable, temp_file], capture_output=True, text=True, timeout=8)
        return res.stdout if res.returncode == 0 else f"Execution Error: {res.stderr}"
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

# Standard Model Context Protocol (MCP) Client via Stdio
async def fetch_tavily_search(query: str) -> str:
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "tavily-mcp@latest"],
        env=os.environ.copy(),
        extra_spawn_args={"shell": True}
    )
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            response = await session.call_tool(
                name="tavily_search",
                arguments={"query": query, "search_depth": "advanced", "max_results": 5}
            )
            return "\\n".join([c.text for c in response.content if hasattr(c, "text")])`,
    keyMetrics: [
      { label: "Sandbox Model", value: "ornith:9b (Ollama local)" },
      { label: "Execution Timeout", value: "8.0s hard isolation limit" },
      { label: "Search Protocol", value: "Model Context Protocol (MCP)" },
      { label: "Visual Target Marker", value: "RGB(204, 255, 51) HSV Tracked" }
    ],
    highlights: [
      "Tool-First Deterministic Reasoning: Eliminates LLM math hallucinations by forcing the ornith:9b sub-agent to verify calculations in a local Python subprocess before answering.",
      "Native Model Context Protocol (MCP): Connects directly to tavily-mcp over stdio JSON-RPC streams via npx, enabling real-time deep web retrieval without heavy custom client wrappers.",
      "HSV Vision-Guided Autonomous Docking: Employs real-time OpenCV color segmentation and contour analysis to locate the charging dock marker, steering and executing a 180° reverse park onto the charging contacts."
    ]
  }
};
