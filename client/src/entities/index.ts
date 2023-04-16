import { Assets } from "pixi.js";
import { ParseEntity } from "./parser";
import { registerEntity } from "./entity";

export { Entity, registerEntity } from "./entity";
export { World, createWorld } from "./world"

export async function loadEntityBlueprint(path) {
	const entity = await Assets.load(path);
	registerEntity(ParseEntity(entity));
}
