// scripts/modules/coverRenderer.mjs
// Front cover cloth textures (wn) and dynamic foil mask layers (Cn) for Three.js Bookshelf.

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
    const texture = Q(new l.CanvasTexture(o), { anisotropy: 16 });
    texture.name = e.id + "-cover-front";

    // --- Custom MOKA book (Book 01) ---
    if (e.id === "codex") {
      const renderMoka = () => {
        t.clearRect(0, 0, o.width, o.height);
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

        t.fillStyle = "rgba(0,0,0,0.4)";
        t.fillRect(44, 0, 3, o.height);
        t.fillStyle = "rgba(255,255,255,0.08)";
        t.fillRect(47, 0, 1, o.height);

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

        const cx = o.width / 2;
        const cy = 460;
        if (typeof customMokaIcon !== "undefined" && customMokaIcon && customMokaIcon.naturalWidth > 0) {
          const iconSize = 420;
          t.drawImage(customMokaIcon, cx - iconSize / 2, cy - iconSize / 2, iconSize, iconSize);
        }

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

        t.fillStyle = e.accent || "#c87046";
        t.fillRect(130, o.height - 12, 16, 12);

        texture.needsUpdate = true;
        __wake(30);
      };

      renderMoka();
      if (typeof customMokaIcon !== "undefined" && customMokaIcon && !customMokaIcon.complete) {
        customMokaIcon.onload = renderMoka;
      }
      return texture;
    }

    // --- Custom Volume 06 (JoinApp) ---
    if (e.id === "xcode") {
      const renderJoinApp = () => {
        t.clearRect(0, 0, o.width, o.height);
        const r = ye(pe(e.id) + e.seed);
        t.fillStyle = "#6830D1";
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

        t.fillStyle = "rgba(0,0,0,0.42)";
        t.fillRect(44, 0, 3, o.height);
        t.fillStyle = "rgba(255,255,255,0.12)";
        t.fillRect(47, 0, 1, o.height);

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

        const cx = o.width / 2;
        const cy = 480;
        if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && customJoinAppImg.naturalWidth > 0) {
          const imgW = 630;
          const imgH = 630;
          t.drawImage(customJoinAppImg, cx - imgW / 2, cy - imgH / 2, imgW, imgH);
        }

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

        t.fillStyle = "#a3e635";
        t.fillRect(130, o.height - 12, 16, 12);

        texture.needsUpdate = true;
        __wake(30);
      };

      renderJoinApp();
      if (typeof customJoinAppImg !== "undefined" && customJoinAppImg && !customJoinAppImg.complete) {
        customJoinAppImg.onload = renderJoinApp;
      }
      return texture;
    }

    // --- Custom Volume 02 (Figma / Sawyer Robot) ---
    if (e.id === "figma") {
      const renderFigma = () => {
        t.clearRect(0, 0, o.width, o.height);
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

        t.fillStyle = "rgba(0,0,0,0.65)";
        t.fillRect(44, 0, 3, o.height);
        t.fillStyle = "rgba(255,255,255,0.08)";
        t.fillRect(47, 0, 1, o.height);

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

        const cx = o.width / 2;
        const cy = 490;
        if (typeof customFigmaImg !== "undefined" && customFigmaImg && customFigmaImg.naturalWidth > 0) {
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
          const grad = t.createRadialGradient(cx, cy + 40, 60, cx, cy + 40, 340);
          grad.addColorStop(0, "rgba(134, 13, 13, 0.22)");
          grad.addColorStop(0.5, "rgba(134, 13, 13, 0.06)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          t.fillStyle = grad;
          t.beginPath();
          t.arc(cx, cy + 40, 340, 0, Math.PI * 2);
          t.fill();
          t.drawImage(customFigmaImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          t.restore();
        }

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

        t.fillStyle = "#860d0d";
        t.fillRect(130, o.height - 12, 16, 12);

        texture.needsUpdate = true;
        __wake(30);
      };

      renderFigma();
      if (typeof customFigmaImg !== "undefined" && customFigmaImg && !customFigmaImg.complete) {
        customFigmaImg.onload = renderFigma;
      }
      return texture;
    }

    // --- Custom Volume 05 (Claude Code / Cat Breed Recognition) ---
    if (e.id === "claude-code") {
      const renderClaudeCode = () => {
        t.clearRect(0, 0, o.width, o.height);
        const r = ye(pe(e.id) + e.seed);
        t.fillStyle = e.color || "#123524";
        t.fillRect(0, 0, o.width, o.height);

        const a = t.createLinearGradient(0, 0, o.width, 0);
        a.addColorStop(0, "rgba(0,0,0,0.52)");
        a.addColorStop(0.06, "rgba(0,0,0,0.18)");
        a.addColorStop(0.12, "rgba(0,0,0,0.0)");
        a.addColorStop(0.96, "rgba(0,0,0,0.14)");
        a.addColorStop(1, "rgba(0,0,0,0.52)");
        t.fillStyle = a;
        t.fillRect(0, 0, o.width, o.height);

        for (let c = 0; c < 1250; c += 1) {
          const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
          t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.04)";
          t.lineWidth = 0.6 + r() * 0.8;
          t.beginPath();
          t.moveTo(i, d);
          t.lineTo(i + s, d + (r() - 0.5) * 2);
          t.stroke();
        }

        t.fillStyle = "rgba(0,0,0,0.55)";
        t.fillRect(44, 0, 3, o.height);
        t.fillStyle = "rgba(255,255,255,0.06)";
        t.fillRect(47, 0, 1, o.height);

        t.fillStyle = e.foil || "#efc16d";
        t.textAlign = "left";
        t.textBaseline = "alphabetic";
        t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
        t.letterSpacing = "3px";
        t.fillText("WORKING VOLUMES  /  05", 64, 88);
        t.strokeStyle = e.foil || "#efc16d";
        t.lineWidth = 2;
        t.beginPath();
        t.moveTo(64, 102);
        t.lineTo(260, 102);
        t.stroke();

        const cx = o.width / 2;
        const cy = 490;
        if (typeof customClaudeCodeImg !== "undefined" && customClaudeCodeImg && customClaudeCodeImg.naturalWidth > 0) {
          const maxW = 620;
          const maxH = 580;
          const aspect = (customClaudeCodeImg.naturalWidth || 800) / (customClaudeCodeImg.naturalHeight || 800);
          let drawW = maxW;
          let drawH = drawW / aspect;
          if (drawH > maxH) {
            drawH = maxH;
            drawW = drawH * aspect;
          }
          t.save();
          t.imageSmoothingEnabled = false;
          t.drawImage(customClaudeCodeImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          t.restore();
        }

        const claudeTitleSize = e.title.length > 18 ? 42 : (e.title.length > 12 ? 58 : 82);
        const titleLetterSpacing = e.title.length > 18 ? "1.5px" : "4px";
        t.font = '600 ' + claudeTitleSize + 'px "Iowan Old Style", Baskerville, Georgia, serif';
        t.letterSpacing = titleLetterSpacing;
        t.fillStyle = e.foil || "#efc16d";
        t.textAlign = "left";
        t.textBaseline = "alphabetic";
        t.fillText(e.title.toUpperCase(), 74, 980);

        t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
        t.letterSpacing = "3px";
        t.fillStyle = e.foil || "#efc16d";
        t.fillText(e.discipline ? e.discipline.toUpperCase() : "VISION & DEEP LEARNING", 76, 1024);

        t.fillStyle = e.accent || "#f5c563";
        t.fillRect(130, o.height - 12, 16, 12);

        texture.needsUpdate = true;
        __wake(30);
      };

      renderClaudeCode();
      if (typeof customClaudeCodeImg !== "undefined" && customClaudeCodeImg && !customClaudeCodeImg.complete) {
        customClaudeCodeImg.onload = renderClaudeCode;
      }
      return texture;
    }

    // Default Fallback
    if (qt) {
      const [c, i, d, s] = Gr[S.indexOf(e)];
      t.drawImage(nt, c, i, d, s, 0, 0, o.width, o.height);
      const h = t.createLinearGradient(0, 0, o.width, 0);
      h.addColorStop(0, "rgba(0,0,0,0.16)");
      h.addColorStop(0.055, "rgba(255,255,255,0.015)");
      h.addColorStop(0.93, "rgba(255,255,255,0)");
      h.addColorStop(1, "rgba(0,0,0,0.1)");
      t.fillStyle = h;
      t.fillRect(0, 0, o.width, o.height);
      return texture;
    }

    const r = ye(pe(e.id) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    return texture;
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
      return Q(new l.CanvasTexture(o), { anisotropy: 16 });
    }

    // Custom Volume 2 Foil Layer (Figma)
    if (e.id === "figma") {
      t.fillStyle = "#ffffff";
      t.strokeStyle = "#ffffff";
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
      const figmaFoilSize = e.title.length > 8 ? 68 : 90;
      t.font = '600 ' + figmaFoilSize + 'px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = "4px";
      t.shadowColor = "rgba(134, 13, 13, 1.0)";
      t.shadowBlur = 26;
      t.fillText(e.title.toUpperCase(), 74, 980);
      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.shadowColor = "rgba(134, 13, 13, 0.8)";
      t.shadowBlur = 10;
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "SAWYER ROBOT", 78, 1024);
      t.shadowBlur = 0;
      return Q(new l.CanvasTexture(o), { anisotropy: 16 });
    }

    // Custom Volume 3 Foil Layer (Cursor / Semantic-ETL-Pipeline)
    if (e.id === "cursor") {
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.fillStyle = "#ffffff";
      t.strokeStyle = "#ffffff";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.fillText("WORKING VOLUMES  /  03", 64, 88);
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();
      let titleSize = 48;
      t.font = '700 ' + titleSize + 'px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "-0.5px";
      while (t.measureText("Semantic-ETL-Pipeline").width > o.width - 128 && titleSize > 28) {
        titleSize -= 2;
        t.font = '700 ' + titleSize + 'px Inter, "Helvetica Neue", Arial, sans-serif';
      }
      t.fillText("Semantic-ETL-Pipeline", 64, 980);
      t.font = '600 16px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "4px";
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "DIRECTED EDITING", 68, 1024);
      return Q(new l.CanvasTexture(o), { anisotropy: 16 });
    }

    // Custom Volume 7 Foil Layer (JoinApp)
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
      return Q(new l.CanvasTexture(o), { anisotropy: 16 });
    }

    // Custom Volume 5 Foil Layer (Claude Code)
    if (e.id === "claude-code") {
      t.fillStyle = "#efc16d";
      t.strokeStyle = "#efc16d";
      t.textAlign = "left";
      t.textBaseline = "alphabetic";
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.shadowColor = "rgba(239, 193, 109, 0.95)";
      t.shadowBlur = 14;
      t.fillText("WORKING VOLUMES  /  05", 64, 88);
      t.lineWidth = 2;
      t.beginPath();
      t.moveTo(64, 102);
      t.lineTo(260, 102);
      t.stroke();
      const claudeFoilSize = e.title.length > 18 ? 42 : (e.title.length > 12 ? 58 : 82);
      const foilLetterSpacing = e.title.length > 18 ? "1.5px" : "4px";
      t.font = '600 ' + claudeFoilSize + 'px "Iowan Old Style", Baskerville, Georgia, serif';
      t.letterSpacing = foilLetterSpacing;
      t.shadowColor = "rgba(239, 193, 109, 1.0)";
      t.shadowBlur = 24;
      t.fillText(e.title.toUpperCase(), 74, 980);
      t.font = '600 15px Inter, "Helvetica Neue", Arial, sans-serif';
      t.letterSpacing = "3px";
      t.shadowColor = "rgba(239, 193, 109, 0.85)";
      t.shadowBlur = 12;
      t.fillText(e.discipline ? e.discipline.toUpperCase() : "VISION & DEEP LEARNING", 76, 1024);
      t.shadowBlur = 0;
      return Q(new l.CanvasTexture(o), { anisotropy: 16 });
    }

    // Authentic ThreeUI foil layer for Volume 4 (Antigravity)
    t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '500 15px Inter, "Helvetica Neue", Arial, sans-serif', t.letterSpacing = "2.8px", t.fillText("WORKING VOLUMES  /  " + ge(r), 58, 70), t.globalAlpha = 0.7, t.lineWidth = 1, t.beginPath(), t.moveTo(58, 86), t.lineTo(164, 86), t.stroke(), t.globalAlpha = 1;
    const a = e.title.length > 10 ? 64 : 78;
    t.font = "400 " + a + 'px "Iowan Old Style", Baskerville, Georgia, serif';
    t.fillText(e.title, 58, 1020);
    const discSize = e.discipline && e.discipline.length > 25 ? 11 : 14;
    const discSpacing = e.discipline && e.discipline.length > 25 ? "1.5px" : "2.4px";
    t.font = '500 ' + discSize + 'px Inter, "Helvetica Neue", Arial, sans-serif';
    t.letterSpacing = discSpacing;
    t.fillText(e.discipline ? e.discipline.toUpperCase() : "WAREHOUSE ROUTING AND SCHEDULING SYSTEM", 60, 1066);
    return Q(new l.CanvasTexture(o), { anisotropy: 16 });
  };\n`;

  return code.slice(0, wnStartIdx) + newWnFunction + code.slice(anStartIdx);
}