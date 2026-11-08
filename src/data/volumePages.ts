// src/data/volumePages.ts
// Unified spread page generator: converts raw VolumeProject / JSON content into rich 5-page spreads.

import type { VolumeProject } from './portfolioData';

export interface BookPageSpread {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // SYSTEM OVERVIEW" or "CHAPTER 01 // ROUTING"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // Field / domain
  thesis?: string;            // Core architectural thesis
  overview?: string;          // Concise executive summary
  description?: string;       // In-depth technical breakdown
  codeSnippet?: string;       // Production code excerpt
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

const pad = (val: number) => String(val).padStart(2, '0');

/**
 * Generates 5 unified spreads for any volume.
 * Spread 01: Genesis & System Overview (synthesized from projectDetails & deck)
 * Spreads 02-05: Chapters 1-4 (from volume.chapters)
 */
export function generateVolumePages(volume: VolumeProject): BookPageSpread[] {
  // If the volume explicitly defines custom pre-formatted pages, use them
  if ((volume as any).pages && Array.isArray((volume as any).pages) && (volume as any).pages.length > 0) {
    return (volume as any).pages;
  }

  const spreads: BookPageSpread[] = [];

  // =========================================================================================
  // SPREAD 01: GENESIS & SYSTEM OVERVIEW
  // =========================================================================================
  const details = volume.projectDetails;
  const genesisDescription = [
    details?.summary,
    details?.problem ? `### Problem Statement\n${details.problem}` : null,
    details?.solution ? `### Architectural Solution\n${details.solution}` : null
  ].filter(Boolean).join('\n\n');

  spreads.push({
    pageNumber: "01",
    pageLabel: "GENESIS // SYSTEM OVERVIEW",
    title: volume.title,
    subtitle: volume.subtitle || details?.name || volume.title,
    discipline: volume.discipline,
    thesis: details?.problem && details?.solution
      ? `${details.problem} → ${details.solution}`
      : volume.note || volume.deck,
    overview: volume.deck || details?.summary || volume.note,
    description: genesisDescription || volume.deck || volume.note,
    keyMetrics: details?.keyMetrics || [],
    highlights: details?.techStack ? details.techStack.slice(0, 6) : [],
    metadata: {
      binding: volume.binding,
      format: volume.format,
      theme: volume.theme,
      motif: volume.motif
    }
  });

  // =========================================================================================
  // SPREADS 02 - 05: CHAPTERS 01 TO 04
  // =========================================================================================
  const chapters = volume.chapters || [];
  const maxChapters = Math.min(Math.max(chapters.length, 1), 4);

  for (let i = 0; i < maxChapters; i++) {
    const ch = chapters[i];
    const pageNum = pad(i + 2);

    if (ch) {
      spreads.push({
        pageNumber: pageNum,
        pageLabel: (ch as any).pageLabel || `CHAPTER ${ch.number || pad(i + 1)} // ${ch.title.toUpperCase()}`,
        title: ch.title,
        subtitle: ch.subtitle || "",
        discipline: (ch as any).discipline || volume.discipline,
        thesis: (ch as any).thesis || ch.subtitle,
        overview: (ch as any).overview || (ch.content ? ch.content.slice(0, 220) + (ch.content.length > 220 ? '...' : '') : ''),
        description: (ch as any).description || ch.content || "",
        codeSnippet: ch.codeSnippet,
        highlights: ch.highlights || [],
        keyMetrics: (ch as any).keyMetrics || (i === 0 ? details?.keyMetrics : undefined),
        image: (ch as any).image,
        imageCaption: (ch as any).imageCaption
      });
    } else {
      // Fallback for missing chapter
      spreads.push({
        pageNumber: pageNum,
        pageLabel: `CHAPTER ${pageNum} // SPECIFICATIONS`,
        title: `Specifications & Architecture`,
        subtitle: volume.subtitle,
        discipline: volume.discipline,
        description: volume.deck || volume.note,
        highlights: details?.techStack || []
      });
    }
  }

  return spreads;
}

