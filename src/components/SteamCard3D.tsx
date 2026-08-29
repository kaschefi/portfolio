import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface SteamCard3DProps {
  /** The title/name displayed on the card */
  name: string;
  /** Sub-category or domain tag */
  category: string;
  /** Icon element */
  icon: React.ReactNode;
  /** Accent color for holographic highlights and icon */
  accentColor?: string;
  /** Maximum tilt angle in degrees (default: 14) */
  maxTilt?: number;
  /** Scale factor when hovered (default: 1.04) */
  scaleHover?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * SteamCard3D - Interactive 3D Card replicating the Steam Trading Card Holographic Tilt Effect.
 * Features:
 * - 3D Gyroscope Perspective Tilt (rotateX, rotateY, scale, translateZ)
 * - Dynamic Light Glare Reflection tracking cursor coordinates
 * - Holographic Foil Shimmer / Color-Dodge Iridescence
 * - Parallax Content Elevation (Z-index layering in 3D space)
 * - Dynamic reactive drop-shadow shifted opposite to tilt angle
 * - Smooth spring physics on cursor enter/leave with rAF optimization
 */
export const SteamCard3D: React.FC<SteamCard3DProps> = ({
  name,
  category,
  icon,
  maxTilt = 14,
  scaleHover = 1.04,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Card transform & glare state
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

  // Calculate 3D tilt coordinates based on mouse position
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

        // Normalized offsets from center (-1 to +1)
        const percentX = (clientX / width) * 2 - 1;
        const percentY = (clientY / height) * 2 - 1;

        // 3D Rotations
        const rotateX = -percentY * maxTilt;
        const rotateY = percentX * maxTilt;

        // Glare coordinates & angle
        const glareX = (clientX / width) * 100;
        const glareY = (clientY / height) * 100;
        const glareAngle = Math.atan2(clientY - height / 2, clientX - width / 2) * (180 / Math.PI) + 90;

        // Distance from center for dynamic glare brightness
        const distanceFromCenter = Math.min(Math.sqrt(percentX * percentX + percentY * percentY), 1.2);
        const glareOpacity = Math.min(0.15 + distanceFromCenter * 0.45, 0.7);

        // Counter-directional elevation shadow
        const shadowX = -percentX * 14;
        const shadowY = -percentY * 14 + 10;

        setStyleState({
          transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleHover}, ${scaleHover}, 1)`,
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

  // Smoothly restore default state on mouse/touch leave
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

  // Calculate 3D tilt coordinates on mobile touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!cardRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const width = rect.width;
        const height = rect.height;

        const percentX = (clientX / width) * 2 - 1;
        const percentY = (clientY / height) * 2 - 1;

        const rotateX = -percentY * (maxTilt * 0.75);
        const rotateY = percentX * (maxTilt * 0.75);

        const glareX = (clientX / width) * 100;
        const glareY = (clientY / height) * 100;
        const glareAngle = Math.atan2(clientY - height / 2, clientX - width / 2) * (180 / Math.PI) + 90;

        const distanceFromCenter = Math.min(Math.sqrt(percentX * percentX + percentY * percentY), 1.2);
        const glareOpacity = Math.min(0.15 + distanceFromCenter * 0.4, 0.6);

        const shadowX = -percentX * 10;
        const shadowY = -percentY * 10 + 6;

        setStyleState({
          transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleHover}, ${scaleHover}, 1)`,
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

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`steam-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`${name} - ${category}`}
    >
      {/* 3D Transform Body */}
      <div
        className="steam-card-body"
        style={{
          transform: styleState.transform,
          boxShadow: styleState.isHovered
            ? `${styleState.shadowX.toFixed(1)}px ${styleState.shadowY.toFixed(1)}px 24px -2px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(255, 255, 255, 0.05)`
            : '0 4px 12px rgba(0, 0, 0, 0.35)',
          borderColor: styleState.isHovered ? 'rgba(244, 238, 230, 0.22)' : 'rgba(244, 238, 230, 0.08)',
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
              rgba(255, 255, 255, 0.75) 0%,
              rgba(255, 255, 255, 0.25) 28%,
              rgba(255, 255, 255, 0) 65%
            )`,
            transition: styleState.isHovered ? 'opacity 0.15s ease-out' : 'opacity 0.4s ease-out'
          }}
        />

        {/* Card Content with 3D Parallax Depth Layers */}
        <div className="steam-card-content">
          <div className="steam-card-top">
            <span className="steam-card-icon">
              {icon}
            </span>
            <span className="steam-card-category">{category}</span>
          </div>

          <div className="steam-card-bottom">
            <span className="steam-card-name">{name}</span>
          </div>
        </div>

        {/* Ambient Corner Accents */}
        <div className="steam-card-reticle" />
      </div>
    </div>
  );
};
