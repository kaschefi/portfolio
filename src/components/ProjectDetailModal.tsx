import React, { useState, useEffect } from 'react';
import { type VolumeProject } from '../data/portfolioData';
import { mokaPagesData, type MokaPageContent } from '../data/mokaPagesData';
import { xcodePagesData, type XcodePageContent } from '../data/xcodePagesData';
import { figmaPagesData, type FigmaPageContent } from '../data/figmaPagesData';
import { cursorPagesData, type CursorPageContent } from '../data/cursorPagesData';
import { claudeCodePagesData, type ClaudeCodePageContent } from '../data/claudeCodePagesData';
import { antigravityPagesData, type AntigravityPageContent } from '../data/antigravityPagesData';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { sound } from '../utils/audio';

type GenericPageContent =
  | MokaPageContent
  | XcodePageContent
  | FigmaPageContent
  | CursorPageContent
  | ClaudeCodePageContent
  | AntigravityPageContent;

interface ProjectDetailModalProps {
  volume: VolumeProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVolume?: (volume: VolumeProject) => void;
}

const pad = (val: number) => String(val).padStart(2, '0');

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  volume,
  isOpen,
  onClose
}) => {
  const [activeSpread, setActiveSpread] = useState<number>(1);
  const [showAllSpreads, setShowAllSpreads] = useState<boolean>(false);

  // Play sound upon opening
  useEffect(() => {
    if (isOpen && volume) {
      sound.playBookOpen();
    }
  }, [isOpen, volume]);

  // Reset to spread 1 whenever volume changes
  useEffect(() => {
    setActiveSpread(1);
    setShowAllSpreads(false);
  }, [volume?.id]);

  // Keyboard navigation inside modal (Escape to close, Left/Right to flip spreads)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && !showAllSpreads) {
        handlePrevSpread();
      } else if (e.key === 'ArrowRight' && !showAllSpreads) {
        handleNextSpread();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeSpread, showAllSpreads, onClose]);

  if (!isOpen || !volume) return null;

  // Resolve identical rich 5-spread datasets as 3D Three.js bookshelf
  const getPages = (volId: string): GenericPageContent[] => {
    switch (volId) {
      case 'codex':
        return mokaPagesData;
      case 'figma':
        return figmaPagesData;
      case 'cursor':
        return cursorPagesData;
      case 'antigravity':
        return antigravityPagesData;
      case 'claude-code':
        return claudeCodePagesData;
      case 'xcode':
        return xcodePagesData;
      default:
        return mokaPagesData;
    }
  };

  const pages = getPages(volume.id);
  const currentSpread = pages[activeSpread - 1] || pages[0];

  const githubUrl =
    volume.id === 'codex'
      ? 'https://github.com/kaschefi/cozmo_ai_assistant'
      : volume.id === 'figma'
        ? 'https://github.com/kaschefi/sawyerRobot-ShellGame'
        : volume.id === 'xcode'
          ? 'https://github.com/kaschefi/joinApp'
          : volume.projectDetails?.githubUrl || 'https://github.com/kaschefi';



  const handlePrevSpread = () => {
    sound.playPageTurn();
    setActiveSpread((prev) => Math.max(1, prev - 1));
    const drawer = document.querySelector('.modal-drawer');
    if (drawer) {
      drawer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSpread = () => {
    sound.playPageTurn();
    setActiveSpread((prev) => Math.min(pages.length, prev + 1));
    const drawer = document.querySelector('.modal-drawer');
    if (drawer) {
      drawer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSpread = (idx: number) => {
    sound.playPageTurn();
    setActiveSpread(idx + 1);
    setShowAllSpreads(false);
    const drawer = document.querySelector('.modal-drawer');
    if (drawer) {
      drawer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderSingleSpread = (page: GenericPageContent, idx: number) => (
    <section key={idx} className="spread-view-section">
      {/* Spread Eyebrow & Meta */}
      <div className="spread-header-block">
        <div className="spread-badge-row">
          <span className="mobile-roman-badge">SPREAD {page.pageNumber} / {pad(pages.length)}</span>
          <span className="spread-label-pill">{page.pageLabel}</span>
          {page.discipline && <span className="spread-discipline-tag">{page.discipline}</span>}
        </div>
        <h2 className="spread-main-title">{page.title}</h2>
        {page.subtitle && <p className="spread-main-subtitle">{page.subtitle}</p>}
      </div>

      {/* Thesis Block */}
      {page.thesis && (
        <div className="moka-thesis-block" style={{ borderLeftColor: volume.accent || '#3884ff' }}>
          {page.thesis}
        </div>
      )}

      {/* Narrative Description Paragraphs */}
      {page.description && (
        <div className="moka-description-block">
          {page.description.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx} className="moka-desc-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Key Architectural Highlights */}
      {page.highlights && page.highlights.length > 0 && (
        <div className="moka-highlights-block">
          <div className="moka-highlights-title" style={{ color: volume.accent || '#3884ff' }}>
            Key Architectural Highlights
          </div>
          {page.highlights.map((h, hIdx) => (
            <div key={hIdx} className="moka-highlight-item">
              <span className="moka-highlight-dot" style={{ background: volume.accent || '#3884ff' }} />
              <span>{h}</span>
            </div>
          ))}
        </div>
      )}

      {/* Architecture System Image / Diagram */}
      {page.image && (
        <div className="moka-img-box">
          <img
            src={page.image}
            alt={page.imageCaption || page.title}
            className="moka-diagram-img"
            loading="lazy"
            decoding="async"
          />
          {page.imageCaption && (
            <p style={{ marginTop: '8px', fontSize: '0.74rem', color: '#9da9be', textAlign: 'center' }}>
              {page.imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Key Performance Metrics */}
      {page.keyMetrics && page.keyMetrics.length > 0 && (
        <div className="moka-metrics-row">
          {page.keyMetrics.map((m, mIdx) => (
            <div key={mIdx} className="moka-metric-item">
              <span className="moka-metric-val">{m.value}</span>
              <span className="moka-metric-lbl">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Production Code Snippet */}
      {'codeSnippet' in page && Boolean((page as { codeSnippet?: string }).codeSnippet) && (
        <div className="moka-code-box">
          <div className="moka-code-header">
            <span>Production Code Implementation</span>
          </div>
          <pre className="moka-code-block">
            <code>{(page as { codeSnippet?: string }).codeSnippet}</code>
          </pre>
        </div>
      )}
    </section>
  );

  return (
    <div
      className="modal-backdrop modal-full-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-drawer modal-full-page"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <header className="modal-header modal-full-header">
          <div className="modal-header-inner">
            <button
              className="modal-back-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              type="button"
              aria-label="Back to projects"
            >
              <ArrowLeft size={16} />
              <span>Back to Projects</span>
            </button>

            <div className="modal-header-center">
              <span className="mobile-roman-badge">
                VOL. {volume.roman}
              </span>
              <span className="modal-header-title">
                {volume.title}
              </span>
            </div>

            <div className="modal-header-actions">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-action-btn modal-action-btn--secondary"
                  title="View Source Code"
                >
                  <GithubIcon size={14} />
                  <span className="hide-on-small">Source</span>
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="modal-body modal-full-body">
          {/* Top Intro Section */}
          <div className="project-full-intro">
            <div className="about-section-tag" style={{ marginBottom: '0.65rem' }}>
              <span className="mobile-roman-badge">
                VOL. {volume.roman}
              </span>
              <span className="about-section-tag-divider">—</span>
              <span>{volume.discipline}</span>
              <span className="about-section-tag-divider">·</span>
              <span>{volume.projectDetails?.timeframe || '2024'}</span>
            </div>

            <h1 id="modal-title" className="about-heading-serif modal-title-serif modal-title-large">
              {volume.title}
            </h1>
            <p className="modal-subtitle-inst">
              {volume.projectDetails?.institution || 'FH Campus Wien'} · <strong>Role: {volume.projectDetails?.role || 'Lead Engineer'}</strong>
            </p>
          </div>

          {/* Spread Selection Navigation (Exact 5 Spreads as in 3D) */}
          <nav className="spread-nav-tabs" aria-label="Monograph Spreads">
            <div className="spread-tabs-list">
              {pages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`spread-tab-btn ${!showAllSpreads && activeSpread === idx + 1 ? 'is-active' : ''}`}
                  onClick={() => handleSelectSpread(idx)}
                >
                  <span className="spread-tab-num">Spread {p.pageNumber}</span>
                  <span className="spread-tab-title">{p.title}</span>
                </button>
              ))}
              <button
                type="button"
                className={`spread-tab-btn spread-tab-btn--all ${showAllSpreads ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playPageTurn();
                  setShowAllSpreads(true);
                }}
              >
                <span className="spread-tab-num">Continuous</span>
                <span className="spread-tab-title">All 5 Spreads</span>
              </button>
            </div>
          </nav>

          {/* Main Spread Content */}
          <div className="spreads-container">
            {showAllSpreads ? (
              <div className="spreads-continuous-feed">
                {pages.map((page, idx) => (
                  <div key={idx} className="spread-feed-item">
                    {renderSingleSpread(page, idx)}
                    {idx < pages.length - 1 && <div className="spread-feed-divider" />}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {renderSingleSpread(currentSpread, activeSpread - 1)}

                {/* Spread-to-Spread Flip Buttons */}
                <div className="spread-pagination-bar">
                  <button
                    className="spread-page-nav-btn"
                    onClick={handlePrevSpread}
                    disabled={activeSpread <= 1}
                    type="button"
                  >
                    <ArrowLeft size={14} />
                    <span>Previous Spread</span>
                  </button>
                  <span className="spread-page-indicator">
                    Spread {pad(activeSpread)} of {pad(pages.length)}
                  </span>
                  <button
                    className="spread-page-nav-btn"
                    onClick={handleNextSpread}
                    disabled={activeSpread >= pages.length}
                    type="button"
                  >
                    <span>Next Spread</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Technical Specs & Colophon */}
          <div className="project-specs-footer">
            <div>
              <span className="specs-label">Format:</span> {volume.format}
            </div>
            <div>
              <span className="specs-label">Binding:</span> {volume.binding}
            </div>
            <div>
              <span className="specs-label">Motif:</span> {volume.motif}
            </div>
            {currentSpread.metadata?.theme && (
              <div>
                <span className="specs-label">Theme:</span> {currentSpread.metadata.theme}
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
