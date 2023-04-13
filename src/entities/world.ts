import { Application } from "pixi.js";
import { Entities, Entity } from "./entity";
import { Event, baseEvent } from "../events";

export interface World {
	app: Application,
	entities: Entity[],
	fireEvent: (event: Event) => void,
	addEntity: (entityId: string, ...props) => Entity,
	removeEntity: (entity: Entity) => void,
}

export function createWorld(app: Application): World {
	return {
		app,
		entities: [],
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
		removeEntity(entity) {
			const index = this.entities.findIndex((e) => e === entity);
			if (index < 0)
				return;
			this.entities.splice(index, 1);
		}
	}
}