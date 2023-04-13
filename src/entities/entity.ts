import { Component, Components } from "../components";
import { Event } from "../events";
import { EntityBlueprint } from "./blueprint";
import { World } from "./world";

export class Entity {
	components: Component[] = []

	fireEvent(event: Event) {
		for (const component of this.components) {
			event.call(component);
		}
	}

	addComponent(componentId, props = {}) {
		const component = new Components[componentId]();
		for (const key in props) {
			const value = props[key];
			component[key] = value;
		}
		this.components.push(component);
		return component;
	}

	removeComponent(component) {
		const index = this.components.findIndex((c) => c === component)
		if (index < 0)
			return;
			this.components.splice(index, 1);
	}

	getComponent<T>(componentType: new () => T): T {
		return this.components.find((component) => componentType.name === component.constructor.name) as T;
	}
}

export const Entities: {[key: string]: (world: World) => Entity } = {}

export function registerEntity(blueprint: EntityBlueprint) {
	Entities[blueprint.id] = (world: World): Entity => {
		const entity = new Entity();
		for (const {type, props} of blueprint.components) {
			const component = entity.addComponent(type, props);
			component.parent = entity;
			component.world = world;
		}
		return entity;
	}
}