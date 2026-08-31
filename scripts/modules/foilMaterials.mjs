// scripts/modules/foilMaterials.mjs
// Spine foil, back cover foil, and Three.js MeshPhysicalMaterial shader properties.

export function applyFoilAndMaterialPatches(rawCode) {
  let code = rawCode;

  // 1. Patch Spine foil Kn(e)
  const knStartIdx = code.indexOf('function Kn(e) {');
  const knEndIdx = code.indexOf('function kn(e) {');
  if (knStartIdx !== -1 && knEndIdx !== -1) {
    const newKnFunction = `function Kn(e) {
    const o = document.createElement("canvas");
    o.width = 384, o.height = 1536;
    const t = o.getContext("2d");
    const foilColor = (e.id === "xcode" || e.id === "codex" || e.id === "claude-code") ? (e.foil || "#efc16d") : "#ffffff";
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
    return Q(new l.CanvasTexture(o), { anisotropy: 2 });
  }\n  `;
    code = code.slice(0, knStartIdx) + newKnFunction + code.slice(knEndIdx);
  }

  // 1b. Patch Back cloth kn(e) (Reduced loop from 2600 to 50 iterations)
  const backClothStartIdx = code.indexOf('function kn(e) {');
  const mnStartIdx = code.indexOf('function Mn(e) {');
  if (backClothStartIdx !== -1 && mnStartIdx !== -1) {
    const newBackClothFunction = `function kn(e) {
    const o = document.createElement("canvas");
    o.width = 512, o.height = 768;
    const t = o.getContext("2d"), r = ye(pe(\`\${e.id}-back-cloth\`) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.15)"), a.addColorStop(0.05, "rgba(255,255,255,0.028)"), a.addColorStop(0.84, "rgba(255,255,255,0)"), a.addColorStop(1, "rgba(0,0,0,0.11)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    for (let c = 0; c < 50; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 5 + r() * 30;
      t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.016)", t.lineWidth = 0.45 + r() * 0.65, t.beginPath(), t.moveTo(i, d), t.lineTo(i + s, d + (r() - 0.5) * 1.5), t.stroke();
    }
    const n = t.createRadialGradient(
      o.width * 0.62,
      o.height * 0.38,
      20,
      o.width * 0.62,
      o.height * 0.38,
      o.width * 0.75
    );
    return n.addColorStop(0, "rgba(255,255,255,0.03)"), n.addColorStop(1, "rgba(0,0,0,0.09)"), t.fillStyle = n, t.fillRect(0, 0, o.width, o.height), Q(new l.CanvasTexture(o), { anisotropy: 2 });
  }\n  `;
    code = code.slice(0, backClothStartIdx) + newBackClothFunction + code.slice(mnStartIdx);
  }

  // 2. Patch Back foil Mn(e)
  const mnIdx = code.indexOf('function Mn(e) {');
  const tFuncIdx = code.indexOf('function T(e, o, t');
  if (mnIdx !== -1 && tFuncIdx !== -1) {
    const newMnFunction = `function Mn(e) {
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
    return Q(new l.CanvasTexture(o), { anisotropy: 2 });
  }\n  `;
    code = code.slice(0, mnIdx) + newMnFunction + code.slice(tFuncIdx);
  }

  // 3. Material performance properties
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