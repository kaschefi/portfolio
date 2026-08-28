---
name: Portfolio 3D Monograph
description: Interactive 3D research archive and engineering monograph with on-demand zero-load WebGL rendering
colors:
  primary: "#3884ff"
  primary-deep: "#1d4ed8"
  primary-glow: "rgba(56, 132, 255, 0.35)"
  neutral-bg: "#0a0d14"
  neutral-surface: "#10141f"
  neutral-card: "rgba(18, 23, 35, 0.72)"
  neutral-card-hover: "rgba(28, 35, 52, 0.85)"
  neutral-glass: "rgba(16, 21, 33, 0.65)"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-medium: "rgba(255, 255, 255, 0.16)"
  text-primary: "#f5f7fa"
  text-secondary: "#9da9be"
  text-muted: "#64748b"
  accent-cyan: "#00d2ff"
  accent-emerald: "#10b981"
  accent-orange: "#ff7a45"
  accent-gold: "#efc16d"
  accent-purple: "#8b5cf6"
  accent-rose: "#f43f5e"
typography:
  display:
    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  serif:
    fontFamily: "'Cinzel', serif"
    fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  body:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
  hero-pad: "clamp(1.5rem, 4vw, 3.5rem)"
components:
  badge-status:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.text-primary}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.9rem"
  button-primary:
    backgroundColor: "{colors.primary-deep}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.15rem"
  button-icon:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    size: "40px"
  card-glass:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System

## Overview

A dark, high-craft editorial monograph engineered for technical evaluators. The interface merges an interactive, tactile Three.js 3D bookshelf with fluid simulations and deep scholarly case study spreads. A core requirement is total GPU dormancy at rest: zero-load idle rendering (0 FPS / 0% GPU) with instant wake on user interaction or movement.

## Colors

- **Primary & Interactive**: Electric Blue (`#3884ff`), Deep Cobalt (`#1d4ed8`), with soft ambient glow states.
- **Dark Neutral Foundations**: Tinted dark slate (`#0a0d14`), deep void navy (`#10141f`), translucent glass cards (`rgba(18, 23, 35, 0.72)`).
- **Text Scale**: Crisp cold white (`#f5f7fa`) for primary titles, technical silver (`#9da9be`) for summaries and metrics, muted slate (`#64748b`) for subtitles and labels.
- **Volume Accents**:
  - `MOKA`: Cobalt & Cyber Blue (`#3884ff` / `#00d2ff`)
  - `Sawyer Robot`: Precision Orange & Charcoal (`#ff7a45` / `#efc16d`)
  - `ResQ`: Emergency Crimson & Signal Red (`#f43f5e` / `#ff7a45`)
  - `RoboFlow`: Cyber Emerald & Graph Violet (`#10b981` / `#8b5cf6`)
  - `Cat Breed Recognition`: Deep Violet & Grad-CAM Heatmap Amber (`#8b5cf6` / `#efc16d`)
  - `JoinApp`: Sapphire Blue & Apple Quartz (`#2563eb` / `#38bdf8`)

## Typography

- **Display Headings**: `Outfit` (800 weight, tight line-height `1.04`, negative letter-spacing `-0.03em`).
- **Monograph & Classical Serifs**: `Cinzel` (used for volume titles, Roman numerals, and formal monograph chapters).
- **Code & Telemetry**: `JetBrains Mono` (used for status badges, tags, technical metadata, and code snippets).
- **Interface & Body**: `Plus Jakarta Sans` (300/400 weight for descriptions, 600 weight for interactive pills and tabs).

## Layout

- **Viewport Fill Hero**: Full viewport height (`100vh`) with fluid simulation reveal layer beneath floating glass HUD elements.
- **Bookshelf Stage**: Centered 3D viewport with bottom navigation dock and volume pagination controls.
- **Chapter Spread Modal**: Split-pane editorial layout simulating physical open book spreads with left-hand architecture/highlights and right-hand narrative/code snippets.
- **Responsive Padding**: Fluid clamps (`clamp(1.5rem, 4vw, 3.5rem)`) providing robust edge margins across desktop and mobile.

## Elevation & Depth

- **Glassmorphic Panels**: Multi-layer backdrop filters (`blur(16px)` to `blur(28px)`) with hairline light borders (`rgba(255, 255, 255, 0.08)` to `0.16`).
- **Glow & Atmospheric Lighting**: Subtle point-source glows (`0 0 24px -2px rgba(56, 132, 255, 0.35)`) highlighting active navigation items and focused books.
- **Shadow Stacks**: Deep diffuse drop shadows (`0 16px 40px -8px rgba(0, 0, 0, 0.6)`) anchoring modals above the 3D scene.

## Shapes

- **HUD Pills & Badges**: Fully rounded (`border-radius: 9999px`) for status indicators, filter tabs, and action triggers.
- **Cards & Modals**: Smooth medium/large corner radii (`12px` to `20px`) matching modern macOS and iOS tactile surfaces.
- **Action Buttons & Icon Triggers**: Square with rounded squircle corners (`12px`) or circular (`50%`).

## Components

- **Status Pill (`.hero-badge`)**: Monospace live status indicator with pulsing emerald LED dot.
- **Hero Title**: Multi-stop gradient text (`#ffffff` -> `#cbd5e1` -> `#94a3b8`) over deep dark background.
- **Nav Dock**: Floating pill container with smooth tab pill indicators and glass hover states.
- **Book 3D Canvas**: Three.js viewport clamped to DPR 1.0, rendering on-demand.
- **Spread Reader**: Dual-page open book reader with serif titles, syntax-highlighted code blocks, and key metric badges.

## Do's and Don'ts

### Do's
- **Always honor on-demand rendering**: Any newly added WebGL interaction must dispatch frame invalidation and sleep when stationary.
- **Use high-contrast hierarchy**: Pair bold display headings with delicate monospace kickers and translucent cards.
- **Keep animations snappy**: Use spring bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`) for micro-interactions.

### Don'ts
- **Never enable infinite requestAnimationFrame loops**: Uncapped render loops without motion sleep are strictly forbidden.
- **Never uncap DPR above 1.0**: High-DPI super-sampling causes severe thermal throttling on laptops and discrete GPUs.
- **Never use pure un-tinted grays**: All dark surfaces must retain subtle cold blue/slate undertones.
