import { IVector2 } from "@dig/math";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";

export class ChunkHandlerComponent {
	static readonly COMPONENT_ID = "ChunkHandlerComponent" as const;
	unloadDistance = 4;
	loadDistance = 2;
	activeChunk?: IVector2;
	chunks: Map<string, PositionComponent[]> = new Map();
	world!: World;

	async setActiveChunk(x: number, y: number) {
		if (this.activeChunk?.x === x && this.activeChunk?.y === y)
			return;
		this.unloadChunks(x, y);
		this.loadChunks(x, y);
		this.activeChunk = {
			x, y
		};
	}

	private unloadChunks(x, y) {
		for(const [key, chunk] of this.chunks.entries()) {
			const [chunkX, chunkY] = ChunkHandlerComponent.keyToChunkPosition(key);
			const delta = Math.abs(chunkX - x) + Math.abs(chunkY - y);
			if (delta < this.unloadDistance)
				continue;
			unloadChunkTask(this.world, chunk);
			this.chunks.delete(key);
		}
	}

	private loadChunks(x, y) {
		for (let i = -this.loadDistance; i <= this.loadDistance; i++)
		for (let j = -this.loadDistance; j <= this.loadDistance; j++) {
			const chunkX = i + x;	
			const chunkY = j + y;	
			const key = ChunkHandlerComponent.key(chunkX, chunkY);
			if (this.chunks.has(key))
				continue;
			this.chunks.set(key, []);
			this.world.networkHandler.getChunk(chunkX, chunkY);
		}
	}

	get(chunkX: number, chunkY: number) {
		const key = ChunkHandlerComponent.key(chunkX, chunkY);
		let chunk = this.chunks.get(key);
		if (!chunk) {
			chunk = [];
			this.chunks.set(key, chunk);
		}
		return chunk;
	}

	add(position: PositionComponent, chunkX: number, chunkY: number) {
		this.get(chunkX, chunkY).push(position);
	}

	remove(position: PositionComponent, chunkX: number, chunkY: number) {
		const chunk = this.get(chunkX, chunkY);
		const index = chunk.indexOf(position);
		if (index > -1)
			chunk.splice(index, 1);
	}

	static key(chunkX: number, chunkY: number) {
		return `${chunkX},${chunkY}`;
	}

	static keyToChunkPosition(key: string) {
		return key.split(",").map((value) => parseInt(value));
	}

}

function unloadChunkTask(world: World, chunk: PositionComponent[], offset = 0) {
	requestIdleCallback((deadline) => {
		let i;
		for (i = offset; i < chunk.length; i++) {
			if (!(deadline.timeRemaining() > 0 || deadline.didTimeout))
				break;
			world.removeEntity(chunk[i].parent);
		}
		if (i < chunk.length)
			unloadChunkTask(world, chunk, i);
	})
}