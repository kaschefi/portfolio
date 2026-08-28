// scripts/modules/foilMaterials.mjs
// Spine foil, back cover foil, and Three.js MeshPhysicalMaterial shader properties.

export function applyFoilAndMaterialPatches(rawCode) {
  let code = rawCode;

  // 1. Patch Spine foil Kn(e) to draw in vibrant foil colors
  code = code.replace(
    /function Kn\(e\)\s*\{[\s\S]*?Q\(new l\.CanvasTexture\(o\)\);\s*\}/,
    `function Kn(e) {
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
    return Q(new l.CanvasTexture(o));
  }`
  );

  // 2. Patch Back foil Mn(e) to draw in vibrant foil colors
  code = code.replace(
    /function Mn\(e\)\s*\{[\s\S]*?Q\(new l\.CanvasTexture\(o\)\);\s*\}/,
    `function Mn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d");
    const foilColor = (e.id === "xcode" || e.id === "codex" || e.id === "claude-code") ? (e.foil || "#efc16d") : "#ffffff";
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

  // 3. Patch front foil (po), spine foil (ho), and back foil (go) materials with luminous metallic foil properties
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
