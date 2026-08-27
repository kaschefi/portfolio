import React from 'react';
import { Volume2, VolumeX, BookOpen, Layers, Cpu, User, Terminal as TerminalIcon } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentView: '3d' | 'grid' | 'skills' | 'about' | 'terminal';
  onViewChange: (view: '3d' | 'grid' | 'skills' | 'about' | 'terminal') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  soundEnabled,
  onToggleSound,
  onContactClick
}) => {
  const handleTabClick = (view: '3d' | 'grid' | 'skills' | 'about' | 'terminal') => {
    sound.playClick();
    onViewChange(view);
  };

  return (
    <header className="navbar" role="banner">
      <div className="nav-brand">
        <div className="brand-icon" aria-hidden="true">
          📚
        </div>
        <div className="brand-info">
          <span className="brand-title">M. Kashefirad</span>
          <span className="brand-subtitle">FH Campus Wien · Systems & 3D</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main Navigation">
        <button
          className={`nav-tab ${currentView === '3d' ? 'active' : ''}`}
          onClick={() => handleTabClick('3d')}
          type="button"
        >
          <BookOpen size={16} />
          <span>3D Bookshelf</span>
        </button>

        <button
          className={`nav-tab ${currentView === 'grid' ? 'active' : ''}`}
          onClick={() => handleTabClick('grid')}
          type="button"
        >
          <Layers size={16} />
          <span>Case Studies</span>
        </button>

        <button
          className={`nav-tab ${currentView === 'skills' ? 'active' : ''}`}
          onClick={() => handleTabClick('skills')}
          type="button"
        >
          <Cpu size={16} />
          <span>Tech Stack</span>
        </button>

        <button
          className={`nav-tab ${currentView === 'about' ? 'active' : ''}`}
          onClick={() => handleTabClick('about')}
          type="button"
        >
          <User size={16} />
          <span>Academic Path</span>
        </button>

        <button
          className={`nav-tab ${currentView === 'terminal' ? 'active' : ''}`}
          onClick={() => handleTabClick('terminal')}
          type="button"
        >
          <TerminalIcon size={16} />
          <span>Terminal</span>
        </button>
      </nav>

      <div className="nav-actions">
        <button
          className={`icon-btn ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Spatial Audio FX'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          type="button"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          className="contact-pill-btn"
          onClick={() => {
            sound.playClick();
            onContactClick();
          }}
          type="button"
        >
          <span>Get in Touch</span>
        </button>
      </div>
    </header>
  );
};
