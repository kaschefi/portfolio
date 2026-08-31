// scripts/modules/pageRenderer.mjs
// Lightweight interior page generator with full book-specific chapter content (512x768).

export function applyPagePatches(code) {
  const pnStartIdx = code.indexOf('function Pn(e) {');
  const erStartIdx = code.indexOf('function er() {');
  if (pnStartIdx === -1 || erStartIdx === -1) {
    return code;
  }

  const newPnFunction = `function Pn(e) {
    const r = \`#\${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}\`;
    const i = 512, d = 768;

    return Array.from({ length: 12 }, (a, n) => {
      const c = document.createElement("canvas");
      c.width = i;
      c.height = d;
      const s = c.getContext("2d", { willReadFrequently: false });
      
      const h = ye(pe(\`\${e.id}-leaf-\${n}\`) + e.seed);
      to(s, i, d, h);

      // Header Folio
      s.fillStyle = r;
      s.strokeStyle = r;
      s.textAlign = "left";
      s.textBaseline = "alphabetic";
      s.globalAlpha = 0.58;
      s.font = '500 10px Inter, "Helvetica Neue", Arial, sans-serif';
      s.letterSpacing = "1.8px";
      s.fillText(\`WORKING VOLUMES  /  \${e.roman}\`, 48, 48);
      s.textAlign = "right";
      s.fillText(ge(n + 1), i - 48, 48);
      s.textAlign = "left";
      s.fillRect(48, 64, i - 96, 1);
      s.globalAlpha = 1;

      // 1. LEFT PAGES (Diagrams & Plates)
      if (n === 1 && e.id === "codex") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  LANGSMITH ROUTER BENCHMARK", 54, 146);
        if (typeof customBenchmarkImg !== "undefined" && customBenchmarkImg && customBenchmarkImg.naturalWidth > 0) {
          const imgW = 404;
          const imgH = Math.round((imgW / customBenchmarkImg.naturalWidth) * customBenchmarkImg.naturalHeight);
          s.drawImage(customBenchmarkImg, 54, 190, imgW, imgH);
        }
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "57-case benchmark evaluation: Monolithic LLM baseline (A) vs MoKa Two-Layer Router (B). 93.0% routing accuracy, 83% token reduction, and ~45ms P50 latency.", 54, 460, 38, 22, 5);
      } else if (n === 3 && e.id === "codex") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 02  /  PHYSICAL ROBOTIC CHASSIS", 54, 146);
        if (typeof customCozmoSketchImg !== "undefined" && customCozmoSketchImg && customCozmoSketchImg.naturalWidth > 0) {
          const imgW = 404;
          const imgH = Math.round((imgW / customCozmoSketchImg.naturalWidth) * customCozmoSketchImg.naturalHeight);
          s.drawImage(customCozmoSketchImg, 54, 176, imgW, imgH);
        }
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "Mechanical dimension schematics and sensor topology of the Anki Cozmo embodied chassis: drop IR array, 3-axis IMU pitch tilt monitor, and 33Hz packet safety interceptors.", 54, 510, 38, 22, 5);
      } else if (n === 1 && e.id === "figma") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  VISION DETECTION & BENCHMARK", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(18, 20, 23, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "Empirical benchmark between classical HSV thresholding and YOLOv8 deep neural networks. Sub-millisecond HSV execution eliminates inference latency, ensuring reliable 90% closed-loop dynamic tracking.", 54, 460, 38, 22, 5);
      } else if (n === 3 && e.id === "figma") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 02  /  KALMAN MOT & OCCLUSION TETHERING", 54, 146);
        const imgX = 54, imgY = 176, imgW = 404, imgH = 260;
        s.fillStyle = "rgba(18, 20, 23, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "Independent 4D Kalman filters with cosine velocity penalties and leader-follower occlusion tethering, reducing identity switches by over 80% during dynamic shuffles.", 54, 510, 38, 22, 5);
      } else if (n === 1 && e.id === "cursor") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  MULTI-MODAL SEMANTIC PIPELINE TOPOLOGY", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(23, 25, 20, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "End-to-end multi-modal ETL: Deep layout detection with Docling v2, parallel Vision Language Model diagram transcription on Groq LPUs, and calibrated 70/30 hybrid vector retrieval with Cross-Encoder reranking.", 54, 460, 38, 22, 5);
      } else if (n === 1 && e.id === "claude-code") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  CONVNEXT-TINY ARCHITECTURE & GRAD-CAM", 54, 146);
        if (typeof customClaudeDiagramImg !== "undefined" && customClaudeDiagramImg && customClaudeDiagramImg.naturalWidth > 0) {
          const imgW = 404;
          const imgH = Math.round((imgW / customClaudeDiagramImg.naturalWidth) * customClaudeDiagramImg.naturalHeight);
          s.drawImage(customClaudeDiagramImg, 54, 180, imgW, imgH);
        }
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "Fine-grained feline vision pipeline: ImageNet transfer learning on Oxford-IIIT Pet dataset, aggressive regularization pass, and Grad-CAM spatial attribution.", 54, 460, 38, 22, 5);
      } else if (n === 1 && e.id === "antigravity") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  GRAPH-BASED WAREHOUSE ENGINE TOPOLOGY", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(11, 25, 83, 0.88)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.globalAlpha = 0.52;
        s.font = '400 15px "Iowan Old Style", Georgia, serif';
        de(s, "RoboFlow warehouse engine: 20x20 discrete floor grid, Dijkstra robot routing with obstacle avoidance, Prim infrastructure cabling, and DAG task dependency ordering.", 54, 460, 38, 22, 5);
      }

      // 2. RIGHT PAGES (Full Narrative Chapters)
      if (n === 0) {
        // Title Page (Spread 1)
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2.3px";
        s.fillText(e.discipline.toUpperCase(), 54, 174);
        s.font = e.title.length > 10 ? '400 44px "Iowan Old Style", Georgia, serif' : '400 52px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, e.title, 52, 246, 18, 54, 2);
        s.globalAlpha = 0.55;
        s.font = '400 18px "Iowan Old Style", Georgia, serif';
        de(s, e.note || e.deck, 54, 430, 36, 26, 5);
      } else if (n === 2) {
        // Chapter 01
        const title = e.id === "codex" ? "The Two-Tier Router" : (e.id === "xcode" ? "Clean Architecture & RBAC" : (e.id === "figma" ? "Architecture & Waving" : (e.id === "cursor" ? "Multi-Modal Ingestion" : (e.id === "claude-code" ? "Architecture Benchmarks" : (e.id === "antigravity" ? "Academic Origin & Grid Model" : (e.chapters?.[0]?.title || "Chapter 01"))))));
        const sub = e.id === "codex" ? "50ms FastEmbed Reflexes & Dynamic Tool RAG" : (e.id === "xcode" ? "Decoupled Express 5 Services & JWT" : (e.id === "figma" ? "7-DoF Cobot & WebSocket Teleoperation" : (e.id === "cursor" ? "Layout-Aware Parsing & Async HTTP 202" : (e.id === "claude-code" ? "ConvNeXt-tiny vs. ResNet50 & EfficientNet-B2" : (e.id === "antigravity" ? "Graph-Theoretic Warehouse Modeling at FH Campus Wien" : (e.chapters?.[0]?.subtitle || e.deck || ""))))));
        const body = e.id === "codex" ? "Sub-50ms spinal reflexes for instant hardware safety and PC routines, paired with in-memory FAISS candidate vector injection for local LLM routing." : (e.id === "xcode" ? "Strict 3-tier architecture isolating Express routing, domain business logic, and PostgreSQL data access with stateless JWT and RBAC guards." : (e.id === "figma" ? "Bridges a Node.js web GUI with the 7-DoF Sawyer cobot via rosbridge_suite WebSockets. A hierarchical Design Tree enforces safe baseline postures, 5-cycle continuous wave loops, and linear Cartesian waypoints." : (e.id === "cursor" ? "Docling v2 with RapidOCR at 1.5x scale preserves markdown grid tables and visual asset routes, paired with non-blocking HTTP 202 job queues and deterministic MD5 content hashing." : (e.id === "claude-code" ? "Systematic 5-epoch baseline comparison on Oxford-IIIT Pet dataset. ConvNeXt-tiny achieved 95.42% accuracy, outperforming ResNet50 (90.00%) and EfficientNet-B2 (90.00%) via ViT-inspired depthwise kernels." : (e.id === "antigravity" ? "Developed as an academic project at FH Campus Wien to investigate, implement, and benchmark graph-theory algorithms for autonomous warehouse logistics over a discrete 20x20 floor grid." : e.note)))));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 01", 54, 166);
        s.font = '400 38px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 44, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 17px "Iowan Old Style", Georgia, serif';
        de(s, body, 54, 440, 38, 24, 6);
      } else if (n === 4) {
        // Chapter 02
        const title = e.id === "codex" ? "Hardware Safety Guards" : (e.id === "xcode" ? "GIS Mapping & Live Chat" : (e.id === "figma" ? "Vision & Detection Benchmark" : (e.id === "cursor" ? "Stream Concurrency" : (e.id === "claude-code" ? "Iterative Regularization" : (e.id === "antigravity" ? "The Three Graph Algorithms" : (e.chapters?.[1]?.title || "Chapter 02"))))));
        const sub = e.id === "codex" ? "Sub-Packet Interception & Anti-Dump Guard" : (e.id === "xcode" ? "Interactive Leaflet Pins & Capacity Gating" : (e.id === "figma" ? "YOLOv8 vs Classical HSV Color Filtering" : (e.id === "cursor" ? "Adaptive Backpressure & Redis JobStore" : (e.id === "claude-code" ? "Overfitting Mitigation & Generalization Pass" : (e.id === "antigravity" ? "Dijkstra Routing, Prim MST & DFS Topological Sort" : (e.chapters?.[1]?.subtitle || e.deck || ""))))));
        const body = e.id === "codex" ? "Direct 33Hz method interception inside PyCozmo packet loops. Multi-modal sensor fusion combining cliff IR flags, IMU pitch tilt (>20°), true deceleration, and OpenCV optical flow visual stasis." : (e.id === "xcode" ? "Synchronizes Vienna-wide event clusters on Leaflet.js with interactive search cards using bidirectional panning, atomic registration, and polling chat." : (e.id === "figma" ? "Rigorous empirical comparison between YOLOv8 deep learning (96% static accuracy) and OpenCV HSV thresholding (100% detection, zero latency), demonstrating that low latency is paramount in fast visual servoing." : (e.id === "cursor" ? "FastAPI async semaphores throttle LPU requests, pull-based token bucket rate limiting prevents worker OOM crashes, and multi-model fallback chains eliminate 429 rate-limit downtime." : (e.id === "claude-code" ? "Iterated on ConvNeXt-tiny with weight decay (5e-2), dropout (0.4), label smoothing (0.1), and random erasing (p=0.2), boosting validation accuracy to 96.67% and weighted F1 to 0.9666." : (e.id === "antigravity" ? "Integrates Dijkstra's algorithm with priority queues for dynamic shortest-path navigation, Prim's Minimum Spanning Tree for optimal facility cabling costs, and DFS Topological Sort with 3-color node classification for deadlock-free task scheduling." : e.deck)))));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 02", 54, 166);
        s.font = '400 36px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 42, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 17px "Iowan Old Style", Georgia, serif';
        de(s, body, 54, 440, 38, 24, 6);
      } else if (n === 6) {
        // Chapter 03
        const title = e.id === "codex" ? "Dual Memory & Voice" : (e.id === "xcode" ? "PostgreSQL & Cron Outbox" : (e.id === "figma" ? "Kalman MOT & Tethering" : (e.id === "cursor" ? "Semantic Chunking & VLMs" : (e.id === "claude-code" ? "Explainability & Grad-CAM" : (e.id === "antigravity" ? "Architecture & Strategy Pattern" : (e.chapters?.[2]?.title || "Chapter 03"))))));
        const sub = e.id === "codex" ? "PostgresSaver & Kokoro-ONNX Stream" : (e.id === "xcode" ? "7-Entity Schema & Ticket Daemon" : (e.id === "figma" ? "Momentum Vectors & Hungarian Assignment" : (e.id === "cursor" ? "Structural Breakpoints & Qwen-27B" : (e.id === "claude-code" ? "Spatial Attention & Facial Localization" : (e.id === "antigravity" ? "Domain Models, Strategy Interfaces & Service Layer" : (e.chapters?.[2]?.subtitle || e.deck || ""))))));
        const body = e.id === "codex" ? "PostgresSaver session state with rolling summarization, native PostgreSQL REAL[] array store with 0.82 cosine similarity deduplication, and zero-disk Kokoro-ONNX voice streaming." : (e.id === "xcode" ? "A normalized 7-table schema with foreign-key cascades, array types (tags TEXT[]), and cron-driven 1-hour ticket dispatch via Nodemailer." : (e.id === "figma" ? "Independent 4D Kalman filters ([x,y,dx,dy]) with cosine velocity penalties and dynamic occlusion tethering (80px threshold), slashing Identity Switch rates from 50% down to under 10%." : (e.id === "cursor" ? "Groups text by DOM elements and triggers instant boundaries on section headers (>300 chars) with element-level overlap (N >= 1) to eliminate table fracturing and sentence truncation." : (e.id === "claude-code" ? "Grad-CAM heatmaps consistently localize to the head and facial structures, confirming the network learns genuine morphological cues rather than background correlations." : (e.id === "antigravity" ? "Strict separation of concerns: domain models represent pure data, algorithms are encapsulated via ShortestPathStrategy, MinimumSpanningTreeStrategy, and TopologicalSortStrategy interfaces, and 4 dedicated services orchestrate business logic." : e.note)))));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 03", 54, 166);
        s.font = '400 36px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 42, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 17px "Iowan Old Style", Georgia, serif';
        de(s, body, 54, 440, 38, 24, 6);
      } else if (n === 8) {
        // Chapter 04
        const title = e.id === "codex" ? "Deterministic Sandbox & Tools" : (e.id === "xcode" ? "Geocoding & Calendar Sync" : (e.id === "figma" ? "MoveIt & Gazebo Twin" : (e.id === "cursor" ? "Hybrid Search & Reranking" : (e.id === "claude-code" ? "Fine-Grained Insights" : (e.id === "antigravity" ? "Simulation & Deadlock Safety" : (e.chapters?.[3]?.title || "Chapter 04"))))));
        const sub = e.id === "codex" ? "Isolated Python Subprocess & Tavily Tools" : (e.id === "xcode" ? "Photon Spatial API & RFC 5545 iCal" : (e.id === "figma" ? "S-Curve Shuffling & RRT-Connect Planning" : (e.id === "cursor" ? "70/30 Dense-Lexical Fusion & Groq LPU" : (e.id === "claude-code" ? "Confusion Analysis & Key Takeaways" : (e.id === "antigravity" ? "Real-Time 20x20 Grid & Dependency Verification" : (e.chapters?.[3]?.subtitle || e.deck || ""))))));
        const body = e.id === "codex" ? "Deterministic code execution in an isolated Python sandbox with 8.0s hard timeouts, Tavily Model Context Protocol integration via stdio, and OpenCV HSV autonomous charger docking." : (e.id === "xcode" ? "Offloads address coordinate resolution to Photon API asynchronously, paired with zero-dependency client-side RFC 5545 iCal generation." : (e.id === "figma" ? "Gazebo digital twin with S-curve velocity profiles and 0.16m radial arc separation. MoveIt RRT-Connect planner generates collision-free hover trajectories in ~1.0s with Intera quaternion pose stabilization." : (e.id === "cursor" ? "Combines cosine dense embeddings (70%) with exact lexical tokens (30%) and Groq GPT-OSS-120B Cross-Encoder reranking over expanded candidate pools (K = max(2k, 16)), doubling top-1 precision." : (e.id === "claude-code" ? "Near-clean separation across 12 breeds. Ragdoll vs. Birman remains the persistent confusion pair across all models due to genuine biological similarity. Proved architecture choice and regularization trump parameter count." : (e.id === "antigravity" ? "Operators interactively place obstacles, robots, charging stations, and drop zones. The system provides real-time path rerouting upon obstacle placement and flags cyclic dependency deadlocks with visual alert dialogs prior to robot dispatch." : e.note)))));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 04", 54, 166);
        s.font = '400 36px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 42, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 17px "Iowan Old Style", Georgia, serif';
        de(s, body, 54, 440, 38, 24, 6);
      } else if (n === 10) {
        // Colophon & Spec Page
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("COLOPHON & SPECIFICATIONS", 54, 164);
        s.font = '400 28px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        s.fillText(e.title, 54, 230);
        s.globalAlpha = 0.58;
        s.font = '400 16px "Iowan Old Style", Georgia, serif';
        de(s, \`\${e.binding}. \${e.format}.\`, 54, 306, 44, 26, 7);
        s.globalAlpha = 0.74;
        s.font = '500 10px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1.8px";
        s.fillText(\`SPECIMEN \${e.roman} / \${e.seed}     ENGINEERING EDITION\`, 54, 676);
      }

      s.globalAlpha = 0.25;
      s.fillRect(48, d - 48, i - 96, 1);
      s.globalAlpha = 1;

      const texture = Q(new l.CanvasTexture(c), { anisotropy: 2 });
      texture.name = \`\${e.id}-interior-page-\${n + 1}\`;
      return texture;
    });
  };\n`;

  return code.slice(0, pnStartIdx) + newPnFunction + code.slice(erStartIdx);
}