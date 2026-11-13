// scripts/modules/pageRenderer.mjs
// Lazy interior page geometry & texture generator driven by src/content/volumes/*.json.
// Defers all 12 flexible PlaneGeometry meshes, Float32Arrays, and 512x768 page textures
// until the user inspects or opens a book (hydrateBookPages).

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
              content: ch.content || "",
              image: ch.image || "",
              imageCaption: ch.imageCaption || "",
              plateTitle: ch.plateTitle || ""
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
    const t = o.getContext("2d", { alpha: false }), r = ye(pe(\`\${e.id}-endpaper\`) + e.seed);
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
    const a = Q(new l.CanvasTexture(o), { anisotropy: 2 });
    a.name = \`\${e.id}-patterned-endpaper\`;
    _endpaperCache.set(e.id, a);
    return a;
  }

  function Sn(e) {
    return _t || Tn(e, false);
  }

  const _volumeDataMap = ${JSON.stringify(volumeDataMap)};
  const _bookPagesCache = new Map();
  const _imageCache = new Map();

  function getLazyImage(src) {
    if (!src) return null;
    if (_imageCache.has(src)) {
      const existing = _imageCache.get(src);
      if (existing && (!existing.complete || existing.naturalWidth > 0)) {
        return existing;
      }
      _imageCache.delete(src);
    }
    if (src.includes('router_benchmark') && typeof customBenchmarkImg !== 'undefined') {
      _imageCache.set(src, customBenchmarkImg);
      return customBenchmarkImg;
    }
    if (src.includes('cozmo_hardware_sketch') && typeof customCozmoSketchImg !== 'undefined') {
      _imageCache.set(src, customCozmoSketchImg);
      return customCozmoSketchImg;
    }
    const img = typeof createLazyImg === "function" ? createLazyImg(src) : (() => {
      if (typeof Image === "undefined") return null;
      const i = new Image();
      i.decoding = "async";
      i.datasetSrc = src;
      return i;
    })();
    _imageCache.set(src, img);
    return img;
  }

  function drawPlateImageOrWait(ctx, img, x, y, imgW, texture) {
    if (!img) return;
    const drawNow = () => {
      if (img.naturalWidth > 0) {
        let w = imgW;
        let h = Math.round((imgW / img.naturalWidth) * img.naturalHeight);
        const maxH = 270;
        if (h > maxH) {
          h = maxH;
          w = Math.round((maxH / img.naturalHeight) * img.naturalWidth);
        }
        const drawX = x + Math.round((imgW - w) / 2);
        ctx.drawImage(img, drawX, y, w, h);
        if (texture) texture.needsUpdate = true;
        if (typeof __wake === "function") __wake(12);
      }
    };
    if (img.naturalWidth > 0) {
      drawNow();
      return;
    }
    if (!img.src && img.datasetSrc) {
      img.src = img.datasetSrc;
    }
    img.addEventListener("load", drawNow, { once: true });
    if (typeof img.decode === "function") {
      img.decode().then(drawNow).catch(() => {});
    }
  }

  function renderBookPagesOnDemand(e) {
    if (_bookPagesCache.has(e.id)) return _bookPagesCache.get(e.id);
    const vol = _volumeDataMap[e.id] || e;
    const r = \`#\${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}\`;
    const i = 512, d = 768;

    const pages = Array.from({ length: 12 }, (a, n) => {
      const c = document.createElement("canvas");
      c.width = i;
      c.height = d;
      const s = c.getContext("2d", { alpha: false, willReadFrequently: false });
      const texture = Q(new l.CanvasTexture(c), { anisotropy: 2 });
      texture.name = \`\${e.id}-interior-page-\${n + 1}\`;

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

      // 1. LEFT PAGES (Diagrams & Plates) - Completely data-driven from JSON
      // Left pages are odd indices (n = 1, 3, 5, 7). Each faces a chapter (chIndex = Math.floor((n - 1) / 2)).
      if (n % 2 === 1 && n <= 7) {
        const chIndex = Math.floor((n - 1) / 2);
        const ch = vol.chapters?.[chIndex];
        if (ch && ch.image) {
          const plateNum = String(chIndex + 1).padStart(2, "0");
          const plateHeading = (ch.plateTitle || ch.subtitle || ch.title || ("PLATE " + plateNum)).toUpperCase();
          s.fillStyle = r;
          s.font = '500 11px Inter, "Helvetica Neue", Arial, sans-serif';
          s.letterSpacing = "2px";
          s.fillText("PLATE " + plateNum + "  /  " + plateHeading, 54, 146);

          const img = getLazyImage(ch.image);
          drawPlateImageOrWait(s, img, 54, 180, 404, texture);

          const captionText = ch.imageCaption || ch.caption;
          if (captionText) {
            s.globalAlpha = 0.52;
            s.font = '400 15px "Iowan Old Style", Georgia, serif';
            s.fillStyle = r;
            de(s, captionText, 54, 470, 38, 22, 5);
            s.globalAlpha = 1;
          }
        }
        // If no image is provided in JSON, nothing is drawn:
        // no black placeholder rectangle, no dummy plate title, no clutter.
      }

      // 2. RIGHT PAGES (Full Narrative Chapters - Loaded from Unified JSON Content)
      const ch0 = vol.chapters?.[0];
      const ch1 = vol.chapters?.[1];
      const ch2 = vol.chapters?.[2];
      const ch3 = vol.chapters?.[3];

      if (n === 0) {
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
      texture.needsUpdate = true;
      return texture;
    });
    _bookPagesCache.set(e.id, pages);
    return pages;
  }

  function hydrateBookPages(bookObj) {
    if (!bookObj || bookObj.pagesHydrated) return;
    const e = bookObj.data;
    const realTextures = renderBookPagesOnDemand(e);
    const paperFace = bookObj.paperFaceTexture || Tn(e);

    // Lazily create the 12 pageSheet materials on first inspection/open
    if (!bookObj.pageMaterials || bookObj.pageMaterials.length === 0) {
      bookObj.pageMaterials = realTextures.map((tex) => {
        const mat = ut(P.pageSheet);
        mat.map = tex;
        mat.bumpMap = paperFace;
        mat.bumpScale = 12e-4;
        mat.roughness = 0.96;
        mat.side = l.FrontSide;
        mat.needsUpdate = !0;
        bookObj.fadeMaterials.push(mat);
        bookObj.materials.push(mat);
        return mat;
      });
    } else {
      for (let pIdx = 0; pIdx < 12; pIdx++) {
        if (realTextures[pIdx] && bookObj.pageMaterials[pIdx]) {
          bookObj.pageMaterials[pIdx].map = realTextures[pIdx];
          bookObj.pageMaterials[pIdx].needsUpdate = !0;
        }
      }
    }

    // Lazily build the 6 flexible page pivot meshes (12 PlaneGeometries) if deferred at boot
    if (bookObj.pagePivots && bookObj.pagePivots.length === 0 && bookObj.pageDims) {
      const { a, c, i, f, g, v, C } = bookObj.pageDims;
      const kt = g - f * 0.42;
      for (let Z = 0; Z < 6; Z += 1) {
        const q = 5 - Z;
        const ot = bookObj.pageMaterials[q * 2];
        const ra = bookObj.pageMaterials[q * 2 + 1];
        const ae = new l.Group();
        ae.name = \`\${e.id}-page-\${Z}\`;
        ae.position.set(-a * 0.5 + f * 0.65, 0, C * 0.5 + 15e-4 + Z * 15e-4);
        ae.userData.restZ = ae.position.z;
        ae.userData.turnedZ = c * 0.5 + i + 4e-3 + q * 15e-4;

        const Dt = new l.PlaneGeometry(1, 1, Qt, Qo);
        const Kt = new l.PlaneGeometry(1, 1, Qt, Qo);
        const Mt = T(Dt, ot, \`\${e.id}-page-sheet-\${Z}-front\`, !1, !0);
        Mt.scale.set(kt, v - 0.014, 1);
        Mt.position.set(kt * 0.5, 0, 22e-5);
        ae.add(Mt);

        const rt = T(Kt, ra, \`\${e.id}-page-sheet-\${Z}-back\`, !1, !0);
        rt.scale.set(kt, v - 0.014, 1);
        rt.position.set(kt * 0.5, 0, -22e-5);
        rt.rotation.y = Math.PI;
        ae.add(rt);

        ae.userData.flex = {
          curve: 0,
          curveVelocity: 0,
          twist: 0,
          twistVelocity: 0,
          surfaces: [
            { geometry: Dt, position: Dt.attributes.position, base: Float32Array.from(Dt.attributes.position.array), direction: 1 },
            { geometry: Kt, position: Kt.attributes.position, base: Float32Array.from(Kt.attributes.position.array), direction: -1 }
          ]
        };
        bookObj.motion.add(ae);
        bookObj.pagePivots.push(ae);
        bookObj.pageSurfaces.push(Mt, rt);
        bookObj.pageGestureSurfaces.push(Mt, rt);
      }
    }

    bookObj.interiorPageTextures = realTextures;

    if (typeof renderEndpaperOnDemand === "function" && bookObj.endpaperMaterial) {
      bookObj.endpaperMaterial.map = renderEndpaperOnDemand(e);
      bookObj.endpaperMaterial.needsUpdate = !0;
    }
    if (typeof renderBackCloth === "function" && bookObj.backCoverMaterial) {
      bookObj.backCoverMaterial.map = renderBackCloth(e);
      bookObj.backCoverMaterial.needsUpdate = !0;
    }
    if (typeof renderBackFoil === "function" && bookObj.backFoilMaterial) {
      const bf = renderBackFoil(e);
      bookObj.backFoilMaterial.map = bf;
      bookObj.backFoilMaterial.alphaMap = bf;
      bookObj.backFoilMaterial.bumpMap = bf;
      bookObj.backFoilMaterial.needsUpdate = !0;
    }
    if (bookObj.backFoilMesh) {
      bookObj.backFoilMesh.visible = !0;
    }
    bookObj.pagesHydrated = !0;
    if (typeof __wake === "function") __wake(60);
  }

  function Pn(e) {
    return [];
  };\n`;

  return code.slice(0, startIdx) + newPnFunction + code.slice(erStartIdx);
}
