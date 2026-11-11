// scripts/modules/assetLoader.mjs
// Provides static asset paths for Three.js textures instead of inline Base64 strings.

export function getAssetDataUris() {
  return {
    mokaDataUri: '/moka_icon.webp',
    benchDataUri: '/router_benchmark.webp',
    cozmoSketchDataUri: '/cozmo_hardware_sketch.webp',
    joinAppDataUri: '/joinapp.webp',
    figmaDataUri: '/sawyerRobot.webp',
    claudeCodeDataUri: '/claude_code.webp',
    cursorCoverDataUri: '/cursor_cover.webp',
    roboflowCoverDataUri: '/roboflow_cover.webp',
  };
}

export function injectAssetDeclarations(code, assets) {
  let cleanedCode = code
    .replace(/\/\* __ASSET_INJECT_START__ \*\/[\s\S]*?\/\* __ASSET_INJECT_END__ \*\//g, '')
    .replace(/const customMokaIcon =[\s\S]*?;\s*\}/g, '')
    .replace(/const customBenchmarkImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customCozmoSketchImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customJoinAppImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customFigmaImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customFigmaDiagramImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customClaudeCodeImg =[\s\S]*?;\s*\}/g, '')
    .replace(/const customClaudeDiagramImg =[\s\S]*?;\s*\}/g, '');

  const lines = [
    '/* __ASSET_INJECT_START__ */',
    'const createAsyncImg = (src) => { if (typeof Image === "undefined") return null; const img = new Image(); img.decoding = "async"; if (src) img.src = src; return img; };',
    'const createLazyImg = (src) => { if (typeof Image === "undefined") return null; const img = new Image(); img.decoding = "async"; img.datasetSrc = src; return img; };',
  ];

  // Cover images are loaded immediately with decoding="async"
  if (assets.mokaDataUri) {
    lines.push(`const customMokaIcon = createAsyncImg("${assets.mokaDataUri}");`);
  }
  if (assets.joinAppDataUri) {
    lines.push(`const customJoinAppImg = createAsyncImg("${assets.joinAppDataUri}");`);
  }
  if (assets.figmaDataUri) {
    lines.push(`const customFigmaImg = createAsyncImg("${assets.figmaDataUri}");`);
  }
  if (assets.claudeCodeDataUri) {
    lines.push(`const customClaudeCodeImg = createAsyncImg("${assets.claudeCodeDataUri}");`);
  }
  if (assets.cursorCoverDataUri) {
    lines.push(`const customCursorCoverImg = createAsyncImg("${assets.cursorCoverDataUri}");`);
  }
  if (assets.roboflowCoverDataUri) {
    lines.push(`const customRoboflowCoverImg = createAsyncImg("${assets.roboflowCoverDataUri}");`);
  }

  // Interior page plate images stay lazy until hydrateBookPages() runs
  if (assets.benchDataUri) {
    lines.push(`const customBenchmarkImg = createLazyImg("${assets.benchDataUri}");`);
  }
  if (assets.cozmoSketchDataUri) {
    lines.push(`const customCozmoSketchImg = createLazyImg("${assets.cozmoSketchDataUri}");`);
  }

  lines.push(
    'const ensureLazyImage = (img, onReady) => { if (!img) return; if (img.naturalWidth > 0) return; if (!img.src && img.datasetSrc) { img.src = img.datasetSrc; } if (onReady) { const fire = () => { if (img.naturalWidth > 0) onReady(); }; img.decode ? img.decode().then(fire).catch(() => { img.onload = fire; }) : (img.onload = fire); } };',
    'const coverImagesReadyPromise = typeof Promise !== "undefined" ? Promise.allSettled([customMokaIcon, customJoinAppImg, customFigmaImg, customClaudeCodeImg, customCursorCoverImg, customRoboflowCoverImg].filter(Boolean).map((img) => img.decode ? img.decode().catch(() => {}) : new Promise((res) => { if (img.complete) res(); else { img.onload = res; img.onerror = res; } }))) : Promise.resolve();',
    '/* __ASSET_INJECT_END__ */'
  );

  cleanedCode = cleanedCode.replace('let qt = !1;', `let qt = !1;\n  ${lines.join('\n  ')}`);
  return cleanedCode;
}
