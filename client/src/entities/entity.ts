import { Component, Components } from "../components";
import { EntityBlueprint } from "./blueprint";
import { World } from "./world";

export class Entity {
	id = -1;
	world!: World;
	components: Component[] = [];

	fireEvent(type: string, params = {}) {
		for (const component of this.components) {
			component[type]?.(params)
		}
	}

	addComponent(componentId, props = {}) {
		componentId = componentId.COMPONENT_ID ?? componentId;
		const Component = Components[componentId]
		if (!Component)
			throw `Component not found '${componentId}'`;
		const component = new Component();
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
	getComponentByTypeId<T>(componentTypeId: string): T {
		return this.components.find((component) => componentTypeId === component.constructor["COMPONENT_ID"]) as T;
	}

	static serialize(entity: Entity): object {
		const data = {};
		for (const component of entity.components) {
			const serialize = component.constructor["serialize"];
			if (serialize)
				data[component.constructor["COMPONENT_ID"]] = serialize(component);
		}
		return data;
	}

	static deserialize(entity: Entity, data: object) {
		for (const key in data) {
			const componentData = data[key];
			const component = entity.getComponentByTypeId<Component>(key);
			const deserialize = component?.constructor?.["deserialize"];
			if (!deserialize) {
				console.warn(`Couldn't deserialize ${key}: ${JSON.stringify(componentData)}`);
				continue;
			}
			deserialize(component, componentData);
		}
	}
}

export const EntitiesBlueprints: {[key: string]: (world: World) => Entity } = {}

export function registerEntity(blueprint: EntityBlueprint) {
	EntitiesBlueprints[blueprint.id] = (world: World): Entity => {
		const entity = new Entity();
		entity.world = world;
		
		for (const {type, props} of blueprint.components) {
			const component = entity.addComponent(Components[type], props);
			component.parent = entity;
			component.world = world;
		}

		return entity;
	}
	console.log(`Entity "${blueprint.id}" registered`);
}
