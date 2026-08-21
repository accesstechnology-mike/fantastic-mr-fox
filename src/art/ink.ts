export function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function hex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

export function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

export function wash(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  rand: () => number,
  blobs = 7,
): void {
  for (let i = 0; i < blobs; i += 1) {
    const ox = (rand() - 0.5) * w * 0.45;
    const oy = (rand() - 0.5) * h * 0.45;
    const rw = w * (0.35 + rand() * 0.4);
    const rh = h * (0.35 + rand() * 0.4);
    ctx.fillStyle = hex(color);
    ctx.globalAlpha = 0.18 + rand() * 0.22;
    ctx.beginPath();
    ctx.ellipse(x + ox, y + oy, rw, rh, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function scratchyStroke(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  color: number,
  rand: () => number,
  width = 1.4,
): void {
  ctx.strokeStyle = hex(color);
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(points[0].x + (rand() - 0.5) * 1.2, points[0].y + (rand() - 0.5) * 1.2);
  for (let i = 1; i < points.length; i += 1) {
    const jitterX = (rand() - 0.5) * 1.6;
    const jitterY = (rand() - 0.5) * 1.6;
    const prev = points[i - 1];
    const cur = points[i];
    const mx = (prev.x + cur.x) / 2 + jitterX;
    const my = (prev.y + cur.y) / 2 + jitterY;
    ctx.quadraticCurveTo(prev.x + jitterX, prev.y + jitterY, mx, my);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function inkBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: number,
  rand: () => number,
): void {
  ctx.fillStyle = hex(color);
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.ellipse(x, y, r * (0.85 + rand() * 0.3), r * (0.7 + rand() * 0.4), rand(), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}
