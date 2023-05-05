import { TileType, generateCave } from "./caves";
import { generateFeatures } from "./features";

export type World = TileType[][];

export function generateWorld() {
	const map = generateCave();
	generateFeatures(map);
	return map;
}
