import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { MobileHero } from './components/MobileHero';
import { ProjectCarousel2D } from './components/ProjectCarousel2D';
import { AboutSectionSkeleton } from './components/AboutSectionSkeleton';
import { BookshelfSkeleton } from './components/BookshelfSkeleton';
import { ContactFooterSkeleton } from './components/ContactFooterSkeleton';
import { useIsMobile } from './utils/useIsMobile';
import type { VolumeProject } from './data/portfolioData';

// Code-split components
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

export function App() {
  const isMobile = useIsMobile();
  const [selectedModalVolume, setSelectedModalVolume] = useState<VolumeProject | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // User override for 2D vs 3D project view mode (defaults to 2d on mobile, 3d on desktop)
  const [viewMode, setViewMode] = useState<'2d' | '3d' | null>(null);
  const activeViewMode: '2d' | '3d' = viewMode ?? (isMobile ? '2d' : '3d');

  // Track when the user is approaching or requesting the 3D Bookshelf
  const [shouldLoadBookshelf, setShouldLoadBookshelf] = useState<boolean>(false);
  const bookshelfTriggerRef = useRef<HTMLDivElement>(null);

  const handleToggleViewMode = (mode: '2d' | '3d') => {
    if (mode === '3d') {
      setShouldLoadBookshelf(true);
    }
    setViewMode(mode);
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  // Scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Proximity observer: Only download and mount Three.js when user scrolls towards it
  useEffect(() => {
    if (isMobile || shouldLoadBookshelf) return;

    const trigger = bookshelfTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBookshelf(true);
          observer.disconnect();
        }
      },
      // Starts loading 400px before the user reaches the bookshelf
      { rootMargin: '400px 0px' }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [isMobile, shouldLoadBookshelf]);

  const handleCloseModal = () => {
    setSelectedModalVolume(null);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'bookshelf' && activeViewMode === '3d') {
      setShouldLoadBookshelf(true);
    }
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
      {/* 1. Hero Section (Gets 100% of GPU & CPU thread upon arrival) */}
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

      {/* 2. Editorial About Section */}
      <Suspense fallback={<AboutSectionSkeleton />}>
        <LazyAboutSection
          onExploreProjects={() => handleScrollToSection('bookshelf')}
        />
      </Suspense>

      {/* 3. Bookshelf Section Trigger & Container */}
      <div ref={bookshelfTriggerRef} id="bookshelf" style={{ position: 'relative', width: '100%' }}>
        {activeViewMode === '2d' && (
          <ProjectCarousel2D
            onSelectVolume={setSelectedModalVolume}
            viewMode={activeViewMode}
            onToggleViewMode={handleToggleViewMode}
          />
        )}

        {shouldLoadBookshelf && (
          <div style={{ display: activeViewMode === '3d' ? 'block' : 'none' }}>
            <Suspense
              fallback={
                <main className="bookshelf-section">
                  <div className="bookshelf-wrapper">
                    <div className="bookshelf-stage">
                      <BookshelfSkeleton />
                    </div>
                  </div>
                </main>
              }
            >
              <LazyBookshelfSection
                viewMode={activeViewMode}
                onToggleViewMode={handleToggleViewMode}
              />
            </Suspense>
          </div>
        )}

        {!shouldLoadBookshelf && activeViewMode === '3d' && (
          <main className="bookshelf-section">
            <div className="bookshelf-wrapper">
              <div className="bookshelf-stage">
                <BookshelfSkeleton />
              </div>
            </div>
          </main>
        )}
      </div>

      {/* 4. Contact Footer */}
      <Suspense fallback={<ContactFooterSkeleton />}>
        <LazyContactFooter onOpenEmail={() => setIsEmailModalOpen(true)} />
      </Suspense>

      {/* Modals */}
      {selectedModalVolume && (
        <Suspense fallback={null}>
          <LazyProjectDetailModal
            volume={selectedModalVolume}
            isOpen={Boolean(selectedModalVolume)}
            onClose={handleCloseModal}
            onSelectVolume={setSelectedModalVolume}
          />
        </Suspense>
      )}

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