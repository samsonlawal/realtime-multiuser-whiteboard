import { useRef, useEffect } from 'react';
import Cursor from './Cursor';

/**
 * Isolated UserPresence layer for the Hero section.
 * - Tracks local cursor with zero React re-renders via direct DOM GPU transforms.
 */
export default function HeroPresence({ containerRef }) {
  const localCursorRef = useRef(null);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (localCursorRef.current) {
        localCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        localCursorRef.current.style.opacity = '1';
      }
    };

    const onPointerLeave = () => {
      if (localCursorRef.current) {
        localCursorRef.current.style.opacity = '0';
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Hardware-accelerated local cursor */}
      <Cursor
        ref={localCursorRef}
        name="You"
        colorClass="bg-peer-you"
        fillHex="#3b82f6"
        className="top-0 left-0 will-change-transform opacity-0 transition-opacity duration-150"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
