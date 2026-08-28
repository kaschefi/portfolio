import { useState, useEffect, useCallback } from 'react';
import { BookshelfContainer } from './components/BookshelfContainer';
import { BookshelfHUD } from './components/BookshelfHUD';
import { Navbar } from './components/Navbar';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectGrid } from './components/ProjectGrid';
import { SkillsMatrix } from './components/SkillsMatrix';
import { AboutTimeline } from './components/AboutTimeline';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { Footer } from './components/Footer';
import type { VolumeProject } from './data/portfolioData';
import { VOLUMES_DATA } from './data/portfolioData';
import { sound } from './utils/audio';

export function App() {
  const [currentView, setCurrentView] = useState<'3d' | 'grid' | 'skills' | 'about' | 'terminal'>('3d');
  const [currentVolumeId, setCurrentVolumeId] = useState<string>('codex');
  const [sceneState, setSceneState] = useState<{ isOpen: boolean; isInspecting: boolean; page: number }>({
    isOpen: false,
    isInspecting: false,
    page: 1
  });
  const [selectedModalVolume, setSelectedModalVolume] = useState<VolumeProject | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());

  // Ensure initial load / refresh always starts at the top (3D Bookshelf)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const currentVolume = VOLUMES_DATA.find((v) => v.id === currentVolumeId) || VOLUMES_DATA[0];

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  const handleVolumeChange = useCallback((id: string) => {
    setCurrentVolumeId(id);
  }, []);

  const handleStateChange = useCallback((state: { isOpen: boolean; isInspecting: boolean; page: number }) => {
    setSceneState(state);
  }, []);

  const handleOpenCaseStudy = (volume?: VolumeProject) => {
    setSelectedModalVolume(volume || currentVolume);
  };

  const handleCloseModal = () => {
    setSelectedModalVolume(null);
  };

  const handleOpenIn3D = (volumeId: string) => {
    setCurrentVolumeId(volumeId);
    setCurrentView('3d');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cycle 3D scene to target volume
    const targetIdx = VOLUMES_DATA.findIndex((v) => v.id === volumeId);
    const currentIdx = VOLUMES_DATA.findIndex((v) => v.id === currentVolumeId);
    if (targetIdx !== -1 && currentIdx !== -1) {
      let diff = targetIdx - currentIdx;
      const totalVols = VOLUMES_DATA.length;
      const half = Math.floor(totalVols / 2);
      if (diff > half) diff -= totalVols;
      if (diff < -half) diff += totalVols;
      const action = diff > 0 ? 'next' : 'previous';
      const steps = Math.abs(diff);
      for (let i = 0; i < steps; i++) {
        setTimeout(() => {
          const btn = document.querySelector(`#${action}`) as HTMLButtonElement | null;
          if (btn) btn.click();
        }, i * 100);
      }
    }
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        if (selectedModalVolume) {
          handleCloseModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModalVolume]);

  return (
    <div className="portfolio-app">
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === '3d') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const elem = document.getElementById(
              view === 'grid' ? 'case-studies' : view === 'skills' ? 'technical-stack' : view === 'about' ? 'about' : 'terminal'
            );
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onContactClick={() => {
          setCurrentView('about');
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main 3D Bookshelf Viewport */}
      <main style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <BookshelfContainer
          onVolumeChange={handleVolumeChange}
          onStateChange={handleStateChange}
        >
          {currentView === '3d' && (
            <BookshelfHUD
              sceneState={sceneState}
              volume={currentVolume}
            />
          )}
        </BookshelfContainer>
      </main>

      {/* Structured Sections Below 3D Viewport */}
      <ProjectGrid
        onSelectProject={(vol) => handleOpenCaseStudy(vol)}
        onOpenIn3D={handleOpenIn3D}
      />

      <SkillsMatrix />

      <AboutTimeline />

      <InteractiveTerminal onOpenVolume={handleOpenIn3D} />

      <Footer />

      {/* Project Case Study Drawer Modal */}
      <ProjectDetailModal
        volume={selectedModalVolume}
        isOpen={Boolean(selectedModalVolume)}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
