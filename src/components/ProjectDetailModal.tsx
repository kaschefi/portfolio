import React, { useEffect } from 'react';
import type { VolumeProject } from '../data/portfolioData';
import { X, ExternalLink, CheckCircle2, Layers, BookOpen } from 'lucide-react';
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
      sound.playSuccess();
      import('canvas-confetti')
        .then((confettiModule) => {
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.8 },
            colors: [volume.accent, volume.foil, '#ffffff']
          });
        })
        .catch(() => {
          // Confetti fallback
        });
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
        style={{ '--volume-accent': volume.accent } as React.CSSProperties}
      >
        <div className="modal-header">
          <div>
            <div className="badge-eyebrow">
              <span className="roman-tag" style={{ background: volume.color }}>
                Vol. {volume.roman}
              </span>
              <span className="discipline-tag">{volume.discipline}</span>
            </div>
            <h2 id="modal-title" className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>
              {volume.title} · {projectDetails.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {projectDetails.institution} · {projectDetails.timeframe}
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
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Hero Project Card */}
          <div className="project-hero-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: volume.accent, fontWeight: 700, textTransform: 'uppercase' }}>
                  {projectDetails.category}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                  {projectDetails.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Role: <strong style={{ color: '#fff' }}>{projectDetails.role}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {projectDetails.githubUrl && (
                  <a
                    href={projectDetails.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="open-book-btn"
                    style={{ textDecoration: 'none' }}
                  >
                    <GithubIcon size={15} />
                    <span>Source</span>
                  </a>
                )}
                {projectDetails.liveUrl && (
                  <a
                    href={projectDetails.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-pill-btn"
                    style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={15} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.6 }}>
              {projectDetails.summary}
            </p>

            {/* Key Metrics */}
            <div className="project-metrics-grid">
              {projectDetails.keyMetrics.map((m, idx) => (
                <div key={idx} className="metric-box">
                  <div className="metric-value" style={{ color: volume.accent }}>
                    {m.value}
                  </div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
          </div>

          {/* Architecture & Engineering Deep-Dive */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Layers size={18} color={volume.accent} />
              <span>System Architecture & Approach</span>
            </h4>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                <strong style={{ color: '#fff' }}>The Challenge:</strong> {projectDetails.problem}
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                <strong style={{ color: '#fff' }}>The Engineering Solution:</strong> {projectDetails.solution}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                💡 Architecture Pattern: {projectDetails.architectureDescription}
              </p>
            </div>
          </div>

          {/* Chapters & Source Proof */}
          <div className="chapters-section">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color={volume.accent} />
              <span>Volume Chapters & Implementation Highlights</span>
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
                      <CheckCircle2 size={14} color={volume.accent} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Specs Footer */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              <strong>Format:</strong> {volume.format}
            </div>
            <div>
              <strong>Binding:</strong> {volume.binding}
            </div>
            <div>
              <strong>Motif:</strong> {volume.motif}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
