import { useRef, useState } from 'react';
import ComponentIcon from '../reusables/ComponentIcon'

import type { NodeEntity, PortDirection } from '../../types/whiteboard';

interface CanvasNodeProps {
  node: NodeEntity;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onPortClick?: (nodeId: string, portDirection: PortDirection) => void;
  onMove?: (id: string, newX: number, newY: number) => void; // <-- 3 arguments!
  scale?: number;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
}

/**
 * CanvasNode:
 * Reusable system architecture node card rendered on the canvas viewport.
 */
export default function CanvasNode({
  node,
  isSelected = false,
  onSelect = () => {},
  onPortClick = () => {},
  onMove = () => {},
  scale = 1,
  onSelectNode = () => {},
  selectedNodeId = null,
  onDeleteNode = () => {},
  onDuplicateNode = () => {},
}: CanvasNodeProps) {
  const width = node.width || 180;
  const height = node.height || 56;
  const accentColor = node.color || '#3b82f6';

  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({startX: 0, startY: 0, initialNodeX: 0, initialNodeY: 0})

  const hasMovedRef = useRef(false)


  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(node.id)

      // 3. Lock mouse to this card so fast moves don't drop it
  e.currentTarget.setPointerCapture(e.pointerId);
  // 4. Take the snapshot!
  dragStartRef.current = {
    startX: e.clientX,
    startY: e.clientY,
    initialNodeX: node.x,
    initialNodeY: node.y,
  };
  // 5. Flip the switch!
  setIsDragging(true);
  hasMovedRef.current = false;

  }


  const rafRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    
  const clientX = e.clientX;
  const clientY = e.clientY;
  // If a frame is already queued, don't schedule another one yet!
  if (rafRef.current) return;

  rafRef.current = requestAnimationFrame(() => {

    const deltaX = (clientX - dragStartRef.current.startX) / scale;
    const deltaY = (clientY - dragStartRef.current.startY) / scale;

  const nextX = Math.round(dragStartRef.current.initialNodeX + deltaX);
  const nextY = Math.round(dragStartRef.current.initialNodeY + deltaY);

  onMove(node.id, nextX, nextY);
    rafRef.current = null;
  })

  hasMovedRef.current = true;

  }


  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging) return;
  setIsDragging(false);
  try {
    e.currentTarget.releasePointerCapture(e.pointerId);
  } catch {}
};



  const isCardActive = selectedNodeId === node.id || isSelected;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (hasMovedRef.current) return;
        onSelectNode(node.id);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute group select-none cursor-move rounded-xl border transition-colors duration-150 shadow-md ${
        isCardActive
          ? 'bg-panel ring-1'
          : 'bg-panel/95 border-subtle hover:shadow-lg'
      } ${isCardActive ? 'ring-2 ring-brand' : ''}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: isCardActive ? accentColor : undefined,
        boxShadow: isCardActive ? `0 0 0 1px ${accentColor}, 0 4px 14px ${accentColor}25` : undefined,
      }}
    >
      {/* ── FLOATING SELECTION ACTION PILL ── */}
      {isCardActive && (
        <div
          className="absolute -top-7 right-0 flex items-center gap-0.5 bg-panel border border-subtle rounded-lg px-1 py-0.5 shadow-lg z-30 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateNode?.(node.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-dim hover:text-heading hover:bg-card-hover transition-colors cursor-pointer"
            title="Duplicate (Ctrl+D)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode?.(node.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete (Backspace)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* ── CARD CONTENT ── */}
      <div className="w-full h-full flex items-center gap-3 px-3.5">
        {/* Left Icon Badge with brand color tint */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
          style={{
            backgroundColor: `${accentColor}18`,
            border: `1px solid ${accentColor}35`,
            color: accentColor,
          }}
        >
          <ComponentIcon type={node.icon || node.primitiveId} size={19} color={accentColor} />
        </div>

        {/* Text Stack */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-heading truncate leading-tight">
            {node.label}
          </p>
          <p className="text-[10px] text-dim truncate mt-0.5 font-mono">
            {node.category || 'Service'}
          </p>
        </div>
      </div>

      {/* ── 4 CONNECTION ANCHOR PORTS ── */}
      {/* Top (North) */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPortClick(node.id, 'top');
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
        style={{ borderColor: accentColor }}
        title="Connect from Top"
      />

      {/* Right (East) */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPortClick(node.id, 'right');
        }}
        className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
        style={{ borderColor: accentColor }}
        title="Connect from Right"
      />

      {/* Bottom (South) */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPortClick(node.id, 'bottom');
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
        style={{ borderColor: accentColor }}
        title="Connect from Bottom"
      />

      {/* Left (West) */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPortClick(node.id, 'left');
        }}
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
        style={{ borderColor: accentColor }}
        title="Connect from Left"
      />
    </div>
  );
}
