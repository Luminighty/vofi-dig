import * as PIXI from "pixi.js";
import { IVector2 } from "./math";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

const gridSize = 16;
const chunkSize = 16;

export const GameConfig = {
	gridSize,
	chunkSize: chunkSize * gridSize,
	gravity: 0.1,
	maxFallSpeed: 1.5,
	world: {
		x: 300,
		y: 300,
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
	backgroundColor: 0x000005,
	scale: 3,
}

export function PositionToChunk(position: IVector2) {
	return {
		x: Math.floor(position.x / GameConfig.chunkSize),
		y: Math.floor(position.y / GameConfig.chunkSize),
	}
}

export function PositionToTile(position: IVector2) {
	return {
		x: Math.floor(position.x / GameConfig.gridSize),
		y: Math.floor(position.y / GameConfig.gridSize),
	}
}