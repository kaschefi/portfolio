import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VOLUMES_DATA, type VolumeProject } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { ViewModeToggle } from './ViewModeToggle';
import { ProjectCard2D } from './ProjectCard2D';

export interface ProjectCarousel2DProps {
  onSelectVolume: (volume: VolumeProject) => void;
  viewMode?: '2d' | '3d';
  onToggleViewMode?: (mode: '2d' | '3d') => void;
}

const pad = (val: number) => String(val).padStart(2, '0');

export const ProjectCarousel2D: React.FC<ProjectCarousel2DProps> = ({
  onSelectVolume,
  viewMode = '2d',
  onToggleViewMode
}) => {
  // 1. Start from the middle of the project collection
  const totalVolumes = VOLUMES_DATA.length;
  const initialIdx = Math.floor(totalVolumes / 2);

  const [currentIdx, setCurrentIdx] = useState<number>(initialIdx);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const dragStartXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  const currentVolume = VOLUMES_DATA[currentIdx] || VOLUMES_DATA[0];

  const handleSelect = useCallback(
    (volume: VolumeProject) => {
      sound.playBookOpen();
      onSelectVolume(volume);
    },
    [onSelectVolume]
  );

  // 2. Infinite Circular Navigation: Connected from end to start
  const goToVolume = useCallback((targetIdx: number) => {
    const nextIdx = ((targetIdx % totalVolumes) + totalVolumes) % totalVolumes;
    sound.playShelfSlide();
    setCurrentIdx(nextIdx);
  }, [totalVolumes]);

  const handlePrev = useCallback(() => {
    goToVolume(currentIdx - 1);
  }, [currentIdx, goToVolume]);

  const handleNext = useCallback(() => {
    goToVolume(currentIdx + 1);
  }, [currentIdx, goToVolume]);

  // 3. Fluid Horizontal Wheel listener (Vertical page scrolling passes untouched)
  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
    if (!isHorizontal) return;

    const delta = e.shiftKey ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 14) return;

    const now = Date.now();
    if (now - lastWheelTimeRef.current < 260) {
      return;
    }

    lastWheelTimeRef.current = now;
    if (delta > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // 4. Keyboard navigation (ArrowLeft / ArrowRight loop infinitely, Enter opens)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const stage = containerRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter') {
        handleSelect(currentVolume);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleSelect, currentVolume]);

  // 5. Direct Pointer / Touch Dragging: only engage drag after movement threshold
  const dragStartYRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    if (e.button !== 0) return;

    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = Date.now();
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartTimeRef.current === 0) return;
    const diffX = e.clientX - dragStartXRef.current;
    const diffY = e.clientY - dragStartYRef.current;

    // Only engage dragging once the user moves more than 7px horizontally
    if (!isDragging) {
      if (Math.abs(diffX) > 7 && Math.abs(diffX) > Math.abs(diffY)) {
        setIsDragging(true);
        hasDraggedRef.current = true;
        if (viewportRef.current) {
          try {
            viewportRef.current.setPointerCapture(e.pointerId);
          } catch {
            // Ignore
          }
        }
      } else {
        return;
      }
    }

    hasDraggedRef.current = true;
    setDragOffset(diffX * 0.95);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragStartTimeRef.current = 0;

    if (!isDragging) {
      // User tapped or clicked without dragging!
      setDragOffset(0);
      return;
    }

    setIsDragging(false);

    if (viewportRef.current) {
      try {
        viewportRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    const elapsed = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(dragOffset) / Math.max(1, elapsed);

    if (dragOffset < -50 || (dragOffset < -20 && velocity > 0.35)) {
      handleNext();
    } else if (dragOffset > 50 || (dragOffset > 20 && velocity > 0.35)) {
      handlePrev();
    }

    setDragOffset(0);

    // Keep hasDraggedRef true for a moment so the click event from pointerup is suppressed
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  const handlePointerCancel = () => {
    dragStartTimeRef.current = 0;
    setIsDragging(false);
    setDragOffset(0);
    hasDraggedRef.current = false;
  };

  return (
    <main
      className="bookshelf-section bookshelf-2d-stage"
      id="bookshelf"
      ref={containerRef}
      onWheel={handleWheel}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Top Editorial Header */}
      <header className="editorial-header" aria-label="Collection">
        <div className="editorial-identity">
          <strong>PROJECTS</strong>
        </div>
        {onToggleViewMode && (
          <div className="editorial-view-toggle">
            <ViewModeToggle mode={viewMode} onChange={onToggleViewMode} />
          </div>
        )}
      </header>

      {/* 2. Central Infinite Horizontal Card Stage (Pointer Dragging scoped here) */}
      <div
        className="bookshelf-2d-viewport"
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="bookshelf-2d-card-track" aria-live="polite">
          {VOLUMES_DATA.map((vol, idx) => {
            // Infinite circular relative distance
            let offset = (idx - currentIdx) % totalVolumes;
            if (offset > totalVolumes / 2) offset -= totalVolumes;
            if (offset < -totalVolumes / 2) offset += totalVolumes;

            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            // Render active center card and up to 2 adjacent wings on each side
            const isVisible = absOffset <= 2;
            if (!isVisible) return null;

            const xSpacing = 405;
            const xOffset = offset * xSpacing + dragOffset;
            const scale = isCenter
              ? Math.max(0.92, 1 - Math.abs(dragOffset) * 0.0003)
              : Math.max(0.85, 0.94 - absOffset * 0.08);
            const opacity = isCenter
              ? 1
              : Math.max(0.3, 0.72 - absOffset * 0.22);
            const zIndex = isCenter ? 20 : 10 - absOffset;

            return (
              <div
                key={vol.id}
                className={`bookshelf-2d-card-slot ${isCenter ? 'is-active-card' : 'is-inactive-card'}`}
                style={{
                  transform: `translate(calc(-50% + ${xOffset}px), -50%) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: isCenter
                    ? 'none'
                    : `brightness(${Math.max(0.7, 1 - absOffset * 0.15)}) blur(${absOffset > 1 ? '1px' : '0px'})`,
                  cursor: isDragging ? 'grabbing' : 'pointer',
                  transition: isDragging
                    ? 'none'
                    : 'transform 420ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 360ms ease, filter 360ms ease'
                }}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    handleSelect(vol);
                  }
                }}
                title={`Open ${vol.title} case study`}
              >
                <ProjectCard2D
                  volume={vol}
                  volumeIndex={idx}
                  isActive={isCenter}
                  onClick={() => {
                    if (!hasDraggedRef.current) {
                      handleSelect(vol);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Navigation: Infinite Loop (Never disabled, isolated from pointer drag) */}
      <section
        className="browse-ui"
        id="browse-ui"
        aria-label="Shelf navigation"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="selection">
          <span className="counter" id="counter">
            {pad(currentIdx + 1)} / {pad(totalVolumes)}
          </span>
          <div className="selection__copy">
            <h1 className="selection__title" id="selection-title">
              {currentVolume.title}
            </h1>
            <p className="selection__note" id="selection-note">
              {currentVolume.note || currentVolume.deck}
            </p>
          </div>
        </div>

        <div className="browse-actions">
          <button
            className="round-button"
            id="previous"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
            aria-label="Previous volume"
            title="Previous volume (Left)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" style={{ pointerEvents: 'none' }}>
              <path d="m10.5 3.5-4.5 4.5 4.5 4.5" />
            </svg>
          </button>
          <button
            className="text-button"
            id="inspect"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelect(currentVolume);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
            aria-label={`Open case study for ${currentVolume.title}`}
          >
            Open
          </button>
          <button
            className="round-button"
            id="next"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
            aria-label="Next volume"
            title="Next volume (Right)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" style={{ pointerEvents: 'none' }}>
              <path d="m5.5 3.5 4.5 4.5-4.5 4.5" />
            </svg>
          </button>
        </div>

        <nav className="index-nav" aria-label="Volume index">
          <div className="markers" id="markers" role="tablist" aria-label="Choose a volume">
            {VOLUMES_DATA.map((v, idx) => (
              <button
                key={v.id}
                className="marker"
                type="button"
                role="tab"
                aria-label={`Jump to volume ${idx + 1}: ${v.title}`}
                aria-selected={idx === currentIdx}
                aria-current={idx === currentIdx ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToVolume(idx);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ))}
          </div>
          <p className="microcopy">Swipe · arrows · select</p>
        </nav>
      </section>
    </main>
  );
};

export default ProjectCarousel2D;
