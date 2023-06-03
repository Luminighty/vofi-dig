import { Slider } from "./slider";
import { create2DPerlin } from "../src/worldgen/perlin";
import { Random } from "../src/math/random";
import { Number } from "./number";

Random.seed = 0;
const seedInput = Number(document.body, "Seed", generate);

const worldSizeInput = Number(document.body, "Size", generate, {value: 200});
const canvasScaleInput = Number(document.body, "Canvas Scale", generate, {value: 2});

const onGrey = (value, threshold) => Math.abs(value) > threshold;
const onHigh = (value, threshold) => value > threshold;
const onLow = (value, threshold) => value < threshold;


const chambers = {
  scale: Slider(document.body, "Chamber Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
  threshold: Slider(document.body, "Chamber Threshold", generate, { min: -1, max: 1, step: 0.002, value: 0 }),
  method: onHigh,
};

const tunnels = {
  scale: Slider(document.body, "Tunnel Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
  threshold: Slider(document.body, "Tunnel Threshold", generate, { min: 0.001, max: 0.06, step: 0.001, value: 0.01 }),
  method: onGrey,
}

const ores = {
  scale: Slider(document.body, "Ore Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
  threshold: Slider(document.body, "Ore Threshold", generate, { min: -1, max: 1, step: 0.002, value: 0 }),
  method: onLow,
}

const rubies = {
  scale: Slider(document.body, "Ruby Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
  threshold: Slider(document.body, "Ruby Threshold", generate, { min: -1, max: 1, step: 0.002, value: 0 }),
  method: onLow,
}

const canvas = document.body.appendChild(document.createElement("canvas"));

async function generate() {
	Random.seed = parseInt(seedInput.value);

	const size = parseInt(worldSizeInput.value);
	const canvasScale = parseInt(canvasScaleInput.value);
	canvas.width =  size * canvasScale;
  canvas.height = size * canvasScale;

  const chamberPerlin = create2DPerlin(1000, parseFloat(chambers.scale.value));
  const tunnelPerlin = create2DPerlin(50000, parseFloat(tunnels.scale.value));
  const orePerlin = create2DPerlin(9999999, parseFloat(ores.scale.value));
  const rubyPerlin = create2DPerlin(99900909, parseFloat(rubies.scale.value));

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const chamberValue = chambers.method(chamberPerlin(x, y), parseFloat(chambers.threshold.value));
      const tunnelValue = tunnels.method(tunnelPerlin(x, y), parseFloat(tunnels.threshold.value));
      const oreValue = ores.method(orePerlin(x, y), parseFloat(ores.threshold.value));
      const rubyValue = rubies.method(rubyPerlin(x, y), parseFloat(rubies.threshold.value));

      let color = chamberValue ? colors.STONE : colors.AIR;
      if (chamberValue && !tunnelValue)
        color = colors.DIRT;
      if (chamberValue && oreValue)
        color = colors.ORE;
      if (chamberValue && rubyValue)
        color = colors.Ruby;

      ctx.fillStyle = color;
      ctx.fillRect(x * canvasScale, y * canvasScale, canvasScale, canvasScale);
    }
  }
}

const colors = {
  AIR: `rgb(255, 255, 255)`,
  STONE: `rgb(80, 80, 80)`,
  DIRT: `rgb(170, 120, 80)`,
  ORE: `rgb(100, 100, 255)`,
  Ruby: `rgb(255, 100, 100)`,
}

generate();
