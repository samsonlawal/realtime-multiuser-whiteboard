import { useRef, useState, useEffect } from 'react';
import FloatingToolbar from '../Toolbar/FloatingToolbar';

const MIN_ZOOM = 30;
const MAX_ZOOM = 300;
const ZOOM_STEP = 15;


const cursorDict = {
  select: "cursor-default",
  hand: "cursor-grab",
  text: "cursor-text",
}

/**
 * Canvas Component:
 * - Dual-layer HTML5 canvas (bottom committed, top scratchpad)
 * - CSS transform zoom applied to a wrapper div
 * - Grid background scales with zoom (coarse 50px + fine 10px sub-grid)
 * - Scroll-wheel zoom support
 */
export default function Canvas({
  activeTool = 'select',
  onSelectTool = () => {},
}) {
  const containerRef = useRef(null);
  const bottomCanvasRef = useRef(null);
  const topCanvasRef = useRef(null);
  const [zoom, setZoom] = useState(100);

  const clampZoom = (val) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, val));

  const handleZoomIn    = () => setZoom((z) => clampZoom(z + ZOOM_STEP));
  const handleZoomOut   = () => setZoom((z) => clampZoom(z - ZOOM_STEP));
  const handleResetZoom = () => setZoom(100);

  // Must use imperative addEventListener with { passive: false } so that
  // e.preventDefault() actually works. React's synthetic onWheel is passive
  // by default — calling preventDefault() inside it is silently ignored,
  // which means Chrome zooms the whole page instead of this canvas.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom((z) => clampZoom(z + delta));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const scale = zoom / 100;

  // Coarse grid cell = 50px at 100% zoom → scales with zoom
  const coarseCell = 50;
  // Fine sub-grid = 10px at 100% → only visible above 60% zoom
  const fineCell = 10;

  // Compute opacity of fine grid: invisible at low zoom, fully visible at 100%+
  const fineOpacity = zoom < 60 ? 0 : Math.min(1, (zoom - 60) / 40) * 0.035;
  const coarseOpacity = Math.max(0.03, Math.min(0.07, zoom / 1500 + 0.03));

  const gridStyle = {
    backgroundImage: [
      // Fine sub-grid
      fineOpacity > 0
        ? `linear-gradient(to right, rgba(255,255,255,${fineOpacity}) 1px, transparent 1px)`
        : null,
      fineOpacity > 0
        ? `linear-gradient(to bottom, rgba(255,255,255,${fineOpacity}) 1px, transparent 1px)`
        : null,
      // Coarse grid
      `linear-gradient(to right, rgba(255,255,255,${coarseOpacity}) 1px, transparent 1px)`,
      `linear-gradient(to bottom, rgba(255,255,255,${coarseOpacity}) 1px, transparent 1px)`,
    ]
      .filter(Boolean)
      .join(', '),

    backgroundSize: [
      fineOpacity > 0 ? `${fineCell * scale}px ${fineCell * scale}px` : null,
      fineOpacity > 0 ? `${fineCell * scale}px ${fineCell * scale}px` : null,
      `${coarseCell * scale}px ${coarseCell * scale}px`,
      `${coarseCell * scale}px ${coarseCell * scale}px`,
    ]
      .filter(Boolean)
      .join(', '),
  };

  return (
    <main
      ref={containerRef}
      className="flex-1 relative h-full bg-canvas overflow-hidden select-none"
      style={gridStyle}
    >
      {/*
        Canvas layers are inside a scale wrapper.
        This makes drawn content zoom visually.
        In Milestone 2 we'll also apply the inverse transform to
        mouse coordinates before drawing, so drawing stays accurate.
      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Layer 1: Bottom canvas (committed shapes) */}
        <canvas
          ref={bottomCanvasRef}
          className="absolute inset-0 block w-full h-full pointer-events-none"
        />

        {/* Layer 2: Top canvas (active draw + remote cursors) */}
        <canvas
          ref={topCanvasRef}
          className={`absolute inset-0 block w-full h-full ${
            cursorDict[activeTool] || 'cursor-crosshair'
          }`}
        />
      </div>

      {/* Center welcome guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="p-5 rounded-2xl bg-panel/80 border border-subtle backdrop-blur-md text-center max-w-sm shadow-2xl">
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-heading text-sm">
            Infinite Workspace
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Add a component from the left sidebar, or pick a shape from the toolbar below.
            <br />
            <span className="text-dim text-[10px]">Ctrl + scroll to zoom</span>
          </p>
        </div>
      </div>

      {/* Floating toolbar */}
      <FloatingToolbar
        activeTool={activeTool}
        onSelectTool={onSelectTool}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />
    </main>
  );
}
