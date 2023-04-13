import { Entity, World } from "../entities";

export interface Component {
	parent?: Entity,
	world?: World,
	[key: string]: any,
}

export interface ComponentConstructor {
	new (): Component,
}

export const Components: { [key: string]: ComponentConstructor} = {};

export function registerComponent(component: ComponentConstructor) {
	if (Components[component.name])
		throw { message: `Component ${component.name} already exists.`, other: Components[component.name], component }		
	Components[component.name] = component;
	console.log(`Component '${component.name}' registered`);
}
