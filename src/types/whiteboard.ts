// ── System Whiteboard Data Contracts ──

export type PortDirection = 'top' | 'right' | 'bottom' | 'left';

export type ToolType =
  | 'select'
  | 'hand'
  | 'rectangle'
  | 'diamond'
  | 'circle'
  | 'arrow'
  | 'text';

export interface Point {
  x: number;
  y: number;
}

// 1. The Catalog Blueprint (Sidebar)
export interface ComponentPrimitive {
  id: string;        // e.g. 'postgres', 'redis', 'kafka'
  label: string;     // e.g. 'PostgreSQL'
  category: string;  // e.g. 'Databases'
  icon?: string;
  color?: string;    // Official brand accent color (e.g. '#336791')
}

// ── Architecture Node (Cards on the Canvas) ──
export interface NodeEntity {
  id: string;
  primitiveId: string;
  label: string;
  category: string;
  icon?: string;
  color?: string;    // Brand accent color inherited from primitive or customized
  x: number;
  y: number;
  width?: number;   // default 180
  height?: number;  // default 56
}

// ── Permanent Connection (Curved Bezier Wire) ──
export interface ConnectionEntity {
  id: string;
  fromNodeId: string;
  fromPort: PortDirection;
  toNodeId: string;
  toPort: PortDirection;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  direction?: 'unidirectional' | 'bidirectional';
  label?: string;
}

// ── In-Progress Draft Wire (While mouse is dragging across the screen) ──
export interface DraftConnection {
  fromNodeId: string;
  fromPort: PortDirection;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// ── Viewport Camera & Zoom Transform ──
export interface ViewportTransform {
  pan: Point;
  zoom: number;   // percentage, e.g. 100
  scale: number;  // decimal, e.g. 1.0
}
