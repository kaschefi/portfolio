import React from 'react';
import { sound } from '../utils/audio';

export interface ViewModeToggleProps {
  mode: '2d' | '3d';
  onChange: (mode: '2d' | '3d') => void;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  mode,
  onChange,
  className = ''
}) => {
  const handleModeClick = (newMode: '2d' | '3d') => {
    if (newMode !== mode) {
      sound.playClick();
      onChange(newMode);
    }
  };

  return (
    <div
      className={`view-mode-toggle ${className}`}
      role="group"
      aria-label="Project view mode"
    >
      <button
        type="button"
        className={`view-mode-btn ${mode === '2d' ? 'is-active' : ''}`}
        onClick={() => handleModeClick('2d')}
        aria-pressed={mode === '2d'}
        aria-label="Switch to 2D project list"
        title="2D project overview"
      >
        2D
      </button>
      <span className="view-mode-slash" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={`view-mode-btn ${mode === '3d' ? 'is-active' : ''}`}
        onClick={() => handleModeClick('3d')}
        aria-pressed={mode === '3d'}
        aria-label="Switch to 3D bookshelf experience"
        title="3D interactive bookshelf"
      >
        3D
      </button>
    </div>
  );
};

export default ViewModeToggle;
