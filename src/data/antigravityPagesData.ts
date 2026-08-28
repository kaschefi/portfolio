// src/data/antigravityPagesData.ts
// Comprehensive architectural specifications and data models for Volume 4 (RoboFlow: Warehouse Routing & Scheduling).

export interface AntigravityPageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // UNIVERSITY PROJECT & OBJECTIVES"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Warehouse Routing and Scheduling System"
  thesis?: string;            // Deep engineering thesis
  overview?: string;          // Concise executive summary
  description?: string;       // In-depth technical breakdown
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

export const antigravityPagesData: AntigravityPageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS // UNIVERSITY PROJECT & OBJECTIVES
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // UNIVERSITY PROJECT & OBJECTIVES",
    title: "RoboFlow: Warehouse Simulation Engine",
    subtitle: "Graph-Based Multi-Robot Routing, Infrastructure Cabling & Task Scheduling in Java & JavaFX",
    discipline: "Warehouse Routing and Scheduling System",
    thesis: "Developed as a university project at FH Campus Wien to investigate, implement, and benchmark foundational graph-theory algorithms for autonomous warehouse logistics within a real-time visual simulation environment.",
    overview: "Simulates autonomous mobile robots (AMRs) operating on a 20x20 warehouse floor grid, planning collision-free shortest paths, computing minimal infrastructure cabling, and scheduling interdependent order-fulfillment workflows.",
    description:
      "### Academic Origin & Problem Formulation\n" +
      "RoboFlow was engineered as a university project at FH Campus Wien to tackle three core logistics challenges in industrial automation:\n" +
      "1. **Autonomous Robot Routing:** Navigating grid floors with obstacle avoidance.\n" +
      "2. **Facility Network Design:** Connecting charging stations and drop zones with minimal cabling cost.\n" +
      "3. **Workflow Scheduling:** Sequencing manufacturing and fulfillment tasks without circular dependency deadlocks.\n\n" +
      "### Graph-Theoretic Modeling\n" +
      "The entire warehouse floor is modeled as a discrete weighted graph $G = (V, E)$, where walkable tiles represent vertices and adjacent traversable cells form weighted edges. By decoupling graph modeling from rendering, the simulation executes sub-millisecond path recalculations and topology updates.",
    metadata: {
      binding: "Cobalt cloth · cool-silver foil",
      format: "162 × 240 mm · FH Campus Wien Edition",
      theme: "RoboFlow · warehouse routing & scheduling",
      motif: "Suspended orbits"
    },
    highlights: [
      "FH Campus Wien university engineering project",
      "Graph-theoretic warehouse modeling (G = (V, E))",
      "Real-time JavaFX 2D grid visualizer with dynamic obstacle avoidance",
      "Integrated routing, facility cabling, and workflow engines"
    ],
    keyMetrics: [
      { label: "Grid Resolution", value: "20 × 20 Cells" },
      { label: "Core Algorithms", value: "3 Graph Solvers" },
      { label: "Architecture", value: "Strategy / MVC" },
      { label: "Runtime", value: "Java 21 / JavaFX" }
    ]
  },

  // =========================================================================================
  // PAGE 02: ALGORITHMS // THE THREE GRAPH SOLVERS
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "ALGORITHMS // THE THREE GRAPH SOLVERS",
    title: "The Three Core Graph Algorithms",
    subtitle: "Dijkstra Shortest Path, Prim Minimum Spanning Tree & DFS Topological Sort",
    discipline: "Warehouse Routing and Scheduling System",
    thesis: "A unified application of three classic graph-theory algorithms to solve navigation, infrastructure optimization, and sequential task scheduling.",
    overview: "Integrates Dijkstra's algorithm with priority queues for robot navigation, Prim's algorithm for minimum facility cabling, and DFS topological sort with 3-color deadlock detection for order fulfillment.",
    description:
      "### 1. Route Planning: Dijkstra's Algorithm\n" +
      "Calculates the shortest walkable path for autonomous robots moving from start stations to target destinations.\n" +
      "• **Data Structure:** Graph modeled via an adjacency list with Euclidean distance weights.\n" +
      "• **Optimization:** Min-heap Priority Queue yielding $O((V + E) \\log V)$ time complexity.\n" +
      "• **Behavior:** Automatically detects user-placed obstacles and recalculates detour paths in real time.\n\n" +
      "### 2. Infrastructure Design: Prim's Algorithm\n" +
      "Connects critical warehouse facilities (charging stations, picking stations, drop zones) with the minimum possible cabling or communication line costs.\n" +
      "• **Algorithm:** Prim's Minimum Spanning Tree (MST) Algorithm.\n" +
      "• **Behavior:** Computes the global MST spanning all active facilities, highlights trunk lines on the grid, and calculates total cabling cost.\n\n" +
      "### 3. Task Scheduling: Topological Sort & Cycle Detection\n" +
      "Schedules multi-step order-fulfillment and manufacturing tasks respecting prerequisite constraints modeled as a Directed Acyclic Graph (DAG).\n" +
      "• **Algorithm:** Depth-First Search (DFS) based Topological Sort.\n" +
      "• **Cycle Detection:** Classifies vertices using White-Gray-Black 3-color node classification. Any discovery of a Gray back-edge indicates a circular deadlock, triggering immediate modal alerts to the operator.",
    highlights: [
      "Dijkstra's shortest path with priority queue min-heap",
      "Prim's MST for minimal facility cabling & trunk lines",
      "DFS Topological Sort with 3-color cycle/deadlock detection",
      "Instant visual feedback on the 20x20 interactive canvas"
    ],
    keyMetrics: [
      { label: "Routing Complexity", value: "O((V+E) log V)" },
      { label: "Cycle Detection", value: "White-Gray-Black DFS" },
      { label: "Infrastructure", value: "Prim MST" },
      { label: "Task Modeling", value: "Directed Acyclic Graph" }
    ]
  },

  // =========================================================================================
  // PAGE 03: ARCHITECTURE // CLEAN DESIGN & STRATEGY PATTERNS
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "ARCHITECTURE // CLEAN DESIGN & STRATEGY PATTERNS",
    title: "System Architecture & JavaFX View Layer",
    subtitle: "Decoupled Domain Models, Strategy Interfaces & 4-Tier Service Layer",
    discipline: "Warehouse Routing and Scheduling System",
    thesis: "Engineered with strict separation of concerns, employing the Strategy Pattern to decouple graph algorithms from domain state, business services, and JavaFX interface controls.",
    overview: "Clean 4-tier architecture separating domain models, pluggable algorithmic strategies, stateful orchestration services, and the interactive JavaFX desktop view layer.",
    description:
      "### Codebase Architecture & Design Patterns\n" +
      "• **Domain Model:** Encapsulates pure entities: `Node`, `Edge`, `Graph`, `Robot`, `Task`, `Station`, and `Obstacle`.\n" +
      "• **Strategy Pattern:** Decouples algorithms via abstract interfaces (`ShortestPathStrategy`, `MinimumSpanningTreeStrategy`, `TopologicalSortStrategy`), allowing effortless drop-in replacements (e.g., A* or Kruskal's) without touching application logic.\n" +
      "• **Service Layer:** Four specialized services coordinate system state: `RoutingService`, `NetworkDesignService`, `TaskSchedulingService`, and `RobotManagementService`.\n" +
      "• **UI Layer:** A rich JavaFX interface featuring a 20x20 interactive grid, management sidebars, an embedded Terminal Log console, and a runtime bottom status bar.",
    highlights: [
      "Strategy Pattern for pluggable algorithm implementations",
      "Decoupled 4-service orchestration architecture",
      "Interactive 20x20 JavaFX grid with live canvas drawing",
      "Embedded terminal logger and runtime status bar"
    ],
    keyMetrics: [
      { label: "Architecture", value: "Domain-Strategy-Service-UI" },
      { label: "UI Framework", value: "JavaFX Canvas & FXML" },
      { label: "Modularity", value: "100% Decoupled" },
      { label: "Patterns", value: "Strategy, Service, MVC" }
    ]
  },

  // =========================================================================================
  // PAGE 04: SIMULATION // RUNTIME EXECUTION & DEADLOCK SAFETY
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "SIMULATION // RUNTIME EXECUTION & DEADLOCK SAFETY",
    title: "Interactive Simulation & Deadlock Safety",
    subtitle: "Dynamic Obstacle Placement, Real-Time Rerouting & Pre-Dispatch Validation",
    discipline: "Warehouse Routing and Scheduling System",
    thesis: "Validates algorithmic correctness under dynamic operating conditions, preventing robot grid deadlocks and catching invalid manufacturing workflows at submission time.",
    overview: "Provides interactive floor editing, step-by-step robot movement visualization, on-the-fly obstacle detours, and pre-dispatch DAG cycle validation.",
    description:
      "### Interactive Simulation Workflows\n" +
      "• **Dynamic Obstacle Avoidance:** Placing obstacles on an active path triggers immediate graph weight invalidation and instant sub-2ms Dijkstra recalculation.\n" +
      "• **Facility Cabling Visualization:** Adding or removing charging stations and drop zones automatically recomputes Prim's MST, rendering the optimal cabling topology in real time.\n" +
      "• **Deadlock Prevention:** When operators build task dependency chains, the topological sort engine verifies graph acyclicity before dispatch, catching circular deadlocks at submission.",
    highlights: [
      "Real-time obstacle injection and dynamic rerouting",
      "Automated deadlock detection with visual alert dialogs",
      "Step-by-step robot movement visualization along planned paths",
      "Multi-station picking and drop-off coordination"
    ],
    keyMetrics: [
      { label: "Reroute Latency", value: "< 2ms" },
      { label: "Deadlock Guard", value: "Pre-dispatch verification" },
      { label: "Simulation Mode", value: "Step & Continuous" },
      { label: "Visual Grid", value: "Interactive 20x20" }
    ]
  },

  // =========================================================================================
  // PAGE 05: COLOPHON // SPECIFICATIONS & SOFTWARE STACK
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "COLOPHON // SPECIFICATIONS & SOFTWARE STACK",
    title: "Engineering Colophon & Technology Stack",
    subtitle: "Java 21, JavaFX Controls, Clean Architecture & Graph Theory",
    discipline: "Warehouse Routing and Scheduling System",
    thesis: "A comprehensive summary of the RoboFlow warehouse simulation engine developed at FH Campus Wien.",
    overview: "Built in pure Java 21 and JavaFX without third-party graph dependencies, demonstrating clean software engineering and foundational computer science in industrial robotics.",
    description:
      "### Software & Engineering Stack\n" +
      "• **Language:** Java 21 (Modern LTS)\n" +
      "• **UI Toolkit:** JavaFX (Canvas, Controls, FXML, Observable Collections)\n" +
      "• **Design Patterns:** Strategy Pattern, Service Layer, Observer, Model-View-Controller\n" +
      "• **Graph Implementations:** First-principles Adjacency List, Min-Heap Priority Queue, DAG Traversal\n" +
      "• **Institution:** FH Campus Wien",
    highlights: [
      "Pure Java 21 first-principles graph implementation",
      "Zero external graph dependencies",
      "Clean separation of algorithmic strategies from UI",
      "FH Campus Wien Academic Software Project"
    ],
    keyMetrics: [
      { label: "Language", value: "Java 21" },
      { label: "UI Toolkit", value: "JavaFX" },
      { label: "Institution", value: "FH Campus Wien" },
      { label: "Design Pattern", value: "Strategy Pattern" }
    ]
  }
];

export const ANTIGRAVITY_PAGES_DATA: Record<string, AntigravityPageContent> = {
  page01: antigravityPagesData[0],
  page02: antigravityPagesData[1],
  page03: antigravityPagesData[2],
  page04: antigravityPagesData[3],
  page05: antigravityPagesData[4]
};
