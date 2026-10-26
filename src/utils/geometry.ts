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
    isDashed?: boolean;
    showArrow?: boolean;
  } = {}
): void {
  const {
    color = '#3b82f6', // default brand blue
    lineWidth = 2,
    isDashed = false,
    showArrow = true,
  } = options;

  const { cp1, cp2 } = getBezierControlPoints(start, end, fromPort, toPort);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  if (isDashed) {
    ctx.setLineDash([6, 6]);
  } else {
    ctx.setLineDash([]);
  }

  // Draw the smooth cubic bezier curve
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  ctx.stroke();

  // Draw arrowhead at the destination port
  if (showArrow) {
    drawArrowhead(ctx, cp2, end, lineWidth * 4);
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
  nodes: NodeEntity[]
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
      isDashed: conn.style === 'dashed',
    });
  }
}

