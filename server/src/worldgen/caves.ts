import { GameConfig } from "../config";
import { Random } from "../math/random";
import { create2DPerlin } from "./perlin";


const ITERATIONS = 5;
const SMOOTH_ITERS = 1;
const EMPTY_CHANCE = 0.3;

function generateTile() {
	return Math.random() > EMPTY_CHANCE ? 1 : 0;
}

export enum TileType {
	None = "None",
	Stone = "Stone",
	Iron = "Iron",
	Ruby = "Ruby",
	Dirt = "Dirt",
}

const onGrey = (value, threshold) => Math.abs(value) > threshold;
const onHigh = (value, threshold) => value > threshold;
const onLow = (value, threshold) => value < threshold;


export type Cave = TileType[][];

const config = {
	ground: { scale: 0.1, threshold: -0.22, method: onHigh },
	dirt: { scale: 0.15, threshold: -0.35, method: onHigh },
	tunnel: { scale: 0.060, threshold: 0.035, method: onGrey },
	ore: { scale: 0.15, threshold: -0.47, method: onLow },
	ruby: { scale: 0.15, threshold: -0.47, method: onLow },
};

export function generateCave() {
	Random.seed = 0;
	const groundPerlin = create2DPerlin(Random.getSeed(), config.ground.scale);
	const tunnelPerlin = create2DPerlin(Random.getSeed(), config.tunnel.scale);
	const orePerlin = create2DPerlin(Random.getSeed(), config.ore.scale);
	const rubyPerlin = create2DPerlin(Random.getSeed(), config.ruby.scale);
	const dirtPerlin = create2DPerlin(Random.getSeed(), config.dirt.scale);

	const cols = GameConfig.world.x;
	const rows = GameConfig.world.y;
	return Array(rows).fill(0).map((_, y) =>
		Array(cols).fill(0).map((_, x) => {
      const chamberValue = config.ground.method(groundPerlin(x, y), config.ground.threshold);
      const dirtValue = config.dirt.method(dirtPerlin(x, y), config.dirt.threshold);
      const tunnelValue = config.tunnel.method(tunnelPerlin(x, y), config.tunnel.threshold);
      const oreValue = config.ore.method(orePerlin(x, y), config.ore.threshold);
      const rubyValue = config.ruby.method(rubyPerlin(x, y), config.ruby.threshold);
			if (!chamberValue)
				return TileType.None;
			if (!dirtValue)
				return TileType.Dirt;
      if (!tunnelValue)
        return TileType.Dirt;
      if (oreValue)
				return TileType.Iron;
      if (rubyValue)
				return TileType.Ruby;
			return TileType.Stone;
		}));
}

// export function cavesMethod() {


// 	const cols = GameConfig.world.x;
// 	const rows = GameConfig.world.y;
// 	let world: Cave = Array.from({length: rows}, () =>
// 		Array.from({length: cols}, generateTile));
	
// 	for (let i = 0; i < ITERATIONS; i++)
// 		world = step(world);  
// 	for (let i = 0; i < SMOOTH_ITERS; i++)
// 		world = smooth(world);
// 	return world;
// }

// const smooth = (world: Cave) => applyToCave(world, (world, i, j) => {
// 	let count = countNeighbours(world, i, j);
// 	if (world[i][j])
// 		return count > 1 ? 1 : 0;
// 	return count > 5 ? 1 : 0;
// });

// const step = (world: Cave) => applyToCave(world, (world, i, j) => {
// 	let count = countNeighbours(world, i, j);
// 	let solid = world[i][j];
// 	return ((solid && count > 4) || (!solid && count < 3)) ? 1 : 0
// })

// function countNeighbours(cave: Cave, i: number, j: number) {
// 	let count = 0;
// 	for (let y = -1; y < 2; y++)
// 		for (let x = -1; x < 2; x++)
// 			count += cave[i + y]?.[j + x] ?? 1;
// 	return count;
// }

// function applyToCave(world: Cave, func: (world: Cave, i: number, j: number) => (1 | 0)): Cave {
// 	const newWorld: Cave = [];
// 	for (let i = 0; i < world.length; i++) {
// 		newWorld[i] = [];
// 		for (let j = 0; j < world[i].length; j++) {
// 			newWorld[i][j] = func(world, i, j);
// 		}
// 	}
// 	return newWorld;
// }
