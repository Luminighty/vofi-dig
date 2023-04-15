import { Application, Container } from "pixi.js";
import { Entities, Entity } from "./entity";
import { Event, baseEvent } from "../events";
import { GameConfig, RenderLayer } from "../config";
import { Component } from "../components";
import { IEntityFilter } from "./filter";

type Constructor<T> = new (...args: any[]) => T;

type ComponentTypeTuple<T extends Constructor<any>[]> = {
  [K in keyof T]: T[K] extends Constructor<infer V> ? V[] : never
};

export class World {
	app!: Application
	renderContainers!: {[key in RenderLayer]: Container};

	entities: Entity[] = [];
	components: {[key: string]: Component[]} = {};
	filters: IEntityFilter[] = [];

	fireEvent(event: Event) {
		for (const entity of this.entities) {
			entity.fireEvent(event);
		}
	}

	addEntity (entityId: string, props: any = {}): Entity {
		const entity = Entities[entityId](this);
		this.entities.push(entity);
		entity.fireEvent(baseEvent("onInit", props));
		entity.fireEvent(baseEvent("onLateInit", props));
		return entity;
	}

	removeEntity(entity: Entity) {
		const index = this.entities.findIndex((e) => e === entity);
		if (index < 0)
			return;
		entity.fireEvent(baseEvent("onDestroy"));
		entity.removeAllComponents();
		this.entities.splice(index, 1);
	}

	withFilter(filter: IEntityFilter) {
		this.filters.push(filter);
		return this;
	}
	queryEntity<T extends Constructor<any>[]>(...componentTypes: T): ComponentTypeTuple<T> {
		const componentGroups = componentTypes.map((c) => this.components[c["COMPONENT_ID"]] ?? []);

		for (const filter of this.filters)
			filter(componentTypes, componentGroups);
		this.filters = [];
		// 
		if (componentGroups.length === 0)
			return [...componentTypes.map(() => [])] as ComponentTypeTuple<T>;
		if (componentGroups.length === 1)
			return componentGroups as ComponentTypeTuple<T>;

		let smallestGroup = componentGroups[0];
		for (const group of componentGroups) {
			if (group.length < smallestGroup.length)
				smallestGroup = group;
		}
		if (smallestGroup.length === 0)
			return [...componentTypes.map(() => [])] as ComponentTypeTuple<T>;
		
		const possibleEntities = smallestGroup.map((component) => component.parent);
		const res = possibleEntities
			.map((entity) => componentTypes.map((type) => entity!.getComponent(type)))
			.filter((components) => components.every((c) => c));
		return transpose(res) as ComponentTypeTuple<T>;
	}
}

export function createWorld(app: Application): World {
	const renderContainers = {} as {[key in RenderLayer]: Container};
	GameConfig.renderLayers.forEach((layer) => { 
		const container = new Container(); 
		app.stage.addChild(container);
		renderContainers[layer] = container;
	});
	const world = new World();
	world.renderContainers = renderContainers;
	world.app = app;
	return world;
}

function transpose(arr) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}