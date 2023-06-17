import { Random } from "@dig/math";
import { Number, RenderLayer, Slider } from "../utils"
import { Perlin2D, create2DPerlin } from "../../src/perlin";
import { createNoise2D } from "simplex-noise";

export function init() {


  const canvas = document.body.appendChild(document.createElement("canvas"));
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

	const renderNoise = RenderLayer(canvas, ctx, (canvas, context) => {
		
	});

	const renderTrees = RenderLayer(canvas, ctx, (canvas, context) => {
		
	});

  Random.seed = 0;
  const seedInput = Number(document.body, "Seed", generate);
  
  const worldSizeInput = Number(document.body, "Size", generate, {value: 100});
  const canvasScaleInput = Number(document.body, "Canvas Scale", generate, {value: 2});
  const treeAmountInput = Number(document.body, "Tree Amount", generate, {value: 2});
  const treeDistanceInput = Number(document.body, "Tree Min Distance", generate, {value: 2});
  const treeSizeInput = Number(document.body, "Tree Size", generate, {value: 2});
  const treeVarianceInput = Number(document.body, "Tree Variance", generate, {value: 2});
  const densityVariance = Number(document.body, "Density Variance", generate, {value: 2});
  const density = {
    scale: Slider(document.body, "Density Scale", generate, { min: 0.001, max: 0.2, step: 0.001, value: 0.05 }),
  };
	let densityScale = parseFloat(density.scale.value);
	const densityNoise = createNoise2D(Random.get.bind(Random));

	function getNoise(x, y) {
		return (densityNoise(x * densityScale, y * densityScale) + 1) / 2
	}

	function renderNoiseMap(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const v = getNoise(x, y);
				const color = v * 256;
				ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
				ctx.fillRect(x * canvasScale, y * canvasScale, canvasScale, canvasScale);
			}
		}
	}

  
  let generating = false;
  async function generate() {
    if (generating)
      return;
    generating = true;
  
    requestIdleCallback(() => {
      Random.seed = parseInt(seedInput.value);
			Random.position = 0;
    
      const size = parseInt(worldSizeInput.value);
      const canvasScale = parseInt(canvasScaleInput.value);
      canvas.width =  size * canvasScale;
      canvas.height = size * canvasScale;
    
			const treeCount = parseInt(treeAmountInput.value);
			const minDistance = parseFloat(treeDistanceInput.value);
			const minDistanceSquared = minDistance * minDistance;

			const minTreeSize = parseInt(treeSizeInput.value);
			const treeSizeVariance = parseInt(treeVarianceInput.value);

			interface Tree { x: number, y: number, size: number }
			const trees: Tree[] = [];
			densityScale = parseFloat(density.scale.value);


			function generateTree(trees: Tree[]): Tree | null {
				const treeSize = Random.get() * treeSizeVariance + minTreeSize;
				let iteration = 0;
				while (iteration++ < 10) {
					const x = Random.get() * size;
					const y = Random.get() * size;
					const densityValue = getNoise(x, y) * parseFloat(densityVariance.value);
					let isTooClose = false;
					for (const otherTree of trees) {
						const distance = Math.abs(otherTree.x - x) + Math.abs(otherTree.y - y);
						const distanceSquared = distance * distance;
						isTooClose = distanceSquared < minDistanceSquared + densityValue * densityValue;
						const range = treeSize + otherTree.size;
						isTooClose = isTooClose || distanceSquared <= range * range;
						if (isTooClose)
							break;
					}
					if (!isTooClose)
						return {size: treeSize, x, y}
				}
				return null;
			}

			for (let i = 0; i < treeCount; i++) {
				const tree = generateTree(trees);
				if (tree)
					trees.push(tree);
			}

			ctx.fillStyle = "lime";
			for (const tree of trees) {
				ctx.beginPath();
				ctx.arc(tree.x * canvasScale, tree.y * canvasScale, tree.size * canvasScale, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
			}

      generating = false;
    })
	}

	generate();
}