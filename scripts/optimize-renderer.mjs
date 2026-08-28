// scripts/optimize-renderer.mjs
// Clean orchestrator for Three.js WebGL performance optimizations and custom book themes.

import fs from 'fs';
import path from 'path';

import { getAssetDataUris, injectAssetDeclarations } from './modules/assetLoader.mjs';
import { applyEnginePatches } from './modules/enginePatches.mjs';
import { applyCoverPatches } from './modules/coverRenderer.mjs';
import { applyPagePatches } from './modules/pageRenderer.mjs';
import { applyFoilAndMaterialPatches } from './modules/foilMaterials.mjs';
import { applyVolumeDataPatches } from './modules/volumeDataPatcher.mjs';

const targetPath = path.resolve('node_modules/@designcodeio/threeui/lib-dist/shaders/bookshelf/bookshelfRenderer.js');

if (!fs.existsSync(targetPath)) {
  console.error('bookshelfRenderer.js not found at:', targetPath);
  process.exit(1);
}

// 1. Read source code
let code = fs.readFileSync(targetPath, 'utf8');

// 2. Load and inject binary assets as Base64 data URIs
const assets = getAssetDataUris();
code = injectAssetDeclarations(code, assets);

// 3. Apply universal on-demand WebGL rendering loop, DPR clamping, and camera framing
code = applyEnginePatches(code);

// 3b. Patch embedded volume data (title, discipline, etc.) to match portfolioData.ts
code = applyVolumeDataPatches(code);

// 4. Apply front cover cloth & foil textures (MOKA & JoinApp)
code = applyCoverPatches(code);

// 5. Apply interior 12-page spreads (MOKA router benchmark, robot chassis, JoinApp specs)
code = applyPagePatches(code);

// 6. Apply spine foil, back foil, and physical material shaders
code = applyFoilAndMaterialPatches(code);

// 7. Write patched renderer
fs.writeFileSync(targetPath, code, 'utf8');

// 8. Clear Vite pre-bundle cache to ensure immediate hot reload
const viteCacheDir = path.resolve('node_modules/.vite');
if (fs.existsSync(viteCacheDir)) {
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
}

console.log('⚡ Bookshelf renderer optimized successfully (modular architecture).');
