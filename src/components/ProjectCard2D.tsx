import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Steam Card 3D Tilt & Glare State
  const [styleState, setStyleState] = useState<{
    transform: string;
    glareX: number;
    glareY: number;
    glareOpacity: number;
    glareAngle: number;
    shadowX: number;
    shadowY: number;
    isHovered: boolean;
  }>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    glareAngle: 135,
    shadowX: 0,
    shadowY: 4,
    isHovered: false
  });

  // Toned down gentle tilt exclusively for 2D project cards
  const maxTilt = 5;
  const scaleHover = 1.012;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const width = rect.width;
        const height = rect.height;

        // Normalized offsets (-1 to +1)
        const percentX = (clientX / width) * 2 - 1;
        const percentY = (clientY / height) * 2 - 1;

        // Subtle 3D rotations
        const rotateX = -percentY * maxTilt;
        const rotateY = percentX * maxTilt;

        // Glare & angle
        const glareX = (clientX / width) * 100;
        const glareY = (clientY / height) * 100;
        const glareAngle =
          Math.atan2(clientY - height / 2, clientX - width / 2) * (180 / Math.PI) + 90;

        const distanceFromCenter = Math.min(
          Math.sqrt(percentX * percentX + percentY * percentY),
          1.2
        );
        const glareOpacity = Math.min(0.08 + distanceFromCenter * 0.28, 0.45);

        const shadowX = -percentX * 6;
        const shadowY = -percentY * 6 + 6;

        setStyleState({
          transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleHover}, ${scaleHover}, 1)`,
          glareX,
          glareY,
          glareOpacity,
          glareAngle,
          shadowX,
          shadowY,
          isHovered: true
        });
      });
    },
    [maxTilt, scaleHover]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    setStyleState({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      glareAngle: 135,
      shadowX: 0,
      shadowY: 4,
      isHovered: false
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const techStack = volume.projectDetails.techStack.slice(0, 4);

  return (
    <article
      ref={cardRef}
      className={`steam-card-container simple-lux-card ${isActive ? 'is-active' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
      <div
        className="steam-card-body simple-lux-card-inner"
        style={{
          transform: styleState.transform,
          boxShadow: styleState.isHovered
            ? `${styleState.shadowX.toFixed(1)}px ${styleState.shadowY.toFixed(1)}px 32px -4px rgba(0, 0, 0, 0.75), 0 0 20px -2px rgba(255, 255, 255, 0.06)`
            : isActive
              ? '0 24px 60px -8px rgba(0, 0, 0, 0.75)'
              : '0 16px 40px -8px rgba(0, 0, 0, 0.55)',
          borderColor: styleState.isHovered
            ? 'rgba(244, 238, 230, 0.28)'
            : isActive
              ? 'rgba(255, 255, 255, 0.22)'
              : 'rgba(255, 255, 255, 0.08)',
          transition: styleState.isHovered
            ? 'box-shadow 0.1s ease-out, border-color 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease-out, border-color 0.3s ease-out'
        }}
      >
        {/* Holographic Foil / Prismatic Sheen Layer */}
        <div
          className="steam-card-holo-layer"
          style={{
            opacity: styleState.isHovered ? 0.38 : 0,
            background: `linear-gradient(
              ${styleState.glareAngle.toFixed(1)}deg,
              rgba(255, 0, 128, 0) 0%,
              rgba(0, 210, 255, 0.18) 25%,
              rgba(255, 230, 0, 0.2) 50%,
              rgba(16, 185, 129, 0.18) 75%,
              rgba(255, 0, 128, 0) 100%
            )`,
            transition: styleState.isHovered ? 'opacity 0.2s ease-out' : 'opacity 0.4s ease-out'
          }}
        />

        {/* Dynamic Light Glare Reflection Layer */}
        <div
          className="steam-card-glare-layer"
          style={{
            opacity: styleState.glareOpacity,
            background: `radial-gradient(
              circle at ${styleState.glareX.toFixed(1)}% ${styleState.glareY.toFixed(1)}%,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 255, 255, 0.22) 28%,
              rgba(255, 255, 255, 0) 65%
            )`,
            transition: styleState.isHovered ? 'opacity 0.15s ease-out' : 'opacity 0.4s ease-out'
          }}
        />

        {/* Ambient Corner Reticle Accent */}
        <div className="steam-card-reticle" />

        {/* Card Content with 3D Parallax Depth Layers */}
        <div className="steam-card-content simple-lux-steam-content">
          {/* 1. Card Top Metadata */}
          <div className="simple-lux-header">
            <span className="simple-lux-vol-badge">
              VOL. {pad(volumeIndex + 1)}
            </span>
            <span className="simple-lux-discipline">
              {volume.discipline}
            </span>
          </div>

          {/* 2. Pure Minimalist Typography */}
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

          {/* 5. Minimalist Action Bar */}
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
      </div>
    </article>
  );
};

export default ProjectCard2D;
