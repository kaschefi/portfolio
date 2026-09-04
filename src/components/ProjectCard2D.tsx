import React from 'react';
import type { VolumeProject } from '../data/portfolioData';

export interface ProjectCard2DProps {
  volume: VolumeProject;
  volumeIndex: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const pad = (val: number) => String(val).padStart(2, '0');

export const ProjectCard2D: React.FC<ProjectCard2DProps> = ({
  volume,
  volumeIndex,
  isActive = false,
  onClick,
  className = ''
}) => {
  const techStack = volume.projectDetails.techStack.slice(0, 4);

  return (
    <article
      className={`simple-lux-card ${isActive ? 'is-active' : ''} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${volume.title} - ${volume.discipline}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
    >
      <div className="simple-lux-card-inner">
        {/* 1. Card Top Metadata (Clean text only, no icons) */}
        <div className="simple-lux-header">
          <span className="simple-lux-vol-badge">
            VOL. {pad(volumeIndex + 1)}
          </span>
          <span className="simple-lux-discipline">
            {volume.discipline}
          </span>
        </div>

        {/* 2. Pure Minimalist Typography (Zero emblems/icons) */}
        <div className="simple-lux-title-block">
          <h3 className="simple-lux-title">{volume.title}</h3>
          <p className="simple-lux-subtitle">{volume.subtitle}</p>
        </div>

        {/* 3. Narrative Thesis Note */}
        <p className="simple-lux-description">
          {volume.deck || volume.note}
        </p>

        {/* 4. Tech Stack Understated Tags */}
        {techStack.length > 0 && (
          <div className="simple-lux-tech-row">
            {techStack.map((tech) => (
              <span key={tech} className="simple-lux-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* 5. Minimalist Action Bar (Pure typography, no icon graphics) */}
        <div className="simple-lux-footer">
          <span className="simple-lux-cta">
            Read Case Study &rarr;
          </span>
          {volume.projectDetails.timeframe && (
            <span className="simple-lux-timeframe">
              {volume.projectDetails.timeframe}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard2D;
