import type { NodeEntity, ConnectionEntity, PortDirection, Point } from '../types/whiteboard';

/**
 * Calculates the exact (x, y) coordinates for any anchor port on a node.
 */
export function getAnchorPoint(node: NodeEntity, port: PortDirection): Point {
  const width = node.width || 180;
  const height = node.height || 56;

  switch (port) {
    case 'top':
      return { x: node.x + width / 2, y: node.y };
    case 'bottom':
      return { x: node.x + width / 2, y: node.y + height };
    case 'left':
      return { x: node.x, y: node.y + height / 2 };
    case 'right':
      return { x: node.x + width, y: node.y + height / 2 };
    default:
      return { x: node.x + width, y: node.y + height / 2 };
  }
}

/**
 * Computes the two Bezier control points (cp1, cp2) to create
 * a natural, curved architectural wire between two anchor ports.
 */
export function getBezierControlPoints(
  start: Point,
  end: Point,
  fromPort: PortDirection,
  toPort: PortDirection
): { cp1: Point; cp2: Point } {
  const dx = Math.abs(end.x - start.x) * 0.5;
  const dy = Math.abs(end.y - start.y) * 0.5;
  const curvature = Math.max(dx, dy, 40);

  const cp1: Point = { ...start };
  const cp2: Point = { ...end };

  // Push cp1 out from the starting port direction
  if (fromPort === 'right') cp1.x += curvature;
  else if (fromPort === 'left') cp1.x -= curvature;
  else if (fromPort === 'bottom') cp1.y += curvature;
  else if (fromPort === 'top') cp1.y -= curvature;

  // Pull cp2 in from the ending port direction
  if (toPort === 'left') cp2.x -= curvature;
  else if (toPort === 'right') cp2.x += curvature;
  else if (toPort === 'top') cp2.y -= curvature;
  else if (toPort === 'bottom') cp2.y += curvature;

  return { cp1, cp2 };
}

/**
 * Renders a curved wire on the given 2D canvas context.
 */
export function drawBezierWire(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  fromPort: PortDirection = 'right',
  toPort: PortDirection = 'left',
  options: {
    color?: string;
    lineWidth?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    isDashed?: boolean;
    direction?: 'unidirectional' | 'bidirectional';
    opacity?: number;
    isSelected?: boolean;
    showArrow?: boolean;
  } = {}
): void {
  const {
    color = '#3b82f6', // default brand blue
    lineWidth = 2,
    style,
    isDashed = false,
    direction = 'unidirectional',
    opacity = 100,
    isSelected = false,
    showArrow = true,
  } = options;

  const { cp1, cp2 } = getBezierControlPoints(start, end, fromPort, toPort);
  const resolvedStyle = style || (isDashed ? 'dashed' : 'solid');

  ctx.save();
  ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity / 100));
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  if (resolvedStyle === 'dashed') {
    ctx.setLineDash([8, 6]);
  } else if (resolvedStyle === 'dotted') {
    ctx.setLineDash([2, 6]);
  } else {
    ctx.setLineDash([]);
  }

  // Highlight selected wire with a subtle outer glow
  if (isSelected) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = `${color}45`;
    ctx.lineWidth = lineWidth + 6;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
    ctx.restore();
  }

  // Draw the smooth cubic bezier curve
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  ctx.stroke();

  // Draw arrowhead(s)
  if (showArrow) {
    const headSize = Math.max(7, lineWidth * 3.2);
    drawArrowhead(ctx, cp2, end, headSize);
    if (direction === 'bidirectional') {
      drawArrowhead(ctx, cp1, start, headSize);
    }
  }

  ctx.restore();
}

/**
 * Draws a small triangle arrowhead pointed at the end coordinate.
 */
function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number
): void {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle - Math.PI / 6),
    to.y - size * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - size * Math.cos(angle + Math.PI / 6),
    to.y - size * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}

/**
 * Iterates through all connections, performs dynamic lookup of the nodes
 * by ID, calculates anchor points, and renders each Bezier curve onto the canvas.
 */
export function renderAllConnections(
  ctx: CanvasRenderingContext2D,
  connections: ConnectionEntity[],
  nodes: NodeEntity[],
  selectedEdgeId: string | null = null
): void {
  // Map node IDs to nodes for O(1) lookup
  const nodeMap = new Map<string, NodeEntity>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  for (const conn of connections) {
    const fromNode = nodeMap.get(conn.fromNodeId);
    const toNode = nodeMap.get(conn.toNodeId);

    // If either card was deleted or not found, skip safely
    if (!fromNode || !toNode) continue;

    const start = getAnchorPoint(fromNode, conn.fromPort);
    const end = getAnchorPoint(toNode, conn.toPort);

    drawBezierWire(ctx, start, end, conn.fromPort, conn.toPort, {
      color: conn.color || '#3b82f6',
      lineWidth: conn.strokeWidth || 2,
      style: conn.style || 'solid',
      direction: conn.direction || 'unidirectional',
      opacity: conn.opacity ?? 100,
      isSelected: conn.id === selectedEdgeId,
    });
  }
}

/**
 * Finds the first connection whose Bezier curve passes within `threshold`
 * world pixels of `point` by sampling points along each curve.
 */
export function findConnectionAtPoint(
  point: Point,
  connections: ConnectionEntity[],
  nodes: NodeEntity[],
  threshold: number = 10
): ConnectionEntity | null {
  const nodeMap = new Map<string, NodeEntity>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  const thresholdSq = threshold * threshold;
  const steps = 20;

  for (let i = connections.length - 1; i >= 0; i--) {
    const conn = connections[i];
    const fromNode = nodeMap.get(conn.fromNodeId);
    const toNode = nodeMap.get(conn.toNodeId);
    if (!fromNode || !toNode) continue;

    const p0 = getAnchorPoint(fromNode, conn.fromPort);
    const p3 = getAnchorPoint(toNode, conn.toPort);
    const { cp1: p1, cp2: p2 } = getBezierControlPoints(p0, p3, conn.fromPort, conn.toPort);

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const u = 1 - t;
      // Cubic Bezier B(t) = u^3*P0 + 3*u^2*t*P1 + 3*u*t^2*P2 + t^3*P3
      const bx = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
      const by = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;

      const dx = point.x - bx;
      const dy = point.y - by;
      if (dx * dx + dy * dy <= thresholdSq) {
        return conn;
      }
    }
  }

  return null;
}

