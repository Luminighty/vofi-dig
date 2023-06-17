import { Random } from "@dig/math";
import { Number, Slider } from "../utils"
import { Perlin2D, create2DPerlin } from "../../src/perlin";

export function init() {
  Random.seed = 0;
  const seedInput = Number(document.body, "Seed", generate);
  
  const worldSizeInput = Number(document.body, "Size", generate, {value: 100});
  const canvasScaleInput = Number(document.body, "Canvas Scale", generate, {value: 2});
  
  const onGrey = (value, threshold) => Math.abs(value) > threshold;
  const onHigh = (value, threshold) => value > threshold;
  const onLow = (value, threshold) => value < threshold;
  
  
  const chambers = {
    scale: Slider(document.body, "Chamber Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
    threshold: Slider(document.body, "Chamber Threshold", generate, { min: -1, max: 1, step: 0.002, value: 0 }),
    method: onHigh,
  };
  
  const canvas = document.body.appendChild(document.createElement("canvas"));
  
  
  let generating = false;
  async function generate() {
    if (generating)
      return;
    generating = true;
  
  
    requestIdleCallback(() => {
      Random.seed = parseInt(seedInput.value);
    
      const size = parseInt(worldSizeInput.value);
      const canvasScale = parseInt(canvasScaleInput.value);
      canvas.width =  size * canvasScale;
      canvas.height = size * canvasScale;
    
      const perlin = create2DPerlin(1000, parseFloat(chambers.scale.value));
    
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      let min: number | null = null;
      let max: number | null = null;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const v = (perlin(x, y) + 1) / 2;
          min = Math.min(v, min ?? v);
          max = Math.max(v, max ?? v);
          const color = v * 256;
          ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
          const roll = Random.get2D(x, y) - parseFloat(chambers.threshold.value);
          if (roll < v)
            ctx.fillStyle = `rgb(0, 255, 0)`;
  
          ctx.fillRect(x * canvasScale, y * canvasScale, canvasScale, canvasScale);
        }
      }
      console.log({min, max});
      generating = false;
    })
  }
  
  const colors = {
    AIR: `rgb(255, 255, 255)`,
    STONE: `rgb(80, 80, 80)`,
    DIRT: `rgb(170, 120, 80)`,
    ORE: `rgb(100, 100, 255)`,
    Ruby: `rgb(255, 100, 100)`,
  }
  
  generate();
}
