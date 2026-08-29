// scripts/modules/enginePatches.mjs
// Universal on-demand WebGL rendering loop, DPR clamping, OrbitControls wake listener, and camera framing.

export function applyEnginePatches(rawCode) {
  let code = rawCode;

  // 1. Fix any double semicolon-comma issue
  code = code.replace(/;\s*,\s*z\.enabled/g, '; z.enabled');

  // 2. Clamp powerPreference from "high-performance" to "default" to protect discrete GPUs
  code = code.replace('powerPreference: "high-performance"', 'powerPreference: "default"');

  // 3. Set setPixelRatio to native high-density DPR (max 2.0 for Retina/HiDPI sharpness)
  code = code.replace(
    /D\.setPixelRatio\(Math\.min\(window\.devicePixelRatio \|\| 1, [^)]+\)\)/g,
    'D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0))'
  );

  // 4. Add Motion Frames keeper, __wake helper, and heroDrag at top of fa()
  if (!code.includes('const heroDrag = {')) {
    code = code.replace(
      'function fa(Nr, m, He = {}) {',
      'function fa(Nr, m, He = {}) {\n  let __motionFrames = 60;\n  const __wake = (frames = 60) => { __motionFrames = Math.max(__motionFrames, frames); U(); };\n  const heroDrag = { active: false, pointerId: null, startX: 0, startY: 0, lastX: 0, lastY: 0, lastTime: 0, velocityX: 0, hasDragged: false, isVerticalScroll: false, dragDistance: 0, startV: 0 };\n'
    );
  }

  // 5. Update the render loop $n to universally sleep across EVERY 3D state (0 FPS Idle)
  const loopRegex = /const a = Math\.abs\(oe - V\) > 5e-4 \|\| Ne > 0;\s*[\s\S]*?!Ae && U\(\);/;
  const replacementLoop = `const a = Math.abs(oe - V) > 5e-4 || Ne > 0;
    const shouldKeepRendering = (__motionFrames > 0) || b === "opening" || b === "closing" || a || r || (p && p.active) || (typeof Ne !== "undefined" && Ne > 0) || (typeof te !== "undefined" && te < 1 && te > 0) || (typeof ft !== "undefined" && ft);
    if (__motionFrames > 0) __motionFrames--;
    shouldKeepRendering && !Ae && U();`;

  if (loopRegex.test(code)) {
    code = code.replace(loopRegex, replacementLoop);
  }

  // 6. Connect all interaction and transition triggers to __wake()
  if (code.includes('function ve(e, o = !0) {') && !code.includes('__wake(75);')) {
    code = code.replace('function ve(e, o = !0) {', 'function ve(e, o = !0) { __wake(75);');
  }
  if (code.includes('function ze(e) {') && !code.includes('function ze(e) { __wake(75);')) {
    code = code.replace('function ze(e) {', 'function ze(e) { __wake(75);');
  }
  if (code.includes('function so() {') && !code.includes('function so() { __wake(75);')) {
    code = code.replace('function so() {', 'function so() { __wake(75);');
  }
  if (code.includes('function Lr() {') && !code.includes('function Lr() { __wake(60);')) {
    code = code.replace('function Lr() {', 'function Lr() { __wake(60);');
  }
  if (code.includes('function xe(e) {') && !code.includes('function xe(e) { __wake(75);')) {
    code = code.replace('function xe(e) {', 'function xe(e) { __wake(75);');
  }
  if (code.includes('function Ie(e, o = !1) {') && !code.includes('function Ie(e, o = !1) { __wake(60);')) {
    code = code.replace('function Ie(e, o = !1) {', 'function Ie(e, o = !1) { __wake(60);');
  }
  if (code.includes('function mr(e) {') && !code.includes('function mr(e) { __wake(45);')) {
    code = code.replace('function mr(e) {', 'function mr(e) { __wake(45);');
  }

  // 6b. Connect dr(e) to hero dragging
  code = code.replace(
    /function dr\(e\)\s*\{[\s\S]*?(?=function fr\(e\))/,
    `function dr(e) { __wake(45);
    if (b === "hero" && (e.button === 0 || e.pointerType === "touch")) {
      De(e);
      heroDrag.active = true;
      heroDrag.pointerId = e.pointerId;
      heroDrag.startX = e.clientX;
      heroDrag.startY = e.clientY;
      heroDrag.lastX = e.clientX;
      heroDrag.lastY = e.clientY;
      heroDrag.lastTime = performance.now();
      heroDrag.velocityX = 0;
      heroDrag.hasDragged = false;
      heroDrag.isVerticalScroll = false;
      heroDrag.dragDistance = 0;
      heroDrag.startV = V;
      __wake(60);
      return;
    }
    b !== "detail" || K || e.button !== 0 || e.isPrimary === !1 || (De(e), M.allowClick = !1, lr() && (M.active = !0, M.pointerId = e.pointerId, M.startX = e.clientX, M.startY = e.clientY, M.moved = !1));
  }\n  `
  );

  // 6c. Connect fr(e) to hero dragging with smart vertical vs horizontal scroll detection
  code = code.replace(
    /function fr\(e\)\s*\{[\s\S]*?(?=function ke\(e\))/,
    `function fr(e) { __wake(45);
    if (heroDrag.active && e.pointerId === heroDrag.pointerId && b === "hero") {
      if (heroDrag.isVerticalScroll) return;

      const deltaX = e.clientX - heroDrag.lastX;
      const totalDeltaX = e.clientX - heroDrag.startX;
      const totalDeltaY = e.clientY - heroDrag.startY;
      const absX = Math.abs(totalDeltaX);
      const absY = Math.abs(totalDeltaY);
      const now = performance.now();
      const dt = Math.max(1, now - heroDrag.lastTime);

      if (!heroDrag.hasDragged) {
        if (absY > absX && absY > 7) {
          heroDrag.isVerticalScroll = true;
          heroDrag.active = false;
          return;
        }
        if (absX > absY && absX > 7) {
          heroDrag.hasDragged = true;
          m.setPointerCapture?.(e.pointerId);
        }
      }

      if (heroDrag.hasDragged) {
        if (e.cancelable) e.preventDefault();
        // Dragging left (negative deltaX) increases V (moves carousel to the right)
        // Dragging right (positive deltaX) decreases V (moves carousel to the left)
        const step = -deltaX / 360;
        V += step;
        heroDrag.velocityX = -deltaX / dt;
        heroDrag.dragDistance += Math.abs(deltaX);
        Ne = 0.18;
        __wake(60);
        U();
      }

      heroDrag.lastX = e.clientX;
      heroDrag.lastY = e.clientY;
      heroDrag.lastTime = now;
      return;
    }
    !M.active || e.pointerId !== M.pointerId || Math.hypot(
      e.clientX - M.startX,
      e.clientY - M.startY
    ) > 16 && (M.moved = !0);
  }\n  `
  );

  // 6d. Connect ke(e) to hero drag release & snapping
  code = code.replace(
    /function ke\(e\)\s*\{[\s\S]*?(?=function hr\(e\))/,
    `function ke(e) {
    if (heroDrag.active && e.pointerId === heroDrag.pointerId && b === "hero") {
      if (heroDrag.hasDragged) {
        let flick = 0;
        if (Math.abs(heroDrag.velocityX) > 0.3) {
          flick = Math.sign(heroDrag.velocityX) * Math.min(1.2, Math.abs(heroDrag.velocityX) * 0.4);
        }
        V = Math.round(V + flick);
        Ne = 0.25;
        __wake(90);
        U();
      }
      heroDrag.active = false;
      heroDrag.isVerticalScroll = false;
      heroDrag.pointerId = null;
      if (m.hasPointerCapture?.(e.pointerId)) {
        m.releasePointerCapture(e.pointerId);
      }
      return;
    }
    !M.active || e.pointerId !== M.pointerId || (M.allowClick = e.type === "pointerup" && !M.moved, M.active = !1, M.pointerId = null);
  }\n  `
  );

  // 6e. Connect yr(e) (click) to prevent book opening if user was dragging
  code = code.replace(
    /function yr\(e\)\s*\{[\s\S]*?(?=function vr\(e\))/,
    `function yr(e) {
    if (heroDrag.hasDragged || heroDrag.dragDistance > 8) {
      heroDrag.hasDragged = false;
      heroDrag.dragDistance = 0;
      return;
    }
    if (b === "detail" && !K && e.button === 0) {
      if (!M.allowClick || (M.allowClick = !1, De(e), !lr())) return;
      e.preventDefault(), ve(!0);
      return;
    }
    if (b !== "hero" || e.button !== 0) return;
    De(e);
    const o = sr();
    o < 0 || (e.preventDefault(), ar(o, m), xe(m));
  }\n  `
  );
  if (code.includes('z = new na(L, m), z.enabled = !1')) {
    code = code.replace(
      'z = new na(L, m), z.enabled = !1',
      'z = new na(L, m); z.addEventListener("change", () => __wake(30)); z.enabled = !1'
    );
  }

  // 7. Wheel handler: Allow vertical page scrolling, while horizontal drags shelf
  if (code.includes('function vr(e) {')) {
    code = code.replace(
      /function vr\(e\)\s*\{[\s\S]*?V \+= A\(o \* 22e-4, -0\.72, 0\.72\), Ne = 0\.14, U\(\);\s*\}/,
      `function vr(e) {
    if (b !== "hero") return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 1.5;
    if (isHorizontal) {
      e.preventDefault();
      V += A(e.deltaX * 22e-4, -0.72, 0.72);
      Ne = 0.14;
      __wake(45);
      U();
    }
  }`
    );
  }

  // 10. Update Bookshelf volumes array S (Figma at Vol II, Claude Code at Vol V, MOKA at Vol I, JoinApp at Vol VII)
  const sStartIdx = code.indexOf('const S = [');
  const sEndIdx = code.indexOf('  ],', sStartIdx);
  if (sStartIdx !== -1 && sEndIdx !== -1) {
    const newSBlock = `const S = [
    {
      id: "codex",
      title: "MOKA",
      roman: "I",
      discipline: "AI assistant",
      note: "Two-tier cognitive hierarchy: 45ms reflexes & LangGraph brain.",
      deck: "An AI-powered robotic assistant built around the Anki Cozmo robot. Features a dual-layer cognitive pipeline: Layer 1 fast semantic reflexes (50ms) for hardware safety and laptop automation, and Layer 2 dynamic LangGraph AI brain with FAISS Tool RAG, local Ollama LLMs, and persistent dual-tier PostgreSQL memory.",
      binding: "Ultramarine cloth · copper foil",
      format: "148 × 216 mm · imagined edition",
      theme: "Codex · intent into implementation",
      motif: "Nested brackets",
      motifKey: "brackets",
      paletteLabel: "Ultramarine · bone · copper",
      color: "#182a43",
      foil: "#F0EBE3",
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
      width: 1.02,
      height: 1.58,
      depth: 0.26,
      chapters: ["Intent", "Repository atlas", "Proof"],
      seed: 11
    },
    {
      id: "figma",
      title: "Figma",
      roman: "II",
      discipline: "Collaborative form",
      note: "Components, conversations, and systems in common.",
      deck: "A modular reader on designing in Figma: move from loose frames to shared components, invite critique into the canvas, and leave behind a system others can extend.",
      binding: "Obsidian cloth · crimson foil",
      format: "150 × 220 mm · FH Campus Wien Edition",
      theme: "Figma · a shared visual language",
      motif: "Connected modules",
      motifKey: "modules",
      paletteLabel: "Obsidian · charcoal · crimson",
      color: "#121417",
      foil: "#860d0d",
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
      width: 1,
      height: 1.48,
      depth: 0.3,
      chapters: ["Token Architecture", "Accessible Matrix", "Multi-Platform Runtimes"],
      seed: 55
    },
    {
      id: "cursor",
      title: "Semantic-ETL-Pipeline",
      roman: "III",
      discipline: "Directed editing",
      note: "A fast line between the thought and the file.",
      deck: "A compact handbook for editing with Cursor: navigate living codebases quickly, keep the active context close, and change the right surface without disturbing the rest.",
      binding: "Citron cloth · black gloss foil",
      format: "140 × 210 mm · imagined edition",
      theme: "Cursor · navigation with momentum",
      motif: "Directional caret",
      motifKey: "caret",
      paletteLabel: "Citron · ink · off-white",
      color: "#afc400",
      foil: "#171a16",
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
      width: 0.92,
      height: 1.52,
      depth: 0.22,
      chapters: ["Navigation", "Selection", "Momentum"],
      seed: 33
    },
    {
      id: "antigravity",
      title: "Antigravity",
      roman: "IV",
      discipline: "Spatial systems",
      note: "Ideas released from the flatness of the page.",
      deck: "A speculative atlas for Antigravity’s spatial way of working: let agents move across tools, make complex structures visible, and understand the system through motion.",
      binding: "Cobalt cloth · cool-silver foil",
      format: "162 × 240 mm · imagined edition",
      theme: "Antigravity · structure in motion",
      motif: "Suspended orbits",
      motifKey: "orbits",
      paletteLabel: "Cobalt · sky · silver",
      color: "#1537a1",
      foil: "#dbe8f1",
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
      width: 1.08,
      height: 1.68,
      depth: 0.25,
      chapters: ["System map", "Tool orbit", "Spatial proof"],
      seed: 44
    },
    {
      id: "claude-code",
      title: "Claude Code",
      roman: "V",
      discipline: "Contextual reasoning",
      note: "Long context, held with deliberation and care.",
      deck: "An annotated volume on Claude Code’s context-first practice: read the project, reason across files, preserve the surrounding work, and make every intervention explainable.",
      binding: "Burnt-orange cloth · antique-gold foil",
      format: "156 × 228 mm · imagined edition",
      theme: "Claude Code · context before intervention",
      motif: "Interlaced paths",
      motifKey: "paths",
      paletteLabel: "Burnt orange · cream · burgundy",
      color: "#c24d24",
      foil: "#efc16d",
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
      width: 1.1,
      height: 1.46,
      depth: 0.29,
      chapters: ["Context", "Deliberation", "Intervention"],
      seed: 22
    },
    {
      id: "xcode",
      title: "JoinApp",
      roman: "VI",
      discipline: "Full-Stack Web Systems",
      note: "Hyperlocal event coordination with 3-tier architecture & transactional outbox.",
      deck: "A modern full-stack web platform engineering hyperlocal event discovery, atomic participation lifecycles, and automated transactional dispatch across Vienna's metropolitan districts.",
      binding: "Violet cloth · neon lime foil",
      format: "158 × 232 mm · FH Campus Wien Edition",
      theme: "JoinApp · blueprint into living form",
      motif: "Drafting compass",
      motifKey: "compass",
      paletteLabel: "Violet · neon lime · slate",
      color: "#6830D1",
      accent: "#a3e635",
      foil: "#a3e635",
      ribbon: "#a3e635",
      palette: {
        paper: "#1a0b36",
        paperDeep: "#100624",
        paperPale: "#f5f3ff",
        ink: "#ffffff",
        inkSoft: "#a3e635",
        wall: "#1a0b36",
        shelf: "#160b29",
        shelfDark: "#0d061a",
        light: "#c4b5fd",
        fill: "#6830D1"
      },
      width: 0.98,
      height: 1.58,
      depth: 0.28,
      chapters: ["Clean Architecture & RBAC", "Hyperlocal GIS & Chat", "PostgreSQL & Cron Dispatch", "Async Geocoding & iCal"],
      seed: 77
    }
  ]`;
    code = code.slice(0, sStartIdx) + newSBlock + code.slice(sEndIdx + 3);
  }

  // 11. Update Gr atlas mapping (swap Gr[1] with Gr[4] for Figma and Claude Code textures)
  const grStartIdx = code.indexOf(', Gr = [');
  const grEndIdx = code.indexOf('], nt = new Image', grStartIdx);
  if (grStartIdx !== -1 && grEndIdx !== -1) {
    const newGrBlock = `, Gr = [
    [0, 0, 512, 768],
    [2048, 0, 512, 768],
    [1024, 0, 512, 768],
    [1536, 0, 512, 768],
    [512, 0, 512, 768],
    [3072, 0, 512, 768]
  ]`;
    code = code.slice(0, grStartIdx) + newGrBlock + code.slice(grEndIdx + 1);
  }

  // 12. Enable all 6 page sheets to use printed leaf textures (q < 6)
  code = code.replace(
    'const q = 5 - Z, ot = q < 4 ? Ct[q * 2] : re, ra = q < 4 ? Ct[q * 2 + 1] : re',
    'const q = 5 - Z, ot = q < 6 ? Ct[q * 2] : re, ra = q < 6 ? Ct[q * 2 + 1] : re'
  );

  // 13. Ensure so() closes the book reliably from both detail and opening states
  code = code.replace(
    'b === "detail" && (Ke(), Te(), b = "closing"',
    '(b === "detail" || b === "opening") && (Ke(), Te(), b = "closing"'
  );

  // 14. Perfectly balanced 5-book shelf view (fade out the 6th book beyond distance 2)
  code = code.replace(
    'const F = A((n - 2.55) / 0.7, 0, 1), N = 1 - Ze(F);',
    'const F = A((n - 2.02) / 0.45, 0, 1), N = 1 - Ze(F);'
  );
  code = code.replace(
    't.contactShadow.visible = !0, t.contactShadow.material.opacity = t.opacity * 0.24, t.hit.visible = t.opacity > 0.12;',
    't.root.visible = t.opacity > 0.005, t.contactShadow.visible = t.opacity > 0.005, t.contactShadow.material.opacity = t.opacity * 0.24, t.hit.visible = t.opacity > 0.12;'
  );

  return code;
}
