import { Assets } from "pixi.js";
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
		componentId = componentId.COMPONENT_ID ?? componentId;
		const component = new Components[componentId]();
		for (const key in props) {
			const value = props[key];
			component[key] = value;
		}
		this.components.push(component);
		if (!this.world.components[componentId])
			this.world.components[componentId] = [];
		this.world.components[componentId].push(component)
		return component;
	}

	removeComponent(component: Component) {
		const index = this.components.findIndex((c) => c === component)
		if (index < 0)
			return;
		this.components.splice(index, 1);
		
		const componentId = component.constructor["COMPONENT_ID"];
		const worldIndex = this.world.components[componentId]?.findIndex((c) => c === component);
		if (worldIndex >= 0)
			this.world.components[componentId]?.splice(worldIndex, 1);
	}

	removeAllComponents() {
		for (const component of this.components) {
			const componentId = component.constructor["COMPONENT_ID"];
			const worldIndex = this.world.components[componentId]?.findIndex((c) => c === component);
			if (worldIndex >= 0)
				this.world.components[componentId]?.splice(worldIndex, 1);
		}
		this.components = [];
	}

	getComponent<T>(componentType: new () => T): T {
		return this.components.find((component) => componentType["COMPONENT_ID"] === component.constructor["COMPONENT_ID"]) as T;
	}
}

export const Entities: {[key: string]: (world: World) => Entity } = {}

export function registerEntity(blueprint: EntityBlueprint) {
	Entities[blueprint.id] = (world: World): Entity => {
		const entity = new Entity();
		entity.world = world;
		for (const {type, props} of blueprint.components) {
			const component = entity.addComponent(Components[type], props);
			component.parent = entity;
			component.world = world;
		}
		return entity;
	}
}
