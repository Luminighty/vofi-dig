import * as PIXI from "pixi.js";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export const GameConfig = {
	gridSize: 16,
	gravity: 0.1,
	maxFallSpeed: 1.5,
	world: {
		x: 120,
		y: 60,
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
} as const

export type RenderLayer = typeof GameConfig.renderLayers[number];  

export const AppConfig = {
	width: GameConfig.gridSize * GameConfig.world.x,
	height: GameConfig.gridSize * GameConfig.world.y,
	backgroundColor: 0x303030,
	scale: 3,
}
