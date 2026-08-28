// scripts/modules/assetLoader.mjs
// Encodes and manages binary assets as embedded Base64 data URIs for Three.js textures.

import fs from 'fs';
import path from 'path';

export function getAssetDataUris() {
  // 1. MOKA OLED eyes icon
  let mokaDataUri = '';
  const mokaCandidates = [
    path.resolve('public/moka_icon.png'),
    path.resolve('public/moka-icon.png'),
    path.resolve('public/antigravity_icon.png'),
    path.resolve('src/assets/antigravity_icon.png')
  ];
  for (const p of mokaCandidates) {
    if (fs.existsSync(p)) {
      const mokaBase64 = fs.readFileSync(p).toString('base64');
      mokaDataUri = `data:image/png;base64,${mokaBase64}`;
      break;
    }
  }

  // 2. Router benchmark image
  const benchPath = path.resolve('public/router_benchmark.png');
  let benchDataUri = '';
  if (fs.existsSync(benchPath)) {
    const benchBase64 = fs.readFileSync(benchPath).toString('base64');
    benchDataUri = `data:image/png;base64,${benchBase64}`;
  }

  // 3. Cozmo hardware sketch image
  const cozmoSketchPath = path.resolve('public/cozmo_hardware_sketch.png');
  let cozmoSketchDataUri = '';
  if (fs.existsSync(cozmoSketchPath)) {
    const cozmoSketchBase64 = fs.readFileSync(cozmoSketchPath).toString('base64');
    cozmoSketchDataUri = `data:image/png;base64,${cozmoSketchBase64}`;
  }

  // 4. JoinApp cover transparent PNG
  const joinAppCandidates = [
    path.resolve('src/assets/joinapp.png'),
    path.resolve('public/joinapp.png'),
    path.resolve('src/assets/joinapp.jpg'),
    path.resolve('public/joinapp.jpg')
  ];
  let joinAppDataUri = '';
  for (const p of joinAppCandidates) {
    if (fs.existsSync(p)) {
      const isPng = p.endsWith('.png');
      const joinAppBase64 = fs.readFileSync(p).toString('base64');
      joinAppDataUri = `data:image/${isPng ? 'png' : 'jpeg'};base64,${joinAppBase64}`;
      break;
    }
  }

  // 5. Figma cover / Sawyer Robot image
  const figmaCandidates = [
    path.resolve('src/assets/sawyerRobot.png'),
    path.resolve('public/sawyerRobot.png'),
    path.resolve('src/assets/sawyerRobot.jpg'),
    path.resolve('public/sawyerRobot.jpg'),
    path.resolve('src/assets/figma_icon.png'),
    path.resolve('public/figma_icon.png'),
    path.resolve('src/assets/figma.png'),
    path.resolve('public/figma.png'),
    path.resolve('src/assets/aegis_logo.png'),
    path.resolve('public/aegis_logo.png')
  ];
  let figmaDataUri = '';
  for (const p of figmaCandidates) {
    if (fs.existsSync(p)) {
      const isPng = p.endsWith('.png');
      const figmaBase64 = fs.readFileSync(p).toString('base64');
      figmaDataUri = `data:image/${isPng ? 'png' : 'jpeg'};base64,${figmaBase64}`;
      break;
    }
  }

  // 6. Figma diagram / token architecture image
  const figmaDiagramCandidates = [
    path.resolve('src/assets/figma_diagram.png'),
    path.resolve('public/figma_diagram.png'),
    path.resolve('src/assets/token_architecture.png'),
    path.resolve('public/token_architecture.png')
  ];
  let figmaDiagramDataUri = '';
  for (const p of figmaDiagramCandidates) {
    if (fs.existsSync(p)) {
      const isPng = p.endsWith('.png');
      const figmaDiagBase64 = fs.readFileSync(p).toString('base64');
      figmaDiagramDataUri = `data:image/${isPng ? 'png' : 'jpeg'};base64,${figmaDiagBase64}`;
      break;
    }
  }

  return {
    mokaDataUri,
    benchDataUri,
    cozmoSketchDataUri,
    joinAppDataUri,
    figmaDataUri,
    figmaDiagramDataUri
  };
}

export function injectAssetDeclarations(code, assets) {
  let cleanedCode = code
    .replace(/const customMokaIcon =[\s\S]*?;\s*}/g, '')
    .replace(/const customBenchmarkImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customCozmoSketchImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customJoinAppImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customFigmaImg =[\s\S]*?;\s*}/g, '')
    .replace(/const customFigmaDiagramImg =[\s\S]*?;\s*}/g, '');

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

  if (declarations) {
    cleanedCode = cleanedCode.replace('let qt = !1;', `let qt = !1;\n  ${declarations.trim()}`);
  }

  return cleanedCode;
}

