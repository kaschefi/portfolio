import { useState, useEffect, useCallback } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { BookshelfContainer } from './components/BookshelfContainer';
import { BookshelfHUD } from './components/BookshelfHUD';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import type { VolumeProject } from './data/portfolioData';
import { VOLUMES_DATA } from './data/portfolioData';

export function App() {
  const [currentVolumeId, setCurrentVolumeId] = useState<string>('codex');
  const [sceneState, setSceneState] = useState<{ isOpen: boolean; isInspecting: boolean; page: number }>({
    isOpen: false,
    isInspecting: false,
    page: 1
  });
  const [selectedModalVolume, setSelectedModalVolume] = useState<VolumeProject | null>(null);

  // Ensure initial load / refresh always starts at the top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const currentVolume = VOLUMES_DATA.find((v) => v.id === currentVolumeId) || VOLUMES_DATA[0];

  const handleVolumeChange = useCallback((id: string) => {
    setCurrentVolumeId(id);
  }, []);

  const handleStateChange = useCallback((state: { isOpen: boolean; isInspecting: boolean; page: number }) => {
    setSceneState(state);
  }, []);

  const handleCloseModal = () => {
    setSelectedModalVolume(null);
  };

  const handleScrollToBookshelf = () => {
    const shelf = document.getElementById('bookshelf');
    if (shelf) {
      shelf.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      {/* Hero Section with Interactive Fluid Reveal */}
      <section className="hero-section" id="hero">
        <HeroFluidReveal onExploreBookshelf={handleScrollToBookshelf} />
      </section>

      {/* 3D Bookshelf Viewport */}
      <main className="bookshelf-section" id="bookshelf">
        <BookshelfContainer
          onVolumeChange={handleVolumeChange}
          onStateChange={handleStateChange}
        >
          <BookshelfHUD
            sceneState={sceneState}
            volume={currentVolume}
          />
        </BookshelfContainer>
      </main>

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
