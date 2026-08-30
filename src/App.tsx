import { useState, useEffect, Suspense, lazy } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { MobileHero } from './components/MobileHero';
import { MobileProjectCards } from './components/MobileProjectCards';
import { AboutSectionSkeleton } from './components/AboutSectionSkeleton';
import { BookshelfSkeleton } from './components/BookshelfSkeleton';
import { ContactFooterSkeleton } from './components/ContactFooterSkeleton';
import { useIsMobile } from './utils/useIsMobile';
import type { VolumeProject } from './data/portfolioData';

// Code-split / lazy-load non-critical, below-the-fold, and modal components
const LazyAboutSection = lazy(() =>
  import('./components/AboutSection').then((m) => ({ default: m.AboutSection }))
);

const LazyBookshelfSection = lazy(() => import('./components/BookshelfSection'));

const LazyContactFooter = lazy(() =>
  import('./components/ContactFooter').then((m) => ({ default: m.ContactFooter }))
);

const LazyProjectDetailModal = lazy(() =>
  import('./components/ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal }))
);

const LazyEmailPickerModal = lazy(() =>
  import('./components/EmailPickerModal').then((m) => ({ default: m.EmailPickerModal }))
);

// Speculative preloader for idle background fetching.
// The 3D bookshelf (and its ~2.3MB Three.js chunk) is only preloaded on
// devices that will actually render it — see the isMobile branch below.
const preloadBelowTheFold = (isMobile: boolean) => {
  import('./components/AboutSection');
  if (!isMobile) {
    import('./components/BookshelfSection');
  }
  import('./components/ContactFooter');
};

export function App() {
  const isMobile = useIsMobile();
  const [selectedModalVolume, setSelectedModalVolume] = useState<VolumeProject | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Ensure initial load / refresh always starts at the top & trigger speculative preloading
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Speculative background preloading after Hero intro transition finishes (4.0s) or on initial scroll
    let preloaded = false;
    const triggerPreload = () => {
      if (preloaded) return;
      preloaded = true;
      preloadBelowTheFold(isMobile);
      window.removeEventListener('scroll', triggerPreload);
    };

    const timer = setTimeout(triggerPreload, 4000);
    window.addEventListener('scroll', triggerPreload, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerPreload);
    };
  }, [isMobile]);

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
      {/* 1. Hero Section (Critical Path / Instant FCP).
          Mobile gets a lightweight CSS crossfade instead of the full-screen
          WebGL fluid-morph shader, which is heavy on phone GPUs/battery. */}
      <section className="hero-section" id="hero">
        {isMobile ? (
          <MobileHero
            onExploreBookshelf={() => handleScrollToSection('bookshelf')}
            onOpenEmail={() => setIsEmailModalOpen(true)}
          />
        ) : (
          <HeroFluidReveal
            onExploreBookshelf={() => handleScrollToSection('bookshelf')}
            onOpenAbout={() => handleScrollToSection('about')}
            onOpenEmail={() => setIsEmailModalOpen(true)}
          />
        )}
      </section>

      {/* 2. Editorial About / Technical Philosophy Dossier Section */}
      <Suspense fallback={<AboutSectionSkeleton />}>
        <LazyAboutSection
          onExploreProjects={() => handleScrollToSection('bookshelf')}
        />
      </Suspense>

      {/* 3. Projects: interactive 3D bookshelf on desktop, lightweight 2D
          cards on mobile. The 3D component (and its Three.js bundle) is
          simply never rendered on mobile, so it's never downloaded either. */}
      {isMobile ? (
        <MobileProjectCards onSelectVolume={setSelectedModalVolume} />
      ) : (
        <Suspense fallback={
          <main className="bookshelf-section" id="bookshelf">
            <div className="bookshelf-wrapper">
              <div className="bookshelf-stage">
                <BookshelfSkeleton />
              </div>
            </div>
          </main>
        }>
          <LazyBookshelfSection />
        </Suspense>
      )}

      {/* 4. Frictionless Contact & Availability Callout Footer */}
      <Suspense fallback={<ContactFooterSkeleton />}>
        <LazyContactFooter
          onOpenEmail={() => setIsEmailModalOpen(true)}
        />
      </Suspense>

      {/* Project Case Study Drawer Modal */}
      {selectedModalVolume && (
        <Suspense fallback={null}>
          <LazyProjectDetailModal
            volume={selectedModalVolume}
            isOpen={Boolean(selectedModalVolume)}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}

      {/* Webmail & Direct Client Picker Modal */}
      {isEmailModalOpen && (
        <Suspense fallback={null}>
          <LazyEmailPickerModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
