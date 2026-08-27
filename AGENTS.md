# Project Guidelines & Immutable Architectural Rules

> **CRITICAL RULE**: The performance optimizations and on-demand WebGL rendering systems documented below MUST NEVER BE REMOVED, MODIFIED, OR REVERTED. They protect hardware from thermal throttling (97°C GPU temperatures) and ensure smooth, responsive UX.

---

## 1. 3D WebGL Universal On-Demand Rendering (Strict Requirement)

The Three.js Bookshelf Scene must **ALWAYS** operate under **Event-Driven On-Demand Rendering**.

### Immutable Invariants:
1. **Zero-Load Idle State (0 FPS / 0% GPU)**:
   - When no animations or user interactions are occurring, the render loop MUST SLEEP completely.
   - This applies to **EVERY** state in the 3D world:
     - Stationary shelf carousel
     - Stationary book inspection (detail view)
     - Reading open book spreads
     - Rested camera angles
2. **Motion-Only Frame Dispatch**:
   - WebGL rendering is only dispatched when active movement is detected:
     - User interaction (pointer drag, mouse move, wheel, keydown, click)
     - OrbitControls rotation / camera damping
     - Book open/close spread animations
     - Page flipping / curling animations
     - Carousel volume sliding
   - After motion ceases, `__motionFrames` counts down and the loop sleeps immediately.
3. **DPR Clamping (`devicePixelRatio <= 1.0`)**:
   - `renderer.setPixelRatio` must always be clamped to `Math.min(window.devicePixelRatio || 1, 1.0)`.
   - Never allow uncapped 2x/3x Retina super-sampling, which quadruples pixel shading calculations for zero perceptual gain.
4. **Power Profile**:
   - `powerPreference` must remain `"default"` to prevent forcing discrete GPUs into maximum power draw.
5. **Persistence via `scripts/optimize-renderer.mjs`**:
   - The optimization script runs automatically on `npm install` (`postinstall`) and `npm run build`.
   - Never delete or bypass this hook in `package.json`.

---

## 2. Book Customization System

Each of the 7 portfolio volumes represents a real engineering project:
- **Volume 1 (Codex)**: `MOKA` — Autonomous AI Assistant & Engineering Systems
- **Volume 2 (Claude Code)**: Contextual Reasoning & Clinical AI
- **Volume 3 (Cursor)**: ResQ Multi-Agent Emergency Dispatch
- **Volume 4 (Antigravity)**: Spatial 3D Kinematics & Robotics
- **Volume 5 (Figma)**: Aegis Cross-Platform Design System
- **Volume 6 (Framer)**: BookNest 3D Web Application
- **Volume 7 (Xcode)**: PulseGuard IoT Vitals Monitor

Custom book covers, textures, and typography are rendered via `scripts/optimize-renderer.mjs` and configured in `src/data/portfolioData.ts`.
