import * as PIXI from "pixi.js";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export const GameConfig = {
	gridSize: 16,
	gravity: 0.1,
	maxFallSpeed: 1.5,
	world: {
		x: 25,
		y: 14,
	},
	renderLayers: [
		"farBackground",
		"background",
		"default",
		"entity",
		"tile",
		"foreground",
		"farForeground",
		"UI",
	],
	get center() {
		return {
			x: this.world.x / 2,
			y: this.world.y / 2,
		}
	}
}

export function toWorldPosition(x: number | {x: number, y: number}, y?: number) {
	if (typeof(x) == "object")
		return toWorldPosition(x.x, x.y);
	return {x: x * GameConfig.gridSize, y: (y ?? 0) * GameConfig.gridSize}
}

export const AppConfig = {
	width: GameConfig.gridSize * GameConfig.world.x,
	height: GameConfig.gridSize * GameConfig.world.y,
	backgroundColor: 0x303030,
}
