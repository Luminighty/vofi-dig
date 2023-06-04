import { TileGenerator, TileType } from "./caves";
import { Features } from "./features";

export type World = TileType[][];

interface WorldGeneratorProps {
	chunkSize?: number;
}

export class WorldGenerator {
	private chunkSize;
	private tileGenerator = new TileGenerator();

	constructor(props: WorldGeneratorProps = {}) {
		this.chunkSize = props.chunkSize ?? 16;
	}

	getChunk(chunkX, chunkY): World {
		const tiles = this.generateTiles(chunkX, chunkY);
		this.generateFeatures(tiles, chunkX, chunkY);
		return tiles;
	}

	private generateTiles(chunkX, chunkY) {
		return Array(this.chunkSize).fill(0).map((_, y) =>
			Array(this.chunkSize).fill(0).map((_, x) => {
				return this.tileGenerator.generate(chunkX * this.chunkSize + x, chunkY * this.chunkSize + y)
			})
		);
	}

	private generateFeatures(tiles: World, chunkX, chunkY) {
		for (const feature of Features)
			tiles = feature(tiles, chunkX, chunkY);
	}
}

export { TileType } from "./caves";