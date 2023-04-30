import { GameConfig } from "../config";
import { TileType, generateCave } from "./caves";
import { generateFeatures } from "./features";

export const TestCave = [
	"0000000000000000000000000",
	"0000000000000000000000000",
	"0000000000000000000000000",
	"0000000000000000000000000",
	"0000000000000000000000000",
	"0000000000000000000000000",
	"0000111100000000000000000",
	"0000100111100000000000000",
	"0000110000000000000000000",
	"0000011110000011100000000",
	"0000000011000000100000000",
	"0000000001111111100000000",
	"0000000000000000000000000",
].map((line) => line.split("").map((v) => parseInt(v)));

export type World = TileType[][];

export function generateWorld() {
	const map = generateCave();
	generateFeatures(map);
	return map;
}
