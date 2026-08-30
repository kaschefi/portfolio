// scripts/modules/assetLoader.mjs
// Encodes and manages binary assets as embedded Base64 data URIs for Three.js textures.

import fs from 'fs';
import path from 'path';

export function getAssetDataUris() {
  const readDataUri = (candidates) => {
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const ext = path.extname(p).toLowerCase();
        let mime = 'image/png';
        if (ext === '.webp') mime = 'image/webp';
        else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
        else if (ext === '.svg') mime = 'image/svg+xml';
        const base64 = fs.readFileSync(p).toString('base64');
        return `data:${mime};base64,${base64}`;
      }
    }
    return '';
  };

  // 1. MOKA OLED eyes icon
  const mokaDataUri = readDataUri([
    path.resolve('public/moka_icon.webp'),
    path.resolve('public/moka-icon.webp'),
    path.resolve('public/antigravity_icon.webp'),
    path.resolve('src/assets/antigravity_icon.webp'),
    path.resolve('public/moka_icon.png'),
    path.resolve('public/moka-icon.png'),
    path.resolve('public/antigravity_icon.png'),
    path.resolve('src/assets/antigravity_icon.png')
  ]);

  // 2. Router benchmark image
  const benchDataUri = readDataUri([
    path.resolve('public/router_benchmark.webp'),
    path.resolve('src/assets/router_benchmark.webp'),
    path.resolve('public/router_benchmark.png'),
    path.resolve('src/assets/router_benchmark.png')
  ]);

  // 3. Cozmo hardware sketch image
  const cozmoSketchDataUri = readDataUri([
    path.resolve('public/cozmo_hardware_sketch.webp'),
    path.resolve('src/assets/cozmo_hardware_sketch.webp'),
    path.resolve('public/cozmo_hardware_sketch.png')
  ]);

  // 4. JoinApp cover transparent PNG/WebP
  const joinAppDataUri = readDataUri([
    path.resolve('public/joinapp.webp'),
    path.resolve('src/assets/joinapp.webp'),
    path.resolve('src/assets/joinapp.png'),
    path.resolve('public/joinapp.png'),
    path.resolve('src/assets/joinapp.jpg'),
    path.resolve('public/joinapp.jpg')
  ]);

  // 5. Figma cover / Sawyer Robot image
  const figmaDataUri = readDataUri([
    path.resolve('public/sawyerRobot.webp'),
    path.resolve('src/assets/sawyerRobot.webp'),
    path.resolve('src/assets/sawyerRobot.png'),
    path.resolve('public/sawyerRobot.png'),
    path.resolve('src/assets/sawyerRobot.jpg'),
    path.resolve('public/sawyerRobot.jpg'),
    path.resolve('src/assets/figma_icon.webp'),
    path.resolve('public/figma_icon.webp')
  ]);

  // 6. Figma diagram / token architecture image
  const figmaDiagramDataUri = readDataUri([
    path.resolve('src/assets/figma_diagram.webp'),
    path.resolve('public/figma_diagram.webp'),
    path.resolve('src/assets/token_architecture.webp'),
    path.resolve('public/token_architecture.webp'),
    path.resolve('src/assets/figma_diagram.png'),
    path.resolve('public/figma_diagram.png'),
    path.resolve('src/assets/token_architecture.png'),
    path.resolve('public/token_architecture.png')
  ]);

  // 7. Claude Code cover image candidates
  const claudeCodeDataUri = readDataUri([
    path.resolve('public/claude_code.webp'),
    path.resolve('src/assets/claude_code.webp'),
    path.resolve('public/cat.webp'),
    path.resolve('src/assets/cat.webp'),
    path.resolve('src/assets/claude_code.png'),
    path.resolve('public/claude_code.png'),
    path.resolve('src/assets/claude_code.jpg'),
    path.resolve('public/claude_code.jpg')
  ]);

  // 8. Claude Code diagram / medical architecture image
  const claudeCodeDiagramDataUri = readDataUri([
    path.resolve('src/assets/claude_code_diagram.webp'),
    path.resolve('public/claude_code_diagram.webp'),
    path.resolve('src/assets/claude_diagram.webp'),
    path.resolve('public/claude_diagram.webp'),
    path.resolve('src/assets/claude_code_diagram.png'),
    path.resolve('public/claude_code_diagram.png'),
    path.resolve('src/assets/claude_diagram.png'),
    path.resolve('public/claude_diagram.png')
  ]);

  return {
    mokaDataUri,
    benchDataUri,
    cozmoSketchDataUri,
    joinAppDataUri,
    figmaDataUri,
    figmaDiagramDataUri,
    claudeCodeDataUri,
    claudeCodeDiagramDataUri
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

