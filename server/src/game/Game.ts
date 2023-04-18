import { GameConfig } from "../config";
import { generateCave } from "../worldgen/caves";
import { getId } from "./id";

export class Game {
	spawn = { x: 0, y: 0 };
	entities: Map<number, Entity> = new Map();

	constructor() {
		this.initMap();
	}

	initMap() {
		const cave = generateCave();
		const gridSize = GameConfig.gridSize;
		this.spawn = {
			x: cave[0].length / 2 * gridSize,
			y: cave[0].length / 2 * gridSize,
		}
		for (let y = 0; y < cave.length; y++) {
			const row = cave[y];
			for (let x = 0; x < row.length; x++) {
				const tile = row[x];
				this.createEntity("Air", {x: x * gridSize, y: y * gridSize});
				if (tile == 0)
					continue;
				if (Math.abs(x - row.length / 2) < 2 && y == Math.ceil(cave.length / 2))
					continue;
				this.createEntity("Dirt", {x: x * gridSize, y: y * gridSize});
			}
		}
		for (let i = 0; i < cave.length; i++) {
			this.createEntity("Bedrock", { x: i * gridSize, y: -gridSize });
			this.createEntity("Bedrock", { y: i * gridSize, x: -gridSize });
			this.createEntity("Bedrock", { x: i * gridSize, y: cave.length * gridSize });
			this.createEntity("Bedrock", { x: cave[i].length * gridSize, y: i * gridSize });
		}
	}


	createEntity(type, props, owner?): Entity {
		const id = getId();
		const entity = {
			id,
			blueprintId: type,
			props,			
			owner
		}
		this.entities.set(id, entity);
		return entity;
	}

	updateEntity(id, data) {
		const entity = this.entities.get(id);
		if (!entity) {
			console.warn(`Entity ${id} not found`);
			return;
		}
		for (const key in data) {
			if (!entity.props[key])
				entity.props[key] = {};
			const props = entity.props[key];
			const componentProps = data[key];
			entity.props[key] = {
				...props,
				...componentProps,
			}
		}
	}

}

export type EntityId = number;

export interface Entity {
	id: EntityId,
	owner?: string,
	blueprintId: string,
	props: object,
}

interface Component {
	type: string,
	props: { [key: string]: any }
}