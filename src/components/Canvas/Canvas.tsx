import { useRef, useState, useEffect } from 'react';
import FloatingToolbar from '../Toolbar/FloatingToolbar';
import CanvasNode from './CanvasNode';
import { renderAllConnections, getAnchorPoint, drawBezierWire  } from '../../utils/geometry';
import type { DraftConnection } from '../../types/whiteboard';
import type { NodeEntity, ToolType, ConnectionEntity, PortDirection, ComponentPrimitive  } from '../../types/whiteboard';

const MIN_ZOOM = 30;
const MAX_ZOOM = 300;
const ZOOM_STEP = 15;


const cursorDict: Partial<Record<ToolType, string>> = {
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

interface CanvasProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  nodes: NodeEntity[];
  onUpdateNodePosition: (id: string, newX: number, newY: number) => void;
  connections?: ConnectionEntity[];
  onConnect?: (fromId: string, fromPort: PortDirection, toId: string, toPort: PortDirection) => void;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
}

export default function Canvas({
  activeTool = 'select',
  onSelectTool = () => {},
  nodes = [],
  connections = [],
  onUpdateNodePosition = () => {},
  onConnect = () => {},
  selectedNodeId = null,
  onSelectNode = () => {},
  onDeleteNode = () => {},
  onDuplicateNode = () => {},
}: CanvasProps) {


  const containerRef = useRef<HTMLElement | null>(null);
  const bottomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const topCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ 
    startX: number; 
    startY: number; 
    initialPanX: number; 
    initialPanY: number; 
  }>({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });

  const [draftWire, setDraftWire] = useState<DraftConnection | null>(null);
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  }));

  const clampZoom = (val: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, val));

  const handleZoomIn    = () => setZoom((z) => clampZoom(z + ZOOM_STEP));
  const handleZoomOut   = () => setZoom((z) => clampZoom(z - ZOOM_STEP));
  const handleResetZoom = () => setZoom(100);

  const cameraRef = useRef({ zoom, pan });
cameraRef.current = { zoom, pan };


  // Must use imperative addEventListener with { passive: false } so that
  // e.preventDefault() actually works. React's synthetic onWheel is passive
  // by default — calling preventDefault() inside it is silently ignored,
  // which means Chrome zooms the whole page instead of this canvas.
 useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
  const handler = (e: WheelEvent) => {
  e.preventDefault();

  const rect = el.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;


  if (e.ctrlKey || e.metaKey) {
    const currentZoom = cameraRef.current.zoom;
    const currentPan  = cameraRef.current.pan;
    const currentScale = currentZoom / 100;
    
    const worldX = (mouseX - currentPan.x) / currentScale;
    const worldY = (mouseY - currentPan.y) / currentScale;
  
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    const newZoom = clampZoom(currentZoom + delta);
    const newScale = newZoom / 100;
    
    const newPanX = mouseX - (worldX * newScale);
    const newPanY = mouseY - (worldY * newScale);
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
    return;
  }

  if (e.shiftKey) {
    setPan((prev) => ({
      ...prev,
      x: prev.x - e.deltaY,
    }));
    return;
  }

  setPan((prev) => ({
    x: prev.x - e.deltaX,
    y: prev.y - e.deltaY,
  }));
};

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);    
  }, []);

  // Track container dimensions so canvas internal pixel buffer always matches the screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w > 0 && h > 0) {
        setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };
    updateSize();
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && draftWire) {
        setDraftWire(null);
        const topCanvas = topCanvasRef.current;
        topCanvas?.getContext('2d')?.clearRect(0, 0, topCanvas.width, topCanvas.height);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftWire]);

  const scale = zoom / 100;

  // Redraw permanent connections on the bottom canvas in camera world-space
  useEffect(() => {
    const canvas = bottomCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);
    renderAllConnections(ctx, connections, nodes);
    ctx.restore();
  }, [connections, nodes, pan, scale, dimensions]);

  // Coarse grid cell = 50px at 100% zoom → scales with zoom
  const coarseCell = 50;
  // Fine sub-grid = 10px at 100% → only visible above 60% zoom
  const fineCell = 10;

  // Compute opacity of fine grid: invisible at low zoom, fully visible at 100%+
  const fineOpacity = zoom < 60 ? 0 : Math.min(1, (zoom - 60) / 40) * 0.035;
  const coarseOpacity = Math.max(0.03, Math.min(0.07, zoom / 1500 + 0.03));

  const gridStyle = {
    backgroundPosition: `${pan.x}px ${pan.y}px`,
    backgroundImage: [
      fineOpacity > 0
        ? `linear-gradient(to right, rgba(255,255,255,${fineOpacity}) 1px, transparent 1px)`
        : null,
      fineOpacity > 0
        ? `linear-gradient(to bottom, rgba(255,255,255,${fineOpacity}) 1px, transparent 1px)`
        : null,
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

  const handlePointerDown = (e: React.PointerEvent) => {
    // If draft wire is active and user clicks empty canvas space, cancel it
    if (draftWire) {
      setDraftWire(null);
      const topCanvas = topCanvasRef.current;
      topCanvas?.getContext('2d')?.clearRect(0, 0, topCanvas.width, topCanvas.height);
      return;
    }

    // Only pan if Hand tool is active OR middle-mouse button is clicked
    if (activeTool !== 'hand' && e.button !== 1) return;

    // Locks mouse tracking to this element even if cursor leaves the window
    e.currentTarget.setPointerCapture(e.pointerId);

    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
    setIsPanning(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStartRef.current.startX;
      const deltaY = e.clientY - panStartRef.current.startY;
      setPan({
        x: panStartRef.current.initialPanX + deltaX,
        y: panStartRef.current.initialPanY + deltaY,
      });
      return;
    }

    if (draftWire && topCanvasRef.current && containerRef.current) {
      const topCanvas = topCanvasRef.current;
      const topCtx = topCanvas.getContext('2d');
      if (!topCtx) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseWorldX = (e.clientX - rect.left - pan.x) / scale;
      const mouseWorldY = (e.clientY - rect.top - pan.y) / scale;

      topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
      topCtx.save();
      topCtx.translate(pan.x, pan.y);
      topCtx.scale(scale, scale);

      drawBezierWire(
        topCtx,
        { x: draftWire.startX, y: draftWire.startY },
        { x: mouseWorldX, y: mouseWorldY },
        draftWire.fromPort,
        'left',
        { color: '#3b82f6', isDashed: true }
      );

      topCtx.restore();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handlePortClick = (nodeId: string, port: PortDirection) => {
    if (!draftWire) {
      const sourceNode = nodes.find((n) => n.id === nodeId);
      if (!sourceNode) return;
      const startPoint = getAnchorPoint(sourceNode, port);
      setDraftWire({
        fromNodeId: nodeId,
        fromPort: port,
        startX: startPoint.x,
        startY: startPoint.y,
        currentX: startPoint.x,
        currentY: startPoint.y,
      });
      return;
    }
    // Case B: Second Click (Finish the wire!)
    if (draftWire.fromNodeId !== nodeId) { // don't connect a card to itself
      onConnect?.(draftWire.fromNodeId, draftWire.fromPort, nodeId, port);
    }
    setDraftWire(null);
    const topCanvas = topCanvasRef.current;
    if (topCanvas) {
      const topCtx = topCanvas.getContext('2d');
      topCtx?.clearRect(0, 0, topCanvas.width, topCanvas.height);
    }
  };

  
  return (
    <main
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'CANVAS') {
          onSelectNode?.('');
        }
      }}
      className={`flex-1 relative h-full bg-canvas overflow-hidden select-none ${
        activeTool === 'hand' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
      style={gridStyle}
    >
      {/* Layer 1: Bottom canvas (committed connections) - Decoupled from CSS transform */}
      <canvas
        ref={bottomCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 block pointer-events-none"
      />

      {/* Layer 2: World space interactive HTML cards (transformed by camera) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            onMove={onUpdateNodePosition}
            scale={scale}
            onPortClick={handlePortClick}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onDeleteNode={onDeleteNode}
            onDuplicateNode={onDuplicateNode}
          />
        ))}
      </div>

      {/* Layer 3: Top canvas (scratchpad for draft wire) - Decoupled from CSS transform */}
      <canvas
        ref={topCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 block pointer-events-none"
      />

      {/* Center welcome guide */}
      {nodes.length === 0 && (
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
      )}

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
