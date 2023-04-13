import { Application, Container } from "pixi.js";
import { Entities, Entity } from "./entity";
import { Event, baseEvent } from "../events";
import { GameConfig } from "../config";
import { Component } from "../components";

type Constructor<T> = new (...args: any[]) => T;

type ComponentTypeTuple<T extends Constructor<any>[]> = {
  [K in keyof T]: T[K] extends Constructor<infer V> ? V[] : never
};

export interface World {
	app: Application,
	entities: Entity[],
	_components: {[key: string]: Component[]},
	renderContainers: {[key: string]: Container},
	fireEvent: (event: Event) => void,
	addEntity: (entityId: string, ...props) => Entity,
	removeEntity: (entity: Entity) => void,
	_removeComponent: (component: Component) => void,
	queryEntity: <T extends Constructor<any>[]>(...componentType: T) => ComponentTypeTuple<T>;
}

export function createWorld(app: Application): World {
	const renderContainers = {};
	GameConfig.renderLayers.forEach((layer) => { 
		const container = new Container(); 
		app.stage.addChild(container);
		renderContainers[layer] = container;
	});
	return {
		app,
		renderContainers,
		entities: [],
		_components: {},
		fireEvent(event) {
			for (const entity of this.entities) {
				entity.fireEvent(event);
			}
		},
		addEntity (entityId, props): Entity {
			const entity = Entities[entityId](this);
			this.entities.push(entity);
			entity.fireEvent(baseEvent("onInit", props ?? {}));
			return entity;
		},
		_removeComponent(component) {
			const componentId = component.constructor.name
			const index = this._components[componentId].findIndex((c) => c === component)
			if (index < 0)
				return;
			this._components[componentId].splice(index, 1);
		},
		removeEntity(entity) {
			const index = this.entities.findIndex((e) => e === entity);
			if (index < 0)
				return;
			entity.fireEvent(baseEvent("onDestroy"));
			entity.components.forEach((c) => this._removeComponent(c));
			this.entities.splice(index, 1);
		},
		queryEntity<T extends Constructor<any>[]>(...componentType: (new() => any)[]): ComponentTypeTuple<T> {
			const componentGroups = componentType.map((c) => this._components[c.name] ?? []);
			if (componentGroups.length === 0)
				return [...componentType.map(() => [])] as ComponentTypeTuple<T>;

			let smallestGroup = componentGroups[0];
			for (const group of componentGroups) {
				if (group.length < smallestGroup.length)
				smallestGroup = group;
			}
			
			const possibleEntities = smallestGroup.map((component) => component.parent);
			const res = possibleEntities
				.map((entity) => componentType.map((type) => entity!.getComponent(type)))
				.filter((components) => components.every((c) => c));
			return transpose(res);
		}
	}
}
function transpose(arr) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}