export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SIDE_NORMAL: Record<Side, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

/** Point on a box's edge for the given side, in the box's own coordinate space. */
export function anchor(box: Box, side: Side): Point {
  switch (side) {
    case 'top':
      return { x: box.x + box.w / 2, y: box.y };
    case 'bottom':
      return { x: box.x + box.w / 2, y: box.y + box.h };
    case 'left':
      return { x: box.x, y: box.y + box.h / 2 };
    case 'right':
      return { x: box.x + box.w, y: box.y + box.h / 2 };
  }
}

/** Cubic bezier `d` string between two anchor points, control points extended along each side's outward normal. */
export function edgePath(a: Point, aSide: Side, b: Point, bSide: Side, bend = 60): string {
  const na = SIDE_NORMAL[aSide];
  const nb = SIDE_NORMAL[bSide];
  const c1 = { x: a.x + na.x * bend, y: a.y + na.y * bend };
  const c2 = { x: b.x + nb.x * bend, y: b.y + nb.y * bend };
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
}
