// scripts/modules/foilMaterials.mjs
// Spine foil, back cover foil, cached cloth/edge/paper textures, and Three.js material properties.
// Idempotent across both fresh and already-patched bookshelfRenderer.js.

export function applyFoilAndMaterialPatches(rawCode) {
  let code = rawCode;

  // 0a. Patch cloth bump An(e) and cloth normal/roughness Ln(e) to cache shared textures
  let anStartIdx = code.indexOf('let _clothBumpCache = null;');
  if (anStartIdx === -1) {
    anStartIdx = code.indexOf('function An(e) {');
  }
  const eoStartIdx = code.indexOf('function eo(e, o) {');
  if (anStartIdx !== -1 && eoStartIdx !== -1) {
    const newAnAndLnFunction = `let _clothBumpCache = null;
  function An(e) {
    if (_clothBumpCache) return _clothBumpCache;
    const o = document.createElement("canvas");
    o.width = 256, o.height = 256;
    const t = o.getContext("2d"), r = ye(pe("shared-cloth") + 11);
    t.fillStyle = "#7f7f7f", t.fillRect(0, 0, o.width, o.height);
    t.beginPath();
    for (let n = 0; n < 256; n += 4) {
      const c = Math.round(98 + r() * 70);
      t.strokeStyle = \`rgb(\${c},\${c},\${c})\`;
      t.moveTo(0, n + (r() - 0.5));
      t.lineTo(256, n + (r() - 0.5));
    }
    t.stroke();
    t.beginPath();
    for (let n = 1; n < 256; n += 6) {
      const c = Math.round(105 + r() * 58);
      t.strokeStyle = \`rgb(\${c},\${c},\${c})\`;
      t.moveTo(n + (r() - 0.5), 0);
      t.lineTo(n + (r() - 0.5), 256);
    }
    t.stroke();
    const a = new l.CanvasTexture(o);
    a.wrapS = l.RepeatWrapping, a.wrapT = l.RepeatWrapping, a.repeat.set(5, 8);
    return _clothBumpCache = Q(a, { color: !1, anisotropy: 2 });
  }

  let _clothMapsCache = null;
  function Ln(e) {
    if (_clothMapsCache) return _clothMapsCache;
    const t = new Float32Array(65536), r = document.createElement("canvas"), a = document.createElement("canvas");
    r.width = a.width = 256, r.height = a.height = 256;
    const n = r.getContext("2d"), c = a.getContext("2d"), i = n.createImageData(256, 256), d = c.createImageData(256, 256), s = 0.23;
    for (let f = 0; f < 256; f += 1) {
      for (let g = 0; g < 256; g += 1) {
        const v = Math.sin((g + s) * Math.PI * 0.52), C = Math.sin((f - s) * Math.PI * 0.41), F = Math.sin((g + f + s) * Math.PI * 0.19);
        t[f * 256 + g] = 0.5 + v * 0.18 + C * 0.15 + F * 0.045;
      }
    }
    const h = (f, g) => t[((g + 256) % 256) * 256 + ((f + 256) % 256)];
    for (let f = 0; f < 256; f += 1) {
      for (let g = 0; g < 256; g += 1) {
        const v = f * 256 + g, C = v * 4, F = (h(g + 1, f) - h(g - 1, f)) * 1.5, N = (h(g, f + 1) - h(g, f - 1)) * 1.5, j = Math.hypot(F, N, 1);
        i.data[C] = Math.round((-F / j * 0.5 + 0.5) * 255);
        i.data[C + 1] = Math.round((-N / j * 0.5 + 0.5) * 255);
        i.data[C + 2] = Math.round((1 / j * 0.5 + 0.5) * 255);
        i.data[C + 3] = 255;
        const E = Math.round(188 + t[v] * 56);
        d.data[C] = E; d.data[C + 1] = E; d.data[C + 2] = E; d.data[C + 3] = 255;
      }
    }
    n.putImageData(i, 0, 0), c.putImageData(d, 0, 0);
    const x = (f, g) => {
      const v = new l.CanvasTexture(f);
      v.name = \`shared-\${g}\`, v.wrapS = l.RepeatWrapping, v.wrapT = l.RepeatWrapping, v.repeat.set(5, 8);
      return Q(v, { color: !1, anisotropy: 2 });
    };
    return _clothMapsCache = {
      normal: x(r, "cloth-normal"),
      roughness: x(a, "cloth-roughness")
    };
  }\n  `;
    code = code.slice(0, anStartIdx) + newAnAndLnFunction + code.slice(eoStartIdx);
  }

  // 0a2. Patch eo(e, o) to reuse existing CanvasTexture directly (eliminating 18 duplicate textures)
  const eoStartIdx2 = code.indexOf('function eo(e, o) {');
  const toStartIdx2 = code.indexOf('function to(e, o, t, r) {');
  if (eoStartIdx2 !== -1 && toStartIdx2 !== -1) {
    const newEoFunction = `function eo(e, o) {
    return e;
  }\n  `;
    code = code.slice(0, eoStartIdx2) + newEoFunction + code.slice(toStartIdx2);
  }

  // 0b. Patch paper fiber noise to(e, o, t, r) (Batched strokes, eliminating 2,400 per-fiber stroke calls)
  const toStartIdx = code.indexOf('function to(e, o, t, r) {');
  const tnStartIdx = code.indexOf('function Tn(e, o = !1) {');
  if (toStartIdx !== -1 && tnStartIdx !== -1) {
    const newToFunction = `function to(e, o, t, r) {
    e.fillStyle = "#e8e1d3";
    e.fillRect(0, 0, o, t);
    const a = e.createLinearGradient(0, 0, o, t);
    a.addColorStop(0, "rgba(255,255,255,0.22)");
    a.addColorStop(0.42, "rgba(255,255,255,0.035)");
    a.addColorStop(1, "rgba(103,87,64,0.08)");
    e.fillStyle = a;
    e.fillRect(0, 0, o, t);

    e.strokeStyle = "rgba(255,255,255,0.045)";
    e.lineWidth = 0.6;
    e.beginPath();
    for (let n = 0; n < 120; n += 1) {
      const c = r() * o, i = r() * t, d = 6 + r() * 26;
      e.moveTo(c, i);
      e.lineTo(Math.min(o, c + d), i + (r() - 0.5) * 2);
    }
    e.stroke();

    e.strokeStyle = "rgba(92,76,55,0.028)";
    e.lineWidth = 0.5;
    e.beginPath();
    for (let n = 0; n < 120; n += 1) {
      const c = r() * o, i = r() * t, d = 6 + r() * 26;
      e.moveTo(c, i);
      e.lineTo(Math.min(o, c + d), i + (r() - 0.5) * 2);
    }
    e.stroke();

    e.fillStyle = "rgba(120,105,85,0.02)";
    for (let n = 0; n < 80; n += 1) {
      const sz = 0.8 + r() * 0.8;
      e.fillRect(r() * o, r() * t, sz, sz);
    }
  }\n  `;
    code = code.slice(0, toStartIdx) + newToFunction + code.slice(tnStartIdx);
  }

  // 0c. Patch page edge textures zn(e) with batched bezier paths
  let znStartIdx = code.indexOf('let _edgeTexturesCache = null;');
  if (znStartIdx === -1) {
    znStartIdx = code.indexOf('function zn(e) {');
  }
  const ooStartIdx = code.indexOf('function oo(e, o, t) {');
  if (znStartIdx !== -1 && ooStartIdx !== -1) {
    const newZnFunction = `let _edgeTexturesCache = null;
  function zn(e) {
    if (_edgeTexturesCache) return _edgeTexturesCache;
    const o = (t, r, a) => {
      const n = document.createElement("canvas");
      n.width = Math.round(t / 2);
      n.height = Math.round(r / 2);
      const w = n.width, h = n.height;
      const c = n.getContext("2d", { willReadFrequently: false });
      const i = ye(pe(\`\${e.id}-\${a}\`) + e.seed);
      c.fillStyle = "#dcd5c7";
      c.fillRect(0, 0, w, h);
      const step = a === "fore-edge" ? 2.5 : 2;

      c.strokeStyle = "rgba(106, 103, 97, 0.16)";
      c.lineWidth = 0.5;
      c.beginPath();
      for (let y = 0; y < h; y += step) {
        c.moveTo(0, y + (i() - 0.5) * 0.5);
        c.bezierCurveTo(w * 0.3, y + (i() - 0.5) * 0.8, w * 0.72, y + (i() - 0.5) * 0.8, w, y + (i() - 0.5) * 0.5);
      }
      c.stroke();

      const s = c.createLinearGradient(0, 0, w, 0);
      s.addColorStop(0, "rgba(58,48,35,0.18)");
      s.addColorStop(0.04, "rgba(255,255,255,0.04)");
      s.addColorStop(0.86, "rgba(255,255,255,0)");
      s.addColorStop(1, "rgba(58,48,35,0.12)");
      c.fillStyle = s;
      c.fillRect(0, 0, w, h);
      return Q(new l.CanvasTexture(n), { anisotropy: 2 });
    };
    return _edgeTexturesCache = {
      fore: o(512, 2048, "fore-edge"),
      headTail: o(2048, 384, "head-tail-edge")
    };
  }\n  `;
    code = code.slice(0, znStartIdx) + newZnFunction + code.slice(ooStartIdx);
  }

  // 0d. Patch Spine cloth Dn(e) (256x1024 scaled cleanly from 384x1536, batched strokes)
  const dnStartIdx = code.indexOf('function Dn(e) {');
  const knTargetIdx = code.indexOf('function Kn(e) {');
  if (dnStartIdx !== -1 && knTargetIdx !== -1) {
    const newDnFunction = `function Dn(e) {
    const o = document.createElement("canvas");
    o.width = 256, o.height = 1024;
    const W = 384, H = 1536;
    const t = o.getContext("2d", { alpha: false }), r = ye(pe(\`\${e.id}-spine-cloth\`) + e.seed);
    t.setTransform(o.width / W, 0, 0, o.height / H, 0, 0);
    t.fillStyle = e.color, t.fillRect(0, 0, W, H);
    const a = t.createLinearGradient(0, 0, W, 0);
    a.addColorStop(0, "rgba(0,0,0,0.2)"), a.addColorStop(0.14, "rgba(255,255,255,0.055)"), a.addColorStop(0.62, "rgba(255,255,255,0.012)"), a.addColorStop(1, "rgba(0,0,0,0.16)"), t.fillStyle = a, t.fillRect(0, 0, W, H);
    t.lineWidth = 0.5;
    t.strokeStyle = "rgba(255,255,255,0.028)";
    t.beginPath();
    for (let c = 0; c < 60; c += 1) {
      const i = r() * W, d = r() * H;
      t.moveTo(i, d);
      t.lineTo(i + 8 + r() * 24, d + (r() - 0.5) * 1.5);
    }
    t.stroke();
    const n = t.createLinearGradient(0, H * 0.82, 0, H);
    n.addColorStop(0, "rgba(0,0,0,0)"), n.addColorStop(1, "rgba(0,0,0,0.12)"), t.fillStyle = n, t.fillRect(0, 0, W, H);
    return Q(new l.CanvasTexture(o), { anisotropy: 2 });
  }\n  `;
    code = code.slice(0, dnStartIdx) + newDnFunction + code.slice(knTargetIdx);
  }

  // 1. Patch Spine foil Kn(e) (256x1024 scaled cleanly from 384x1536)
  const knStartIdx = code.indexOf('function Kn(e) {');
  let knEndIdx = code.indexOf('const _backClothCache = new Map();');
  if (knEndIdx === -1) {
    knEndIdx = code.indexOf('function kn(e) {');
  }
  if (knStartIdx !== -1 && knEndIdx !== -1) {
    const newKnFunction = `function Kn(e) {
    const o = document.createElement("canvas");
    o.width = 256, o.height = 1024;
    const W = 384, H = 1536;
    const t = o.getContext("2d");
    t.setTransform(o.width / W, 0, 0, o.height / H, 0, 0);
    const foilColor = (e.id === "xcode" || e.id === "codex" || e.id === "claude-code") ? (e.foil || "#efc16d") : "#ffffff";
    t.clearRect(0, 0, W, H);
    t.fillStyle = foilColor;
    t.strokeStyle = foilColor;
    t.lineWidth = 2.4;
    t.strokeRect(34, 38, W - 68, H - 76);
    t.textAlign = "center";
    t.textBaseline = "middle";
    t.font = '500 24px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "5px";
    t.fillText(e.roman, W * 0.5, 118);
    t.save();
    t.translate(W * 0.5, H * 0.5);
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
    t.arc(W * 0.5, H - 120, 24, 0, Math.PI * 2);
    t.stroke();
    t.beginPath();
    t.moveTo(W * 0.5 - 24, H - 120);
    t.lineTo(W * 0.5 + 24, H - 120);
    t.stroke();
    return Q(new l.CanvasTexture(o), { anisotropy: 2 });
  }\n  `;
    code = code.slice(0, knStartIdx) + newKnFunction + code.slice(knEndIdx);
  }

  // 1b. Patch Back cloth kn(e) to defer large canvas bake until inspection
  let backClothStartIdx = code.indexOf('const _backClothCache = new Map();');
  if (backClothStartIdx === -1) {
    backClothStartIdx = code.indexOf('function kn(e) {');
  }
  let mnStartIdx = code.indexOf('let _emptyFoilTexture = null;');
  if (mnStartIdx === -1) {
    mnStartIdx = code.indexOf('function Mn(e) {');
  }
  if (backClothStartIdx !== -1 && mnStartIdx !== -1) {
    const newBackClothFunction = `const _backClothCache = new Map();
  function renderBackCloth(e) {
    if (_backClothCache.has(e.id)) return _backClothCache.get(e.id);
    const o = document.createElement("canvas");
    o.width = 512, o.height = 768;
    const t = o.getContext("2d", { alpha: false }), r = ye(pe(\`\${e.id}-back-cloth\`) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.15)"), a.addColorStop(0.05, "rgba(255,255,255,0.028)"), a.addColorStop(0.84, "rgba(255,255,255,0)"), a.addColorStop(1, "rgba(0,0,0,0.11)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    t.lineWidth = 0.6;
    t.strokeStyle = "rgba(255,255,255,0.018)";
    t.beginPath();
    for (let c = 0; c < 25; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 5 + r() * 30;
      t.moveTo(i, d); t.lineTo(i + s, d + (r() - 0.5) * 1.5);
    }
    t.stroke();
    t.strokeStyle = "rgba(0,0,0,0.016)";
    t.beginPath();
    for (let c = 0; c < 25; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 5 + r() * 30;
      t.moveTo(i, d); t.lineTo(i + s, d + (r() - 0.5) * 1.5);
    }
    t.stroke();
    const n = t.createRadialGradient(
      o.width * 0.62,
      o.height * 0.38,
      20,
      o.width * 0.62,
      o.height * 0.38,
      o.width * 0.75
    );
    n.addColorStop(0, "rgba(255,255,255,0.03)"), n.addColorStop(1, "rgba(0,0,0,0.09)"), t.fillStyle = n, t.fillRect(0, 0, o.width, o.height);
    const tex = Q(new l.CanvasTexture(o), { anisotropy: 2 });
    _backClothCache.set(e.id, tex);
    return tex;
  }
  function kn(e) {
    return _t || Tn(e, false);
  }\n  `;
    code = code.slice(0, backClothStartIdx) + newBackClothFunction + code.slice(mnStartIdx);
  }

  // 2. Patch Back foil Mn(e) to defer large canvas bake until inspection
  let mnIdx = code.indexOf('let _emptyFoilTexture = null;');
  if (mnIdx === -1) {
    mnIdx = code.indexOf('function Mn(e) {');
  }
  const tFuncIdx = code.indexOf('function T(e, o, t');
  if (mnIdx !== -1 && tFuncIdx !== -1) {
    const newMnFunction = `let _emptyFoilTexture = null;
  function getEmptyFoilTexture() {
    if (_emptyFoilTexture) return _emptyFoilTexture;
    const c = document.createElement("canvas");
    c.width = 1; c.height = 1;
    return _emptyFoilTexture = Q(new l.CanvasTexture(c), { color: !1 });
  }

  const _backFoilCache = new Map();
  function renderBackFoil(e) {
    if (_backFoilCache.has(e.id)) return _backFoilCache.get(e.id);
    const o = document.createElement("canvas");
    o.width = 512, o.height = 768;
    const t = o.getContext("2d");
    const foilColor = (e.id === "xcode" || e.id === "codex" || e.id === "claude-code") ? (e.foil || "#efc16d") : "#ffffff";
    t.clearRect(0, 0, o.width, o.height);
    t.fillStyle = foilColor;
    t.strokeStyle = foilColor;
    t.textAlign = "left";
    t.textBaseline = "alphabetic";
    t.font = '500 14px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "3px";
    t.fillText(\`WORKING VOLUMES  /  \${e.roman}\`, 48, 64);
    t.globalAlpha = 0.72;
    t.fillRect(48, 84, 140, 2);
    t.globalAlpha = 1;
    t.lineWidth = 1.5;
    for (let r = 0; r < 4; r += 1) {
      t.globalAlpha = 0.24 - r * 0.04;
      t.beginPath();
      t.arc(360, 260, 50 + r * 28, 0, Math.PI * 2);
      t.stroke();
    }
    t.globalAlpha = 1;
    if (e.id === "xcode") {
      t.font = '800 52px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      t.textAlign = "left";
      t.fillStyle = "#ffffff";
      t.fillText("Join", 48, 640);
      const joinW = t.measureText("Join").width;
      t.fillStyle = "#a3e635";
      t.fillText("App", 48 + joinW, 640);
    } else {
      t.font = \`400 \${e.title.length > 10 ? 42 : 52}px "Iowan Old Style", Baskerville, Georgia, serif\`;
      t.letterSpacing = "0px";
      t.fillText(e.title, 48, 640);
    }
    t.font = '500 13px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = "2px";
    t.fillStyle = foilColor;
    t.fillText(e.discipline.toUpperCase(), 50, 680);
    const tex = Q(new l.CanvasTexture(o), { anisotropy: 2 });
    _backFoilCache.set(e.id, tex);
    return tex;
  }
  function Mn(e) {
    return getEmptyFoilTexture();
  }\n  `;
    code = code.slice(0, mnIdx) + newMnFunction + code.slice(tFuncIdx);
  }

  // 3. Foil material performance properties
  code = code.replace(
    /po\s*=\s*new l\.MeshPhysicalMaterial\(\{[\s\S]*?polygonOffsetFactor:\s*-2\s*\}\)/,
    `po = new l.MeshPhysicalMaterial({
      color: e.id === "cursor" ? 0x111310 : (e.id === "figma" ? 0x860d0d : (e.id === "claude-code" ? 0xefc16d : 0xffffff)),
      map: N,
      alphaMap: N,
      bumpMap: Dr,
      bumpScale: 0.016,
      roughness: e.id === "cursor" ? 0.35 : 0.18,
      metalness: e.id === "cursor" ? 0.05 : 0.94,
      clearcoat: 0.22,
      clearcoatRoughness: 0.10,
      sheen: 0.25,
      sheenRoughness: 0.5,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2
    })`
  );

  code = code.replace(
    /ho\s*=\s*new l\.MeshPhysicalMaterial\(\{[\s\S]*?side:\s*l\.DoubleSide\s*\}\)/,
    `ho = new l.MeshPhysicalMaterial({
      color: e.id === "cursor" ? 0x111310 : (e.id === "figma" ? 0x860d0d : (e.id === "claude-code" ? 0xefc16d : 0xffffff)),
      map: je,
      alphaMap: je,
      bumpMap: Kr,
      bumpScale: 0.017,
      roughness: e.id === "cursor" ? 0.35 : 0.18,
      metalness: e.id === "cursor" ? 0.05 : 0.92,
      clearcoat: 0.20,
      clearcoatRoughness: 0.10,
      sheen: 0.25,
      sheenRoughness: 0.5,
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
      color: e.id === "cursor" ? 0x111310 : (e.id === "figma" ? 0x860d0d : (e.id === "claude-code" ? 0xefc16d : 0xffffff)),
      map: xt,
      alphaMap: xt,
      bumpMap: kr,
      bumpScale: 0.016,
      roughness: e.id === "cursor" ? 0.35 : 0.20,
      metalness: e.id === "cursor" ? 0.05 : 0.90,
      clearcoat: 0.18,
      clearcoatRoughness: 0.12,
      sheen: 0.25,
      sheenRoughness: 0.5,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      side: l.DoubleSide
    })`
  );

  return code;
}
