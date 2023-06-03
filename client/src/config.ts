import { IVector2 } from "@dig/math";
import * as PIXI from "pixi.js";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

const gridSize = 16;
const chunkSize = 16;

export const GameConfig = {
	gridSize,
	chunkSize: chunkSize * gridSize,
	gravity: 0.1,
	maxFallSpeed: 1.5,
	renderLayers: [
		"farBackground",
		"background",
		"default",
		"entity",
		"tile",
		"foreground",
		"farForeground",
		"UI",
	]
} as const

export type RenderLayerKey = typeof GameConfig.renderLayers[number];  

export const AppConfig = {
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