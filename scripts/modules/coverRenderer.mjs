// scripts/modules/coverRenderer.mjs
// Front cover cloth textures and dynamic foil layers for Three.js Bookshelf.

export function applyCoverPatches(code) {
  const wnStartIdx = code.indexOf('function wn(e) {');
  const anStartIdx = code.indexOf('function An(e)');

  if (wnStartIdx === -1 || anStartIdx === -1) {
    return code;
  }

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

      // Center OLED Visor Motif
      const drawMokaVisor = () => {
        const cx = o.width / 2;
        const cy = 460;

        if (typeof customMokaIcon !== "undefined" && customMokaIcon && (customMokaIcon.complete || customMokaIcon.naturalWidth > 0)) {
          const iconSize = 420;
          t.drawImage(customMokaIcon, cx - iconSize / 2, cy - iconSize / 2, iconSize, iconSize);
        } else {
          t.save();
          t.fillStyle = "#0a0e14";
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
      texture.name = e.id + "-cover-front";

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
      t.fillText("WORKING VOLUMES  /  06", 64, 88);

      t.strokeStyle = "#a3e635";
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      // JoinApp Center Artwork (from transparent joinapp.png)
      const drawJoinAppCenterArtwork = () => {
        const cx = o.width / 2;
        const cy = 460;

        if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && (customJoinAppImg.complete || customJoinAppImg.naturalWidth > 0)) {
          const imgW = 420;
          const imgH = 420;
          t.drawImage(customJoinAppImg, cx - imgW / 2, cy - imgH / 2, imgW, imgH);
        } else {
          t.save();
          t.fillStyle = "#1e1138";
          t.strokeStyle = "#a3e635";
          t.lineWidth = 3;
          t.beginPath();
          t.roundRect ? t.roundRect(cx - 160, cy - 140, 320, 280, 24) : t.rect(cx - 160, cy - 140, 320, 280);
          t.fill();
          t.stroke();

          t.fillStyle = "#a3e635";
          t.textAlign = "center";
          t.textBaseline = "middle";
          t.font = '800 64px Inter, "Helvetica Neue", Arial, sans-serif';
          t.fillText("JoinApp", cx, cy);
          t.restore();
        }
      };

      drawJoinAppCenterArtwork();

      // Title: White "Join" + Lime "App"
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
      texture.name = e.id + "-cover-front";

      if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && !customJoinAppImg.complete) {
        customJoinAppImg.onload = () => {
          drawJoinAppCenterArtwork();
          texture.needsUpdate = true;
          __wake(30);
        };
      }

      return texture;
    }

    // Custom Volume 2 (Figma / Obsidian Cloth #121417 + Crimson Texts #860d0d)
    if (e.id === "figma") {
      const r = ye(pe(e.id) + e.seed);
      t.fillStyle = "#121417";
      t.fillRect(0, 0, o.width, o.height);
      const a = t.createLinearGradient(0, 0, o.width, 0);
      a.addColorStop(0, "rgba(0,0,0,0.5)");
      a.addColorStop(0.06, "rgba(0,0,0,0.18)");
      a.addColorStop(0.12, "rgba(255,255,255,0.035)");
      a.addColorStop(0.96, "rgba(0,0,0,0.1)");
      a.addColorStop(1, "rgba(0,0,0,0.52)");
      t.fillStyle = a;
      t.fillRect(0, 0, o.width, o.height);

      for (let c = 0; c < 1250; c += 1) {
        const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
        t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.04)";
        t.lineWidth = 0.6 + r() * 0.8;
        t.beginPath();
        t.moveTo(i, d);
        t.lineTo(i + s, d + (r() - 0.5) * 2);
        t.stroke();
      }

      // Spine crease line
      t.fillStyle = "rgba(0,0,0,0.65)";
      t.fillRect(44, 0, 3, o.height);
      t.fillStyle = "rgba(255,255,255,0.08)";
      t.fillRect(47, 0, 1, o.height);

      // Top Volume tag — crimson #860d0d
      t.fillStyle = "#860d0d";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  02", 64, 88);

      t.strokeStyle = "#860d0d";
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      // Sawyer Robot Artwork — 100% full uncropped illustration with all bottom circuit traces
      // (customFigmaImg is injected globally by the asset loader with sawyerRobot.png)
      const drawFigmaCenterArtwork = () => {
        const cx = o.width / 2;
        const cy = 490;

        if (typeof customFigmaImg !== "undefined" && customFigmaImg && (customFigmaImg.complete || customFigmaImg.naturalWidth > 0)) {
          const maxW = 620;
          const maxH = 580;
          const aspect = (customFigmaImg.naturalWidth || 819) / (customFigmaImg.naturalHeight || 763);
          let drawW = maxW;
          let drawH = drawW / aspect;
          if (drawH > maxH) {
            drawH = maxH;
            drawW = drawH * aspect;
          }

          t.save();
          // Crimson radial pedestal glow behind robot
          const grad = t.createRadialGradient(cx, cy + 40, 60, cx, cy + 40, 340);
          grad.addColorStop(0, "rgba(134, 13, 13, 0.22)");
          grad.addColorStop(0.5, "rgba(134, 13, 13, 0.06)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          t.fillStyle = grad;
          t.beginPath();
          t.arc(cx, cy + 40, 340, 0, Math.PI * 2);
          t.fill();

          // Draw the complete image without any crop
          t.drawImage(customFigmaImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          t.restore();
        }
      };

      drawFigmaCenterArtwork();

      // Title: FIGMA in #860d0d
      const figmaTitleSize = e.title.length > 8 ? 68 : 90;
      t.font = '600 ' + figmaTitleSize + 'px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = "4px";
      t.fillStyle = "#860d0d";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.fillText(e.title.toUpperCase(), 74, 980);

      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillStyle = "#860d0d";
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "SAWYER ROBOT", 78, 1024);

      // Bookmark ribbon at bottom (#860d0d accent)
      t.fillStyle = "#860d0d";
      t.fillRect(130, o.height - 12, 16, 12);

      const texture = Q(new l.CanvasTexture(o), { anisotropy: 16 });
      texture.name = e.id + "-cover-front";

      if (typeof customFigmaImg !== "undefined" && customFigmaImg && !customFigmaImg.complete) {
        customFigmaImg.onload = () => {
          drawFigmaCenterArtwork();
          texture.needsUpdate = true;
          __wake(30);
        };
      }

      return texture;
    }


    // Authentic ThreeUI Cover Atlas for Volumes 3 - 6 (Cursor, Antigravity, Claude Code, Framer)
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
      texture.name = e.id + "-cover-front";
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
    t.fillStyle = e.foil, t.textAlign = "center", t.textBaseline = "middle", t.font = '500 18px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "4px", t.fillText("WORKING VOLUMES  /  " + e.roman, o.width / 2, 92);
    const n = e.title.length > 10 ? 72 : 88;
    return t.font = "400 " + n + 'px "Iowan Old Style", Baskerville, Georgia, serif', t.fillText(e.title, o.width / 2, o.height * 0.72), t.font = '500 16px Inter, "Helvetica Neue", Arial, sans-serif', t.fillText(e.discipline.toUpperCase(), o.width / 2, o.height * 0.79), Q(new l.CanvasTexture(o));
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

      // Draw reflective frame foil
      const cx = o.width / 2;
      const cy = 460;
      t.lineWidth = 1.8;
      t.strokeRect(cx - 160, cy - 70, 320, 140);
      t.strokeRect(cx - 145, cy - 55, 290, 110);

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
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "AI ASSISTANT", 78, 1024);

      return Q(new l.CanvasTexture(o));
    }

    // Custom Volume 2 Foil Layer (Figma: white canvas so alphaMap gives full metallic glow)
    if (e.id === "figma") {
      t.fillStyle = "#ffffff";
      t.strokeStyle = "#ffffff";

      // Volume tag with glow
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.shadowColor = "rgba(134, 13, 13, 0.85)";
      t.shadowBlur = 12;
      t.fillText("WORKING VOLUMES  /  02", 64, 88);

      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();

      // Title with strong glow
      const figmaFoilSize = e.title.length > 8 ? 68 : 90;
      t.font = '600 ' + figmaFoilSize + 'px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = "4px";
      t.shadowColor = "rgba(134, 13, 13, 1.0)";
      t.shadowBlur = 26;
      t.fillText(e.title.toUpperCase(), 74, 980);

      // Discipline
      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.shadowColor = "rgba(134, 13, 13, 0.8)";
      t.shadowBlur = 10;
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "SAWYER ROBOT", 78, 1024);

      t.shadowBlur = 0;
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
      t.fillText("WORKING VOLUMES  /  06", 64, 88);

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

    // Authentic ThreeUI foil layer for Volumes 3 - 6
    t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '500 15px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "2.8px", t.fillText("WORKING VOLUMES  /  " + ge(r), 58, 70), t.globalAlpha = 0.7, t.lineWidth = 1, t.beginPath(), t.moveTo(58, 86), t.lineTo(164, 86), t.stroke(), t.globalAlpha = 1;
    const a = e.title.length > 10 ? 64 : 78;
    return t.font = "400 " + a + 'px "Iowan Old Style", Baskerville, Georgia, serif', t.fillText(e.title, 58, 1020), t.font = '500 14px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "2.4px", t.fillText(e.discipline.toUpperCase(), 60, 1066), Q(new l.CanvasTexture(o));
  }
  `;

  return code.slice(0, wnStartIdx) + newWnFunction + code.slice(anStartIdx);
}
