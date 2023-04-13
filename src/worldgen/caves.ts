import { GameConfig } from "../config";

const ITERATIONS = 10;
const SMOOTH_ITERS = 4;
const EMPTY_CHANCE = 0.6;

function generateTile() {
	return Math.random() > EMPTY_CHANCE ? 1 : 0;
}

export type Cave = (1 | 0)[][];

export function generateCave() {

	const cols = GameConfig.world.x;
	const rows = GameConfig.world.y;
	let world: Cave = Array.from({length: rows}, () =>
		Array.from({length: cols}, generateTile));
	
	for (let i = 0; i < ITERATIONS; i++)
		world = step(world);
	for (let i = 0; i < SMOOTH_ITERS; i++)
		world = smooth(world);
	return world;
}


const smooth = (world: Cave) => applyToCave(world, (world, i, j) => {
	let count = countNeighbours(world, i, j);
	if (world[i][j])
		return count > 1 ? 1 : 0;
	return count > 5 ? 1 : 0;
});

const step = (world: Cave) => applyToCave(world, (world, i, j) => {
	let count = countNeighbours(world, i, j);
	let solid = world[i][j];
	return ((solid && count > 4) || (!solid && count < 3)) ? 1 : 0
})

function countNeighbours(cave: Cave, i: number, j: number) {
	let count = 0;
	for (let y = -1; y < 2; y++)
		for (let x = -1; x < 2; x++)
			count += cave[i + y]?.[j + x] ?? 1;
	return count;
}

function applyToCave(world: Cave, func: (world: Cave, i: number, j: number) => (1 | 0)): Cave {
	const newWorld: Cave = [];
	for (let i = 0; i < world.length; i++) {
		newWorld[i] = [];
		for (let j = 0; j < world[i].length; j++) {
			newWorld[i][j] = func(world, i, j);
		}
	}
	return newWorld;

}