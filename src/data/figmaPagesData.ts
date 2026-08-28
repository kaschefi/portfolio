// src/data/figmaPagesData.ts
// Comprehensive architectural specifications and data models for Volume 2 (Figma / Aegis Cross-Platform Design System).

export interface FigmaPageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // SYSTEM OVERVIEW"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Design Engineering & Tokens"
  thesis?: string;            // Deep engineering thesis
  overview?: string;          // Concise 1-2 paragraph executive summary
  description?: string;       // In-depth technical breakdown
  codeSnippet?: string;       // Optional code excerpt
  metadata?: {
    binding: string;
    format: string;
    theme: string;
    motif: string;
  };
  keyMetrics?: Array<{ label: string; value: string }>;
  highlights?: string[];
  image?: string;
  imageCaption?: string;
}

export const figmaPagesData: FigmaPageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS & SYSTEM OVERVIEW
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // SYSTEM OVERVIEW",
    title: "Aegis Design System",
    subtitle: "Cross-Platform Token Architecture & Living Component Infrastructure",
    discipline: "Design Engineering & Distributed UI Systems",
    thesis: "Design systems fail when decoupled from code. Aegis eliminates design debt and visual drift by establishing an automated, single-source-of-truth token pipeline connecting Figma Variables to production codebases across Web, Mobile, and Embedded displays with strict WCAG 2.2 AAA accessibility compliance.",
    overview:
      "Aegis is an enterprise cross-platform design token architecture and living component ecosystem developed at FH Campus Wien. It replaces fragile manual style guides with an automated, synchronized pipeline that ingests Figma Variables and compiles them into type-safe tokens for Web (CSS Custom Properties & TypeScript), Mobile (Flutter & React Native), and Embedded displays.\n\nThe system unifies 65+ foundational UI component primitives, dynamic multi-tier color spaces (OKLCH, HSL, RGB), automated contrast verification engines, and continuous visual regression testing to deliver seamless visual consistency and zero design drift.",
    description:
      "### Core Problem Statement & Mission\n" +
      "Modern multi-platform engineering teams face severe friction between design prototypes and production codebases: inconsistent spacing scales, fragmented color definitions, inaccessible contrast ratios, and manual handoffs that accumulate massive design debt over time.\n\n" +
      "Aegis solves this foundational challenge through an automated, three-pillar architecture:\n\n" +
      "1. Single Source of Truth Token Pipeline: Design tokens are authored once in Figma using native Variables and Modes (Light, Dark, OLED, High-Contrast), extracted via the Figma REST API, and transformed through Style Dictionary into platform-specific compile-time artifacts.\n\n" +
      "2. Modular Component Primitives: Over 65+ production-grade component primitives built with headless accessibility wrappers, composable compound component patterns, and atomic stylesheet scoping.\n\n" +
      "3. Automated CI/CD & Drift Verification: Continuous integration pipelines trigger upon Figma library publishes, validating contrast ratios (>7:1 for text), verifying zero token drift, and running automated visual regression tests across 320+ Storybook component states.",
    keyMetrics: [
      { label: "Components Built", value: "65+ Primitives" },
      { label: "Token Sync Latency", value: "< 1.2s Pipeline" },
      { label: "WCAG Compliance", value: "100% AAA Rating" },
      { label: "Target Platforms", value: "Web, iOS, Android" },
    ],
    highlights: [
      "Single-source-of-truth token architecture synchronizing Figma Variables to CSS Custom Properties, TypeScript, and Flutter Dart.",
      "Strict WCAG 2.2 AAA color contrast verification integrated into the automated CI build step.",
      "65+ production-ready component primitives covering complex data tables, navigation shells, modals, and input controls.",
      "Zero-runtime-overhead compilation through Style Dictionary AST transformations and static type definitions."
    ],
    metadata: {
      binding: "Obsidian cloth · rose-gold foil",
      format: "150 × 220 mm · FH Campus Wien Edition",
      theme: "Figma · a shared visual language",
      motif: "Connected modules",
    },
    codeSnippet:
`// Automated Figma Variable Extraction Pipeline (scripts/sync-tokens.ts)
import { FigmaClient } from '@figma/rest-api-spec';
import { transformTokensToStyleDictionary } from './transformers';

export async function syncFigmaDesignTokens(fileKey: string, personalAccessToken: string) {
  const figma = new FigmaClient({ personalAccessToken });
  
  // 1. Fetch all local variables, collections, and mode values
  const { meta } = await figma.getLocalVariables(fileKey);
  const collections = meta.variableCollections;
  const variables = meta.variables;

  // 2. Transform Figma AST to W3C Design Tokens Community Group (DTCG) standard
  const dtcgTokens = transformTokensToStyleDictionary(variables, collections);

  // 3. Export to intermediate design-tokens.json for Style Dictionary compilation
  await fs.promises.writeFile(
    './tokens/design-tokens.tokens.json',
    JSON.stringify(dtcgTokens, null, 2),
    'utf-8'
  );
  console.log(\`✓ Synchronized \${Object.keys(variables).length} tokens across \${Object.keys(collections).length} collections.\`);
}`
  },

  // =========================================================================================
  // PAGE 02: TOKEN ARCHITECTURE & SEMANTIC HIERARCHY
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "TOKEN ARCHITECTURE // SEMANTIC HIERARCHY",
    title: "Multi-Tier Token Hierarchy",
    subtitle: "From Primitive Values to Semantic Intent & Scoped Components",
    discipline: "Design Token Engineering & Style Dictionary Compilation",
    thesis: "Eliminating Hardcoded Visual Debt through Three-Layer Token Decoupling, OKLCH Color Interpolation, and Fluid Typography Clamps",
    overview:
      "Tokens represent the non-negotiable contract between design intent and engineering execution. Aegis organizes all design values into a strict 3-tier taxonomy (Global Primitives -> Semantic Intent -> Component Scoped), enabling global brand updates and instant theme switching without modifying component logic.",
    description:
      "### The Three-Layer Token Taxonomy\n\n" +
      "• Tier 1: Global Primitive Tokens (Base Layer): Raw color scales (e.g. \`color.blue.500 = #0284c7\`), unitless ratios, base spacing units (4px / 8px grid), and typography modular scales. Global tokens contain zero semantic meaning and are never referenced directly inside application components.\n\n" +
      "• Tier 2: Semantic Intent Tokens (Context Layer): Express contextual meaning and purpose (e.g. \`color.surface.elevated\`, \`color.text.primary\`, \`color.border.interactive\`). Semantic tokens map dynamically across themes (Light, Dark, OLED High-Contrast) using CSS Custom Properties and OKLCH color spaces for perceptual uniformity.\n\n" +
      "• Tier 3: Component-Scoped Tokens (Execution Layer): Local parameters bound to individual component nodes (e.g. \`button.primary.background.hover\`, \`card.padding.desktop\`). They consume Tier 2 semantic tokens, providing fine-grained customization without leaking styling concerns across the system.\n\n" +
      "### Mathematical Fluid Spacing & Typography Scales\n" +
      "Aegis uses fluid clamp functions for responsive typography and spacing without abrupt media query jumps:\n" +
      "\`font-size: clamp(1.125rem, 0.95rem + 0.87vw, 1.75rem)\`\n" +
      "This guarantees flawless layout scaling across mobile phones (375px), laptops (1440px), and ultra-wide 4K monitors (3840px).",
    keyMetrics: [
      { label: "Global Primitives", value: "240+ Values" },
      { label: "Semantic Mappings", value: "180+ Contexts" },
      { label: "Color Modes", value: "Light / Dark / OLED" },
      { label: "Modular Scale", value: "1.250 (Major Third)" },
    ],
    highlights: [
      "Zero hardcoded hex values in component stylesheets; 100% tokenized architecture.",
      "Perceptually uniform OKLCH color palette ensuring smooth luminosity curves across themes.",
      "Fluid typography and spacing scales using mathematical CSS clamp() equations.",
      "Decoupled 3-tier hierarchy allows complete visual rebranding in minutes."
    ],
    codeSnippet:
`/* Generated CSS Design Tokens - Style Dictionary Output (dist/tokens.css) */
:root {
  /* Tier 1: Global Primitives */
  --primitive-color-vermilion-500: #c83222;
  --primitive-color-vermilion-400: #ff4d4f;
  --primitive-font-family-serif: "Iowan Old Style", Baskerville, Georgia, serif;
  --primitive-font-family-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

  /* Tier 2: Semantic Intent Tokens (Light Mode Default) */
  --surface-canvas: hsl(220 20% 98%);
  --surface-card: hsl(0 0% 100% / 0.88);
  --surface-elevated: hsl(0 0% 100% / 0.95);
  --text-primary: hsl(220 30% 12%);
  --text-muted: hsl(220 15% 46%);
  --border-subtle: hsl(220 20% 90% / 0.65);
  --accent-brand: var(--primitive-color-vermilion-500);
  --accent-glow: hsl(4 80% 55% / 0.28);
}

[data-theme="dark"] {
  /* Tier 2: Semantic Intent Tokens (Dark Mode Override) */
  --surface-canvas: hsl(222 28% 7%);
  --surface-card: hsl(222 24% 11% / 0.85);
  --surface-elevated: hsl(222 22% 16% / 0.92);
  --text-primary: hsl(210 30% 98%);
  --text-muted: hsl(215 15% 65%);
  --border-subtle: hsl(218 20% 24% / 0.45);
  --accent-brand: var(--primitive-color-vermilion-400);
  --accent-glow: hsl(4 90% 65% / 0.35);
}`
  },

  // =========================================================================================
  // PAGE 03: ACCESSIBILITY BY DEFAULT (WCAG 2.2 AAA ENGINE)
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "ACCESSIBILITY CORE // WCAG 2.2 AAA ENGINE",
    title: "Accessible Component Matrix",
    subtitle: "WCAG 2.2 AAA Contrast Ratios, Focus Systems & Motion Safety",
    discipline: "Inclusive Design Engineering & Assistive Technology",
    thesis: "Embedding Accessibility into the Token Kernel: Deterministic Contrast Assertions, High-Visibility Focus Indicators, and Screen Reader State Machines",
    overview:
      "Accessibility is not an afterthought or audit checklist; it is an architectural invariant embedded directly into the Aegis token engine. Every component primitive guarantees WCAG 2.2 AAA contrast ratios (>7:1 for body copy, >4.5:1 for interactive targets), programmatic focus management, and screen reader announcements.",
    description:
      "### Deterministic Contrast Verification Algorithm\n" +
      "Aegis integrates an automated relative luminance formula into its token compilation pipeline:\n" +
      "\`L = 0.2126 * R_sRGB + 0.7152 * G_sRGB + 0.0722 * B_sRGB\`\n" +
      "\`Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)\`\n" +
      "If any proposed semantic token pair (e.g. \`text-muted\` against \`surface-card\`) drops below 7.0:1 in normal text or 4.5:1 in large UI controls, the CI build fails immediately with a detailed luminescence report.\n\n" +
      "### Keyboard Navigation & Focus Ring Management\n" +
      "Interactive surfaces utilize custom dual-layer focus rings (\`--focus-ring-outer\` and \`--focus-ring-inner\`) that guarantee 100% visibility against both light and dark backgrounds without triggering browser layout shifts.\n\n" +
      "• Roving Tabindex & Focus Traps: Modal dialogs, dropdowns, and drawer sheets implement strict focus trapping with automated restore-focus handlers on close.\n" +
      "• ARIA Live Regions: Dynamic state changes (such as token sync notifications or form validations) dispatch polite and assertive screen reader alerts via \`aria-live=\"polite\"\`.\n" +
      "• Motion Preferences: All keyframe animations and transitions automatically collapse to 0ms when \`prefers-reduced-motion: reduce\` is detected.",
    keyMetrics: [
      { label: "Contrast Ratio", value: "> 7.0:1 (AAA)" },
      { label: "Keyboard Nav", value: "100% Tab Order" },
      { label: "Screen Readers", value: "VoiceOver & NVDA" },
      { label: "Focus Visibility", value: "Dual-Ring 3px" },
    ],
    highlights: [
      "Automated CI build assertion rejects any token combination failing WCAG 2.2 AAA contrast standards.",
      "Dual-layer focus indicators guarantee crystal-clear visibility across any background tone.",
      "Zero layout shift focus management using outline-offset and CSS box-shadow primitives.",
      "Comprehensive reduced-motion fallbacks respecting user operating system preferences."
    ],
    codeSnippet:
`// Automated Contrast & Luminance Assertion Engine (utils/accessibility.ts)
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function assertWcagAAA(foregroundHex: string, backgroundHex: string): { ratio: number; passes: boolean } {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Number(ratio.toFixed(2)),
    passes: ratio >= 7.0 // Strict WCAG 2.2 AAA threshold for regular body text
  };
}`
  },

  // =========================================================================================
  // PAGE 04: CROSS-PLATFORM RUNTIMES (WEB, MOBILE & EMBEDDED)
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "PLATFORM EMITTERS // CROSS-PLATFORM RUNTIMES",
    title: "Cross-Platform Token Emitters",
    subtitle: "Unified Pipeline to CSS, TypeScript, Flutter Dart & Swift",
    discipline: "Cross-Platform Tooling & Compiler Architecture",
    thesis: "Write Tokens Once, Emit Everywhere: Abstracting Platform Idiosyncrasies through Style Dictionary and AST Code Generators",
    overview:
      "Aegis enforces a unified design vocabulary across diverse platform runtimes. A custom Style Dictionary build pipeline ingests normalized token JSON and generates optimized, platform-native code artifacts with zero runtime overhead.",
    description:
      "### Multi-Platform Emission Architecture\n\n" +
      "1. Web Runtime (CSS3 & TypeScript):\n" +
      "   • Emits modular CSS Custom Properties with scoped theme classes.\n" +
      "   • Generates strictly typed TypeScript interfaces (\`AegisThemeTokens\`, \`ColorPalette\`, \`SpacingScale\`) providing autocompletion and compile-time verification in React, Next.js, and Vite projects.\n\n" +
      "2. Mobile Flutter Runtime (Dart):\n" +
      "   • Compiles color tokens into \`ThemeExtension<AegisColors>\` classes.\n" +
      "   • Emits \`EdgeInsets\`, \`TextStyle\`, and \`BoxShadow\` constants mapped to Flutter's layout engine with zero runtime parsing cost.\n\n" +
      "3. iOS & Native Runtime (Swift & SwiftUI):\n" +
      "   • Emits SwiftUI \`Color\` extensions and UIKit \`UIColor\` palettes.\n" +
      "   • Generates dynamic asset catalogs and protocol-oriented theme providers.\n\n" +
      "4. Tree-Shaking & Dead-Code Elimination:\n" +
      "   • Generates ES modules with side-effect-free annotations, ensuring modern bundlers (Rollup, Vite, Webpack) strip unused tokens completely from production bundles.",
    keyMetrics: [
      { label: "Target Formats", value: "5 Native Formats" },
      { label: "Build Latency", value: "< 850ms Clean Build" },
      { label: "Runtime Overhead", value: "0 KB (Pure Constants)" },
      { label: "Type Safety", value: "100% Strict TS/Dart/Swift" },
    ],
    highlights: [
      "Simultaneous code emission for Web (CSS/TS), Flutter (Dart), and iOS (Swift) from a single token manifest.",
      "Zero runtime parsing overhead; all tokens compile into native platform constants.",
      "Strict TypeScript types and autocomplete interfaces for immediate developer ergonomics.",
      "ESM module exports with full tree-shaking support to minimize bundle sizes."
    ],
    codeSnippet:
`// Style Dictionary Cross-Platform Build Configuration (style-dictionary.config.ts)
import StyleDictionary from 'style-dictionary';

export function buildPlatformTokens() {
  const sd = StyleDictionary.extend({
    source: ['tokens/**/*.tokens.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/web/',
        files: [{ destination: 'aegis-tokens.css', format: 'css/variables' }]
      },
      typescript: {
        transformGroup: 'js',
        buildPath: 'dist/web/',
        files: [{ destination: 'tokens.ts', format: 'javascript/es6' }, { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' }]
      },
      flutter: {
        transformGroup: 'flutter',
        buildPath: 'dist/mobile/',
        files: [{ destination: 'aegis_tokens.dart', format: 'flutter/class.dart', className: 'AegisTokens' }]
      },
      swift: {
        transformGroup: 'ios-swift',
        buildPath: 'dist/ios/',
        files: [{ destination: 'AegisTokens.swift', format: 'ios-swift/class.swift', className: 'AegisTokens' }]
      }
    }
  });
  sd.buildAllPlatforms();
}`
  },

  // =========================================================================================
  // PAGE 05: AUTOMATION & QUALITY ASSURANCE (CI/CD & STORYBOOK)
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "QUALITY ASSURANCE // CI/CD & STORYBOOK",
    title: "Automated Design Systems CI/CD",
    subtitle: "Figma Webhooks, Chromatic Visual Regressions & Storybook Docs",
    discipline: "DevOps for Design Systems & Visual Verification",
    thesis: "Continuous Visual Integration: Guaranteeing Zero Design Drift via Figma Webhook Handshakes, Chromatic Regressions, and Living Storybook Docs",
    overview:
      "A complete continuous delivery pipeline ensuring that every design iteration in Figma is verified, tested, and published to downstream application repositories with zero manual handoff errors.",
    description:
      "### The Continuous Visual Integration Loop\n\n" +
      "1. Figma Webhook Event Dispatch:\n" +
      "   • When a designer publishes a new version of the Aegis Figma Component Library, a webhook POST payload hits our GitHub Actions webhook receiver.\n\n" +
      "2. Automated Token Extraction & Linting:\n" +
      "   • The CI runner pulls the latest variables, runs relative luminance assertions, verifies token schema contracts, and generates automated pull requests.\n\n" +
      "3. Chromatic Pixel-Level Visual Regressions:\n" +
      "   • Builds 320+ Storybook component stories across 4 viewport resolutions (375px, 768px, 1280px, 1920px) in both Light and Dark themes.\n" +
      "   • Captures pixel diffs; any regression > 0.01% requires explicit review and approval by Design and Engineering leads.\n\n" +
      "4. Automated NPM & Package Releases:\n" +
      "   • Merged PRs trigger Semantic Release to publish versioned \`@aegis/design-tokens\` and \`@aegis/react-components\` packages to NPM with automated changelog generation.",
    keyMetrics: [
      { label: "Visual Snapshots", value: "320+ Stories" },
      { label: "CI Pipeline Speed", value: "< 2.5 min" },
      { label: "Regression Diff Cap", value: "0.01% Pixel Threshold" },
      { label: "Release Cadence", value: "Automated SemVer" },
    ],
    highlights: [
      "Figma webhook integration automatically triggers token compilation on library publish.",
      "320+ component stories tested across 4 responsive viewports in Light & Dark modes.",
      "Chromatic visual regression testing catches unintended CSS shifts before production release.",
      "Automated semantic versioning and changelog publishing for downstream consumers."
    ],
    codeSnippet:
`# GitHub Actions Automated Token Sync & Visual Regression Pipeline (.github/workflows/tokens-ci.yml)
name: Aegis Token Sync & Visual Verification

on:
  repository_dispatch:
    types: [figma-library-published]
  push:
    branches: [main]

jobs:
  build-and-verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Extract Figma Variables & Build Tokens
        env:
          FIGMA_ACCESS_TOKEN: \${{ secrets.FIGMA_ACCESS_TOKEN }}
          FIGMA_FILE_KEY: \${{ secrets.FIGMA_FILE_KEY }}
        run: npm run tokens:sync && npm run tokens:build

      - name: Execute WCAG AAA Contrast Assertions
        run: npm run test:a11y

      - name: Run Chromatic Visual Regression Tests
        uses: chromaui/action@v1
        with:
          projectToken: \${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: false
          autoAcceptChanges: false`
  }
];

// Map lookup dictionary for easy index access (page01 .. page05)
export const FIGMA_PAGES_DATA: Record<string, FigmaPageContent> = figmaPagesData.reduce(
  (acc, page) => {
    acc[`page${page.pageNumber}`] = page;
    return acc;
  },
  {} as Record<string, FigmaPageContent>
);
