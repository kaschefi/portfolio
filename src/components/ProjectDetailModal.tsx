import React, { useEffect } from 'react';
import type { VolumeProject } from '../data/portfolioData';
import { X, CheckCircle2, Layers, BookOpen } from 'lucide-react';
import { GithubIcon } from './Icons';
import { sound } from '../utils/audio';

interface ProjectDetailModalProps {
  volume: VolumeProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  volume,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (isOpen && volume) {
      sound.playBookOpen();
    }
  }, [isOpen, volume]);

  if (!isOpen || !volume) return null;

  const { projectDetails, chapters } = volume;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Archival Modal Header */}
        <div className="modal-header">
          <div>
            <div className="about-section-tag" style={{ marginBottom: '0.45rem' }}>
              <span className="mobile-roman-badge">
                VOL. {volume.roman}
              </span>
              <span className="about-section-tag-divider">—</span>
              <span>{volume.discipline}</span>
              <span className="about-section-tag-divider">·</span>
              <span>{projectDetails.timeframe}</span>
            </div>

            <h2 id="modal-title" className="about-heading-serif modal-title-serif">
              {volume.title} · {projectDetails.name}
            </h2>
            <p className="modal-subtitle-inst">
              {projectDetails.institution}
            </p>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close modal"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Hero Project Card (Skill Card Material Aesthetic) */}
          <div className="project-hero-card">
            <div className="project-hero-top-row">
              <div>
                <span className="project-hero-category">
                  {projectDetails.category}
                </span>
                <h3 className="project-hero-title">
                  {projectDetails.name}
                </h3>
                <p className="project-hero-role">
                  Role: <strong>{projectDetails.role}</strong>
                </p>
              </div>

              <div className="project-hero-actions">
                {projectDetails.githubUrl && (
                  <a
                    href={projectDetails.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="modal-action-btn modal-action-btn--secondary"
                  >
                    <GithubIcon size={14} />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            <p className="project-hero-summary">
              {projectDetails.summary}
            </p>

            {/* Key Metrics Grid */}
            <div className="project-metrics-grid">
              {projectDetails.keyMetrics.map((m, idx) => (
                <div key={idx} className="metric-box">
                  <div className="metric-value">
                    {m.value}
                  </div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="project-tech-section">
              <span className="project-tech-label">
                Engineered with
              </span>
              <div className="tech-tag-cloud">
                {projectDetails.techStack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Reticle Corner Accent */}
            <div className="mobile-card-reticle" aria-hidden="true" />
          </div>

          {/* Architecture & Engineering Deep-Dive */}
          <div className="project-arch-section">
            <h4 className="project-section-title">
              <Layers size={16} className="project-section-icon" />
              <span>System Architecture &amp; Approach</span>
            </h4>
            <div className="project-arch-card">
              <p className="project-arch-p">
                <strong>The Challenge:</strong> {projectDetails.problem}
              </p>
              <p className="project-arch-p">
                <strong>The Engineering Solution:</strong> {projectDetails.solution}
              </p>
              <p className="project-arch-subtext">
                Architecture Pattern: {projectDetails.architectureDescription}
              </p>
            </div>
          </div>

          {/* Chapters & Source Proof */}
          <div className="chapters-section">
            <h4 className="project-section-title">
              <BookOpen size={16} className="project-section-icon" />
              <span>Volume Chapters &amp; Implementation Highlights</span>
            </h4>

            {chapters.map((chapter) => (
              <div key={chapter.number} className="chapter-card">
                <div className="chapter-eyebrow">
                  CHAPTER {chapter.number} · {volume.title.toUpperCase()}
                </div>
                <h5 className="chapter-title">{chapter.title}</h5>
                <p className="chapter-subtitle">{chapter.subtitle}</p>
                <p className="chapter-content">{chapter.content}</p>

                {chapter.codeSnippet && (
                  <pre className="code-snippet-box">
                    <code>{chapter.codeSnippet}</code>
                  </pre>
                )}

                <ul className="highlights-list">
                  {chapter.highlights.map((h, i) => (
                    <li key={i} className="highlight-item">
                      <CheckCircle2 size={13} className="highlight-icon" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Specs Footer */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

