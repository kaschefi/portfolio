import fs from 'fs';
import path from 'path';

const filePath = path.resolve('node_modules/@designcodeio/threeui/lib-dist/shaders/bookshelf/bookshelfRenderer.js');

if (!fs.existsSync(filePath)) {
  console.error('bookshelfRenderer.js not found at:', filePath);
  process.exit(1);
}

// 1. Read MOKA OLED eyes icon as Base64 data URI
let mokaDataUri = '';
const mokaCandidates = [
  path.resolve('public/moka_icon.png'),
  path.resolve('public/moka-icon.png'),
  path.resolve('public/antigravity_icon.png'),
  path.resolve('src/assets/antigravity_icon.png')
];
for (const p of mokaCandidates) {
  if (fs.existsSync(p)) {
    const mokaBase64 = fs.readFileSync(p).toString('base64');
    mokaDataUri = `data:image/png;base64,${mokaBase64}`;
    break;
  }
}

// 2. Read router benchmark image as Base64 data URI
const benchPath = path.resolve('public/router_benchmark.png');
let benchDataUri = '';
if (fs.existsSync(benchPath)) {
  const benchBase64 = fs.readFileSync(benchPath).toString('base64');
  benchDataUri = `data:image/png;base64,${benchBase64}`;
}

// 3. Read Cozmo hardware sketch image as Base64 data URI
const cozmoSketchPath = path.resolve('public/cozmo_hardware_sketch.png');
let cozmoSketchDataUri = '';
if (fs.existsSync(cozmoSketchPath)) {
  const cozmoSketchBase64 = fs.readFileSync(cozmoSketchPath).toString('base64');
  cozmoSketchDataUri = `data:image/png;base64,${cozmoSketchBase64}`;
}

// 4. Read JoinApp cover image as Base64 PNG data URI
const joinAppCandidates = [
  path.resolve('src/assets/joinapp.png'),
  path.resolve('public/joinapp.png'),
  path.resolve('src/assets/joinapp.jpg'),
  path.resolve('public/joinapp.jpg')
];
let joinAppDataUri = '';
for (const p of joinAppCandidates) {
  if (fs.existsSync(p)) {
    const isPng = p.endsWith('.png');
    const joinAppBase64 = fs.readFileSync(p).toString('base64');
    joinAppDataUri = `data:image/${isPng ? 'png' : 'jpeg'};base64,${joinAppBase64}`;
    break;
  }
}

let code = fs.readFileSync(filePath, 'utf8');

// Fix any double semicolon-comma issue
code = code.replace(/;\s*,\s*z\.enabled/g, '; z.enabled');

// 1. Change powerPreference from "high-performance" to "default"
code = code.replace('powerPreference: "high-performance"', 'powerPreference: "default"');

// 2. Clamp setPixelRatio to max 1.0
code = code.replace(
  /D\.setPixelRatio\(Math\.min\(window\.devicePixelRatio \|\| 1, [^)]+\)\)/g,
  'D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0))'
);

// 3. Add Motion Frames keeper and __wake helper at the top of fa() renderer function
if (!code.includes('let __motionFrames = 60;')) {
  code = code.replace(
    'function fa(Nr, m, He = {}) {',
    'function fa(Nr, m, He = {}) {\n  let __motionFrames = 60;\n  const __wake = (frames = 60) => { __motionFrames = Math.max(__motionFrames, frames); U(); };\n'
  );
}

// 4. Update the render loop $n to universally sleep across EVERY 3D state
const loopRegex = /const a = Math\.abs\(oe - V\) > 5e-4 \|\| Ne > 0;\s*[\s\S]*?!Ae && U\(\);/;
const replacementLoop = `const a = Math.abs(oe - V) > 5e-4 || Ne > 0;
    const shouldKeepRendering = (__motionFrames > 0) || b === "opening" || b === "closing" || a || r || (p && p.active) || (typeof Ne !== "undefined" && Ne > 0) || (typeof te !== "undefined" && te < 1 && te > 0) || (typeof ft !== "undefined" && ft);
    if (__motionFrames > 0) __motionFrames--;
    shouldKeepRendering && !Ae && U();`;

if (loopRegex.test(code)) {
  code = code.replace(loopRegex, replacementLoop);
}

// 5. Connect all interaction and transition triggers to __wake()
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
if (code.includes('function dr(e) {') && !code.includes('function dr(e) { __wake(45);')) {
  code = code.replace('function dr(e) {', 'function dr(e) { __wake(45);');
}
if (code.includes('function fr(e) {') && !code.includes('function fr(e) { __wake(45);')) {
  code = code.replace('function fr(e) {', 'function fr(e) { __wake(45);');
}
if (code.includes('z = new na(L, m), z.enabled = !1')) {
  code = code.replace(
    'z = new na(L, m), z.enabled = !1',
    'z = new na(L, m); z.addEventListener("change", () => __wake(30)); z.enabled = !1'
  );
}

// 6. Camera Framing: Center camera on open book spread (both pages visible)
const orFnIdx = code.indexOf('function or() {');
const orFnEnd = code.indexOf('\n  }', orFnIdx) + 4;
if (orFnIdx !== -1) {
  const newOrFn = `function or() {
    const e = G < 820;
    // Hero shelf camera (Le) and look-at (le)
    Le.set(0, e ? 2.02 : 1.92, e ? 8.7 : 8.1);
    le.set(0, e ? 1.57 : 1.55, 0);
    // Book position in detail mode (Fe): shifted left to make room for the HUD panel
    Fe.set(e ? 0 : -0.30, e ? 2.3 : 1.56, e ? 0.15 : 0);
    // Open-spread camera (ht): tracks the book's x position
    ht.set(e ? 0 : -0.30, e ? 2.46 : 1.78, e ? 5.7 : 5.55);
    // Look-at for open spread: centered on the book spine
    Je.set(e ? 0 : -0.30, e ? 2.18 : 1.62, 0);
    if (e) {
      Ye = 0; Ge = G;
      return;
    }
    Ye = Math.round(G * 0.22);
    Ge = G * 0.56;
  }`;
  code = code.slice(0, orFnIdx) + newOrFn + code.slice(orFnEnd);
}

// 6b. Patch xr(e) — the open-book animation — to apply a moderate viewport offset (8% of screen width)
code = code.replace(
  'se = ue($o, 0, o), Pe(), L.lookAt(ce);',
  'se = ue($o, G * 0.08, o), Pe(), L.lookAt(ce);'
);

// 7. Update wheel handler vr(e): Allow vertical scrolling to naturally scroll down the website, while horizontal scrolling moves the shelf
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

// 8. Update Codex book title, subtitle, note, and chapters for MOKA
code = code.replace(/title:\s*"Codex"/g, 'title: "MOKA"');
code = code.replace(/title:\s*"codex"/g, 'title: "MOKA"');
code = code.replace(/discipline:\s*"Agentic craft"/g, 'discipline: "AI assistant"');
code = code.replace(/discipline:\s*"agentic craft"/g, 'discipline: "AI assistant"');
code = code.replace('foil: "#c87046"', 'foil: "#F0EBE3"');
code = code.replace('Precise intent, translated into tested systems.', 'Two-tier cognitive hierarchy: 45ms reflexes & LangGraph brain.');
code = code.replace('A field manual for delegating repository work to Codex: state the intent, let the agent trace the system, and treat tests and browser proof as part of the craft.', 'An AI-powered robotic assistant built around the Anki Cozmo robot. Features a dual-layer cognitive pipeline: Layer 1 fast semantic reflexes (50ms) for hardware safety and laptop automation, and Layer 2 dynamic LangGraph AI brain with FAISS Tool RAG, local Ollama LLMs, and persistent dual-tier PostgreSQL memory.');

// 8b. Robustly update Volume 7 (JoinApp) internal 3D scene room colors and foil color to electric lime #a3e635
code = code.replace(
  /id:\s*"xcode"[\s\S]*?seed:\s*77/,
  `id: "xcode",
      title: "JoinApp",
      roman: "VII",
      discipline: "Full-Stack Web Systems",
      note: "Hyperlocal event coordination with 3-tier architecture & transactional outbox.",
      deck: "A modern full-stack web platform engineering hyperlocal event discovery, atomic participation lifecycles, and automated transactional dispatch across Vienna's metropolitan districts.",
      binding: "Royal purple cloth · neon lime foil",
      format: "158 × 232 mm · FH Campus Wien Edition",
      theme: "JoinApp · blueprint into living form",
      motif: "Drafting compass",
      motifKey: "compass",
      paletteLabel: "Royal purple · neon lime · slate",
      color: "#7c3aed",
      foil: "#a3e635",
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
      width: 1.12,
      height: 1.63,
      depth: 0.28,
      chapters: ["Clean Architecture & RBAC", "Hyperlocal GIS & Chat", "PostgreSQL & Cron Dispatch", "Async Geocoding & iCal"],
      seed: 77`
);

// 9. Embed MOKA Icon / Benchmark Image / JoinApp data URIs directly if available
code = code.replace(/const customMokaIcon =[\s\S]*?;\s*}/g, '');
code = code.replace(/const customBenchmarkImg =[\s\S]*?;\s*}/g, '');
code = code.replace(/const customCozmoSketchImg =[\s\S]*?;\s*}/g, '');
code = code.replace(/const customJoinAppImg =[\s\S]*?;\s*}/g, '');

let customImgDeclarations = '';
if (mokaDataUri) {
  customImgDeclarations += `const customMokaIcon = typeof Image !== "undefined" ? new Image() : null;\n  if (customMokaIcon) { customMokaIcon.src = "${mokaDataUri}"; }\n`;
}
if (benchDataUri) {
  customImgDeclarations += `const customBenchmarkImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customBenchmarkImg) { customBenchmarkImg.src = "${benchDataUri}"; }\n`;
}
if (cozmoSketchDataUri) {
  customImgDeclarations += `const customCozmoSketchImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customCozmoSketchImg) { customCozmoSketchImg.src = "${cozmoSketchDataUri}"; }\n`;
}
if (joinAppDataUri) {
  customImgDeclarations += `const customJoinAppImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customJoinAppImg) { customJoinAppImg.src = "${joinAppDataUri}"; }\n`;
}

if (customImgDeclarations) {
  code = code.replace('let qt = !1;', `let qt = !1;\n  ${customImgDeclarations.trim()}`);
}

// 10. Replace wn(e) and Cn(e) with authentic dynamic cloth & foil rendering for MOKA and JoinApp
const wnStartIdx = code.indexOf('function wn(e) {');
const anStartIdx = code.indexOf('function An(e)');

if (wnStartIdx !== -1 && anStartIdx !== -1) {
  const newWnFunction = `function wn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d");

    // Custom MOKA book (Book 0) background cloth & front cover
    if (e.id === "codex") {
      const r = ye(pe(e.id) + e.seed);
      t.fillStyle = e.color;
      t.fillRect(0, 0, o.width, o.height);
      const a = t.createLinearGradient(0, 0, o.width, 0);
      a.addColorStop(0, "rgba(0,0,0,0.32)");
      a.addColorStop(0.06, "rgba(0,0,0,0.08)");
      a.addColorStop(0.12, "rgba(255,255,255,0.04)");
      a.addColorStop(0.96, "rgba(0,0,0,0)");
      a.addColorStop(1, "rgba(0,0,0,0.32)");
      t.fillStyle = a;
      t.fillRect(0, 0, o.width, o.height);

      for (let c = 0; c < 1250; c += 1) {
        const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
        t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.024)" : "rgba(0,0,0,0.025)";
        t.lineWidth = 0.6 + r() * 0.8;
        t.beginPath();
        t.moveTo(i, d);
        t.lineTo(i + s, d + (r() - 0.5) * 2);
        t.stroke();
      }

      // Spine crease line
      t.fillStyle = "rgba(0,0,0,0.4)";
      t.fillRect(44, 0, 3, o.height);
      t.fillStyle = "rgba(255,255,255,0.08)";
      t.fillRect(47, 0, 1, o.height);

      // Top Volume tag
      t.fillStyle = e.foil || "#F0EBE3";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  01", 64, 88);

      t.strokeStyle = e.foil || "#F0EBE3";
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      for (let y = 110; y <= 210; y += 14) {
        t.beginPath();
        t.arc(o.width / 2, y, 1.8, 0, Math.PI * 2);
        t.fill();
      }

      // Center glowing OLED robot eyes visor
      const drawMokaVisor = () => {
        if (typeof customMokaIcon !== "undefined" && customMokaIcon && (customMokaIcon.complete || customMokaIcon.naturalWidth > 0)) {
          const iconW = 440;
          const iconH = Math.round((iconW / (customMokaIcon.naturalWidth || 440)) * (customMokaIcon.naturalHeight || 240));
          const iconX = (o.width - iconW) / 2;
          const iconY = 460 - iconH / 2;
          t.drawImage(customMokaIcon, iconX, iconY, iconW, iconH);
        } else {
          // Instant vector OLED eyes
          const cx = o.width / 2;
          const cy = 460;
          t.save();
          t.fillStyle = "#070b12";
          t.strokeStyle = "rgba(56, 189, 248, 0.4)";
          t.lineWidth = 2;
          t.beginPath();
          t.roundRect ? t.roundRect(cx - 160, cy - 70, 320, 140, 24) : t.rect(cx - 160, cy - 70, 320, 140);
          t.fill();
          t.stroke();

          t.fillStyle = "#38bdf8";
          t.shadowColor = "#00e5ff";
          t.shadowBlur = 18;
          t.beginPath();
          t.roundRect ? t.roundRect(cx - 110, cy - 35, 80, 70, 12) : t.rect(cx - 110, cy - 35, 80, 70);
          t.fill();

          t.beginPath();
          t.roundRect ? t.roundRect(cx + 30, cy - 35, 80, 70, 12) : t.rect(cx + 30, cy - 35, 80, 70);
          t.fill();
          t.restore();
        }
      };

      drawMokaVisor();

      for (let y = 690; y <= 820; y += 16) {
        t.beginPath();
        t.arc(o.width / 2, y, 2, 0, Math.PI * 2);
        t.fill();
      }

      t.font = '600 90px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = "4px";
      t.fillStyle = e.foil || "#F0EBE3";
      t.fillText("MOKA", 74, 980);

      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "AI ASSISTANT", 78, 1024);

      // Bookmark ribbon at bottom
      t.fillStyle = e.accent || "#c87046";
      t.fillRect(130, o.height - 12, 16, 12);

      const texture = Q(new l.CanvasTexture(o), { anisotropy: 16 });
      texture.name = \`\${e.id}-cover-front\`;

      if (typeof customMokaIcon !== "undefined" && customMokaIcon && !customMokaIcon.complete) {
        customMokaIcon.onload = () => {
          drawMokaVisor();
          texture.needsUpdate = true;
          __wake(30);
        };
      }

      return texture;
    }

    // Custom Volume 7 (JoinApp: White "Join" + Lime "App") front cover
    if (e.id === "xcode") {
      const r = ye(pe(e.id) + e.seed);
      t.fillStyle = e.color || "#7c3aed";
      t.fillRect(0, 0, o.width, o.height);
      const a = t.createLinearGradient(0, 0, o.width, 0);
      a.addColorStop(0, "rgba(0,0,0,0.36)");
      a.addColorStop(0.06, "rgba(0,0,0,0.08)");
      a.addColorStop(0.12, "rgba(255,255,255,0.05)");
      a.addColorStop(0.96, "rgba(0,0,0,0)");
      a.addColorStop(1, "rgba(0,0,0,0.32)");
      t.fillStyle = a;
      t.fillRect(0, 0, o.width, o.height);

      for (let c = 0; c < 1250; c += 1) {
        const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
        t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.035)";
        t.lineWidth = 0.6 + r() * 0.8;
        t.beginPath();
        t.moveTo(i, d);
        t.lineTo(i + s, d + (r() - 0.5) * 2);
        t.stroke();
      }

      // Spine crease line
      t.fillStyle = "rgba(0,0,0,0.42)";
      t.fillRect(44, 0, 3, o.height);
      t.fillStyle = "rgba(255,255,255,0.12)";
      t.fillRect(47, 0, 1, o.height);

      // Top Volume tag (Lime)
      t.fillStyle = "#a3e635";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  07", 64, 88);

      t.strokeStyle = "#a3e635";
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      // JoinApp Center Artwork (from transparent joinapp.png)
      const cx = o.width / 2;
      const cy = 470;
      const imgSize = 480;

      const drawJoinAppCenterArtwork = () => {
        if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && (customJoinAppImg.complete || customJoinAppImg.naturalWidth > 0)) {
          t.save();
          t.drawImage(customJoinAppImg, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
          t.restore();
        }
      };

      drawJoinAppCenterArtwork();

      // Two-color title: White "Join" + Lime "App"
      const startX = 74;
      const titleY = 980;
      t.font = '800 86px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";

      t.fillStyle = "#ffffff";
      t.fillText("Join", startX, titleY);
      const joinWidth = t.measureText("Join").width;

      t.fillStyle = "#a3e635";
      t.fillText("App", startX + joinWidth, titleY);

      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillStyle = "#a3e635";
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "FULL-STACK", 78, 1024);

      // Bookmark ribbon at bottom (Lime accent)
      t.fillStyle = "#a3e635";
      t.fillRect(130, o.height - 12, 16, 12);

      const texture = Q(new l.CanvasTexture(o), { anisotropy: 16 });
      texture.name = \`\${e.id}-cover-front\`;

      if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && !customJoinAppImg.complete) {
        customJoinAppImg.onload = () => {
          drawJoinAppCenterArtwork();
          texture.needsUpdate = true;
          __wake(30);
        };
      }

      return texture;
    }

    // Authentic ThreeUI Cover Atlas for Volumes 2 - 6 (Claude Code, Cursor, Antigravity, Figma, Framer)
    if (qt) {
      const [c, i, d, s] = Gr[S.indexOf(e)];
      t.drawImage(
        nt,
        c,
        i,
        d,
        s,
        0,
        0,
        o.width,
        o.height
      );
      const h = t.createLinearGradient(0, 0, o.width, 0);
      h.addColorStop(0, "rgba(0,0,0,0.16)");
      h.addColorStop(0.055, "rgba(255,255,255,0.015)");
      h.addColorStop(0.93, "rgba(255,255,255,0)");
      h.addColorStop(1, "rgba(0,0,0,0.1)");
      t.fillStyle = h;
      t.fillRect(0, 0, o.width, o.height);
      const texture = Q(new l.CanvasTexture(o));
      texture.name = \`\${e.id}-cover-front\`;
      return texture;
    }

    // Fallback procedural cloth if atlas is not yet ready
    const r = ye(pe(e.id) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.24)"), a.addColorStop(0.075, "rgba(255,255,255,0.035)"), a.addColorStop(0.5, "rgba(255,255,255,0.01)"), a.addColorStop(0.94, "rgba(0,0,0,0.06)"), a.addColorStop(1, "rgba(0,0,0,0.19)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    for (let c = 0; c < 1250; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
      t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.024)" : "rgba(0,0,0,0.025)", t.lineWidth = 0.6 + r() * 0.8, t.beginPath(), t.moveTo(i, d), t.lineTo(i + s, d + (r() - 0.5) * 2), t.stroke();
    }
    t.strokeStyle = e.foil, t.globalAlpha = 0.72, t.lineWidth = 2, t.strokeRect(42, 42, o.width - 84, o.height - 84), t.strokeRect(55, 55, o.width - 110, o.height - 110), t.globalAlpha = 1;
    $t(t, e, o.width, o.height);
    t.fillStyle = e.foil, t.textAlign = "center", t.textBaseline = "middle", t.font = '500 18px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "4px", t.fillText(\`WORKING VOLUMES  /  \${e.roman}\`, o.width / 2, 92);
    const n = e.title.length > 10 ? 72 : 88;
    return t.font = \`400 \${n}px "Iowan Old Style", Baskerville, Georgia, serif\`, t.fillText(e.title, o.width / 2, o.height * 0.72), t.font = '500 16px Inter, "Helvetica Neue", Arial, sans-serif', t.fillText(e.discipline.toUpperCase(), o.width / 2, o.height * 0.79), Q(new l.CanvasTexture(o));
  }
  function Cn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d"), r = S.indexOf(e) + 1;
    t.clearRect(0, 0, o.width, o.height);
    t.fillStyle = "#ffffff";
    t.strokeStyle = "#ffffff";

    // Custom MOKA Foil Layer
    if (e.id === "codex") {
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  01", 64, 88);

      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      for (let y = 110; y <= 210; y += 14) {
        t.beginPath();
        t.arc(o.width / 2, y, 1.8, 0, Math.PI * 2);
        t.fill();
      }

      for (let y = 690; y <= 820; y += 16) {
        t.beginPath();
        t.arc(o.width / 2, y, 2, 0, Math.PI * 2);
        t.fill();
      }

      t.font = '600 90px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = "4px";
      t.fillText("MOKA", 74, 980);

      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillText("AI ASSISTANT", 78, 1024);

      return Q(new l.CanvasTexture(o));
    }

    // Custom Volume 7 Foil Layer (JoinApp: White "Join" + Lime "App")
    if (e.id === "xcode") {
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.fillStyle = "#a3e635";
      t.strokeStyle = "#a3e635";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  07", 64, 88);

      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();



      // Foil title: White "Join" + Lime "App"
      const startX = 74;
      const titleY = 980;
      t.font = '800 86px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";

      t.fillStyle = "#ffffff";
      t.fillText("Join", startX, titleY);
      const joinWidth = t.measureText("Join").width;

      t.fillStyle = "#a3e635";
      t.fillText("App", startX + joinWidth, titleY);

      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillStyle = "#a3e635";
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "FULL-STACK", 78, 1024);

      return Q(new l.CanvasTexture(o));
    }

    // Authentic ThreeUI foil layer for Volumes 2 - 6
    t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '500 15px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "2.8px", t.fillText(\`WORKING VOLUMES  /  \${ge(r)}\`, 58, 70), t.globalAlpha = 0.7, t.lineWidth = 1, t.beginPath(), t.moveTo(58, 86), t.lineTo(164, 86), t.stroke(), t.globalAlpha = 1;
    const a = e.title.length > 10 ? 64 : 78;
    return t.font = \`400 \${a}px "Iowan Old Style", Baskerville, Georgia, serif\`, t.fillText(e.title, 58, 1020), t.font = '500 14px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "2.4px", t.fillText(e.discipline.toUpperCase(), 60, 1066), Q(new l.CanvasTexture(o));
  }
  `;
  
  code = code.slice(0, wnStartIdx) + newWnFunction + code.slice(anStartIdx);
}

// 11. Replace ONLY Pn(e) leaf pages (strictly from 'function Pn(e) {' to 'function er() {')
const pnStartIdx = code.indexOf('function Pn(e) {');
const erStartIdx = code.indexOf('function er() {');

if (pnStartIdx !== -1 && erStartIdx !== -1) {
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
        const title = e.id === "codex" ? "The Two-Tier Router" : (e.id === "xcode" ? "Clean Architecture & RBAC" : (e.chapters?.[0] || "Chapter 01"));
        const sub = e.id === "codex" ? "50ms FastEmbed Reflexes & Dynamic Tool RAG" : (e.id === "xcode" ? "Decoupled Express 5 Services & JWT" : (e.deck || ""));
        const body = e.id === "codex" ? "Sub-50ms spinal reflexes for instant hardware safety and PC routines, paired with in-memory FAISS candidate vector injection for local LLM routing." : (e.id === "xcode" ? "Strict 3-tier architecture isolating Express routing, domain business logic, and PostgreSQL data access with stateless JWT and RBAC guards." : e.note);
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
        const title = e.id === "codex" ? "Hardware Safety Guards" : (e.id === "xcode" ? "GIS Mapping & Live Chat" : (e.chapters?.[1] || "Chapter 02"));
        const sub = e.id === "codex" ? "Sub-Packet Interception & Anti-Dump Guard" : (e.id === "xcode" ? "Interactive Leaflet Pins & Capacity Gating" : (e.deck || ""));
        const body = e.id === "codex" ? "Direct 33Hz method interception inside PyCozmo packet loops. Multi-modal sensor fusion combining cliff IR flags, IMU pitch tilt (>20°), true deceleration, and OpenCV optical flow visual stasis." : (e.id === "xcode" ? "Synchronizes Vienna-wide event clusters on Leaflet.js with interactive search cards using bidirectional panning, atomic registration, and polling chat." : e.deck);
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
        const title = e.id === "codex" ? "Dual Memory & Voice" : (e.id === "xcode" ? "PostgreSQL & Cron Outbox" : (e.chapters?.[2] || "Chapter 03"));
        const sub = e.id === "codex" ? "PostgresSaver & Kokoro-ONNX Stream" : (e.id === "xcode" ? "7-Entity Schema & Ticket Daemon" : (e.deck || ""));
        const body = e.id === "codex" ? "PostgresSaver session state with rolling summarization, native PostgreSQL REAL[] array store with 0.82 cosine similarity deduplication, and zero-disk Kokoro-ONNX voice streaming." : (e.id === "xcode" ? "A normalized 7-table schema with foreign-key cascades, array types (tags TEXT[]), and cron-driven 1-hour ticket dispatch via Nodemailer." : e.note);
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
        const title = e.id === "codex" ? "Deterministic Sandbox & Tools" : (e.id === "xcode" ? "Geocoding & Calendar Sync" : (e.chapters?.[3] || "Chapter 04"));
        const sub = e.id === "codex" ? "Isolated Python Subprocess & Tavily Tools" : (e.id === "xcode" ? "Photon Spatial API & RFC 5545 iCal" : (e.deck || ""));
        const body = e.id === "codex" ? "Deterministic code execution in an isolated Python sandbox with 8.0s hard timeouts, Tavily Model Context Protocol integration via stdio, and OpenCV HSV autonomous charger docking." : (e.id === "xcode" ? "Offloads address coordinate resolution to Photon API asynchronously, paired with zero-dependency client-side RFC 5545 iCal generation." : e.note);
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
  code = code.slice(0, pnStartIdx) + newPnFunction + code.slice(erStartIdx);
}

// 12. Enable all 6 page sheets to use printed leaf textures (q < 6 instead of q < 4)
code = code.replace(
  'const q = 5 - Z, ot = q < 4 ? Ct[q * 2] : re, ra = q < 4 ? Ct[q * 2 + 1] : re',
  'const q = 5 - Z, ot = q < 6 ? Ct[q * 2] : re, ra = q < 6 ? Ct[q * 2 + 1] : re'
);

// 13. Patch Spine foil Kn(e) to draw in e.foil for Volume 7 and MOKA instead of static white
code = code.replace(
  /function Kn\(e\)\s*\{[\s\S]*?Q\(new l\.CanvasTexture\(o\)\);\s*\}/,
  `function Kn(e) {
    const o = document.createElement("canvas");
    o.width = 384, o.height = 1536;
    const t = o.getContext("2d");
    const foilColor = (e.id === "xcode" || e.id === "codex") ? (e.foil || "#a3e635") : "#ffffff";
    t.clearRect(0, 0, o.width, o.height);
    t.fillStyle = foilColor;
    t.strokeStyle = foilColor;
    t.lineWidth = 2.4;
    t.strokeRect(34, 38, o.width - 68, o.height - 76);
    t.textAlign = "center";
    t.textBaseline = "middle";
    t.font = '500 24px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "5px";
    t.fillText(e.roman, o.width * 0.5, 118);
    t.save();
    t.translate(o.width * 0.5, o.height * 0.5);
    t.rotate(Math.PI / 2);

    if (e.id === "xcode") {
      t.font = '800 68px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      t.textAlign = "left";
      const joinW = t.measureText("Join").width;
      const appW = t.measureText("App").width;
      const totalW = joinW + appW;
      const startX = -totalW / 2;

      t.fillStyle = "#ffffff";
      t.fillText("Join", startX, 0);

      t.fillStyle = "#a3e635";
      t.fillText("App", startX + joinW, 0);
    } else {
      t.font = \`400 \${e.title.length > 10 ? 58 : 68}px "Iowan Old Style", Baskerville, Georgia, serif\`;
      t.letterSpacing = "0px";
      t.fillText(e.title, 0, 0);
    }
    t.restore();
    t.beginPath();
    t.arc(o.width * 0.5, o.height - 120, 24, 0, Math.PI * 2);
    t.stroke();
    t.beginPath();
    t.moveTo(o.width * 0.5 - 24, o.height - 120);
    t.lineTo(o.width * 0.5 + 24, o.height - 120);
    t.stroke();
    return Q(new l.CanvasTexture(o));
  }`
);

// 14. Patch Back foil Mn(e) to draw in e.foil for Volume 7 and MOKA instead of static white
code = code.replace(
  /function Mn\(e\)\s*\{[\s\S]*?Q\(new l\.CanvasTexture\(o\)\);\s*\}/,
  `function Mn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d");
    const foilColor = (e.id === "xcode" || e.id === "codex") ? (e.foil || "#a3e635") : "#ffffff";
    t.clearRect(0, 0, o.width, o.height);
    t.fillStyle = foilColor;
    t.strokeStyle = foilColor;
    t.textAlign = "left";
    t.textBaseline = "alphabetic";
    t.font = '500 16px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "3px";
    t.fillText(\`WORKING VOLUMES  /  \${e.roman}\`, 68, 82);
    t.globalAlpha = 0.72;
    t.fillRect(68, 108, 176, 2);
    t.globalAlpha = 1;
    t.lineWidth = 1.5;
    for (let r = 0; r < 5; r += 1) {
      t.globalAlpha = 0.24 - r * 0.032;
      t.beginPath();
      t.arc(548, 374, 74 + r * 38, 0, Math.PI * 2);
      t.stroke();
    }
    t.globalAlpha = 1;
    t.beginPath();
    t.moveTo(348, 374);
    t.lineTo(704, 374);
    t.moveTo(548, 174);
    t.lineTo(548, 574);
    t.stroke();

    if (e.id === "xcode") {
      t.font = '800 62px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      t.textAlign = "left";
      t.fillStyle = "#ffffff";
      t.fillText("Join", 68, 956);
      const joinW = t.measureText("Join").width;
      t.fillStyle = "#a3e635";
      t.fillText("App", 68 + joinW, 956);
    } else {
      t.font = \`400 \${e.title.length > 10 ? 52 : 62}px "Iowan Old Style", Baskerville, Georgia, serif\`;
      t.letterSpacing = "0px";
      t.fillText(e.title, 68, 956);
    }

    t.font = '500 15px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "2.6px";
    t.fillStyle = foilColor;
    t.fillText(e.discipline.toUpperCase(), 70, 1004);
    t.globalAlpha = 0.68;
    t.fillRect(68, 1040, 632, 1.5);
    t.globalAlpha = 1;
    t.textAlign = "right";
    t.fillText("AN IMAGINED EDITION", 700, 1080);
    return Q(new l.CanvasTexture(o));
  }`
);

// 15. Patch front foil (po), spine foil (ho), and back foil (go) materials with pure white base color so canvas pixel colors (White Join + Lime App) render faithfully
code = code.replace(
  /po\s*=\s*new l\.MeshPhysicalMaterial\(\{[\s\S]*?polygonOffsetFactor:\s*-2\s*\}\)/,
  `po = new l.MeshPhysicalMaterial({
      color: 0xffffff,
      map: N,
      alphaMap: N,
      bumpMap: Dr,
      bumpScale: 0.016,
      roughness: (e.id === "xcode" || e.id === "codex") ? 0.3 : (e.id === "cursor" ? 0.22 : 0.2),
      metalness: (e.id === "xcode" || e.id === "codex") ? 0.05 : (e.id === "cursor" ? 0.34 : 0.94),
      clearcoat: 0.18,
      clearcoatRoughness: 0.12,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2
    })`
);

code = code.replace(
  /ho\s*=\s*new l\.MeshPhysicalMaterial\(\{[\s\S]*?side:\s*l\.DoubleSide\s*\}\)/,
  `ho = new l.MeshPhysicalMaterial({
      color: 0xffffff,
      map: je,
      alphaMap: je,
      bumpMap: Kr,
      bumpScale: 0.017,
      roughness: (e.id === "xcode" || e.id === "codex") ? 0.3 : 0.19,
      metalness: (e.id === "xcode" || e.id === "codex") ? 0.05 : 0.92,
      clearcoat: 0.16,
      clearcoatRoughness: 0.13,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      side: l.DoubleSide
    })`
);

code = code.replace(
  /go\s*=\s*new l\.MeshPhysicalMaterial\(\{[\s\S]*?side:\s*l\.DoubleSide\s*\}\)/,
  `go = new l.MeshPhysicalMaterial({
      color: 0xffffff,
      map: xt,
      alphaMap: xt,
      bumpMap: kr,
      bumpScale: 0.016,
      roughness: (e.id === "xcode" || e.id === "codex") ? 0.3 : 0.21,
      metalness: (e.id === "xcode" || e.id === "codex") ? 0.05 : 0.9,
      clearcoat: 0.14,
      clearcoatRoughness: 0.14,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      side: l.DoubleSide
    })`
);

// 16. Ensure so() closes the book reliably from both detail and opening states
code = code.replace(
  'b === "detail" && (Ke(), Te(), b = "closing"',
  '(b === "detail" || b === "opening") && (Ke(), Te(), b = "closing"'
);

fs.writeFileSync(filePath, code, 'utf8');

// Clear Vite cache
const viteCacheDir = path.resolve('node_modules/.vite');
if (fs.existsSync(viteCacheDir)) {
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
}

console.log('⚡ Bookshelf renderer updated with JoinApp (White "Join" + Lime "App") typography.');
