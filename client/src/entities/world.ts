import { Application, Container } from "pixi.js";
import { EntitiesBlueprints, Entity } from "./entity";
import { Event, baseEvent } from "../events";
import { GameConfig, RenderLayerKey } from "../config";
import { Component } from "../components";
import { IEntityFilter } from "./filter";
import { NetworkHandler } from "../network";
import { Socket } from "socket.io-client";

type Constructor<T> = new (...args: unknown[]) => T;

type ComponentTypeTuple<T extends Constructor<unknown>[]> = {
  [K in keyof T]: T[K] extends Constructor<infer V> ? V[] : never
};

export class World {
	app!: Application;
	networkHandler!: NetworkHandler;
	renderContainers!: {[key in RenderLayerKey]: Container};
	entities: Entity[] = [];
	components: {[key: string]: Component[]} = {};
	private filters: IEntityFilter[] = [];
	private networkSynced = false;

	fireEvent(event: Event) {
		for (const entity of this.entities) {
			entity.fireEvent(event);
		}
	}

	withNetwork() {
		this.networkSynced = true;
		return this;
	}

	addEntity (entityId: string, props = {}, networkId?: number): Entity {
		if (!EntitiesBlueprints[entityId])
			throw `Entity ${entityId} not found!`;

		const entity = EntitiesBlueprints[entityId](this);
		entity.id = networkId ?? 0;
		if (this.networkSynced)
			this.networkHandler.createEntity(entityId, props, (id) => entity.id = id as number);
		this.networkSynced = false;

		this.entities.push(entity);
		entity.fireEvent(baseEvent("onInit", props));
		entity.fireEvent(baseEvent("onLateInit", props));
		return entity;
	}

	removeEntity(entity: Entity) {
		if (this.networkSynced)
			this.networkHandler.destroyEntity(entity);
		this.networkSynced = false;
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

	queryEntity<T extends Constructor<unknown>[]>(...componentTypes: T): ComponentTypeTuple<T> {
		const componentGroups = componentTypes.map((c) => this.components[c["COMPONENT_ID"]] ?? []);

		for (const filter of this.filters)
			filter(componentTypes, componentGroups);
		this.filters = [];

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
			
		if (componentGroups.length === 0)
			return [...componentTypes.map(() => [])] as ComponentTypeTuple<T>;
		return transpose(res) as ComponentTypeTuple<T>;
	}

	querySingleton<T>(componentType: new (...args: unknown[]) => T): T {
		return this.components[componentType["COMPONENT_ID"]][0] as T;
	}
}

function transpose(arr) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}

export function createWorld(app: Application, socket: Socket): World {
	const renderContainers = {} as {[key in RenderLayerKey]: Container};
	GameConfig.renderLayers.forEach((layer) => { 
		const container = new Container();
		app.stage.addChild(container);
		renderContainers[layer] = container;
	});
	const world = new World();
	world.renderContainers = renderContainers;
	world.app = app;
	world.networkHandler = new NetworkHandler(world, socket);
	return world;
}
