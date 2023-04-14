import type { ResolverManifest } from "pixi.js";

export enum TileType {
	Air = "TILE_AIR",
	Dirt = "TILE_DIRT",
}

export enum Sprites {
	Miner = "MINER",
	Gem = "GEM",
}

export const assetsManifest: ResolverManifest = {
	bundles: [
		{
			name: "ALL",
			assets: {
				[TileType.Air]: `assets/textures/air.png`,
				[TileType.Dirt]: `assets/textures/dirt.png`,
				[Sprites.Miner]: `assets/textures/miner.png`,
				[Sprites.Gem]: `assets/textures/gem.png`,
			}
		}
	]
}
