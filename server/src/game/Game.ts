import { TileType, WorldGenerator } from "@dig/worldgen";
import { GameConfig, PositionToChunk } from "../config";
import { getId } from "./id";
import { Chunks } from "./Chunks";

export class Game {
	spawn = { x: GameConfig.chunkSize / 2, y: GameConfig.chunkSize / 2 };
	private entities: Map<number, Entity> = new Map();
	private chunks = new Chunks();
	private generatedChunks: Set<string> = new Set();
	private worldgen: WorldGenerator = new WorldGenerator({chunkSize: 16});
	

	constructor() {
		this.initMap();
	}

	generateChunk(chunkX, chunkY) {
		if (this.generatedChunks.has(`${chunkX};${chunkY}`))
			return;
		this.generatedChunks.add(`${chunkX};${chunkY}`);
		const tiles = this.worldgen.getChunk(chunkX, chunkY);
		const gridSize = GameConfig.gridSize;
		for (let y = 0; y < tiles.length; y++) {
			const row = tiles[y];
			for (let x = 0; x < row.length; x++) {
				const tile = row[x];
				if (tile == TileType.None)
					continue;
				const props = {
					x: x * gridSize + chunkX * GameConfig.chunkSize,
					y: y * gridSize + chunkY * GameConfig.chunkSize,
				};
				this.createEntity(tile, props);
			}
		}
	}

	initMap() {
		const spawnSize = 2;
		for (let i = -spawnSize; i <= spawnSize; i++)
		for (let j = -spawnSize; j <= spawnSize; j++)
			this.generateChunk(i, j);
		this.createEntity("Torch", { x: 0, y: 0 });
	}


	createEntity(type, props, owner?): Entity {
		const id = getId();
		const entity: Entity = {
			id,
			blueprintId: type,
			props,			
			owner
		}
		if (props.x !== null && props.y !== null)
			entity.chunk = PositionToChunk(props);
		this.entities.set(id, entity);
		this.chunks.add(entity);
		return entity;
	}

	updateEntity(id, data) {
		const entity = this.entities.get(id);
		if (!entity) {
			console.warn(`Entity ${id} not found`);
			return;
		}
		this.chunks.update(entity, data);
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

	forEachEntities(callback: (entity: Entity) => void) {
		this.entities.forEach(callback);
	}

	getById(id): Entity | undefined {
		return this.entities.get(id)
	}

	getEntitiesOnChunk(x: number, y: number) {
		if (!this.generatedChunks.has(`${x};${y}`))
			this.generateChunk(x, y);
		return this.chunks.get({x, y});
	}

	deleteById(id) {
		const entity = this.getById(id);
		if (entity)
			this.chunks.remove(entity)
		this.entities.delete(id);
	}
}

export type EntityId = number;

export interface Entity {
	id: EntityId,
	owner?: string,
	blueprintId: string,
	props: object,
	chunk?: {
		x: number,
		y: number,
	}
}
