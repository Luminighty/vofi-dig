import { TileType } from "./caves";

export class Chunk {
	static chunkSize = 16;
	public tiles: TileType[][] = [];

	constructor(
		public x: number,
		public y: number,
	) { }

	setTile(x: number, y: number, tile: TileType) {
		try {
			this.tiles[y][x] = tile;
		} catch (error) {
			console.error(this.tiles.length);
			console.error({x, y});
			throw error;
		}
	}

	getTile(x: number, y: number): TileType {
		return this.tiles[y][x];
	}

	get topLeft() {
		return {
			x: this.x * Chunk.chunkSize, 
			y: this.y * Chunk.chunkSize 
		};
	}

	get bottomRight() {
		return {
			x: (this.x + 1) * Chunk.chunkSize - 1, 
			y: (this.y + 1) * Chunk.chunkSize - 1 
		}
	}

}