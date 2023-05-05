import { Assets } from "pixi.js";
import { ParseEntity } from "./parser";
import { registerEntity } from "./entity";
import { EntityBlueprint } from "./blueprint";
import { registerEntityBlueprints } from "./registry";

export { Entity, registerEntity } from "./entity";
export { World, createWorld } from "./world"

let blueprints: { [key: string]: EntityBlueprint } = {};

export async function loadEntityBlueprint(path) {
	const xml = await Assets.load(path);
	const entity = ParseEntity(xml);
	blueprints[entity.id] = entity;
}

let currentUnwrapBlueprints = {};
function unwrapIncludes(blueprint: EntityBlueprint) {
	if (currentUnwrapBlueprints[blueprint.id])
		throw new Error(`Circular dependecy in entity blueprints: ${JSON.stringify(currentUnwrapBlueprints)}`);
	
	currentUnwrapBlueprints[blueprint.id] = true;
	blueprint.components
		.filter((component) => component.type === "Include")
		.map((component) => {
			const other = blueprints[component.props["from"]]
			if (!other) {
				throw new Error(`Couldn't find entity "${component.props["from"]}" to include in "${blueprint.id}"`)
			}
			unwrapIncludes(other); // Make sure that the blueprint doesn't have Include anymore
			return other;
		})
		.forEach((other) => 
			other.components.forEach((otherComponent) => {
				const component = blueprint.components.find((c) => c.type === otherComponent.type);
				if (!component) {
					blueprint.components.push(otherComponent);
					return;
				}
				// Original props should take precedence
				component.props = {
					...otherComponent.props,
					...component.props,
				};
			})
		);

	blueprint.components = blueprint.components.filter((component) => component.type !== "Include");
	currentUnwrapBlueprints[blueprint.id] = false;
}

function postProcessBlueprints() {
	Object.values(blueprints)
		.forEach((blueprint) => unwrapIncludes(blueprint));
	currentUnwrapBlueprints = {};
}

function registerBlueprints() {
	Object.values(blueprints)
		.forEach((blueprint) => registerEntity(blueprint));
}

export async function loadEntityBlueprintRegistry() {
	await registerEntityBlueprints();
	console.log(blueprints);
	console.log(Object.values(blueprints));
	postProcessBlueprints();
	registerBlueprints();
	console.log(blueprints);
	blueprints = {};
}