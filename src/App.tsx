import { useState, useEffect, Suspense, lazy } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { AboutSectionSkeleton } from './components/AboutSectionSkeleton';
import { BookshelfSkeleton } from './components/BookshelfSkeleton';
import { ContactFooterSkeleton } from './components/ContactFooterSkeleton';
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

// Speculative preloader for idle background fetching
const preloadBelowTheFold = () => {
  import('./components/AboutSection');
  import('./components/BookshelfSection');
  import('./components/ContactFooter');
};

export function App() {
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
      preloadBelowTheFold();
      window.removeEventListener('scroll', triggerPreload);
    };

    const timer = setTimeout(triggerPreload, 4000);
    window.addEventListener('scroll', triggerPreload, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerPreload);
    };
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
      {/* 1. Hero Section with Interactive Fluid Reveal (Critical Path / Instant FCP) */}
      <section className="hero-section" id="hero">
        <HeroFluidReveal 
          onExploreBookshelf={() => handleScrollToSection('about')} 
          onOpenAbout={() => handleScrollToSection('about')}
          onOpenEmail={() => setIsEmailModalOpen(true)}
        />
      </section>

      {/* 2. Editorial About / Technical Philosophy Dossier Section */}
      <Suspense fallback={<AboutSectionSkeleton />}>
        <LazyAboutSection 
          onExploreProjects={() => handleScrollToSection('bookshelf')} 
        />
      </Suspense>

      {/* 3. Interactive 3D Bookshelf Viewport */}
      <Suspense fallback={
        <main className="bookshelf-section" id="bookshelf">
          <BookshelfSkeleton />
        </main>
      }>
        <LazyBookshelfSection />
      </Suspense>

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
