import { Random } from "@dig/math";

function randomGradient(ix: number, iy: number, seed: number) {
  const angle = Random.get3D(ix, iy, seed) * 2 * Math.PI;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function dotGridGradient(ix: number, iy: number, x: number, y: number, seed: number): number {
  const gradient = randomGradient(ix, iy, seed);
  const dx = x - ix;
  const dy = y - iy;
  return dx * gradient.x + dy * gradient.y;
}

function interpolate(a0: number, a1: number, w: number): number {
  return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
}

export const create2DPerlin = (seed: number, scale: number) => (x: number, y: number) => {
	x *= scale;
	y *= scale;

  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  const sx = x - x0;
  const sy = y - y0;

  const n0 = dotGridGradient(x0, y0, x, y, seed);
  const n1 = dotGridGradient(x1, y0, x, y, seed);
  const ix0 = interpolate(n0, n1, sx);

  const n2 = dotGridGradient(x0, y1, x, y, seed);
  const n3 = dotGridGradient(x1, y1, x, y, seed);
  const ix1 = interpolate(n2, n3, sx);

  return interpolate(ix0, ix1, sy);
};

export type Perlin2D = (x: number, y: number) => number;