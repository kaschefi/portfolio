import React, { useState, useCallback } from 'react';
import { BookshelfContainer } from './BookshelfContainer';
import { BookshelfHUD } from './BookshelfHUD';
import { VOLUMES_DATA } from '../data/portfolioData';

export const BookshelfSection: React.FC = () => {
  const [currentVolumeId, setCurrentVolumeId] = useState<string>('codex');
  const [sceneState, setSceneState] = useState<{ isOpen: boolean; isInspecting: boolean; page: number }>({
    isOpen: false,
    isInspecting: false,
    page: 1
  });

  const handleVolumeChange = useCallback((id: string) => {
    setCurrentVolumeId(id);
  }, []);

  const handleStateChange = useCallback((state: { isOpen: boolean; isInspecting: boolean; page: number }) => {
    setSceneState(state);
  }, []);

  const currentVolume = VOLUMES_DATA.find((v) => v.id === currentVolumeId) || VOLUMES_DATA[0];

  return (
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
  );
};

export default BookshelfSection;
