import { TileGenerator, TileType } from "./caves";
import { Chunk } from "./chunk";
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
		const chunk = new Chunk(chunkX, chunkY);
		this.generateTiles(chunk);
		this.generateFeatures(chunk);
		return chunk.tiles;
	}

	private generateTiles(chunk: Chunk) {
		chunk.tiles = Array(this.chunkSize).fill(0).map((_, y) =>
			Array(this.chunkSize).fill(0).map((_, x) => {
				return this.tileGenerator.generate(chunk.x * this.chunkSize + x, chunk.y * this.chunkSize + y)
			})
		);
	}

	private generateFeatures(chunk: Chunk) {
		for (const feature of Features)
			feature(chunk);
	}
}

export { TileType } from "./caves";