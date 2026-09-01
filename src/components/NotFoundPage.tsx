import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export interface SteamDigit3DProps {
  /** The numeral character to render ('4' or '0') */
  digit: string;
  /** Max tilt degrees (default: 14 matching SteamCard3D) */
  maxTilt?: number;
  /** Scale factor on hover (default: 1.04 matching SteamCard3D) */
  scaleHover?: number;
  className?: string;
}

/**
 * SteamDigit3D - Replicates the exact SteamCard3D effect directly inside each numeral:
 * - Unhovered: Dark obsidian slate body (matching unhovered SteamCard3D cards)
 * - Hovered: 3D perspective gyroscope tilt, dynamic white light glare following cursor,
 *   and subtle prismatic rainbow foil shimmer.
 */
export const SteamDigit3D: React.FC<SteamDigit3DProps> = ({
  digit,
  maxTilt = 14,
  scaleHover = 1.04,
  className = ''
}) => {
  const digitRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Exact transform & glare state from SteamCard3D.tsx
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

  // Calculate 3D tilt & cursor glare tracking (1:1 with SteamCard3D.tsx)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!digitRef.current) return;

      const rect = digitRef.current.getBoundingClientRect();
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
        const glareOpacity = Math.min(0.25 + distanceFromCenter * 0.5, 0.9);

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

  // Smooth restore on mouse leave
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

  // Touch move handler matching SteamCard3D
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!digitRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = digitRef.current.getBoundingClientRect();
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
        const glareOpacity = Math.min(0.2 + distanceFromCenter * 0.45, 0.75);

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

  // Prismatic Holographic Foil gradient (from SteamCard3D lines 218-226)
  const holoBackground = `linear-gradient(
    ${styleState.glareAngle.toFixed(1)}deg,
    rgba(255, 0, 128, 0) 0%,
    rgba(0, 210, 255, 0.5) 25%,
    rgba(255, 230, 0, 0.55) 50%,
    rgba(16, 185, 129, 0.5) 75%,
    rgba(255, 0, 128, 0) 100%
  )`;

  // Dynamic White Light Glare Reflection tracking cursor coordinates directly
  const glareBackground = `radial-gradient(
    circle at ${styleState.glareX.toFixed(1)}% ${styleState.glareY.toFixed(1)}%,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.55) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 70%
  )`;

  // Counter-directional elevation drop shadow
  const dropShadowFilter = styleState.isHovered
    ? `drop-shadow(${styleState.shadowX.toFixed(1)}px ${styleState.shadowY.toFixed(1)}px 24px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.18))`
    : 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.08))';

  return (
    <div
      ref={digitRef}
      className={`steam-digit-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      tabIndex={0}
      role="img"
      aria-label={`Digit ${digit}`}
    >
      {/* 3D Transform Body for the digit */}
      <div
        className="steam-digit-body"
        style={{
          transform: styleState.transform,
          filter: dropShadowFilter,
          transition: styleState.isHovered
            ? 'filter 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease-out'
        }}
      >
        {/* Layer 1: Dark Obsidian Slate Base (identical on 4, 0, 4 - matches non-hovered Steam card surface) */}
        <span className="steam-digit-text steam-digit-base" aria-hidden="true">
          {digit}
        </span>

        {/* Layer 2: Prismatic Holographic Foil Shimmer */}
        <span
          className="steam-digit-text steam-digit-holo"
          style={{
            backgroundImage: holoBackground,
            opacity: styleState.isHovered ? 0.65 : 0,
            transition: styleState.isHovered ? 'opacity 0.2s ease-out' : 'opacity 0.4s ease-out'
          }}
          aria-hidden="true"
        >
          {digit}
        </span>

        {/* Layer 3: Dynamic White Light Glare Reflection (following cursor position directly) */}
        <span
          className="steam-digit-text steam-digit-glare"
          style={{
            backgroundImage: glareBackground,
            opacity: styleState.isHovered ? styleState.glareOpacity : 0,
            transition: styleState.isHovered ? 'opacity 0.1s ease-out' : 'opacity 0.4s ease-out'
          }}
          aria-hidden="true"
        >
          {digit}
        </span>
      </div>
    </div>
  );
};

/**
 * NotFoundPage — Custom 404 Error Monograph Page.
 * Styled in complete alignment with the main portfolio hero and editorial design system.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <div className="notfound-page" role="main">
      {/* Ambient portfolio glow atmosphere */}
      <div className="notfound-bg-orb notfound-bg-orb--blue" aria-hidden="true" />
      <div className="notfound-bg-orb notfound-bg-orb--purple" aria-hidden="true" />
      <div className="notfound-bg-orb notfound-bg-orb--warm" aria-hidden="true" />

      {/* Dot-grid texture overlay */}
      <div className="notfound-grid-overlay" aria-hidden="true" />
      {/* Main Editorial Content Column */}
      <main className="notfound-content">
        {/* Monospace Eyebrow Indicator */}
        <div className="hero-eyebrow notfound-eyebrow">
          <span>HTTP_STATUS // 404 NOT_FOUND</span>
        </div>

        {/* ── 4 0 4 Digits Row (Consistent SteamCard3D holographic tilt on all 3 digits) ── */}
        <div className="notfound-digits-row" aria-label="404 — Page not found">
          <SteamDigit3D digit="4" />
          <SteamDigit3D digit="0" />
          <SteamDigit3D digit="4" />
        </div>

        {/* Editorial Title matching the hero serif style */}
        <h1 className="hero-title hero-title--serif notfound-title">
          Lost in the <br />
          <span className="hero-title-name">Digital Void</span>
        </h1>

        {/* Subhead line */}
        <div className="hero-subhead notfound-subhead">
          <span>HTTP 404 // Route Does Not Exist</span>
        </div>

        {/* Narrative Description */}
        <p className="hero-description notfound-description">
          Looks like you've ventured beyond the mapped territory. The page you are looking for doesn't exist, has been relocated, or the URL might be mistyped.
        </p>

        {/* Action CTAs matching main page buttons */}
        <div className="hero-cta-row notfound-cta-row">
          <a href="/" className="hero-outline-btn hero-outline-btn--primary">
            <ArrowLeft className="hero-btn-arrow" />
            <span>Return to Portfolio</span>

          </a>
        </div>

        {/* Monograph telemetry footer */}
        <p className="notfound-footer-mono" aria-hidden="true">
          KASCHEFIRAD // MONOGRAPH ARCHIVE // 2026
        </p>
      </main>
    </div>
  );
};

export default NotFoundPage;
