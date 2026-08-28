# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technical recruiters, hiring managers, research evaluators, and engineering peers in Artificial Intelligence, Robotics, and Software Engineering.

## Product Purpose

An interactive, editorial-grade 3D portfolio and research archive representing academic and industrial projects at FH Campus Wien. It balances high-craft visual aesthetics (Three.js 3D bookshelf, chapter spreads, fluid simulation overlays) with rigorous technical depth and engineering proof.

## Positioning

A hybrid engineering monograph: unlike generic flat portfolio grids or unoptimized, GPU-heavy 3D demos, this experience combines tactile 3D book inspection and chapter reading with strict zero-load idle rendering and production-grade WebGL performance.

## Operating Context

Evaluators and hiring managers browsing on desktop and mobile web browsers, reviewing case studies, technical architectures, live demos, and source code repositories.

## Capabilities and Constraints

- **Universal On-Demand WebGL Rendering**: Zero-load idle state (0 FPS / 0% GPU) is an immutable architectural invariant. Rendering only wakes on active motion/user events and sleeps immediately when stationary.
- **DPR Clamping**: `renderer.setPixelRatio` clamped to `Math.min(window.devicePixelRatio, 1.0)`.
- **Power Preference**: Must remain `"default"` to prevent forcing discrete GPUs into maximum power draw.
- **6 Curated Volumes**:
  1. `MOKA` (Volume 1 / Codex): Autonomous AI Assistant & Engineering Systems
  2. `Sawyer Robot` (Volume 2 / Figma): Waving Task, Shell Game & Vision Tracking
  3. `ResQ` (Volume 3 / Cursor): Multi-Agent Emergency Dispatch
  4. `RoboFlow` (Volume 4 / Antigravity): Graph-Based Warehouse Simulation (Dijkstra, Prim MST, Topological Sort)
  5. `Cat Breed Recognition` (Volume 5 / Claude Code): Fine-Grained Classification, CNN Benchmarks & Grad-CAM Explainability
  6. `JoinApp` (Volume 6 / Xcode): Hyperlocal Community Event Hub

## Brand Commitments

- Scholarly monograph meets modern computational lab aesthetic.
- Tactile physical-digital hybrid design language (leather, foil, cloth, archival paper, refined typography, smooth micro-interactions).
- Restrained, intentional motion; never gratuitous continuous looping animations that drain user battery or GPU.

## Evidence on Hand

- Real project data and chapters defined in [portfolioData.ts](file:///c:/Users/mkrad/Desktop/FH%20Campus%20Wien/portfolio/src/data/portfolioData.ts).
- Optimization script enforcing render invariants in [optimize-renderer.mjs](file:///c:/Users/mkrad/Desktop/FH%20Campus%20Wien/portfolio/scripts/optimize-renderer.mjs).
- Interactive 3D bookshelf in [BookshelfScene.tsx](file:///c:/Users/mkrad/Desktop/FH%20Campus%20Wien/portfolio/src/components/BookshelfScene.tsx).
- Fluid reveal canvas integration in [HeroFluidReveal.tsx](file:///c:/Users/mkrad/Desktop/FH%20Campus%20Wien/portfolio/src/components/HeroFluidReveal.tsx).

## Product Principles

1. **Zero Compromise on Thermal & Battery Efficiency**: The 3D world must sleep completely at rest. High-end visual fidelity must never cost thermal throttling.
2. **Substance Over Gimmick**: 3D interactions and motion serve to structure and reveal deep engineering evidence, architecture diagrams, and real project data.
3. **Editorial Typography & Tactility**: Every volume feels crafted, physical, and distinguished by its own thematic palette and typography.
4. **Immediate Accessibility & Navigation**: Readers can fluidly transition between shelf browsing, volume inspection, direct chapter reading, and quick overview lists.
