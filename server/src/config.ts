const gridSize = 16;
const chunkSize = 16;

export const GameConfig = {
	gridSize,
	chunkSize: chunkSize * gridSize,
	world: {
		x: 100,
		y: 100,
	},
	get center() {
		return {
			x: this.world.x / 2,
			y: this.world.y / 2,
		}
	}
} as const

export function PositionToChunk(position) {
	return {
		x: Math.floor(position.x / GameConfig.chunkSize),
		y: Math.floor(position.y / GameConfig.chunkSize),
	}
}

export function PositionToTile(position) {
	return {
		x: Math.floor(position.x / GameConfig.gridSize),
		y: Math.floor(position.y / GameConfig.gridSize),
	}
}