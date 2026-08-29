import React from 'react';

const VOL_SKELETONS = [
  { id: 'vol-1', title: 'MOKA', discipline: 'SYSTEMS' },
  { id: 'vol-2', title: 'SAWYER', discipline: 'ROBOTICS' },
  { id: 'vol-3', title: 'RESQ', discipline: 'MULTI-AGENT' },
  { id: 'vol-4', title: 'ROBOFLOW', discipline: 'SIMULATION' },
  { id: 'vol-5', title: 'CAT BREED', discipline: 'VISION AI' },
  { id: 'vol-6', title: 'JOINAPP', discipline: 'ENGINEERING' }
];

export const BookshelfSkeleton: React.FC = () => {
  return (
    <div className="bookshelf-skeleton" aria-label="Loading 3D Bookshelf Archive">
      <div className="skeleton-shelf-container">
        {/* Six Standby 3D Book Spines */}
        <div className="skeleton-books-row">
          {VOL_SKELETONS.map((vol, i) => (
            <div
              key={vol.id}
              className={`skeleton-book-spine skeleton-book-spine--${i}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="skeleton-spine-inner">
                <span className="skeleton-spine-tag">VOL.0{i + 1}</span>
                <span className="skeleton-spine-title">{vol.title}</span>
                <div className="skeleton-spine-foil-line" />
              </div>
            </div>
          ))}
        </div>

        {/* Ambient Pedestal Shelf Beam */}
        <div className="skeleton-pedestal-beam">
          <div className="skeleton-pedestal-glow" />
        </div>

        {/* Status Callout & Technical Indicator */}
        <div className="skeleton-status-bar">
          <div className="skeleton-status-dot" />
          <span className="skeleton-status-text">INITIALIZING 3D ENGINE // VOLUMES [01–06]</span>
        </div>
      </div>
    </div>
  );
};
