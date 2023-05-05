import { Entity, World } from "../entities";

export interface Component {
	parent?: Entity,
	world?: World,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any,
}

export interface ComponentConstructor {
	new (): Component,
	COMPONENT_ID: string,
}

export const Components: { [key: string]: ComponentConstructor} = {};

export function registerComponent(component: ComponentConstructor) {
	if (Components[component.COMPONENT_ID])
		throw { message: `Component ${component.COMPONENT_ID} already exists.`, other: Components[component.COMPONENT_ID], component }		
	Components[component.COMPONENT_ID] = component;
	console.log(`Component '${component.COMPONENT_ID}' registered`);
}
