import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { sound } from '../utils/audio';
import { VOLUMES_DATA } from '../data/portfolioData';
import { BookshelfSkeleton } from './BookshelfSkeleton';
import { preloadBookshelfScene } from '../utils/bookshelfPreload';

// Code-split / lazy load heavy 3D WebGL BookshelfScene bundle
const LazyBookshelfScene = lazy(() =>
  preloadBookshelfScene().then((module) => ({
    default: module.BookshelfScene
  }))
);

interface BookshelfContainerProps {
  onVolumeChange: (volumeId: string) => void;
  onStateChange: (state: { isOpen: boolean; isInspecting: boolean; page: number }) => void;
  children?: React.ReactNode;
}

const TITLE_TO_ID: Record<string, string> = {
  'moka': 'codex',
  'codex': 'codex',
  'sawyer robot': 'figma',
  'sawyer': 'figma',
  'shell game': 'figma',
  'figma': 'figma',
  'aegis': 'figma',
  'aegis design system': 'figma',
  'claude code': 'claude-code',
  'cat-breed-recognition': 'claude-code',
  'cat breed recognition': 'claude-code',
  'cursor': 'cursor',
  'semantic-etl-pipeline': 'cursor',
  'semantic-etl': 'cursor',
  'semantic etl pipeline': 'cursor',
  'semantic etl': 'cursor',
  'resq': 'cursor',
  'resq emergency response': 'cursor',
  'antigravity': 'antigravity',
  'roboflow': 'antigravity',
  'framer': 'framer',
  'xcode': 'xcode',
  'joinapp': 'xcode',
  'join app': 'xcode'
};

export const BookshelfContainer: React.FC<BookshelfContainerProps> = ({
  onVolumeChange,
  onStateChange,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hasInitializedSelectionRef = useRef<boolean>(false);
  const [isScrolledIntoView, setIsScrolledIntoView] = useState<boolean>(true);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsScrolledIntoView(inView);
        const canvas = root.querySelector('canvas');
        if (canvas) {
          canvas.style.visibility = inView ? 'visible' : 'hidden';
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Dynamic palette
  const applyPalette = (volId: string) => {
    const vol = VOLUMES_DATA.find((v) => v.id === volId) || VOLUMES_DATA[0];
    const root = containerRef.current;
    if (vol && root) {
      root.style.setProperty('--paper', vol.palette.paper);
      root.style.setProperty('--paper-deep', vol.palette.paperDeep);
      root.style.setProperty('--paper-pale', vol.palette.paperPale);
      root.style.setProperty('--ink', vol.palette.ink);
      root.style.setProperty('--ink-soft', vol.palette.inkSoft);
      root.style.setProperty('--accent', vol.accent || vol.foil);
      root.style.setProperty('--foil', vol.foil);
      root.style.setProperty('--wall', vol.palette.wall);
    }
  };

  // 3. Bi-Directional DOM Observer (scoped to .bookshelf & .bookshelf__source-controls)
  useEffect(() => {
    const root = containerRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    let lastTitle = '';
    let lastPage = 1;
    let lastOpen = false;
    let lastInspect = false;

    applyPalette('codex');

    const handleMutations = () => {
      const titleElem = root.querySelector('.bookshelf__source-controls #selection-title') as HTMLElement | null;
      const pageElem = root.querySelector('.bookshelf__source-controls #page-counter') as HTMLElement | null;

      if (titleElem && titleElem.textContent) {
        const rawTitle = titleElem.textContent.trim().toLowerCase();
        let matchedId = TITLE_TO_ID[rawTitle];
        if (!matchedId) {
          const found = VOLUMES_DATA.find(
            (v) =>
              v.title.toLowerCase() === rawTitle ||
              v.id.toLowerCase() === rawTitle ||
              v.discipline.toLowerCase() === rawTitle
          );
          if (found) matchedId = found.id;
        }
        matchedId = matchedId || 'codex';
        if (matchedId !== lastTitle) {
          lastTitle = matchedId;
          applyPalette(matchedId);
          onVolumeChange(matchedId);
          if (hasInitializedSelectionRef.current) {
            sound.playShelfSlide();
          } else {
            hasInitializedSelectionRef.current = true;
          }
        }
      }

      let currentPage = 1;
      if (pageElem && pageElem.textContent) {
        const match = pageElem.textContent.match(/(\d+)/);
        if (match) {
          currentPage = parseInt(match[1], 10) || 1;
        }
      }

      const inspecting =
        root.querySelector('.bookshelf')?.classList.contains('mode-detail') ||
        root.querySelector('.bookshelf__source-controls #detail-panel')?.getAttribute('aria-hidden') === 'false' ||
        false;

      const toggleBtn = root.querySelector('.bookshelf__source-controls #toggle-book') as HTMLButtonElement | null;
      const isOpen = toggleBtn
        ? toggleBtn.getAttribute('aria-pressed') === 'true' ||
        toggleBtn.textContent?.toLowerCase().includes('close') ||
        false
        : false;

      const inspectChanged = inspecting !== lastInspect;
      if (inspectChanged) {
        lastInspect = inspecting;
        setIsInspecting(inspecting);
      }

      if (currentPage !== lastPage || isOpen !== lastOpen || inspectChanged) {
        lastPage = currentPage;
        lastOpen = isOpen;
        onStateChange({
          isOpen,
          isInspecting: inspecting,
          page: currentPage
        });
      }
    };

    const observer = new MutationObserver(handleMutations);
    let bootObserver: MutationObserver | null = null;
    let isAttached = false;

    const attachScopedObservers = () => {
      if (isAttached) return true;
      const bookshelfEl = stage.querySelector('.bookshelf');
      const sourceControlsEl = stage.querySelector('.bookshelf__source-controls');
      if (!bookshelfEl || !sourceControlsEl) return false;

      isAttached = true;
      observer.observe(bookshelfEl, {
        attributes: true,
        attributeFilter: ['class', 'data-state']
      });
      observer.observe(sourceControlsEl, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'data-state', 'aria-hidden', 'aria-pressed', 'aria-current']
      });
      handleMutations();
      return true;
    };

    if (!attachScopedObservers()) {
      bootObserver = new MutationObserver(() => {
        if (attachScopedObservers() && bootObserver) {
          bootObserver.disconnect();
          bootObserver = null;
        }
      });
      bootObserver.observe(stage, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      if (bootObserver) {
        bootObserver.disconnect();
      }
    };
  }, [onVolumeChange, onStateChange]);

  // Ready listener (scoped to .bookshelf and .bookshelf__canvas)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const checkReady = () => {
      const ready =
        stage.querySelector('.bookshelf[data-state="ready"]') !== null ||
        stage.querySelector('.bookshelf__canvas.is-ready') !== null;
      if (ready) {
        setIsSceneReady(true);
      }
      return ready;
    };

    const observer = new MutationObserver(() => {
      if (checkReady()) {
        observer.disconnect();
      }
    });
    let bootObserver: MutationObserver | null = null;
    let isAttached = false;

    const attachReadyObserver = () => {
      if (isAttached) return true;
      const bookshelfEl = stage.querySelector('.bookshelf');
      if (!bookshelfEl) return false;
      isAttached = true;
      if (checkReady()) return true;

      observer.observe(bookshelfEl, {
        attributes: true,
        attributeFilter: ['data-state', 'class']
      });
      const canvasEl = bookshelfEl.querySelector('.bookshelf__canvas');
      if (canvasEl) {
        observer.observe(canvasEl, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
      return true;
    };

    if (!attachReadyObserver()) {
      bootObserver = new MutationObserver(() => {
        if (attachReadyObserver() && bootObserver) {
          bootObserver.disconnect();
          bootObserver = null;
        }
      });
      bootObserver.observe(stage, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      if (bootObserver) {
        bootObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isSceneReady) return;
    const timer = window.setTimeout(() => {
      setShowSkeleton(false);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [isSceneReady]);

  // View-spine events
  useEffect(() => {
    const handleViewSpine = () => setIsExpanded(true);
    const handleResetView = () => setIsExpanded(false);
    window.addEventListener('bookshelf:view-spine', handleViewSpine);
    window.addEventListener('bookshelf:reset-view', handleResetView);
    return () => {
      window.removeEventListener('bookshelf:view-spine', handleViewSpine);
      window.removeEventListener('bookshelf:reset-view', handleResetView);
    };
  }, []);

  useEffect(() => {
    if (!isInspecting) {
      setIsExpanded(false);
    }
  }, [isInspecting]);

  return (
    <div
      className={`experience bookshelf-wrapper ${isInspecting ? 'mode-detail' : 'mode-hero'} ${isExpanded && isInspecting ? 'is-expanded' : ''
        }`}
      ref={containerRef}
    >
      <div
        className="bookshelf-stage"
        ref={stageRef}
        style={{
          opacity: isScrolledIntoView ? 1 : 0.05,
          pointerEvents: isScrolledIntoView ? 'auto' : 'none',
          transition: 'opacity 0.4s ease'
        }}
      >
        <Suspense fallback={null}>
          <LazyBookshelfScene />
        </Suspense>
        {showSkeleton && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              pointerEvents: 'none',
              opacity: isSceneReady ? 0 : 1,
              transition: 'opacity 0.4s ease-out'
            }}
          >
            <BookshelfSkeleton />
          </div>
        )}
      </div>
      <div className="bookshelf-vignette" aria-hidden="true" />
      <div
        className="bookshelf-hud-wrapper"
        style={{
          opacity: isSceneReady ? 1 : 0,
          pointerEvents: isSceneReady ? 'auto' : 'none',
          transition: 'opacity 0.4s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};