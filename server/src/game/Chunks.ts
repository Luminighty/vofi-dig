import { IVector2 } from "@dig/math";
import { Entity } from "./Game";
import { PositionToChunk } from "../config";

const toKey = (chunk: IVector2) => `${chunk.x};${chunk.y}`;

export class Chunks {
	chunks: Map<string, Entity[]> = new Map();

	add(entity: Entity) {
		if (!entity.chunk)
			return;
		this.get(entity.chunk).push(entity);
	}

	remove(entity: Entity) {
		if (!entity.chunk)
			return;
		const chunk = this.get(entity.chunk);
		const index = chunk.indexOf(entity);
		if (index > -1)
			chunk.splice(index, 1);
	}

	update(entity: Entity, data) {
		const position = data["PositionComponent"] as IVector2 | null;
		if (!position)
			return;
		const lastChunk = entity.chunk;
		const newChunk = PositionToChunk(position);
		if (lastChunk?.x === newChunk.x && lastChunk?.y === newChunk.y)
			return;
		this.remove(entity);
		entity.chunk = newChunk;
		this.add(entity);
	}

	get(chunk: IVector2): Entity[] {
		const key = toKey(chunk);
		let entry = this.chunks.get(key);
		if (!entry) {
			entry = [];
			this.chunks.set(key, entry);
		}
		return entry;
	}
}