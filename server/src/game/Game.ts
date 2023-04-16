import { generateCave } from "../worldgen/caves";
import { getId } from "./id";

export class Game {
	entities: Map<number, Entity> = new Map();

	constructor() {
		this.initMap();
		console.log(this.entities.size);
	}

	initMap() {
		const cave = generateCave();

		const gridSize = 16;
		for (let y = 0; y < cave.length; y++) {
			const row = cave[y];
			for (let x = 0; x < row.length; x++) {
				const tile = row[x];
				this.createEntity("Air", {x: x * gridSize, y: y * gridSize});
				if (tile == 0)
					continue;
				if (Math.abs(x - row.length / 2) < 2 && y == Math.ceil(cave.length / 2))
					continue;
				this.createEntity("Tile", {x: x * gridSize, y: y * gridSize});
			}
		}
		for (let i = 0; i < cave.length; i++) {
			this.createEntity("Bedrock", { x: i * gridSize, y: -gridSize });
			this.createEntity("Bedrock", { y: i * gridSize, x: -gridSize });
			this.createEntity("Bedrock", { x: i * gridSize, y: cave.length * gridSize });
			this.createEntity("Bedrock", { x: cave[i].length * gridSize, y: i * gridSize });
		}
	}


	createEntity(type, props) {
		const id = getId();
		const entity = {
			id,
			blueprintId: type,
			props,			
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
		entity.props = {
			...entity.props,
			...data,
		}
	}

}

export type EntityId = number;

export interface Entity {
	id: EntityId,
	blueprintId: string,
	props: object,
}

interface Component {
	type: string,
	props: { [key: string]: any }
}