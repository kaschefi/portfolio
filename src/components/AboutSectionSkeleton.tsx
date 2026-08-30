import React from 'react';

export const AboutSectionSkeleton: React.FC = () => {
  return (
    <section className="about-dossier-section" id="about" aria-label="Loading Profile & Philosophy Dossier">
      <div className="about-dossier-wrapper" style={{ opacity: 0.6 }}>
        <div className="about-section-top">
          <div className="about-section-tag">
            <span>DOSSIER // 01</span>
            <span className="about-section-tag-divider">—</span>
            <span>PROFILE &amp; TECHNICAL PHILOSOPHY</span>
          </div>
        </div>
        <div className="about-dossier-grid">
          <div className="about-left-col">
            <h2 className="about-heading-serif">Now, the human part.</h2>
            <div className="about-narrative-block">
              <div style={{ height: '1.2rem', width: '90%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '0.8rem' }} />
              <div style={{ height: '1.2rem', width: '98%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '0.8rem' }} />
              <div style={{ height: '1.2rem', width: '75%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
            </div>
          </div>
          <div className="about-right-col">
            <div className="about-matrix-header">
              <div className="about-matrix-title">
                <span>SKILLS</span>
              </div>
              <span className="about-matrix-count">[INITIALIZING...]</span>
            </div>
            <div className="about-skills-grid" style={{ minHeight: '340px' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
