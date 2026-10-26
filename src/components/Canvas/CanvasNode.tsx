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
}

/**
 * CanvasNode:
 * Reusable system architecture node card rendered on the canvas viewport.
 *
 * Props:
 *  - node: {
 *      id: string,
 *      primitiveId: string,
 *      label: string,
 *      category: string,
 *      x: number,
 *      y: number,
 *      width: number (default 180),
 *      height: number (default 56)
 *    }
 *  - isSelected: boolean — whether the card has active focus
 *  - onSelect: function(nodeId) — click handler
 *  - onPortClick: function(nodeId, portDirection) — anchor point click handler for arrows
 */
export default function CanvasNode({
  node,
  isSelected = false,
  onSelect = () => {},
  onPortClick = () => {},
  onMove = () => {},
  scale = 1,
}: CanvasNodeProps) {
  const width = node.width || 180;
  const height = node.height || 56;

  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({startX: 0, startY: 0, initialNodeX: 0, initialNodeY: 0})


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
  }


  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

  const deltaX = (e.clientX - dragStartRef.current.startX) / scale;
  const deltaY = (e.clientY - dragStartRef.current.startY) / scale;

  const nextX = Math.round(dragStartRef.current.initialNodeX + deltaX);
  const nextY = Math.round(dragStartRef.current.initialNodeY + deltaY);

  onMove(node.id, nextX, nextY);
  }


  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging) return;
  setIsDragging(false);
  try {
    e.currentTarget.releasePointerCapture(e.pointerId);
  } catch {}
};



  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
        
      }}
      onPointerDown={handlePointerDown}
      onPointerMove = {handlePointerMove}
      onPointerUp={handlePointerUp}

      className={`absolute group select-none cursor-move rounded-xl border transition-border duration-150 shadow-md ${
        isSelected
          ? 'bg-panel border-brand shadow-brand/20 ring-1 ring-brand'
          : 'bg-panel/95 border-subtle hover:border-brand/50 hover:shadow-lg'
      }`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* ── CARD CONTENT ── */}
      <div className="w-full h-full flex items-center gap-3 px-3.5">
        {/* Left Icon Badge */}
        <div className="w-8 h-8 rounded-lg bg-card border border-subtle flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
          <ComponentIcon type={node.icon || node.primitiveId} size={16} />
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
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 border-brand/60 hover:border-brand hover:bg-brand hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
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
        className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 border-brand/60 hover:border-brand hover:bg-brand hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
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
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 border-brand/60 hover:border-brand hover:bg-brand hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
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
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-panel border-2 border-brand/60 hover:border-brand hover:bg-brand hover:scale-150 transition-all opacity-0 group-hover:opacity-100 cursor-crosshair z-10"
        title="Connect from Left"
      />
    </div>
  );
}
