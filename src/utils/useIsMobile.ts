import { useEffect, useState } from 'react';

// A device counts as "mobile" only when it BOTH has a coarse/touch-primary
// pointer AND a small viewport. This avoids two common false positives:
// - A touch laptop (e.g. Surface) with a large screen: fine for the full 3D scene.
// - A desktop browser window resized narrow (dev tools, split screen): still has a mouse.
// We also check the smaller of width/height so a phone held in landscape is
// still correctly treated as mobile.
const MOBILE_MAX_DIMENSION = 768;

function computeIsMobile(): boolean {
    if (typeof window === 'undefined') return false;

    const isCoarsePointer =
        window.matchMedia?.('(hover: none) and (pointer: coarse)')?.matches ?? false;
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    const isSmallViewport = smallerDimension <= MOBILE_MAX_DIMENSION;

    return isCoarsePointer && isSmallViewport;
}

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(() => computeIsMobile());

    useEffect(() => {
        const update = () => setIsMobile(computeIsMobile());

        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);

        const pointerQuery = window.matchMedia?.('(hover: none) and (pointer: coarse)');
        pointerQuery?.addEventListener?.('change', update);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
            pointerQuery?.removeEventListener?.('change', update);
        };
    }, []);

    return isMobile;
}
