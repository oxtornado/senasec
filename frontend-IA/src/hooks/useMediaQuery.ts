import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Breakpoints específicos para SENASEC
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobileS = useMediaQuery('(max-width: 374px)');
  const isMobileM = useMediaQuery('(min-width: 375px) and (max-width: 424px)');
  const isMobileL = useMediaQuery('(min-width: 425px) and (max-width: 767px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileS,
    isMobileM,
    isMobileL,
    isTouch: isMobile || isTablet
  };
};