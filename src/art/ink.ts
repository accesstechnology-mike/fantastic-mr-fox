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

export function jitter(rand: () => number, amount: number): number {
  return (rand() - 0.5) * amount;
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
  if (points.length === 0) {
    return;
  }
  ctx.strokeStyle = hex(color);
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.82 + rand() * 0.16;
  ctx.beginPath();
  ctx.moveTo(points[0].x + jitter(rand, 1.1), points[0].y + jitter(rand, 1.1));
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const cur = points[i];
    const mx = (prev.x + cur.x) / 2 + jitter(rand, 1.5);
    const my = (prev.y + cur.y) / 2 + jitter(rand, 1.5);
    ctx.quadraticCurveTo(prev.x + jitter(rand, 1.2), prev.y + jitter(rand, 1.2), mx, my);
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
  ctx.globalAlpha = 0.88 + rand() * 0.1;
  ctx.beginPath();
  ctx.ellipse(x, y, r * (0.85 + rand() * 0.3), r * (0.7 + rand() * 0.4), rand(), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function fillOval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: number,
  rand: () => number,
  alpha = 0.92,
): void {
  ctx.fillStyle = hex(color);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.ellipse(x + jitter(rand, 0.8), y + jitter(rand, 0.8), rx, ry, jitter(rand, 0.25), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function outlineOval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: number,
  rand: () => number,
  width = 1.4,
): void {
  const steps = 10;
  const points: Array<{ x: number; y: number }> = [];
  const rot = jitter(rand, 0.2);
  for (let i = 0; i <= steps; i += 1) {
    const a = rot + (Math.PI * 2 * i) / steps;
    points.push({
      x: x + Math.cos(a) * rx + jitter(rand, 0.7),
      y: y + Math.sin(a) * ry + jitter(rand, 0.7),
    });
  }
  scratchyStroke(ctx, points, color, rand, width);
}

export function fillPoly(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  color: number,
  rand: () => number,
  alpha = 0.9,
): void {
  if (points.length < 3) {
    return;
  }
  ctx.fillStyle = hex(color);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(points[0].x + jitter(rand, 0.6), points[0].y + jitter(rand, 0.6));
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x + jitter(rand, 0.6), points[i].y + jitter(rand, 0.6));
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function inkDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: number,
  rand: () => number,
): void {
  ctx.fillStyle = hex(color);
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.ellipse(x, y, r * (0.85 + rand() * 0.25), r * (0.7 + rand() * 0.3), rand(), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function paperPage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  paper: number,
  stain: number,
  rand: () => number,
): void {
  ctx.fillStyle = hex(paper);
  ctx.fillRect(0, 0, w, h);
  wash(ctx, w * 0.5, h * 0.5, w, h, paper, rand, 12);
  wash(ctx, w * 0.18, h * 0.82, w * 0.4, h * 0.3, stain, rand, 5);
  wash(ctx, w * 0.8, h * 0.2, w * 0.28, h * 0.22, stain, rand, 4);
}

export function inkFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  ink: number,
  rand: () => number,
  inset = 10,
): void {
  scratchyStroke(
    ctx,
    [
      { x: inset, y: inset },
      { x: w - inset, y: inset + 3 },
      { x: w - inset - 2, y: h - inset },
      { x: inset + 3, y: h - inset - 2 },
      { x: inset, y: inset },
    ],
    ink,
    rand,
    2,
  );
}
