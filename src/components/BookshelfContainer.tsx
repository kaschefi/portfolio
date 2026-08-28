import React, { useRef, useEffect, useState } from 'react';
import { BookshelfScene } from '../../node_modules/@designcodeio/threeui/lib-dist/shaders/bookshelf/BookshelfScene.js';
import { sound } from '../utils/audio';
import { VOLUMES_DATA } from '../data/portfolioData';

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
  const [isScrolledIntoView, setIsScrolledIntoView] = useState<boolean>(true);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  // 1. IntersectionObserver: Stop WebGL work completely when scrolled out of view
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsScrolledIntoView(inView);

        const canvas = root.querySelector('canvas');
        if (canvas) {
          if (!inView) {
            canvas.style.visibility = 'hidden';
          } else {
            canvas.style.visibility = 'visible';
            window.dispatchEvent(new Event('resize'));
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // 2. Apply dynamic palette CSS variables
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
    }
  };

  // 3. Bi-Directional DOM Mutation Observer
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let lastTitle = '';
    let lastPage = 1;
    let lastOpen = false;
    let lastInspect = false;

    // Apply initial palette
    applyPalette('codex');

    const observer = new MutationObserver(() => {
      const titleElem = root.querySelector('#selection-title') as HTMLElement | null;
      const pageElem = root.querySelector('#page-counter') as HTMLElement | null;

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
          sound.playShelfSlide();
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
        root.querySelector('#detail-panel')?.getAttribute('aria-hidden') === 'false' ||
        false;

      const toggleBtn = root.querySelector('#toggle-book') as HTMLButtonElement | null;
      const isOpen = toggleBtn
        ? toggleBtn.getAttribute('aria-pressed') === 'true' || toggleBtn.textContent?.toLowerCase().includes('close') || false
        : false;

      if (inspecting !== lastInspect) {
        lastInspect = inspecting;
        setIsInspecting(inspecting);
      }

      if (currentPage !== lastPage || isOpen !== lastOpen || inspecting !== lastInspect) {
        lastPage = currentPage;
        lastOpen = isOpen;
        onStateChange({
          isOpen,
          isInspecting: inspecting,
          page: currentPage
        });
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    return () => {
      observer.disconnect();
    };
  }, [onVolumeChange, onStateChange]);

  return (
    <div
      className={`experience bookshelf-wrapper ${isInspecting ? 'mode-detail' : 'mode-hero'}`}
      ref={containerRef}
    >
      <div
        className="bookshelf-stage"
        style={{
          opacity: isScrolledIntoView ? 1 : 0.05,
          pointerEvents: isScrolledIntoView ? 'auto' : 'none',
          transition: 'opacity 0.4s ease'
        }}
      >
        <BookshelfScene />
      </div>

      <div className="bookshelf-vignette" aria-hidden="true" />
      {children}
    </div>
  );
};

