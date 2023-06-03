import { TileGenerator, TileType, generateCave } from "./caves";
import { generateFeatures } from "./features";

export type World = TileType[][];

export function generateWorld(width, height) {
	const map = generateCave(width, height);
	generateFeatures(map);
	return map;
}

interface WorldGeneratorProps {
	chunkSize?: number;
}

export class WorldGenerator {
	private chunkSize;
	private tileGenerator = new TileGenerator();

	constructor({chunkSize}: WorldGeneratorProps = {}) {
		this.chunkSize = chunkSize ?? 16;
	}

	getChunk(chunkX, chunkY): World {
		return Array(this.chunkSize).fill(0).map((_, y) =>
			Array(this.chunkSize).fill(0).map((_, x) => {
				return this.tileGenerator.generate(chunkX * this.chunkSize + x, chunkY * this.chunkSize + y)
			}));
	}
}

export { TileType } from "./caves";