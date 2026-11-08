// scripts/modules/pageRenderer.mjs
// Lightweight interior page generator driven dynamically by src/content/volumes/*.json (512x768).

import fs from 'fs';
import path from 'path';

export function applyPagePatches(code) {
  let startIdx = code.indexOf('const _endpaperCache = new Map();');
  if (startIdx === -1) {
    startIdx = code.indexOf('function Sn(e) {');
  }
  const erStartIdx = code.indexOf('function er() {');
  if (startIdx === -1 || erStartIdx === -1) {
    return code;
  }

  // Load all volume content directly from JSON files to make them the single source of truth
  const volumesDir = path.resolve('src/content/volumes');
  const volumeDataMap = {};
  if (fs.existsSync(volumesDir)) {
    const files = fs.readdirSync(volumesDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(volumesDir, f), 'utf8'));
        if (d && d.id) {
          volumeDataMap[d.id] = {
            title: d.title || "",
            discipline: d.discipline || "",
            note: d.note || "",
            deck: d.deck || "",
            chapters: (d.chapters || []).map(ch => ({
              number: ch.number || "",
              title: ch.title || "",
              subtitle: ch.subtitle || "",
              content: ch.content || ""
            }))
          };
        }
      } catch (err) {
        console.warn(`[pageRenderer] Failed to read ${f}:`, err);
      }
    }
  }

  const newPnFunction = `
  const _endpaperCache = new Map();
  function renderEndpaperOnDemand(e) {
    if (_endpaperCache.has(e.id)) return _endpaperCache.get(e.id);
    const o = document.createElement("canvas");
    o.width = 512, o.height = 768;
    const t = o.getContext("2d"), r = ye(pe(\`\${e.id}-endpaper\`) + e.seed);
    to(t, o.width, o.height, r);
    t.save();
    t.fillStyle = e.color;
    t.globalAlpha = 0.14;
    t.fillRect(0, 0, o.width, o.height);
    t.globalAlpha = 0.18;
    t.strokeStyle = e.foil;
    t.lineWidth = 1;
    t.beginPath();
    for (let n = 28; n < o.width; n += 48) {
      t.moveTo(n, 0); t.lineTo(n, o.height);
    }
    for (let n = 24; n < o.height; n += 48) {
      t.moveTo(0, n); t.lineTo(o.width, n);
    }
    t.stroke();
    t.globalAlpha = 0.42;
    $t(t, { ...e, foil: e.palette.inkSoft }, o.width, o.height);
    t.restore();
    const a = Q(new l.CanvasTexture(o), { anisotropy: 4 });
    a.name = \`\${e.id}-patterned-endpaper\`;
    _endpaperCache.set(e.id, a);
    return a;
  }

  function Sn(e) {
    return _t || Tn(e, false);
  }

  const _volumeDataMap = ${JSON.stringify(volumeDataMap)};
  const _bookPagesCache = new Map();

  function renderBookPagesOnDemand(e) {
    if (_bookPagesCache.has(e.id)) return _bookPagesCache.get(e.id);
    const vol = _volumeDataMap[e.id] || e;
    const r = \`#\${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}\`;
    const i = 512, d = 768;

    const pages = Array.from({ length: 12 }, (a, n) => {
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
        de(s, "57-case benchmark evaluation: Monolithic LLM baseline (A) vs MoKa Two-Layer Router (B). 95.8% LAYA routing accuracy, 0 output tokens, and 5.5ms P50 latency.", 54, 460, 38, 22, 5);
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

      // 2. RIGHT PAGES (Full Narrative Chapters - Loaded from Unified JSON Content)
      const ch0 = vol.chapters?.[0];
      const ch1 = vol.chapters?.[1];
      const ch2 = vol.chapters?.[2];
      const ch3 = vol.chapters?.[3];

      if (n === 0) {
        // Title Page (Spread 1)
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2.3px";
        s.fillText((vol.discipline || e.discipline).toUpperCase(), 54, 174);
        const titleText = vol.title || e.title;
        s.font = titleText.length > 10 ? '400 44px "Iowan Old Style", Georgia, serif' : '400 52px "Iowan Old Style", Georgia, serif';
        s.letterSpacing = "0px";
        de(s, titleText, 52, 246, 18, 54, 2);
        s.globalAlpha = 0.55;
        s.font = '400 18px "Iowan Old Style", Georgia, serif';
        de(s, vol.note || vol.deck || e.note || e.deck, 54, 430, 36, 26, 5);
      } else if (n === 2) {
        // Chapter 01
        const title = ch0?.title || "Chapter 01";
        const sub = ch0?.subtitle || "";
        const body = ch0?.content || vol.note || "";
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
        const title = ch1?.title || "Chapter 02";
        const sub = ch1?.subtitle || "";
        const body = ch1?.content || vol.deck || "";
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
        const title = ch2?.title || "Chapter 03";
        const sub = ch2?.subtitle || "";
        const body = ch2?.content || vol.note || "";
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
        const title = ch3?.title || "Chapter 04";
        const sub = ch3?.subtitle || "";
        const body = ch3?.content || vol.deck || "";
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
        s.fillText(vol.title || e.title, 54, 230);
        s.globalAlpha = 0.58;
        s.font = '400 16px "Iowan Old Style", Georgia, serif';
        de(s, \`\${vol.binding || e.binding}. \${vol.format || e.format}.\`, 54, 306, 44, 26, 7);
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
    _bookPagesCache.set(e.id, pages);
    return pages;
  }

  function hydrateBookPages(bookObj) {
    if (!bookObj || bookObj.pagesHydrated) return;
    const realTextures = renderBookPagesOnDemand(bookObj.data);
    if (bookObj.pageMaterials && Array.isArray(bookObj.pageMaterials)) {
      for (let pIdx = 0; pIdx < 12; pIdx++) {
        if (realTextures[pIdx] && bookObj.pageMaterials[pIdx]) {
          bookObj.pageMaterials[pIdx].map = realTextures[pIdx];
          bookObj.pageMaterials[pIdx].needsUpdate = true;
        }
      }
    }
    if (bookObj.interiorPageTextures) {
      bookObj.interiorPageTextures = realTextures;
    }
    if (typeof renderEndpaperOnDemand === "function" && bookObj.endpaperMaterial) {
      bookObj.endpaperMaterial.map = renderEndpaperOnDemand(bookObj.data);
      bookObj.endpaperMaterial.needsUpdate = true;
    }
    if (typeof renderBackCloth === "function" && bookObj.backCoverMaterial) {
      bookObj.backCoverMaterial.map = renderBackCloth(bookObj.data);
      bookObj.backCoverMaterial.needsUpdate = true;
    }
    if (typeof renderBackFoil === "function" && bookObj.backFoilMaterial) {
      const bf = renderBackFoil(bookObj.data);
      bookObj.backFoilMaterial.map = bf;
      bookObj.backFoilMaterial.alphaMap = bf;
      bookObj.backFoilMaterial.bumpMap = bf;
      bookObj.backFoilMaterial.needsUpdate = true;
    }
    bookObj.pagesHydrated = true;
    if (typeof __wake === "function") __wake(60);
  }

  function Pn(e) {
    const placeholder = _t || Tn(e, false);
    return Array.from({ length: 12 }, () => placeholder);
  };\n`;

  return code.slice(0, startIdx) + newPnFunction + code.slice(erStartIdx);
}
