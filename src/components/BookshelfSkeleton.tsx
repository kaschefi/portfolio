import React from 'react';

interface LuxSpine {
  id: string;
  volNum: string;
  roman: string;
  height: string;
  width: string;
  tilt: string;
  accent: string;
  clothClass: string;
}

const LUX_VOLUMES: LuxSpine[] = [
  {
    id: 'lux-vol-1',
    volNum: 'VOL. I',
    roman: 'I',
    height: 'clamp(210px, 29vw, 280px)',
    width: 'clamp(46px, 7.5vw, 68px)',
    tilt: 'rotate(-1.6deg) translateY(2px)',
    accent: '#efc16d',
    clothClass: 'skeleton-spine--ultramarine'
  },
  {
    id: 'lux-vol-2',
    volNum: 'VOL. II',
    roman: 'II',
    height: 'clamp(225px, 31vw, 298px)',
    width: 'clamp(48px, 7.8vw, 72px)',
    tilt: 'rotate(0deg) translateY(0)',
    accent: '#f4d7b9',
    clothClass: 'skeleton-spine--terracotta'
  },
  {
    id: 'lux-vol-3',
    volNum: 'VOL. III',
    roman: 'III',
    height: 'clamp(198px, 27vw, 260px)',
    width: 'clamp(42px, 6.8vw, 58px)',
    tilt: 'rotate(1.2deg) translateY(3px)',
    accent: '#a7f3d0',
    clothClass: 'skeleton-spine--emerald'
  },
  {
    id: 'lux-vol-4',
    volNum: 'VOL. IV',
    roman: 'IV',
    height: 'clamp(215px, 29.5vw, 284px)',
    width: 'clamp(46px, 7.4vw, 66px)',
    tilt: 'rotate(-0.8deg) translateY(1px)',
    accent: '#93c5fd',
    clothClass: 'skeleton-spine--celestial'
  },
  {
    id: 'lux-vol-5',
    volNum: 'VOL. V',
    roman: 'V',
    height: 'clamp(204px, 28vw, 268px)',
    width: 'clamp(44px, 7.1vw, 62px)',
    tilt: 'rotate(1.5deg) translateY(3px)',
    accent: '#e9d5ff',
    clothClass: 'skeleton-spine--amethyst'
  },
  {
    id: 'lux-vol-6',
    volNum: 'VOL. VI',
    roman: 'VI',
    height: 'clamp(220px, 30.5vw, 290px)',
    width: 'clamp(48px, 7.7vw, 70px)',
    tilt: 'rotate(2.8deg) translateY(6px)',
    accent: '#fecdd3',
    clothClass: 'skeleton-spine--burgundy'
  }
];

export const BookshelfSkeleton: React.FC = () => {
  return (
    <div className="bookshelf-skeleton" aria-label="Loading 3D Bookshelf Archive" role="status">
      <div className="skeleton-shelf-container">
        {/* Soft Archival Warm Candlelight Glow */}
        <div className="skeleton-ambient-glow" aria-hidden="true" />

        {/* 6 Classic Luxury Book Spines */}
        <div className="skeleton-books-row">
          {LUX_VOLUMES.map((vol, i) => (
            <div
              key={vol.id}
              className={`skeleton-book-spine skeleton-lux-spine ${vol.clothClass}`}
              style={{
                height: vol.height,
                width: vol.width,
                transform: vol.tilt,
                animationDelay: `${i * 0.14}s`,
                ['--spine-foil' as any]: vol.accent
              }}
            >
              {/* Headcap & Gilded Top Band */}
              <div className="skeleton-lux-headcap" />
              <div className="skeleton-lux-foil-fillet skeleton-lux-foil-fillet--top" />

              <div className="skeleton-lux-inner">
                {/* Top Roman Numeral & Volume Inscription */}
                <div className="skeleton-lux-header">
                  <span className="skeleton-lux-roman">{vol.roman}</span>
                  <div className="skeleton-lux-divider" />
                </div>

                {/* Debossed Gold-Foil Title Placeholder Bars */}
                <div className="skeleton-lux-title-placeholder">
                  <div className="skeleton-lux-bar skeleton-lux-bar--primary" />
                  <div className="skeleton-lux-bar skeleton-lux-bar--secondary" />
                </div>

                {/* Tailband Fillet & Edition Marker */}
                <div className="skeleton-lux-footer">
                  <div className="skeleton-lux-divider" />
                  <div className="skeleton-lux-dot" />
                </div>
              </div>

              {/* Tailband & Gilded Bottom Band */}
              <div className="skeleton-lux-foil-fillet skeleton-lux-foil-fillet--bottom" />
              <div className="skeleton-lux-tailband" />

              {/* Gentle Warm Gold Leaf Shimmer */}
              <div className="skeleton-shimmer-layer" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Architectural Walnut & Gilded Shelf Ledge */}
        <div className="skeleton-pedestal-beam skeleton-pedestal-walnut">
          <div className="skeleton-pedestal-gold-rim" />
          <div className="skeleton-pedestal-walnut-face" />
          <div className="skeleton-pedestal-glow" />
          <div className="skeleton-pedestal-shadow" />
        </div>

        {/* Editorial Luxury Archival Status Badge */}
        <div className="skeleton-status-bar skeleton-lux-status">
          <span className="skeleton-lux-star" aria-hidden="true">✦</span>
          <span className="skeleton-status-text">LOADING</span>
          <span className="skeleton-lux-star" aria-hidden="true">✦</span>
        </div>
      </div>
    </div>
  );
};

export default BookshelfSkeleton;
