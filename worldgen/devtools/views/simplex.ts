import { Random } from "@dig/math";
import { Number, Slider } from "../utils"
import { createNoise2D } from 'simplex-noise';

export function init() {
  Random.seed = 0;
  const seedInput = Number(document.body, "Seed", generate);
  
  const worldSizeInput = Number(document.body, "Size", generate, {value: 100});
  const canvasScaleInput = Number(document.body, "Canvas Scale", generate, {value: 2});
  const noiseScaleInput = Number(document.body, "Noise Scale", generate, {value: 0.15, step: 0.01});
  
  const canvas = document.body.appendChild(document.createElement("canvas"));
  let generating = false;
  async function generate() {
    if (generating)
      return;
    generating = true;
  

    requestIdleCallback(() => {
			const densityPerlin = createNoise2D(Random.get.bind(Random));
      Random.seed = parseInt(seedInput.value);
			Random.position = 0;
    
      const size = parseInt(worldSizeInput.value);
      const canvasScale = parseInt(canvasScaleInput.value);
      const noiseScale = parseFloat(noiseScaleInput.value);
      canvas.width =  size * canvasScale;
      canvas.height = size * canvasScale;
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
			let min = 0;
			let max = 0;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const v = (densityPerlin(x * noiseScale, y * noiseScale) + 1) / 2;
					min = Math.min(min, v);
					max = Math.max(max, v);
          const color = v * 255;
          ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
          ctx.fillRect(x * canvasScale, y * canvasScale, canvasScale, canvasScale);
        }
      }
			console.log({min, max});
			

      generating = false;
    })
	}

	generate();
}