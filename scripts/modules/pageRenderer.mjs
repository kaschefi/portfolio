// scripts/modules/pageRenderer.mjs
// Interior 12-page spreads (Pn) for Three.js Bookshelf.

export function applyPagePatches(code) {
  const pnStartIdx = code.indexOf('function Pn(e) {');
  const erStartIdx = code.indexOf('function er() {');

  if (pnStartIdx === -1 || erStartIdx === -1) {
    return code;
  }

  const newPnFunction = `function Pn(e) {
    const r = \`#\${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}\`;
    return Array.from({ length: 12 }, (a, n) => {
      const c = document.createElement("canvas"), i = 512, d = 768;
      c.width = 384, c.height = 576;
      const s = c.getContext("2d");
      s.scale(0.75, 0.75);
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

      // 1. LEFT PAGES (n = 1, 3, 5, 7, 9, 11): Clean parchment or plate illustrations
      if (n === 1 && e.id === "codex") {
        // Spread 2 Left Page: PLATE 01 / ROUTER BENCHMARK
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  LANGSMITH ROUTER BENCHMARK", 54, 146);

        if (typeof customBenchmarkImg !== "undefined" && customBenchmarkImg && (customBenchmarkImg.complete || customBenchmarkImg.naturalWidth > 0)) {
          const imgW = 404;
          const imgH = Math.round((imgW / (customBenchmarkImg.naturalWidth || 404)) * (customBenchmarkImg.naturalHeight || 200));
          const imgX = 54;
          const imgY = 190;

          s.fillStyle = "rgba(10, 14, 20, 0.92)";
          s.fillRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);
          s.strokeStyle = "rgba(200, 112, 70, 0.45)";
          s.lineWidth = 1;
          s.strokeRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);

          s.drawImage(customBenchmarkImg, imgX, imgY, imgW, imgH);
        }

        s.globalAlpha = 0.52;
        s.font = '400 16px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, "57-case benchmark evaluation: Monolithic LLM baseline (A) vs MoKa Two-Layer Router (B). 93.0% routing accuracy, 83% token reduction, and ~45ms P50 latency.", 54, 460, 40, 22, 5);

        s.globalAlpha = 0.2;
        s.fillRect(48, d - 48, i - 96, 1);
        s.globalAlpha = 1;
        const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
        x.name = \`\${e.id}-interior-page-\${n + 1}\`;
        return x;
      }

      if (n === 1 && e.id === "figma") {
        // Spread 2 Left Page: PLATE 01 / VISION DETECTION & BENCHMARK
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  VISION DETECTION & BENCHMARK", 54, 146);

        // Procedural Obsidian / Crimson Benchmark Diagram
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(18, 20, 23, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.strokeStyle = "rgba(239, 176, 170, 0.4)";
        s.lineWidth = 1.2;
        s.strokeRect(imgX, imgY, imgW, imgH);

        // Grid lines
        s.strokeStyle = "rgba(239, 176, 170, 0.08)";
        s.lineWidth = 0.8;
        for (let gx = imgX + 40; gx < imgX + imgW; gx += 40) {
          s.beginPath(); s.moveTo(gx, imgY); s.lineTo(gx, imgY + imgH); s.stroke();
        }
        for (let gy = imgY + 30; gy < imgY + imgH; gy += 30) {
          s.beginPath(); s.moveTo(imgX, gy); s.lineTo(imgX + imgW, gy); s.stroke();
        }

        // Method 1: OpenCV HSV Color Filtering
        s.fillStyle = "#22262c";
        s.fillRect(imgX + 16, imgY + 24, 114, 150);
        s.strokeStyle = "#4ade80";
        s.lineWidth = 1.2;
        s.strokeRect(imgX + 16, imgY + 24, 114, 150);
        s.fillStyle = "#4ade80";
        s.font = '700 11px Inter, sans-serif';
        s.textAlign = "center";
        s.fillText("OpenCV HSV", imgX + 73, imgY + 48);
        s.fillStyle = "#efb0aa";
        s.font = '500 10px Inter, sans-serif';
        s.fillText("Acc: 100%", imgX + 73, imgY + 74);
        s.fillText("Lat: < 1 ms", imgX + 73, imgY + 96);
        s.fillStyle = "#4ade80";
        s.font = '700 11px Inter, sans-serif';
        s.fillText("Track: 9/10 (90%)", imgX + 73, imgY + 130);
        s.fillText("✓ Chosen", imgX + 73, imgY + 152);

        // Method 2: YOLOv8 Deep Learning
        s.fillStyle = "#22262c";
        s.fillRect(imgX + 144, imgY + 24, 114, 150);
        s.strokeStyle = "#f87171";
        s.lineWidth = 1.2;
        s.strokeRect(imgX + 144, imgY + 24, 114, 150);
        s.fillStyle = "#f87171";
        s.font = '700 11px Inter, sans-serif';
        s.fillText("YOLOv8 CNN", imgX + 201, imgY + 48);
        s.fillStyle = "#efb0aa";
        s.font = '500 10px Inter, sans-serif';
        s.fillText("Static: 96%", imgX + 201, imgY + 74);
        s.fillText("Lat: ~30 ms", imgX + 201, imgY + 96);
        s.fillStyle = "#f87171";
        s.font = '700 11px Inter, sans-serif';
        s.fillText("Track: 6/10 (60%)", imgX + 201, imgY + 130);
        s.fillText("⚠ Latency Lag", imgX + 201, imgY + 152);

        // Method 3: ArUco Markers
        s.fillStyle = "#22262c";
        s.fillRect(imgX + 272, imgY + 24, 116, 150);
        s.strokeStyle = "#60a5fa";
        s.lineWidth = 1.2;
        s.strokeRect(imgX + 272, imgY + 24, 116, 150);
        s.fillStyle = "#60a5fa";
        s.font = '700 11px Inter, sans-serif';
        s.fillText("ArUco Fiducial", imgX + 330, imgY + 48);
        s.fillStyle = "#efb0aa";
        s.font = '500 10px Inter, sans-serif';
        s.fillText("6D Pose Est.", imgX + 330, imgY + 74);
        s.fillText("Ground Truth", imgX + 330, imgY + 96);
        s.fillStyle = "#60a5fa";
        s.font = '700 11px Inter, sans-serif';
        s.fillText("Calibration", imgX + 330, imgY + 130);
        s.fillText("✓ Verified", imgX + 330, imgY + 152);

        // Lower annotation
        s.textAlign = "left";
        s.fillStyle = "#efb0aa";
        s.font = '500 10px Inter, sans-serif';
        s.fillText("ROBOFLOW RED SOLO CUPS  ·  OPENCV HSV  ·  NEAR-ZERO LATENCY", imgX + 16, imgY + 225);

        s.globalAlpha = 0.52;
        s.font = '400 16px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, "Empirical benchmark between classical HSV thresholding and YOLOv8 deep neural networks. Sub-millisecond HSV execution eliminates inference latency, ensuring reliable 90% closed-loop dynamic tracking.", 54, 460, 40, 22, 5);

        s.globalAlpha = 0.2;
        s.fillRect(48, d - 48, i - 96, 1);
        s.globalAlpha = 1;
        const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
        x.name = \`\${e.id}-interior-page-\${n + 1}\`;
        return x;
      }

      if (n === 3 && e.id === "codex") {
        // Spread 3 Left Page: PLATE 02 / PHYSICAL ROBOTIC CHASSIS
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 02  /  PHYSICAL ROBOTIC CHASSIS", 54, 146);

        if (typeof customCozmoSketchImg !== "undefined" && customCozmoSketchImg && (customCozmoSketchImg.complete || customCozmoSketchImg.naturalWidth > 0)) {
          const imgW = 404;
          const imgH = Math.round((imgW / (customCozmoSketchImg.naturalWidth || 404)) * (customCozmoSketchImg.naturalHeight || 200));
          const imgX = 54;
          const imgY = 176;

          s.fillStyle = "rgba(242, 238, 230, 0.95)";
          s.fillRect(imgX - 4, imgY - 4, imgW + 8, imgH + 8);
          s.strokeStyle = "rgba(200, 112, 70, 0.4)";
          s.lineWidth = 1;
          s.strokeRect(imgX - 4, imgY - 4, imgW + 8, imgH + 8);

          s.drawImage(customCozmoSketchImg, imgX, imgY, imgW, imgH);
        }

        s.globalAlpha = 0.52;
        s.font = '400 16px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, "Mechanical dimension schematics and sensor topology of the Anki Cozmo embodied chassis: drop IR array, 3-axis IMU pitch tilt monitor, and 33Hz packet safety interceptors.", 54, 510, 40, 22, 5);

        s.globalAlpha = 0.2;
        s.fillRect(48, d - 48, i - 96, 1);
        s.globalAlpha = 1;
        const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
        x.name = \`\${e.id}-interior-page-\${n + 1}\`;
        return x;
      }

      if (n === 3 && e.id === "figma") {
        // Spread 3 Left Page: PLATE 02 / KALMAN MOT & OCCLUSION TETHERING
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 02  /  KALMAN MOT & OCCLUSION TETHERING", 54, 146);

        // Procedural MOT Architecture Diagram (Obsidian / Crimson)
        const imgX = 54, imgY = 176, imgW = 404, imgH = 260;
        s.fillStyle = "rgba(18, 20, 23, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
        s.strokeStyle = "rgba(239, 176, 170, 0.35)";
        s.lineWidth = 1.2;
        s.strokeRect(imgX, imgY, imgW, imgH);

        // Tracking Features List
        const features = [
          { label: "Kalman State", req: "[x, y, dx, dy] 4D Vector", actual: "0.85 Decay" },
          { label: "Data Association", req: "Hungarian Algorithm", actual: "Cosine Sim" },
          { label: "Occlusion Logic", req: "80px Overlap Threshold", actual: "Tethering" },
          { label: "Identity Switch Rate", req: "Baseline ~50%", actual: "< 10% (Pass)" }
        ];

        features.forEach((b, bIdx) => {
          const by = imgY + 25 + bIdx * 52;
          s.fillStyle = "rgba(34, 38, 44, 0.85)";
          s.fillRect(imgX + 16, by, imgW - 32, 42);
          s.strokeStyle = "rgba(239, 176, 170, 0.25)";
          s.lineWidth = 1;
          s.strokeRect(imgX + 16, by, imgW - 32, 42);

          s.textAlign = "left";
          s.fillStyle = "#efb0aa";
          s.font = '600 12px Inter, sans-serif';
          s.fillText(b.label, imgX + 26, by + 26);

          s.fillStyle = "#a8a29e";
          s.font = '500 11px Inter, sans-serif';
          s.fillText(b.req, imgX + 160, by + 26);

          s.fillStyle = "#ffd1bc";
          s.font = '700 12px Inter, sans-serif';
          s.fillText(b.actual, imgX + 300, by + 26);
        });

        s.globalAlpha = 0.52;
        s.font = '400 16px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, "Independent 4D Kalman filters with cosine velocity penalties and leader-follower occlusion tethering, reducing identity switches by over 80% during dynamic shuffles.", 54, 510, 40, 22, 5);

        s.globalAlpha = 0.2;
        s.fillRect(48, d - 48, i - 96, 1);
        s.globalAlpha = 1;
        const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
        x.name = \`\${e.id}-interior-page-\${n + 1}\`;
        return x;
      }

      if (n === 1 || n === 3 || n === 5 || n === 7 || n === 9 || n === 11) {
        s.globalAlpha = 0.2;
        s.fillRect(48, d - 48, i - 96, 1);
        s.globalAlpha = 1;
        const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
        x.name = \`\${e.id}-interior-page-\${n + 1}\`;
        return x;
      }

      // 2. RIGHT PAGES (n = 0, 2, 4, 6, 8, 10): Clean, readable chapter text
      if (n === 0) {
        // Title Page (Spread 1)
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2.3px";
        s.fillText(e.discipline.toUpperCase(), 54, 174);
        s.font = \`400 \${e.title.length > 10 ? 48 : 58}px "Iowan Old Style", Baskerville, Georgia, serif\`;
        s.letterSpacing = "0px";
        de(s, e.title, 52, 246, 18, 58, 2);
        s.globalAlpha = 0.55;
        s.font = '400 20px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, e.note || e.deck, 54, 430, 36, 28, 5);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      } else if (n === 2) {
        // Chapter 01
        const title = e.id === "codex" ? "The Two-Tier Router" : (e.id === "xcode" ? "Clean Architecture & RBAC" : (e.id === "figma" ? "Architecture & Waving" : (e.chapters?.[0] || "Chapter 01")));
        const sub = e.id === "codex" ? "50ms FastEmbed Reflexes & Dynamic Tool RAG" : (e.id === "xcode" ? "Decoupled Express 5 Services & JWT" : (e.id === "figma" ? "7-DoF Cobot & WebSocket Teleoperation" : (e.deck || "")));
        const body = e.id === "codex" ? "Sub-50ms spinal reflexes for instant hardware safety and PC routines, paired with in-memory FAISS candidate vector injection for local LLM routing." : (e.id === "xcode" ? "Strict 3-tier architecture isolating Express routing, domain business logic, and PostgreSQL data access with stateless JWT and RBAC guards." : (e.id === "figma" ? "Bridges a Node.js web GUI with the 7-DoF Sawyer cobot via rosbridge_suite WebSockets. A hierarchical Design Tree enforces safe baseline postures, 5-cycle continuous wave loops, and linear Cartesian waypoints." : e.note));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 01", 54, 166);
        s.font = '400 42px "Iowan Old Style", Baskerville, Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 48, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 18px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, body, 54, 440, 38, 26, 6);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      } else if (n === 4) {
        // Chapter 02
        const title = e.id === "codex" ? "Hardware Safety Guards" : (e.id === "xcode" ? "GIS Mapping & Live Chat" : (e.id === "figma" ? "Vision & Detection Benchmark" : (e.chapters?.[1] || "Chapter 02")));
        const sub = e.id === "codex" ? "Sub-Packet Interception & Anti-Dump Guard" : (e.id === "xcode" ? "Interactive Leaflet Pins & Capacity Gating" : (e.id === "figma" ? "YOLOv8 vs Classical HSV Color Filtering" : (e.deck || "")));
        const body = e.id === "codex" ? "Direct 33Hz method interception inside PyCozmo packet loops. Multi-modal sensor fusion combining cliff IR flags, IMU pitch tilt (>20°), true deceleration, and OpenCV optical flow visual stasis." : (e.id === "xcode" ? "Synchronizes Vienna-wide event clusters on Leaflet.js with interactive search cards using bidirectional panning, atomic registration, and polling chat." : (e.id === "figma" ? "Rigorous empirical comparison between YOLOv8 deep learning (96% static accuracy) and OpenCV HSV thresholding (100% detection, zero latency), demonstrating that low latency is paramount in fast visual servoing." : e.deck));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 02", 54, 166);
        s.font = '400 40px "Iowan Old Style", Baskerville, Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 46, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 18px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, body, 54, 440, 38, 26, 6);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      } else if (n === 6) {
        // Chapter 03
        const title = e.id === "codex" ? "Dual Memory & Voice" : (e.id === "xcode" ? "PostgreSQL & Cron Outbox" : (e.id === "figma" ? "Kalman MOT & Tethering" : (e.chapters?.[2] || "Chapter 03")));
        const sub = e.id === "codex" ? "PostgresSaver & Kokoro-ONNX Stream" : (e.id === "xcode" ? "7-Entity Schema & Ticket Daemon" : (e.id === "figma" ? "Momentum Vectors & Hungarian Assignment" : (e.deck || "")));
        const body = e.id === "codex" ? "PostgresSaver session state with rolling summarization, native PostgreSQL REAL[] array store with 0.82 cosine similarity deduplication, and zero-disk Kokoro-ONNX voice streaming." : (e.id === "xcode" ? "A normalized 7-table schema with foreign-key cascades, array types (tags TEXT[]), and cron-driven 1-hour ticket dispatch via Nodemailer." : (e.id === "figma" ? "Independent 4D Kalman filters ([x,y,dx,dy]) with cosine velocity penalties and dynamic occlusion tethering (80px threshold), slashing Identity Switch rates from 50% down to under 10%." : e.note));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 03", 54, 166);
        s.font = '400 40px "Iowan Old Style", Baskerville, Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 46, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 18px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, body, 54, 440, 38, 26, 6);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      } else if (n === 8) {
        // Chapter 04
        const title = e.id === "codex" ? "Deterministic Sandbox & Tools" : (e.id === "xcode" ? "Geocoding & Calendar Sync" : (e.id === "figma" ? "MoveIt & Gazebo Twin" : (e.chapters?.[3] || "Chapter 04")));
        const sub = e.id === "codex" ? "Isolated Python Subprocess & Tavily Tools" : (e.id === "xcode" ? "Photon Spatial API & RFC 5545 iCal" : (e.id === "figma" ? "S-Curve Shuffling & RRT-Connect Planning" : (e.deck || "")));
        const body = e.id === "codex" ? "Deterministic code execution in an isolated Python sandbox with 8.0s hard timeouts, Tavily Model Context Protocol integration via stdio, and OpenCV HSV autonomous charger docking." : (e.id === "xcode" ? "Offloads address coordinate resolution to Photon API asynchronously, paired with zero-dependency client-side RFC 5545 iCal generation." : (e.id === "figma" ? "Gazebo digital twin with S-curve velocity profiles and 0.16m radial arc separation. MoveIt RRT-Connect planner generates collision-free hover trajectories in ~1.0s with Intera quaternion pose stabilization." : e.note));
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("CHAPTER 04", 54, 166);
        s.font = '400 38px "Iowan Old Style", Baskerville, Georgia, serif';
        s.letterSpacing = "0px";
        de(s, title, 52, 236, 18, 44, 3);
        s.globalAlpha = 0.6;
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1px";
        de(s, sub, 54, 380, 38, 20, 2);
        s.globalAlpha = 0.48;
        s.font = '400 18px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, body, 54, 440, 38, 26, 6);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      } else if (n === 10) {
        // Colophon & Spec Page
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("COLOPHON & SPECIFICATIONS", 54, 164);
        s.font = '400 32px "Iowan Old Style", Baskerville, Georgia, serif';
        s.letterSpacing = "0px";
        s.fillText(e.title, 54, 230);
        s.globalAlpha = 0.58;
        s.font = '400 18px "Iowan Old Style", Baskerville, Georgia, serif';
        de(s, \`\${e.binding}. \${e.format}.\`, 54, 306, 44, 28, 7);
        s.globalAlpha = 0.74;
        s.font = '500 10px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "1.8px";
        s.fillText(\`SPECIMEN \${e.roman} / \${e.seed}  ·  ENGINEERING EDITION\`, 54, 676);
        s.globalAlpha = 0.25;
        s.fillRect(48, d - 48, i - 96, 1);
      }

      const x = Q(new l.CanvasTexture(c), { anisotropy: 16 });
      x.name = \`\${e.id}-interior-page-\${n + 1}\`;
      return x;
    });
  }
  `;

  return code.slice(0, pnStartIdx) + newPnFunction + code.slice(erStartIdx);
}
