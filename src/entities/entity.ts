import { Component, Components } from "../components";
import { Event } from "../events";
import { EntityBlueprint } from "./blueprint";
import { World } from "./world";

export class Entity {
	world!: World;
	components: Component[] = [];

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
		if (!this.world._components[componentId])
			this.world._components[componentId] = [];
		this.world._components[componentId].push(component)
		return component;
	}

	removeComponent(component: Component) {
		const index = this.components.findIndex((c) => c === component)
		if (index < 0)
			return;
		this.components.splice(index, 1);
		
		const componentId = component.constructor.name;
		const worldIndex = this.world._components[componentId]?.findIndex((c) => c === component);
		if (worldIndex >= 0)
			this.world._components[componentId]?.splice(worldIndex, 1);
	}

	getComponent<T>(componentType: new () => T): T {
		return this.components.find((component) => componentType.name === component.constructor.name) as T;
	}
}

export const Entities: {[key: string]: (world: World) => Entity } = {}

export function registerEntity(blueprint: EntityBlueprint) {
	Entities[blueprint.id] = (world: World): Entity => {
		const entity = new Entity();
		entity.world = world;
		for (const {type, props} of blueprint.components) {
			const component = entity.addComponent(type, props);
			component.parent = entity;
			component.world = world;
		}
		return entity;
	}
}