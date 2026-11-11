// scripts/modules/enginePatches.mjs
// Universal on-demand WebGL rendering loop (0 FPS idle), staggered non-blocking initialization,
// WebGL compileAsync, lightweight directional lighting (zero RectAreaLights), DPR clamping <= 2.0,
// inline Base64 removal, deferred page meshes, and clean teardown.

export function applyEnginePatches(rawCode) {
  let code = rawCode;

  // 0. Strip unused 302 KB RectAreaLightUniformsLib import
  code = code.replace(
    /import\s*\{\s*RectAreaLightUniformsLib\s+as\s+ia\s*\}\s*from\s*"\.\/three165\/RectAreaLightUniformsLib\.js";\r?\n?/g,
    ''
  );

  // 1. Fix any double semicolon-comma issue
  code = code.replace(/;\s*,\s*z\.enabled/g, '; z.enabled');

  // 2. Clamp powerPreference from "high-performance" to "default" to protect discrete GPUs
  code = code.replace(/powerPreference:\s*"high-performance"/g, 'powerPreference: "default"');

  // 3. Set setPixelRatio to native high-density DPR (max 2.0 per AGENTS.md)
  code = code.replace(
    /D\.setPixelRatio\(Math\.min\(window\.devicePixelRatio \|\| 1, [^)]+\)\)/g,
    'D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0))'
  );

  // 3b. Right-size Key light shadow map from 2048 to 1024 for 4x faster rasterization
  code = code.replace(
    'e.shadow.mapSize.set(2048, 2048)',
    'e.shadow.mapSize.set(1024, 1024)'
  );

  // 3c. Strip 588 KB inline cover atlas Base64 (Vr) & move 124 KB wood texture Base64 (Yr) to /walnut_wood.webp
  code = code.replace(/Vr\s*=\s*"data:image\/webp;base64,[^"]*"/g, 'Vr = ""');
  code = code.replace(/Yr\s*=\s*"data:image\/webp;base64,[^"]*"/g, 'Yr = "/walnut_wood.webp"');
  code = code.replace('nt.decoding = "async", nt.src = Vr;', 'nt.decoding = "async"; if (Vr) nt.src = Vr;');

  // 4. Inject/update Motion Frames keeper, boot/viewport guards, __wake helper, spineAnim, and heroDrag
  code = code
    .replace(/\/\* __ENGINE_TOP_START__ \*\/[\s\S]*?\/\* __ENGINE_TOP_END__ \*\//g, '')
    .replace(/\s*let __motionFrames = \d+;\s*const __wake =[\s\S]*?startV: 0 \};\r?\n?/g, '');

  code = code.replace(
    'function fa(Nr, m, He = {}) {',
    `function fa(Nr, m, He = {}) {
  /* __ENGINE_TOP_START__ */
  let __motionFrames = 2;
  let __isBooted = !1;
  let __inViewport = !0;
  let __viewportObserver = null;
  let __docClickHandler = null;
  let __viewSpineHandler = null;
  let __resetViewHandler = null;
  const __wake = (frames = 45) => { __motionFrames = Math.max(__motionFrames, frames); U(); };
  const spineAnim = { active: false, progress: 0, duration: 0.62, fromQuat: new l.Quaternion(), toQuat: new l.Quaternion() };
  const heroDrag = { active: false, pointerId: null, startX: 0, startY: 0, lastX: 0, lastY: 0, lastTime: 0, velocityX: 0, hasDragged: false, isVerticalScroll: false, dragDistance: 0, startV: 0 };
  /* __ENGINE_TOP_END__ */`
  );

  // 5. Convert shared paper/headband materials P to fast MeshStandardMaterial (eliminating extra physical shader permutations)
  const pStartIdx = code.indexOf('const P = {');
  const utStartIdx = code.indexOf('function ut(e) {');
  if (pStartIdx !== -1 && utStartIdx !== -1) {
    const newPBlock = `const P = {
    box: new l.BoxGeometry(1, 1, 1),
    plane: new l.PlaneGeometry(1, 1),
    page: new l.MeshStandardMaterial({
      color: 15196111,
      roughness: 0.95,
      metalness: 0
    }),
    pageSheet: new l.MeshStandardMaterial({
      color: 15656663,
      roughness: 0.955,
      metalness: 0,
      side: l.DoubleSide
    }),
    headband: new l.MeshStandardMaterial({
      color: 13018733,
      roughness: 0.58,
      metalness: 0.16
    }),
    walnut: new l.MeshStandardMaterial({
      color: 4860701,
      roughness: 0.58,
      metalness: 0
    }),
    walnutDark: new l.MeshStandardMaterial({
      color: 2758415,
      roughness: 0.7,
      metalness: 0
    })
  };\n  `;
    code = code.slice(0, pStartIdx) + newPBlock + code.slice(utStartIdx);
  }

  // 5b. Optimize En(e, o): convert matte interior parts to MeshStandardMaterial and defer 12 page geometries/materials until hydrateBookPages()
  const enStartIdx = code.indexOf('function En(e, o) {');
  const orStartIdx = code.indexOf('function or() {');
  if (enStartIdx !== -1 && orStartIdx !== -1) {
    const newEnFunction = `function En(e, o) {
    const t = new l.Group();
    t.name = \`book-\${e.id}\`, t.userData.index = o;
    const r = new l.Group();
    r.name = \`\${e.id}-motion\`, t.add(r);
    const a = e.width, n = e.height, c = e.depth, i = 0.032, d = 45e-4, s = 25e-4, h = 15e-4, x = 0.014, f = 0.082, g = a - 0.074, v = n - 0.068, C = c - 0.026, F = wn(e), N = Cn(e), j = An(e), E = Ln(e), Y = Tn(e), _ = Pn(e), J = Sn(e), fe = zn(e), Ee = Dn(e), je = Kn(e), vt = kn(e), xt = Mn(e), Dr = eo(N, \`\${e.id}-front-foil-emboss\`), Kr = eo(je, \`\${e.id}-spine-foil-emboss\`), kr = eo(xt, \`\${e.id}-back-foil-emboss\`), qe = new l.MeshPhysicalMaterial({
      color: e.color,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.34, 0.34),
      roughnessMap: E.roughness,
      roughness: 0.98,
      metalness: 0.02,
      bumpMap: j,
      bumpScale: 45e-4,
      sheen: 0.34,
      sheenRoughness: 0.76,
      sheenColor: new l.Color(e.foil),
      transparent: !0
    }), co = new l.MeshPhysicalMaterial({
      map: F,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.28, 0.28),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 35e-4,
      roughness: 0.92,
      metalness: 0.035,
      clearcoat: 0.06,
      clearcoatRoughness: 0.72,
      sheen: 0.26,
      sheenRoughness: 0.78,
      transparent: !0
    }), po = new l.MeshPhysicalMaterial({
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
    }), fo = new l.MeshPhysicalMaterial({
      map: Ee,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.3, 0.3),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 4e-3,
      roughness: 0.95,
      metalness: 0.025,
      sheen: 0.27,
      sheenRoughness: 0.78,
      transparent: !0,
      side: l.DoubleSide
    }), ho = new l.MeshPhysicalMaterial({
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
    }), uo = new l.MeshPhysicalMaterial({
      map: vt,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.28, 0.28),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 35e-4,
      roughness: 0.96,
      metalness: 0.025,
      sheen: 0.25,
      sheenRoughness: 0.8,
      transparent: !0,
      side: l.DoubleSide
    }), go = new l.MeshPhysicalMaterial({
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
    }), et = new l.MeshStandardMaterial({
      color: new l.Color(e.palette.paperPale).lerp(new l.Color(15919832), 0.5),
      map: J,
      bumpMap: Y,
      bumpScale: 18e-4,
      roughness: 0.94,
      metalness: 0,
      side: l.DoubleSide,
      transparent: !0
    }), mo = new l.MeshStandardMaterial({
      color: 16777215,
      map: fe.fore,
      bumpMap: fe.fore,
      bumpScale: 22e-4,
      roughness: 0.93,
      metalness: 0,
      side: l.DoubleSide,
      transparent: !0
    }), bo = new l.MeshStandardMaterial({
      color: 16777215,
      map: fe.headTail,
      bumpMap: fe.headTail,
      bumpScale: 15e-4,
      roughness: 0.94,
      metalness: 0,
      side: l.DoubleSide,
      transparent: !0
    }), wt = new l.MeshStandardMaterial({
      color: new l.Color(e.color).multiplyScalar(0.42),
      roughness: 0.9,
      metalness: 0,
      bumpMap: j,
      bumpScale: 6e-3,
      side: l.DoubleSide,
      transparent: !0
    }), we = ut(P.page), yo = ut(P.headband), Ct = [], vo = new l.MeshStandardMaterial({
      color: new l.Color(9273711).lerp(new l.Color(e.palette.paperPale), 0.34),
      roughness: 0.98,
      metalness: 0,
      transparent: !0
    }), xo = new l.MeshStandardMaterial({
      color: new l.Color(e.foil).lerp(new l.Color(e.color), 0.28),
      roughness: 0.62,
      metalness: 0.08,
      side: l.DoubleSide,
      transparent: !0
    });
    we.map = Y, we.bumpMap = Y, we.bumpScale = 14e-4, we.roughness = 0.95, we.needsUpdate = !0;
    const Mr = new Et(a, n, i, 2, d), wo = In(g, v, C, s), At = oo(a - 7e-3, n - 7e-3, 35e-4), Er = oo(a - 0.045, n - 0.045, 3e-3);
    t.userData.construction = {
      board: i,
      coverRadius: d,
      pageRadius: s,
      spineRadius: h,
      spineBoardThickness: x,
      spineProfile: "flat",
      spineFoilLayered: !0,
      backSurfaceLayered: !0,
      clothPbrMaps: !0,
      foilEmbossed: !0,
      interiorPageDesigns: 12,
      flexiblePageSegments: Qt,
      clothLikePageDeformation: !0,
      turnInStrips: 8,
      ribbonBookmark: !0,
      pageSignatures: wo.userData.pageSignatures,
      gutterCompression: wo.userData.gutterCompression,
      coverArtInset: 7e-3,
      coverOverhangX: (a - g) * 0.5,
      coverOverhangY: (n - v) * 0.5
    };
    const Lt = T(wo, we, \`\${e.id}-page-block\`);
    Lt.position.x = 0.018, r.add(Lt);
    const he = new l.Group();
    he.name = \`\${e.id}-back-cover-pivot\`, he.position.set(-a * 0.5, 0, -c * 0.5 - i * 0.5);
    const jr = T(Mr, qe, \`\${e.id}-back-cover\`);
    jr.position.x = a * 0.5, he.add(jr);
    const Co = T(At, uo, \`\${e.id}-back-cover-art\`, !1, !1);
    Co.position.set(a * 0.5, 0, -i * 0.55), Co.rotation.y = Math.PI, he.add(Co);
    const Ao = T(At, go, \`\${e.id}-back-foil-art\`, !1, !1);
    Ao.position.set(a * 0.5, 0, -i * 0.605), Ao.rotation.y = Math.PI, Ao.visible = !1, he.add(Ao);
    const qr = T(Er, et, \`\${e.id}-back-endpaper\`, !1, !0);
    qr.position.set(a * 0.5, 0, i * 0.515), he.add(qr), tr(he, e, "back", a, n, i * 0.53, qe);
    const Tt = T(P.plane, wt, \`\${e.id}-back-hinge-groove\`, !1, !1);
    Tt.scale.set(0.012, n * 0.94, 1), Tt.position.set(0.038, 0, -i * 0.535), Tt.rotation.y = Math.PI, he.add(Tt), r.add(he);
    const ne = new l.Group();
    ne.name = \`\${e.id}-front-cover-pivot\`, ne.position.set(-a * 0.5, 0, c * 0.5 + i * 0.5);
    const Lo = T(Mr, qe, \`\${e.id}-front-cover\`);
    Lo.position.x = a * 0.5, ne.add(Lo);
    const Rr = T(At, co, \`\${e.id}-cover-art\`, !1, !1);
    Rr.position.set(a * 0.5, 0, i * 0.55), ne.add(Rr);
    const Hr = T(At, po, \`\${e.id}-foil-art\`, !1, !1);
    Hr.position.set(a * 0.5, 0, i * 0.605), ne.add(Hr);
    const To = T(Er, et, \`\${e.id}-front-endpaper\`, !1, !0);
    To.position.set(a * 0.5, 0, -i * 0.515), To.rotation.y = Math.PI, ne.add(To), tr(ne, e, "front", a, n, -i * 0.53, qe);
    const So = T(P.plane, wt, \`\${e.id}-front-hinge-groove\`, !1, !1);
    So.scale.set(0.012, n * 0.94, 1), So.position.set(0.038, 0, i * 0.655), ne.add(So), r.add(ne);
    const Xr = [], St = [];
    const ta = new Et(x, n - 0.012, c + i * 1.88, 1, h), Pt = T(ta, fo, \`\${e.id}-flat-spine\`);
    Pt.position.x = -a * 0.5 - x * 0.35, Pt.userData.profile = "flat", r.add(Pt);
    const zt = T(P.plane, ho, \`\${e.id}-spine-foil\`, !1, !1);
    zt.scale.set(c + i * 1.82, n - 0.018, 1), zt.rotation.y = -Math.PI * 0.5, zt.position.set(Pt.position.x - x * 0.505, 0, 0), r.add(zt);
    const Ur = T(new Et(f * 0.68, n - 0.056, Math.max(0.045, C - 8e-3), 1, 15e-4), et, \`\${e.id}-spine-lining\`);
    Ur.position.set(-a * 0.5 + f * 0.38, 0, 0), r.add(Ur), [-1, 1].forEach((Z) => {
      const q = new l.CylinderGeometry(0.012, 0.012, C * 0.88, 12, 1, !1), ot = T(q, yo, \`\${e.id}-headband-\${Z}\`);
      ot.rotation.x = Math.PI * 0.5, ot.position.set(-g * 0.5 + 0.046, Z * (v * 0.5 - 4e-3), 0), r.add(ot);
    });
    const oa = oo(0.034, v * 0.76, 2e-3), Po = T(oa, xo, \`\${e.id}-ribbon-bookmark\`, !1, !0);
    Po.position.set(-g * 0.5 + 0.09 + e.seed % 3 * 0.018, -v * 0.17, C * 0.5 + 3e-3), Po.rotation.z = (e.seed % 2 ? -1 : 1) * 0.014, r.add(Po);
    for (let Z = 0; Z < 6; Z += 1) {
      const q = T(P.box, vo, \`\${e.id}-page-signature-\${Z + 1}\`, !1, !0);
      q.scale.set(35e-4, 135e-5, C * 0.91), q.position.set(0.018 + g * 0.5 + 1e-3, -v * 0.5 + (Z + 1) / 7 * v, 0), r.add(q);
    }
    const It = T(P.plane, mo, \`\${e.id}-fore-edge\`, !1, !0);
    It.scale.set(C * 0.94, v - 0.028, 1), It.rotation.y = Math.PI * 0.5, It.position.set(0.018 + g * 0.5 + 2e-3, 0, 0), r.add(It), [-1, 1].forEach((Z) => {
      const q = T(P.plane, bo, \`\${e.id}-\${Z > 0 ? "head" : "tail"}-edge\`, !1, !0);
      q.scale.set(g - 0.035, C * 0.94, 1), q.rotation.x = Z > 0 ? -Math.PI * 0.5 : Math.PI * 0.5, q.position.set(0.018, Z * (v * 0.5 + 2e-3), 0), r.add(q);
    });
    const Zr = new l.MeshBasicMaterial({ transparent: !0, opacity: 0, depthWrite: !1 }), Re = T(P.box, Zr, \`\${e.id}-hit-target\`, !1, !1);
    Re.scale.set(a * 1.34, n * 1.2, Math.max(c * 4, 1)), Re.position.set(-f * 0.18, 0, 0.12), Re.userData.index = o, r.add(Re), ko.push(Re);
    const Wr = new l.MeshBasicMaterial({
      color: new l.Color(e.palette.shelfDark),
      alphaMap: er(),
      transparent: !0,
      opacity: 0.24,
      depthWrite: !1,
      side: l.DoubleSide
    }), tt = T(P.plane, Wr, \`\${e.id}-contact-shadow\`, !1, !1);
    return tt.scale.set(a * 1.22, c * 2.05, 1), tt.rotation.x = -Math.PI * 0.5, tt.position.set(0, -n * 0.5 - 0.022, 0.025), t.add(tt), {
      data: e,
      root: t,
      motion: r,
      frontPivot: ne,
      frontCover: Lo,
      pageBlock: Lt,
      pagePivots: Xr,
      pageSurfaces: St,
      pageGestureSurfaces: [Lt],
      hit: Re,
      coverTexture: F,
      foilTexture: N,
      clothBumpTexture: j,
      clothSurfaceMaps: E,
      paperFaceTexture: Y,
      interiorPageTextures: _,
      endpaperTexture: J,
      pageEdgeTextures: fe,
      spineTexture: Ee,
      spineFoilTexture: je,
      backCoverTexture: vt,
      backFoilTexture: xt,
      foilEmbossTexture: Dr,
      spineEmbossTexture: Kr,
      backEmbossTexture: kr,
      contactShadow: tt,
      backFoilMesh: Ao,
      pageDims: { a, n, c, i, f, g, v, C },
      pageMaterials: Ct,
      backCoverMaterial: uo,
      backFoilMaterial: go,
      endpaperMaterial: et,
      pagesHydrated: !1,
      opacity: 1,
      lastOffset: null,
      fadeMaterials: [qe, co, po, fo, ho, uo, go, et, mo, bo, wt, we, yo, vo, xo],
      materials: [qe, co, po, fo, ho, uo, go, et, mo, bo, wt, we, yo, vo, xo, Wr, Zr],
      base: { width: a, height: n, depth: c }
    };
  }\n  `;
    code = code.slice(0, enStartIdx) + newEnFunction + code.slice(orStartIdx);
  }

  // 5c. Replace 5 heavy RectAreaLights in Hn() with fast DirectionalLights (removes LTC BRDF shader bottleneck)
  const hnStartIdx = code.indexOf('function Hn() {');
  const xnStartIdx = code.indexOf('function Xn() {');
  if (hnStartIdx !== -1 && xnStartIdx !== -1) {
    const newHnFunction = `function Hn() {
    I.hemisphere = new l.HemisphereLight(16775400, 5980208, 0.72), R.add(I.hemisphere);
    const e = new l.DirectionalLight(16771266, 1.48);
    e.name = "shadow-key", e.position.set(-4.6, 7.4, 5.8), e.castShadow = !0, e.shadow.mapSize.set(1024, 1024), e.shadow.camera.left = -6, e.shadow.camera.right = 6, e.shadow.camera.top = 6, e.shadow.camera.bottom = -1.5, e.shadow.camera.near = 1, e.shadow.camera.far = 18, e.shadow.bias = -18e-5, e.shadow.normalBias = 0.018, e.shadow.radius = 3.5, R.add(e), I.key = e;
    const o = new l.DirectionalLight(16771266, 0.58);
    o.name = "cloth-softbox", o.position.set(-3.2, 5.5, 4.6), R.add(o), I.softKey = o;
    const t = new l.DirectionalLight(14214119, 0.36);
    t.name = "cool-fill", t.position.set(5.5, 3.6, 4.2), R.add(t), I.fill = t;
    const r = new l.DirectionalLight(14001246, 0.62);
    r.name = "foil-rake", r.position.set(3.8, 3.6, -2.1), R.add(r), I.rim = r;
    const a = new l.DirectionalLight(14214119, 0.45);
    a.name = "back-cover-softbox", a.position.set(-1.8, 2.9, -4.5), R.add(a), I.backFill = a;
    const n = new l.DirectionalLight(16771266, 0.34);
    n.name = "spine-rake", n.position.set(-4.6, 3.2, 1.1), R.add(n), I.spineRake = n;
    const c = new l.DirectionalLight(16775143, 0.38);
    c.name = "page-edge-rake", c.position.set(4.2, 4.8, 3.1), R.add(c), I.pageRake = c;
  }\n  `;
    code = code.slice(0, hnStartIdx) + newHnFunction + code.slice(xnStartIdx);
  }

  // 5d. Update the render loop $n to universally sleep across EVERY 3D state (0 FPS Idle)
  if (!code.includes('const shouldKeepRendering =')) {
    const loopRegex = /const a = Math\.abs\(oe - V\) > 5e-4 \|\| Ne > 0;\s*[\s\S]*?!Ae && U\(\);/;
    const replacementLoop = `if (spineAnim.active && u) {
        spineAnim.progress += o / spineAnim.duration;
        const st = ct(A(spineAnim.progress, 0, 1));
        u.root.quaternion.slerpQuaternions(spineAnim.fromQuat, spineAnim.toQuat, st);
        if (spineAnim.progress >= 1) {
          spineAnim.active = false;
          u.root.quaternion.copy(spineAnim.toQuat);
        }
        __wake(5);
      }
      const a = Math.abs(oe - V) > 5e-4 || Ne > 0;
      const shouldKeepRendering = (__motionFrames > 0) || spineAnim.active || b === "opening" || b === "closing" || a || r || (p && p.active) || (typeof Ne !== "undefined" && Ne > 0) || (typeof te !== "undefined" && te < 1 && te > 0) || (typeof ft !== "undefined" && ft);
      if (__motionFrames > 0) __motionFrames--;
      shouldKeepRendering && !Ae && U();`;

    if (loopRegex.test(code)) {
      code = code.replace(loopRegex, replacementLoop);
    }
  }

  // Guard U() so ResizeObserver/pointer events cannot trigger synchronous D.render() during async boot
  code = code.replace(
    /function U\(\)\s*\{\s*[^}]*\}/,
    `function U() {
    __isBooted && !ee && !Ae && (ee = requestAnimationFrame($n));
  }`
  );

  // Sync visibilitychange with viewport intersection state
  code = code.replace(
    /function Sr\(\)\s*\{\s*[^}]*\}/,
    `function Sr() {
    Ae = document.hidden || !__inViewport, Ae ? ($e(!0), Te(), ee && (cancelAnimationFrame(ee), ee = 0)) : (Nt = performance.now(), U());
  }`
  );

  // 6. Connect all interaction and transition triggers to __wake()
  if (code.includes('function ve(e, o = !0) {') && !code.includes('hydrateBookPages(u)')) {
    code = code.replace(
      'function ve(e, o = !0) {',
      'function ve(e, o = !0) { __wake(75); if (e && u && !u.pagesHydrated && typeof hydrateBookPages === "function") hydrateBookPages(u);'
    );
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
  if (code.includes('function xe(e = ie) {') && !code.includes('hydrateBookPages(pt[O])')) {
    code = code.replace(
      'function xe(e = ie) {',
      'function xe(e = ie) { __wake(75); if (pt[O] && !pt[O].pagesHydrated && typeof hydrateBookPages === "function") hydrateBookPages(pt[O]);'
    );
  } else if (code.includes('function xe(e) {') && !code.includes('hydrateBookPages(pt[O])')) {
    code = code.replace(
      'function xe(e) {',
      'function xe(e) { __wake(75); if (pt[O] && !pt[O].pagesHydrated && typeof hydrateBookPages === "function") hydrateBookPages(pt[O]);'
    );
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
      /function vr\(e\)\s*\{[\s\S]*?(?=function xe\()/,
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
  }\n  `
    );
  }

  // 10. Update Bookshelf volumes array S (6 volumes)
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

  // 15. Teardown _n(): clean up all listeners + IntersectionObserver + Three.js resources
  const teardownStartIdx = code.indexOf('function _n() {');
  const eaStartIdx = code.indexOf('async function ea() {');
  if (teardownStartIdx !== -1 && eaStartIdx !== -1) {
    const newTeardown = `function _n() {
    jt = !0, Ae = !0, __isBooted = !1, Ke(), Te(), ee && cancelAnimationFrame(ee), ee = 0;
    __viewportObserver?.disconnect();
    __viewportObserver = null;
    __docClickHandler && document.removeEventListener("click", __docClickHandler);
    __viewSpineHandler && window.removeEventListener("bookshelf:view-spine", __viewSpineHandler);
    __resetViewHandler && window.removeEventListener("bookshelf:reset-view", __resetViewHandler);
    __docClickHandler = __viewSpineHandler = __resetViewHandler = null;
    m.removeEventListener("pointermove", mr), m.removeEventListener("pointerleave", br), m.removeEventListener("click", yr), m.removeEventListener("pointerdown", dr, !0), m.removeEventListener("pointermove", fr, !0), m.removeEventListener("pointerup", ke, !0), m.removeEventListener("pointercancel", ke, !0), m.removeEventListener("lostpointercapture", ke, !0), m.removeEventListener("pointerdown", hr, !0), m.removeEventListener("pointermove", gr, !0), m.removeEventListener("pointerup", Me, !0), m.removeEventListener("pointercancel", Me, !0), m.removeEventListener("lostpointercapture", Me, !0), window.removeEventListener("pointerup", bt), window.removeEventListener("pointercancel", bt), y.removeEventListener("wheel", vr), m.removeEventListener("webglcontextlost", Ir), window.removeEventListener("resize", yt), y.removeEventListener("keydown", Tr), window.removeEventListener("blur", Pr), document.removeEventListener("visibilitychange", Sr), Zt.removeEventListener("change", zr), z?.dispose(), R?.traverse((e) => {
      e.geometry?.dispose(), (Array.isArray(e.material) ? e.material : [e.material]).filter(Boolean).forEach((t) => {
        Object.values(t).forEach((r) => {
          r?.isTexture && r.dispose();
        }), t.dispose();
      });
    }), Wt?.dispose(), D?.dispose();
  }\n  `;
    code = code.slice(0, teardownStartIdx) + newTeardown + code.slice(eaStartIdx);
  }

  // 16. Staggered non-blocking async initialization ea() + WebGL compileAsync()
  const eaStartIdx2 = code.indexOf('async function ea() {');
  const returnStartIdx = code.indexOf('  return {\n    ready: ea()', eaStartIdx2);
  if (eaStartIdx2 !== -1 && returnStartIdx !== -1) {
    const newEa = `async function ea() {
    const nextFrame = () => new Promise((t) => requestAnimationFrame(t));
    const e = at.decode().then(
      () => !0,
      () => !1
    );
    await Promise.all([
      Promise.race([
        document.fonts?.load?.("600 82px Inter").catch(() => {}),
        new Promise((t) => setTimeout(t, 250))
      ]),
      Promise.race([
        typeof coverImagesReadyPromise !== "undefined" ? coverImagesReadyPromise : Promise.resolve(),
        new Promise((t) => setTimeout(t, 400))
      ])
    ]);
    if (jt) return;
    try {
      D = new l.WebGLRenderer({
        canvas: m,
        antialias: !0,
        alpha: !0,
        powerPreference: "default"
      });
    } catch {
      lo("WebGL is unavailable in this browser. The complete static catalog remains available.");
      return;
    }
    D.outputColorSpace = l.SRGBColorSpace, D.toneMapping = l.ACESFilmicToneMapping, D.toneMappingExposure = 0.9, D.shadowMap.enabled = !0, D.shadowMap.type = l.PCFSoftShadowMap, D.setClearColor(0, 0), R = new l.Scene(), R.fog = new l.FogExp2(15327179, 0.027);
    const o = new l.PMREMGenerator(D);
    Wt = o.fromScene(new aa(), 0.04), R.environment = Wt.texture, R.environmentIntensity = 0.88, o.dispose(), L = new l.PerspectiveCamera(32, 1, 0.1, 60), W = new l.Group(), W.name = "continuous-shelf-stage", R.add(W), or(), L.position.copy(Le), L.lookAt(le), z = new na(L, m); z.addEventListener("change", () => __wake(30)); z.enabled = !1, z.enableDamping = !X, z.dampingFactor = 0.075, z.enablePan = !0, z.screenSpacePanning = !0, z.minDistance = 2.8, z.maxDistance = 7.2, z.minPolarAngle = Math.PI * 0.24, z.maxPolarAngle = Math.PI * 0.76, z.target.copy(le), z.addEventListener("change", U);

    await nextFrame();
    if (jt) return;

    Rn(), Hn(), Xn();
    await nextFrame();
    if (jt) return;

    // Build books staggered 1 per frame (visible center/adjacent volumes first) to avoid main-thread stalls
    pt = new Array(S.length);
    const buildOrder = [0, 1, 5, 2, 4, 3].filter((idx) => idx < S.length);
    for (let idx = 0; idx < S.length; idx += 1) {
      if (!buildOrder.includes(idx)) buildOrder.push(idx);
    }
    for (let bi = 0; bi < buildOrder.length; bi += 1) {
      if (jt) return;
      const r = buildOrder[bi];
      const a = En(S[r], r);
      pt[r] = a;
      W.add(a.root);
      ir(a, r);
      if (typeof D.initTexture === "function") {
        a.coverTexture && D.initTexture(a.coverTexture);
        a.foilTexture && D.initTexture(a.foilTexture);
        a.spineTexture && D.initTexture(a.spineTexture);
        a.spineFoilTexture && D.initTexture(a.spineFoilTexture);
      }
      if (bi < buildOrder.length - 1) {
        await nextFrame();
      }
    }
    if (jt) return;

    mt(0, !0), yt();
    m.addEventListener("pointermove", mr), m.addEventListener("pointerleave", br), m.addEventListener("click", yr), m.addEventListener("pointerdown", dr, { capture: !0 }), m.addEventListener("pointermove", fr, { capture: !0 }), m.addEventListener("pointerup", ke, { capture: !0 }), m.addEventListener("pointercancel", ke, { capture: !0 }), m.addEventListener("lostpointercapture", ke, { capture: !0 }), m.addEventListener("pointerdown", hr, { capture: !0 }), m.addEventListener("pointermove", gr, { capture: !0 }), m.addEventListener("pointerup", Me, { capture: !0 }), m.addEventListener("pointercancel", Me, { capture: !0 }), m.addEventListener("lostpointercapture", Me, { capture: !0 }), window.addEventListener("pointerup", bt), window.addEventListener("pointercancel", bt), y.addEventListener("wheel", vr, { passive: !1 }), m.addEventListener("webglcontextlost", Ir), window.addEventListener("resize", yt), y.addEventListener("keydown", Tr), window.addEventListener("blur", Pr), document.addEventListener("visibilitychange", Sr), Zt.addEventListener("change", zr), Io.addEventListener("click", () => Ie(-1, Io)), Do.addEventListener("click", () => Ie(1, Do)), ie.addEventListener("click", () => xe(ie)), Ut.addEventListener("click", so), it.addEventListener("click", () => ve(!K)), st.addEventListener("click", () => ze(-1)), lt.addEventListener("click", () => ze(1)), Ko.addEventListener("click", Lr);

    __viewSpineHandler = () => {
      if (b === "detail" && u) {
        ve(!1);
        const targetQ = new l.Quaternion().setFromEuler(new l.Euler(-0.02, Math.PI * 0.40, 0.01, "YXZ"));
        spineAnim.active = true;
        spineAnim.progress = 0;
        spineAnim.fromQuat.copy(u.root.quaternion);
        spineAnim.toQuat.copy(targetQ);
        L.position.copy(ht);
        z.target.copy(Je);
        z.update();
        __wake(90);
        U();
      }
    };
    __resetViewHandler = () => {
      if (b === "detail" && u) {
        spineAnim.active = true;
        spineAnim.progress = 0;
        spineAnim.fromQuat.copy(u.root.quaternion);
        spineAnim.toQuat.copy(fn);
        Lr();
        __wake(90);
        U();
      }
    };
    __docClickHandler = (evt) => {
      if (evt.target?.closest?.("#view-spine")) {
        __viewSpineHandler();
      }
    };
    document.addEventListener("click", __docClickHandler);
    window.addEventListener("bookshelf:view-spine", __viewSpineHandler);
    window.addEventListener("bookshelf:reset-view", __resetViewHandler);

    if (typeof IntersectionObserver !== "undefined") {
      __viewportObserver = new IntersectionObserver(
        ([entry]) => {
          __inViewport = entry ? entry.isIntersecting : !0;
          Ae = document.hidden || !__inViewport;
          if (Ae) {
            ee && (cancelAnimationFrame(ee), ee = 0);
          } else {
            Nt = performance.now();
            __wake(2);
          }
        },
        { threshold: 0.01 }
      );
      __viewportObserver.observe(y);
    }

    // Async parallel shader compilation via WebGL KHR_parallel_shader_compile before first frame
    if (typeof D.compileAsync === "function") {
      try {
        await D.compileAsync(R, L);
      } catch {}
    }
    if (jt) return;

    __isBooted = !0;
    __motionFrames = 2;
    D.render(R, L);
    Ht.hidden = !0;
    y.classList.add("webgl-ready");
    U();
    He.onReady?.();
    e.then((t) => {
      !t || Ae || !D || jt || (Rt = !0, qn());
    });
  }\n`;
    code = code.slice(0, eaStartIdx2) + newEa + code.slice(returnStartIdx);
  }

  // 17. Ensure Lr() smoothly slerps book orientation when collapsing
  if (code.includes('function Lr() { __wake(60);') && !code.includes('spineAnim.fromQuat.copy(u.root.quaternion)')) {
    code = code.replace(
      'function Lr() { __wake(60);',
      `function Lr() { __wake(60);
      if (b === "detail" && u) {
        spineAnim.active = true;
        spineAnim.progress = 0;
        spineAnim.fromQuat.copy(u.root.quaternion);
        spineAnim.toQuat.copy(fn);
      }`
    );
  }

  return code;
}
