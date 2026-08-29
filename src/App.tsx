import { useState, useEffect, useCallback } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { AboutSection } from './components/AboutSection';
import { BookshelfContainer } from './components/BookshelfContainer';
import { BookshelfHUD } from './components/BookshelfHUD';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ContactFooter } from './components/ContactFooter';
import { EmailPickerModal } from './components/EmailPickerModal';
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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

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

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
        } else if (isEmailModalOpen) {
          setIsEmailModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModalVolume, isEmailModalOpen]);

  return (
    <div className="portfolio-app">
      {/* 1. Hero Section with Interactive Fluid Reveal */}
      <section className="hero-section" id="hero">
        <HeroFluidReveal 
          onExploreBookshelf={() => handleScrollToSection('about')} 
          onOpenAbout={() => handleScrollToSection('about')}
          onOpenEmail={() => setIsEmailModalOpen(true)}
        />
      </section>

      {/* 2. Editorial About / Technical Philosophy Dossier Section */}
      <AboutSection 
        onExploreProjects={() => handleScrollToSection('bookshelf')} 
      />

      {/* 3. Interactive 3D Bookshelf Viewport */}
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

      {/* 4. Frictionless Contact & Availability Callout Footer */}
      <ContactFooter 
        onOpenEmail={() => setIsEmailModalOpen(true)}
      />

      {/* Project Case Study Drawer Modal */}
      <ProjectDetailModal
        volume={selectedModalVolume}
        isOpen={Boolean(selectedModalVolume)}
        onClose={handleCloseModal}
      />

      {/* Webmail & Direct Client Picker Modal */}
      <EmailPickerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}

export default App;
