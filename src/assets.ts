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
				[TileType.Air]: `assets/air.png`,
				[TileType.Dirt]: `assets/dirt.png`,
				[Sprites.Miner]: `assets/miner.png`,
				[Sprites.Gem]: `assets/gem.png`,
			}
		}
	]
}
