import React, { useState } from 'react';
import type { VolumeProject } from '../data/portfolioData';
import { VOLUMES_DATA } from '../data/portfolioData';
import { BookOpen, Layers, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProjectGridProps {
  onSelectProject: (volume: VolumeProject) => void;
  onOpenIn3D: (volumeId: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  onSelectProject,
  onOpenIn3D
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI & Autonomous' },
    { id: '3d', label: '3D & Spatial' },
    { id: 'systems', label: 'Distributed Systems' },
    { id: 'native', label: 'Native & Design' }
  ];

  const filteredVolumes = VOLUMES_DATA.filter((vol) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ai') return ['codex', 'claude-code'].includes(vol.id);
    if (activeCategory === '3d') return ['antigravity', 'figma'].includes(vol.id);
    if (activeCategory === 'systems') return ['cursor', 'xcode'].includes(vol.id);
    if (activeCategory === 'native') return ['figma', 'xcode'].includes(vol.id);
    return true;
  });

  return (
    <section className="portfolio-section" id="case-studies">
      <div className="section-header">
        <div className="section-eyebrow">
          <Layers size={14} />
          <span>Curated Works · Six Volumes</span>
        </div>
        <h2 className="section-title">Case Studies & Engineering Systems</h2>
        <p className="section-deck">
          Explore six authored volumes spanning autonomous agent pipelines, clinical decision support, spatial robotics, and native telemetry networks.
        </p>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.75rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`nav-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id);
              }}
              type="button"
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid">
        {filteredVolumes.map((volume) => {
          const { projectDetails } = volume;
          return (
            <div
              key={volume.id}
              className="project-card"
              style={{ '--card-accent': volume.accent } as React.CSSProperties}
            >
              <div>
                <div className="card-top">
                  <div className="volume-pill-tag" style={{ borderLeft: `3px solid ${volume.accent}` }}>
                    <span style={{ fontFamily: 'var(--font-serif)', color: volume.accent }}>
                      Vol. {volume.roman}
                    </span>
                    <span>·</span>
                    <span>{volume.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {projectDetails.timeframe}
                  </span>
                </div>

                <h3 className="card-title">{projectDetails.name}</h3>
                <p style={{ fontSize: '0.78rem', color: volume.accent, fontWeight: 600, marginBottom: '0.4rem' }}>
                  {projectDetails.category}
                </p>
                <p className="card-desc">{projectDetails.summary}</p>

                {/* Tech Tags */}
                <div className="tech-tag-cloud" style={{ marginTop: '1rem' }}>
                  {projectDetails.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {projectDetails.techStack.length > 4 && (
                    <span className="tech-tag">+{projectDetails.techStack.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="open-book-btn"
                  onClick={() => {
                    sound.playShelfSlide();
                    onOpenIn3D(volume.id);
                  }}
                  type="button"
                  title="View this book on the 3D Bookshelf"
                >
                  <Sparkles size={14} />
                  <span>View in 3D</span>
                </button>

                <button
                  className="contact-pill-btn"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    sound.playClick();
                    onSelectProject(volume);
                  }}
                  type="button"
                >
                  <BookOpen size={14} />
                  <span>Case Study</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
