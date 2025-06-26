import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const ScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    // Eventos para mouse
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseUp);

    // Eventos para touch
    let isTouching = false;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      scrollLeft = el.scrollLeft;
    };

    const handleTouchMove = (e) => {
      if (!isTouching) return;
      const touchX = e.touches[0].clientX;
      const walk = (touchStartX - touchX) * 1.5;
      el.scrollLeft = scrollLeft + walk;
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseUp);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <Box
      ref={scrollRef}
      sx={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'pan-y',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 4,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ScrollWrapper;
