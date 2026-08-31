import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HeroFluidReveal } from './components/HeroFluidReveal';
import { MobileHero } from './components/MobileHero';
import { MobileProjectCards } from './components/MobileProjectCards';
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

  // Track when the user is approaching or requesting the 3D Bookshelf
  const [shouldLoadBookshelf, setShouldLoadBookshelf] = useState<boolean>(false);
  const bookshelfTriggerRef = useRef<HTMLDivElement>(null);

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
    if (sectionId === 'bookshelf') {
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
      <div ref={bookshelfTriggerRef} style={{ position: 'relative', width: '100%' }}>
        {isMobile ? (
          <MobileProjectCards onSelectVolume={setSelectedModalVolume} />
        ) : shouldLoadBookshelf ? (
          <Suspense
            fallback={
              <main className="bookshelf-section" id="bookshelf">
                <div className="bookshelf-wrapper">
                  <div className="bookshelf-stage">
                    <BookshelfSkeleton />
                  </div>
                </div>
              </main>
            }
          >
            <LazyBookshelfSection />
          </Suspense>
        ) : (
          <main className="bookshelf-section" id="bookshelf">
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