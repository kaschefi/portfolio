import React from 'react';
import { sound } from '../utils/audio';
import type { VolumeProject } from '../data/portfolioData';
import { VOLUMES_DATA } from '../data/portfolioData';
import { MOKA_PAGES_DATA, type MokaPageContent } from '../data/mokaPagesData';
import { XCODE_PAGES_DATA, type XcodePageContent } from '../data/xcodePagesData';
import { FIGMA_PAGES_DATA, type FigmaPageContent } from '../data/figmaPagesData';
import { CURSOR_PAGES_DATA, type CursorPageContent } from '../data/cursorPagesData';
import { CLAUDE_CODE_PAGES_DATA, type ClaudeCodePageContent } from '../data/claudeCodePagesData';
import { ANTIGRAVITY_PAGES_DATA, type AntigravityPageContent } from '../data/antigravityPagesData';
import { ViewModeToggle } from './ViewModeToggle';

interface BookshelfHUDProps {
  sceneState: { isOpen: boolean; isInspecting: boolean; page: number };
  volume: VolumeProject;
  viewMode?: '2d' | '3d';
  onToggleViewMode?: (mode: '2d' | '3d') => void;
}

const pad = (val: number) => String(val).padStart(2, '0');

export const BookshelfHUD: React.FC<BookshelfHUDProps> = ({
  sceneState,
  volume,
  viewMode = '3d',
  onToggleViewMode
}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [expandedPage, setExpandedPage] = React.useState<number>(1);

  // Sync expandedPage when entering inspect mode
  React.useEffect(() => {
    if (sceneState.isInspecting) {
      setExpandedPage(sceneState.page || 1);
    }
  }, [sceneState.isInspecting, sceneState.page]);

  // Reset expanded if user exits inspecting mode
  React.useEffect(() => {
    if (!sceneState.isInspecting) {
      setIsExpanded(false);
    }
  }, [sceneState.isInspecting]);

  // Sync with bookshelf:view-spine and bookshelf:reset-view events
  React.useEffect(() => {
    const handleViewSpine = () => setIsExpanded(true);
    const handleResetView = () => setIsExpanded(false);

    window.addEventListener('bookshelf:view-spine', handleViewSpine);
    window.addEventListener('bookshelf:reset-view', handleResetView);

    return () => {
      window.removeEventListener('bookshelf:view-spine', handleViewSpine);
      window.removeEventListener('bookshelf:reset-view', handleResetView);
    };
  }, []);

  const handleToggleExpand = () => {
    sound.playClick();
    if (!isExpanded) {
      if (sceneState.isOpen) {
        triggerDomAction('toggle-book', () => sound.playBookClose());
      }
      window.dispatchEvent(new CustomEvent('bookshelf:view-spine'));
      setIsExpanded(true);
    } else {
      window.dispatchEvent(new CustomEvent('bookshelf:reset-view'));
      setIsExpanded(false);
    }
  };

  const triggerDomAction = (id: string, soundFn?: () => void) => {
    if (soundFn) soundFn();
    else sound.playClick();

    // Trigger internal ThreeUI bookshelf action buttons in DOM
    const elem = (document.querySelector(`.bookshelf__source-controls #${id}`) ||
      document.querySelector(`.bookshelf #${id}`) ||
      document.querySelector(`#${id}`)) as HTMLButtonElement | null;
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

  const handleCloseDetail = () => {
    sound.playBookClose();
    // 1. Click source controls close-detail button
    const elem = document.querySelector('.bookshelf__source-controls #close-detail') as HTMLButtonElement | null;
    if (elem) {
      elem.click();
    }
    // 2. Dispatch Escape keydown to the .bookshelf element
    const shelf = document.querySelector('.bookshelf') as HTMLElement | null;
    if (shelf) {
      shelf.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
    }
  };

  const handleInspectToggle = () => {
    if (sceneState.isInspecting) {
      handleCloseDetail();
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

  const handleNextExpandedPage = () => {
    sound.playPageTurn();
    setExpandedPage((prev) => Math.min(5, prev + 1));
  };

  const handlePrevExpandedPage = () => {
    sound.playPageTurn();
    setExpandedPage((prev) => Math.max(1, prev - 1));
  };

  const handleResetCamera = () => {
    sound.playClick();
    window.dispatchEvent(new CustomEvent('bookshelf:reset-view'));
    triggerDomAction('reset-view');
  };

  const volumeIdx = VOLUMES_DATA.findIndex((v) => v.id === volume.id);
  const currentIdx = volumeIdx !== -1 ? volumeIdx : 0;

  const handleSelectIndex = (targetIdx: number) => {
    if (targetIdx === currentIdx) return;
    let diff = targetIdx - currentIdx;
    const totalVols = VOLUMES_DATA.length;
    const half = Math.floor(totalVols / 2);
    if (diff > half) diff -= totalVols;
    if (diff < -half) diff += totalVols;
    const action = diff > 0 ? 'next' : 'previous';
    const steps = Math.abs(diff);
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        triggerDomAction(action);
      }, i * 60);
    }
  };

  // Resolve Active Page Content for MOKA, Xcode, Figma, Cursor, Claude Code, or Antigravity (RoboFlow)
  const activePageNumber = isExpanded ? expandedPage : sceneState.page;
  const activePageKey = `page0${Math.min(Math.max(activePageNumber, 1), 5)}`;
  const richContent: MokaPageContent | XcodePageContent | FigmaPageContent | CursorPageContent | ClaudeCodePageContent | AntigravityPageContent | undefined =
    volume.id === 'codex'
      ? MOKA_PAGES_DATA[activePageKey]
      : volume.id === 'xcode'
        ? XCODE_PAGES_DATA[activePageKey]
        : volume.id === 'figma'
          ? FIGMA_PAGES_DATA[activePageKey]
          : volume.id === 'cursor'
            ? CURSOR_PAGES_DATA[activePageKey]
            : volume.id === 'claude-code'
              ? CLAUDE_CODE_PAGES_DATA[activePageKey]
              : volume.id === 'antigravity'
                ? ANTIGRAVITY_PAGES_DATA[activePageKey]
                : undefined;

  const getPageTitle = (page: number) => {
    if (richContent) {
      return richContent.pageLabel;
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
          <strong>Projects</strong>
        </div>
        <div className="editorial-view-toggle">
          {onToggleViewMode && (
            <ViewModeToggle mode={viewMode} onChange={onToggleViewMode} />
          )}
        </div>
      </header>

      {/* 2. Bottom Shelf Browse Navigation */}
      <section className="browse-ui" id="browse-ui" aria-label="Shelf navigation">
        <div className="selection">
          <span className="counter" id="counter">
            {pad(currentIdx + 1)} / {pad(VOLUMES_DATA.length)}
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
        className={`detail-panel ${isExpanded ? 'is-expanded-panel' : ''}`}
        id="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        aria-hidden={!sceneState.isInspecting}
      >
        <div className="detail-panel-actions">
          <button
            className="expand-button"
            onClick={handleToggleExpand}
            type="button"
            aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
            title={isExpanded ? 'Collapse reading panel' : 'Expand reading panel'}
          >
            {isExpanded ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5.5 1.5v4H1.5M10.5 1.5v4h4M5.5 14.5v-4H1.5M10.5 14.5v-4h4" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 5.5V1.5h4M14.5 5.5V1.5h-4M1.5 10.5v4h4M14.5 10.5v4h-4" />
              </svg>
            )}
          </button>
          <button
            className="close-button"
            onClick={handleCloseDetail}
            type="button"
            aria-label="Return volume to shelf"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <p className="eyebrow" id="detail-eyebrow">
          Volume {volume.roman} · {(sceneState.isOpen || isExpanded) && richContent?.discipline ? richContent.discipline : volume.discipline}
        </p>
        <h2 className="detail-title" id="detail-title">
          {(sceneState.isOpen || isExpanded) && richContent ? richContent.title : volume.title}
        </h2>
        <p className="detail-deck" id="detail-deck">
          {(sceneState.isOpen || isExpanded) && richContent ? richContent.subtitle : volume.deck}
        </p>

        {/* Closed State Actions / GitHub Repository Link */}
        {!sceneState.isOpen && !isExpanded && (
          <div className="detail-github-box">
            <a
              href={volume.id === 'codex' ? 'https://github.com/kaschefi/cozmo_ai_assistant' : (volume.id === 'xcode' ? 'https://github.com/kaschefi/joinApp' : (volume.id === 'figma' ? 'https://github.com/kaschefi/sawyerRobot-ShellGame' : (volume.projectDetails?.githubUrl || 'https://github.com/kaschefi')))}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-github-btn"
              aria-label="View source repository on GitHub"
            >
              <div className="detail-github-info">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <div className="detail-github-text">
                  <span className="detail-github-repo">
                    {volume.id === 'codex' ? 'kaschefi/cozmo_ai_assistant' : (volume.id === 'xcode' ? 'kaschefi/joinApp' : (volume.id === 'figma' ? 'kaschefi/sawyerRobot-ShellGame' : (volume.projectDetails?.githubUrl?.replace('https://github.com/', '') || 'kaschefi/claude-code')))}
                  </span>
                  <span className="detail-github-label">Open on GitHub</span>
                </div>
              </div>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3h7v7M13 3 7 9" />
              </svg>
            </a>
          </div>
        )}

        {/* Rich Page Content (Extended Description, Highlights, Code snippet, Diagrams, Metrics) - SHOWN WHEN OPEN OR IN EXPAND MODE */}
        {(sceneState.isOpen || isExpanded) && richContent && (
          <div className="moka-rich-content">
            {richContent.thesis && (
              <div className="moka-thesis-block" style={{ borderLeftColor: volume.accent || '#c87046' }}>
                {richContent.thesis}
              </div>
            )}

            {richContent.description && (
              <div className="moka-description-block">
                {richContent.description.split('\n\n').map((paragraph: string, pIdx: number) => (
                  <p key={pIdx} className="moka-desc-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {richContent.highlights && richContent.highlights.length > 0 && (
              <div className="moka-highlights-block">
                <div className="moka-highlights-title" style={{ color: volume.accent || '#c87046' }}>Key Architectural Highlights</div>
                {richContent.highlights.map((h: string, hIdx: number) => (
                  <div key={hIdx} className="moka-highlight-item">
                    <span className="moka-highlight-dot" style={{ background: volume.accent || '#c87046' }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {richContent.image && (
              <div className="moka-img-box">
                <img
                  src={richContent.image}
                  alt={richContent.imageCaption || "System Architecture"}
                  className="moka-diagram-img"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={400}
                />
              </div>
            )}

            {richContent.keyMetrics && richContent.keyMetrics.length > 0 && (
              <div className="moka-metrics-row">
                {richContent.keyMetrics.map((m: { label: string; value: string }, idx: number) => (
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
            onClick={isExpanded ? handlePrevExpandedPage : handlePrevPage}
            disabled={isExpanded ? expandedPage <= 1 : (!sceneState.isOpen || sceneState.page <= 1)}
            type="button"
            aria-label="Previous sample page"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m10.5 3.5-4.5 4.5 4.5 4.5" />
            </svg>
          </button>
          <p className="page-status" aria-live="off">
            <strong id="page-label">
              {(sceneState.isOpen || isExpanded) ? getPageTitle(activePageNumber) : 'Closed'}
            </strong>
            <span id="page-counter">
              {(sceneState.isOpen || isExpanded) ? `Spread 0${activePageNumber} / 05` : 'Click book to open'}
            </span>
          </p>
          <button
            className="page-button"
            id="next-page"
            onClick={isExpanded ? handleNextExpandedPage : handleNextPage}
            disabled={isExpanded ? expandedPage >= 5 : (!sceneState.isOpen || sceneState.page >= 5)}
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
            <button
              id="view-spine"
              style={{ display: 'none' }}
              type="button"
              aria-hidden="true"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
