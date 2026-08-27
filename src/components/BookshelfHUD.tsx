import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';
import type { VolumeProject } from '../data/portfolioData';
import { VOLUMES_DATA } from '../data/portfolioData';
import { MOKA_PAGES_DATA, type MokaPageContent } from '../data/mokaPagesData';

interface BookshelfHUDProps {
  sceneState: { isOpen: boolean; isInspecting: boolean; page: number };
  volume: VolumeProject;
}

const pad = (val: number) => String(val).padStart(2, '0');

export const BookshelfHUD: React.FC<BookshelfHUDProps> = ({
  sceneState,
  volume
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const triggerDomAction = (id: string, soundFn?: () => void) => {
    if (soundFn) soundFn();
    else sound.playClick();

    // Trigger internal ThreeUI bookshelf action buttons in DOM
    const elem = document.querySelector(`.bookshelf__source-controls #${id}`) as HTMLButtonElement | null;
    if (elem) {
      elem.click();
    }
  };

  const handlePrevVolume = () => {
    sound.playShelfSlide();
    triggerDomAction('previous');
  };

  const handleNextVolume = () => {
    sound.playShelfSlide();
    triggerDomAction('next');
  };

  const handleInspectToggle = () => {
    if (sceneState.isInspecting) {
      triggerDomAction('close-detail', () => sound.playBookClose());
    } else {
      triggerDomAction('inspect', () => sound.playFoilShimmer());
    }
  };

  const handleBookToggle = () => {
    if (sceneState.isOpen) {
      triggerDomAction('toggle-book', () => sound.playBookClose());
    } else {
      triggerDomAction('toggle-book', () => sound.playBookOpen());
    }
  };

  const handleNextPage = () => {
    sound.playPageTurn();
    triggerDomAction('next-page');
  };

  const handlePrevPage = () => {
    sound.playPageTurn();
    triggerDomAction('previous-page');
  };

  const handleResetCamera = () => {
    sound.playClick();
    triggerDomAction('reset-view');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const volumeIdx = VOLUMES_DATA.findIndex((v) => v.id === volume.id);
  const currentIdx = volumeIdx !== -1 ? volumeIdx : 0;

  const handleSelectIndex = (targetIdx: number) => {
    if (targetIdx === currentIdx) return;
    let diff = targetIdx - currentIdx;
    if (diff > 3) diff -= 7;
    if (diff < -3) diff += 7;
    const action = diff > 0 ? 'next' : 'previous';
    const steps = Math.abs(diff);
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        triggerDomAction(action);
      }, i * 60);
    }
  };

  // Resolve Active Page Content for MOKA
  const activePageKey = `page0${Math.min(Math.max(sceneState.page, 1), 5)}`;
  const mokaContent: MokaPageContent | undefined =
    volume.id === 'codex' ? MOKA_PAGES_DATA[activePageKey] : undefined;

  const getPageTitle = (page: number) => {
    if (mokaContent) {
      return mokaContent.pageLabel;
    }
    if (page <= 1) return 'Title Page & Overview';
    const chapterIdx = page - 2;
    if (volume.chapters && volume.chapters[chapterIdx]) {
      return `Chapter 0${chapterIdx + 1}: ${volume.chapters[chapterIdx].title}`;
    }
    if (page === 5) return 'Colophon & Specifications';
    return `Page 0${page}`;
  };

  return (
    <>
      {/* 1. Top Editorial Header */}
      <header className="editorial-header" aria-label="Collection">
        <div className="editorial-identity">
          <strong>Working Volumes</strong>
          <span>Seven field guides for making</span>
        </div>
        <div className="editorial-index">
          <span>Edition 02 · 2026</span>
          <span id="palette-label">{volume.paletteLabel}</span>
        </div>
      </header>

      {/* 2. Bottom Shelf Browse Navigation */}
      <section className="browse-ui" id="browse-ui" aria-label="Shelf navigation">
        <div className="selection">
          <span className="counter" id="counter">
            {pad(currentIdx + 1)} / 07
          </span>
          <div className="selection__copy">
            <h1 className="selection__title" id="selection-title">
              {volume.title}
            </h1>
            <p className="selection__note" id="selection-note">
              {volume.note}
            </p>
          </div>
        </div>

        <div className="browse-actions">
          <button
            className="round-button"
            id="previous"
            onClick={handlePrevVolume}
            type="button"
            aria-label="Previous volume"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m10.5 3.5-4.5 4.5 4.5 4.5" />
            </svg>
          </button>
          <button
            className="text-button"
            id="inspect"
            onClick={handleInspectToggle}
            type="button"
          >
            Open
          </button>
          <button
            className="round-button"
            id="next"
            onClick={handleNextVolume}
            type="button"
            aria-label="Next volume"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m5.5 3.5 4.5 4.5-4.5 4.5" />
            </svg>
          </button>
        </div>

        <nav className="index-nav" aria-label="Volume index">
          <div className="markers" id="markers" role="tablist" aria-label="Choose a volume">
            {VOLUMES_DATA.map((v, idx) => (
              <button
                key={v.id}
                className="marker"
                type="button"
                role="tab"
                aria-label={`Jump to volume ${idx + 1}: ${v.title}`}
                aria-selected={idx === currentIdx}
                aria-current={idx === currentIdx ? 'true' : undefined}
                onClick={() => handleSelectIndex(idx)}
              />
            ))}
          </div>
          <p className="microcopy">Wheel · arrows · select</p>
        </nav>
      </section>

      {/* 3. Detail Mode Panel (Right Side Inspection) */}
      <aside
        className="detail-panel"
        id="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        aria-hidden={!sceneState.isInspecting}
      >
        <button
          className="close-button"
          id="close-detail"
          onClick={handleInspectToggle}
          type="button"
          aria-label="Return volume to shelf"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>

        <p className="eyebrow" id="detail-eyebrow">
          Volume {volume.roman} · {volume.discipline}
        </p>
        <h2 className="detail-title" id="detail-title">
          {volume.title}
        </h2>
        <p className="detail-deck" id="detail-deck">
          {volume.deck}
        </p>

        {/* 2x2 Metadata Grid */}
        <dl className="meta-list">
          <div>
            <dt>Binding</dt>
            <dd id="detail-binding">{volume.binding}</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd id="detail-format">{volume.format}</dd>
          </div>
          <div>
            <dt>Theme</dt>
            <dd id="detail-theme">{volume.theme}</dd>
          </div>
          <div>
            <dt>Motif</dt>
            <dd id="detail-motif">{volume.motif}</dd>
          </div>
        </dl>

        {/* MOKA Rich Page Content (Code snippet, Benchmark diagram, Metrics) */}
        {mokaContent && (
          <div className="moka-rich-content">
            {mokaContent.thesis && (
              <div className="moka-thesis-block">
                {mokaContent.thesis}
              </div>
            )}

            {mokaContent.codeSnippet && (
              <div className="moka-code-box">
                <div className="moka-code-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Code2 size={12} />
                    <span>PYTHON ARCHITECTURE</span>
                  </span>
                  <button
                    className="moka-code-copy-btn"
                    onClick={() => handleCopyCode(mokaContent.codeSnippet!)}
                    type="button"
                  >
                    {copiedCode ? <Check size={11} /> : <Copy size={11} />}
                    <span style={{ marginLeft: '3px' }}>{copiedCode ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <pre className="moka-code-block">
                  <code>{mokaContent.codeSnippet}</code>
                </pre>
              </div>
            )}

            {mokaContent.image && (
              <div className="moka-img-box">
                <img
                  src={mokaContent.image}
                  alt={mokaContent.imageCaption || "System Architecture"}
                  className="moka-diagram-img"
                />
              </div>
            )}

            {mokaContent.keyMetrics && mokaContent.keyMetrics.length > 0 && (
              <div className="moka-metrics-row">
                {mokaContent.keyMetrics.map((m, idx) => (
                  <div key={idx} className="moka-metric-item">
                    <span className="moka-metric-val">{m.value}</span>
                    <span className="moka-metric-lbl">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Page Navigation Circles */}
        <div className="page-navigation" role="group" aria-label="Browse sample pages">
          <button
            className="page-button"
            id="previous-page"
            onClick={handlePrevPage}
            disabled={!sceneState.isOpen || sceneState.page <= 1}
            type="button"
            aria-label="Previous sample page"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m10.5 3.5-4.5 4.5 4.5 4.5" />
            </svg>
          </button>
          <p className="page-status" aria-live="off">
            <strong id="page-label">
              {sceneState.isOpen ? getPageTitle(sceneState.page) : 'Closed'}
            </strong>
            <span id="page-counter">
              {sceneState.isOpen ? `Spread 0${sceneState.page} / 05` : 'Click book to open'}
            </span>
          </p>
          <button
            className="page-button"
            id="next-page"
            onClick={handleNextPage}
            disabled={!sceneState.isOpen || sceneState.page >= 5}
            type="button"
            aria-label="Next sample page"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m5.5 3.5 4.5 4.5-4.5 4.5" />
            </svg>
          </button>
        </div>

        {/* Action Controls */}
        <div className="detail-controls">
          <p className="microcopy">Drag cover or click once to open · Background to orbit</p>
          <div className="detail-buttons">
            <button
              className="text-button reset-button"
              id="toggle-book"
              onClick={handleBookToggle}
              type="button"
              aria-pressed={sceneState.isOpen}
            >
              {sceneState.isOpen ? 'Close book' : 'Open book'}
            </button>
            <button
              className="text-button reset-button"
              id="reset-view"
              onClick={handleResetCamera}
              type="button"
            >
              Reset view
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
