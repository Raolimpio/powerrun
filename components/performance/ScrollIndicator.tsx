'use client';

import { useEffect, useState } from 'react';

export interface ScrollIndicatorProps {
  className?: string;
  color?: string;
  height?: string;
}

export function ScrollIndicator({
  className = '',
  color = 'bg-blue-600',
  height = 'h-1',
}: ScrollIndicatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = Math.min(100, (scrollPx / winHeightPx) * 100);

      setScrollProgress(scrolled);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${height} ${className}`}>
      <div
        className={`${height} ${color} transition-all duration-150 ease-out`}
        style={{
          width: `${scrollProgress}%`,
          willChange: 'width',
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      />
    </div>
  );
}
