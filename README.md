# Interactive 3D Engineering Portfolio

An interactive portfolio built with **React 19**, **TypeScript**, **Vite 8**, and **WebGL / Three.js** (`three@0.165.0`), featuring a Navier-Stokes WebGL hero reveal, a 3D interactive project bookshelf powered by an optimized **`@designcodeio/threeui`** renderer, and a fallback 2D carousel view.

---

## ThreeUI (`@designcodeio/threeui`) Integration & Engineering Improvements

The interactive 3D bookshelf builds on **`@designcodeio/threeui`** (`BookshelfScene` and `bookshelfRenderer.js`). While ThreeUI provides the core bookshelf geometry, page-curl mechanics, and carousel interactions, running the stock renderer inside a multi-section React page with custom covers, high-density typography, and detailed multi-spread project volumes caused heavy startup stutters, high GPU power draw, and screen freezes during shader compilation.

Rather than maintaining an ad-hoc fork or ejecting from the package, all renderer upgrades are implemented as an **automated, idempotent modular patch pipeline** in [`scripts/optimize-renderer.mjs`](scripts/optimize-renderer.mjs) (`scripts/modules/*`), executed automatically on `postinstall`, `npm run dev`, and `npm run build`.

### Summary of ThreeUI Improvements

1. **Zero-Load Idle & Event-Driven On-Demand Rendering (`enginePatches.mjs`)**
   - Converted the continuous `requestAnimationFrame` loop into strict motion-driven rendering (`__motionFrames` / `__wake()`), resting at **0 FPS / 0% GPU** across idle shelf browsing, book detail inspection, open spreads, and settled camera states.
   - Added a canvas `IntersectionObserver` so the loop pauses automatically whenever the bookshelf scrolls out of the viewport.
   - Clamped pixel ratio to `Math.min(window.devicePixelRatio || 1, 2.0)`, lowered shadow map resolution from `2048×2048` to `1024×1024`, and kept `powerPreference: "default"` to avoid aggressive discrete GPU clock boosting and thermal throttling.

2. **Elimination of Startup Frame Freezes & Shader Stalls (`enginePatches.mjs`, `assetLoader.mjs`)**
   - **Externalized Inline Assets & Stripped Unused Lookups**: Removed the ~588 KB inline Base64 cover atlas (`Vr`), ~124 KB inline walnut wood Base64 (`Yr`), and unused ~302 KB `RectAreaLightUniformsLib` import—reducing patched `bookshelfRenderer.js` from ~854 KB to ~145 KB and serving assets as external `.webp` textures (`public/walnut_wood.webp`, `public/cursor_cover.webp`, `public/roboflow_cover.webp`, etc.).
   - **Lightweight Lighting & Shared Materials**: Replaced 5 LTC `RectAreaLight` instances with lightweight `DirectionalLight`s and converted matte paper/board/edge materials from `MeshPhysicalMaterial` to `MeshStandardMaterial`, reserving `MeshPhysicalMaterial` strictly for metallic foil overlays. Cached shared procedural cloth bump, normal, and roughness maps across all books.
   - **Staggered Construction & Async Shader Compilation**: Built books one per animation frame in center-out priority (`[0, 1, 5, 2, 4, 3]`), pre-uploaded cover textures incrementally via `renderer.initTexture(...)`, and warmed WebGL shader pipelines asynchronously with `await renderer.compileAsync(scene, camera)` (`KHR_parallel_shader_compile`) while keeping [`BookshelfSkeleton`](src/components/BookshelfSkeleton.tsx) visible until ready.

3. **Deferred Interior Page Hydration (`pageRenderer.mjs`, `foilMaterials.mjs`)**
   - Deferred creation of each volume's 12 deformable page meshes (`PlaneGeometry`), `Float32Array` curl buffers, endpapers, and 512×768 interior page/back-cover textures into on-demand `hydrateBookPages(book)` triggered only when a book is inspected or opened (`Pn()` returns an empty array at initial shelf boot).
   - Marked interior plate images (`/router_benchmark.webp`, `/cozmo_hardware_sketch.webp`) as lazy (`createLazyImg` / `ensureLazyImage`) so they decode only when viewed.
   - Downscaled cover canvas textures (`wn`/`Cn`) to `512×768` and spine textures (`Dn`/`Kn`) to `256×1024`, removed CPU-expensive `ctx.shadowBlur`, and batched procedural cloth grain strokes.

4. **Custom Books, Content Pipeline & React Integration (`volumeDataPatcher.mjs`, `coverRenderer.mjs`, `BookshelfContainer.tsx`, `BookshelfHUD.tsx`)**
   - Automated synchronization between `src/content/volumes/*.json` and the 3D renderer metadata/chapters (`MOKA`, `Sawyer Robot`, `Semantic-ETL-Pipeline`, `Roboflow`, `Cat-breed-recognition`, and `JoinApp`) with custom cover art, metallic foil masks, spine inspection rotation (`bookshelf:view-spine`), and a `2D / 3D` view mode switcher.
   - Scoped `MutationObserver` synchronization strictly to `.bookshelf`, `.bookshelf__canvas`, and `.bookshelf__source-controls` with `hud-*` prefixed React HUD IDs so HUD updates never collide with ThreeUI's hidden control bindings or trigger spurious re-syncs.
   - Added clean teardown in `_n()` (disconnecting observers, detaching window/document listeners, and disposing Three.js geometries, materials, textures, and PMREM targets) and idle desktop chunk/cover pre-warming in [`App.tsx`](src/App.tsx) via [`bookshelfPreload.ts`](src/utils/bookshelfPreload.ts) before the proximity `IntersectionObserver` mounts WebGL.

---

## Development & Build Commands

```bash
npm install        # Installs packages and runs postinstall optimize-renderer.mjs
npm run dev        # Runs optimize-renderer.mjs and starts the Vite dev server
npm run lint       # Runs oxlint across the project
npx tsc -b         # Type-checks the TypeScript project
npm run build      # Patches ThreeUI, type-checks, bundles with Vite, and generates .gz/.br assets
npm run preview    # Serves the production dist/ bundle locally
```
