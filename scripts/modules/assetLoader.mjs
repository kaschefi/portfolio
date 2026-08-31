// scripts/modules/assetLoader.mjs
// Provides static asset paths for Three.js textures instead of multi-megabyte Base64 strings.

export function getAssetDataUris() {
  return {
    mokaDataUri: '/moka_icon.webp',
    benchDataUri: '/router_benchmark.webp',
    cozmoSketchDataUri: '/cozmo_hardware_sketch.webp',
    joinAppDataUri: '/joinapp.webp',
    figmaDataUri: '/sawyerRobot.webp',
    figmaDiagramDataUri: '/token_architecture.webp',
    claudeCodeDataUri: '/claude_code.webp',
  };
}

export function injectAssetDeclarations(code, assets) {
  let cleanedCode = code
    .replace(/const customMokaIcon =[\s\S]*?;\s*}/g, '')
    .replace(/const customBenchmarkImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customCozmoSketchImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customJoinAppImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customFigmaImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customFigmaDiagramImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customClaudeCodeImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customClaudeDiagramImg =[\s\S]*?;\s*}/g, '');

  let declarations = '';
  if (assets.mokaDataUri) {
    declarations += `const customMokaIcon = typeof Image !== "undefined" ? new Image() : null;\n  if (customMokaIcon) { customMokaIcon.src = "${assets.mokaDataUri}"; }\n`;
  }
  if (assets.benchDataUri) {
    declarations += `const customBenchmarkImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customBenchmarkImg) { customBenchmarkImg.src = "${assets.benchDataUri}"; }\n`;
  }
  if (assets.cozmoSketchDataUri) {
    declarations += `const customCozmoSketchImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customCozmoSketchImg) { customCozmoSketchImg.src = "${assets.cozmoSketchDataUri}"; }\n`;
  }
  if (assets.joinAppDataUri) {
    declarations += `const customJoinAppImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customJoinAppImg) { customJoinAppImg.src = "${assets.joinAppDataUri}"; }\n`;
  }
  if (assets.figmaDataUri) {
    declarations += `const customFigmaImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customFigmaImg) { customFigmaImg.src = "${assets.figmaDataUri}"; }\n`;
  }
  if (assets.figmaDiagramDataUri) {
    declarations += `const customFigmaDiagramImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customFigmaDiagramImg) { customFigmaDiagramImg.src = "${assets.figmaDiagramDataUri}"; }\n`;
  }
  if (assets.claudeCodeDataUri) {
    declarations += `const customClaudeCodeImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customClaudeCodeImg) { customClaudeCodeImg.src = "${assets.claudeCodeDataUri}"; }\n`;
  }
  if (assets.claudeCodeDiagramDataUri) {
    declarations += `const customClaudeDiagramImg = typeof Image !== "undefined" ? new Image() : null;\n  if (customClaudeDiagramImg) { customClaudeDiagramImg.src = "${assets.claudeCodeDiagramDataUri}"; }\n`;
  }

  if (declarations) {
    cleanedCode = cleanedCode.replace('let qt = !1;', `let qt = !1;\n  ${declarations.trim()}`);
  }

  return cleanedCode;
}