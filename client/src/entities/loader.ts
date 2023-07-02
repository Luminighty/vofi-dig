import { IProgressCallback, ILoadingBar } from "../dialogs/LoadingBar";
import { EntityBlueprint } from "./blueprint";
import { registerEntity } from "./entity";
import { ParseEntity } from "./parser";

let blueprints: { [key: string]: EntityBlueprint } = {};

export async function loadEntityBlueprintRegistry(loadingBar: ILoadingBar) {
	await registerEntityBlueprints(loadingBar.withLabel("Registering Entities"));
	postProcessBlueprints(loadingBar.withLabel("Processing Entities"));
	registerBlueprints();
	blueprints = {};
}

async function loadEntityBlueprint(id) {
	const xml = await (await fetch(`assets/entity/${id}`)).text();
	const entity = ParseEntity(xml);
	blueprints[entity.id] = entity;
}

async function registerEntityBlueprints(update: IProgressCallback) {
	let progress = 0;
	const entities = await (await fetch("/assets/entity")).json();
	return Promise.all(
		entities.map((file) => 
			loadEntityBlueprint(file)
				.then(() => update(++progress, entities.length))
		)
	)
}

let currentUnwrapBlueprints = {};
function unwrapIncludes(blueprint: EntityBlueprint) {
	if (currentUnwrapBlueprints[blueprint.id]) {
		const entityDependencies = Object.keys(currentUnwrapBlueprints)
			.filter((key) => currentUnwrapBlueprints[key])
		throw new Error(`Circular dependecy in entity blueprints: ${JSON.stringify(entityDependencies)}`);
	}
	
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

function postProcessBlueprints(update: IProgressCallback) {
	const values = Object.values(blueprints);
	let progress = 0;
	values.forEach((blueprint) => {
			unwrapIncludes(blueprint);
			update(++progress, values.length);
		});
	currentUnwrapBlueprints = {};
}

function registerBlueprints() {
	Object.values(blueprints)
		.forEach((blueprint) => registerEntity(blueprint));
}
