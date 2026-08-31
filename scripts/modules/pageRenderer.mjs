// scripts/modules/pageRenderer.mjs
// Lightweight interior page generator: downscaled to 512x768 to eliminate main-thread freeze.

export function applyPagePatches(code) {
  const pnStartIdx = code.indexOf('function Pn(e) {');
  const erStartIdx = code.indexOf('function er() {');
  if (pnStartIdx === -1 || erStartIdx === -1) {
    return code;
  }

  const newPnFunction = `function Pn(e) {
    const r = \`#\${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}\`;
    // Downscaled from 1024x1536 to 512x768 (4x less memory and CPU baking time)
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

      // 1. LEFT PAGES (Plates / Diagrams)
      if (n === 1 && e.id === "codex") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  LANGSMITH ROUTER BENCHMARK", 54, 146);
        if (typeof customBenchmarkImg !== "undefined" && customBenchmarkImg && customBenchmarkImg.naturalWidth > 0) {
          const imgW = 404;
          const imgH = Math.round((imgW / customBenchmarkImg.naturalWidth) * customBenchmarkImg.naturalHeight);
          s.drawImage(customBenchmarkImg, 54, 190, imgW, imgH);
        }
      } else if (n === 1 && e.id === "figma") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  VISION DETECTION & BENCHMARK", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(18, 20, 23, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
      } else if (n === 1 && e.id === "cursor") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  MULTI-MODAL SEMANTIC PIPELINE TOPOLOGY", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(23, 25, 20, 0.85)";
        s.fillRect(imgX, imgY, imgW, imgH);
      } else if (n === 1 && e.id === "claude-code") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  CONVNEXT-TINY ARCHITECTURE & GRAD-CAM", 54, 146);
        if (typeof customClaudeDiagramImg !== "undefined" && customClaudeDiagramImg && customClaudeDiagramImg.naturalWidth > 0) {
          const imgW = 404;
          const imgH = Math.round((imgW / customClaudeDiagramImg.naturalWidth) * customClaudeDiagramImg.naturalHeight);
          s.drawImage(customClaudeDiagramImg, 54, 180, imgW, imgH);
        }
      } else if (n === 1 && e.id === "antigravity") {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("PLATE 01  /  GRAPH-BASED WAREHOUSE ENGINE TOPOLOGY", 54, 146);
        const imgX = 54, imgY = 180, imgW = 404, imgH = 250;
        s.fillStyle = "rgba(11, 25, 83, 0.88)";
        s.fillRect(imgX, imgY, imgW, imgH);
      }

      // 2. RIGHT PAGES (Text Chapters)
      if (n === 0) {
        s.font = '500 12px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2.3px";
        s.fillText(e.discipline.toUpperCase(), 54, 174);
        s.font = e.title.length > 10 ? '400 44px "Iowan Old Style", Georgia, serif' : '400 52px "Iowan Old Style", Georgia, serif';
        de(s, e.title, 52, 246, 18, 54, 2);
        s.globalAlpha = 0.55;
        s.font = '400 18px "Iowan Old Style", Georgia, serif';
        de(s, e.note || e.deck, 54, 430, 36, 26, 5);
      } else if (n === 2 || n === 4 || n === 6 || n === 8) {
        const chNum = Math.floor(n / 2);
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText(\`CHAPTER 0\${chNum}\`, 54, 166);
        s.font = '400 36px "Iowan Old Style", Georgia, serif';
        const chTitle = e.chapters?.[chNum - 1]?.title || \`Chapter 0\${chNum}\`;
        de(s, chTitle, 52, 236, 18, 42, 3);
      } else if (n === 10) {
        s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
        s.letterSpacing = "2px";
        s.fillText("COLOPHON & SPECIFICATIONS", 54, 164);
        s.font = '400 30px "Iowan Old Style", Georgia, serif';
        s.fillText(e.title, 54, 230);
      }

      s.globalAlpha = 0.25;
      s.fillRect(48, d - 48, i - 96, 1);
      s.globalAlpha = 1;

      const texture = Q(new l.CanvasTexture(c), { anisotropy: 4 });
      texture.name = \`\${e.id}-interior-page-\${n + 1}\`;
      return texture;
    });
  };\n`;

  return code.slice(0, pnStartIdx) + newPnFunction + code.slice(erStartIdx);
}