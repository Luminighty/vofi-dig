import { World } from "../../entities";
import { OnChunk } from "../../entities/filter";
import { baseEvent } from "../../events";
import { ChunkHandlerComponent } from "../ChunkHandler.component";
import { PositionComponent } from "../Position.component";

export class ChunkLoaderComponent {
	static readonly COMPONENT_ID = "ChunkLoaderComponent" as const;
	world!: World;
	maxChunkDistance = 2;
	chunkHandler!: ChunkHandlerComponent;

	onInit() {
		if (!this.isMain)
			ChunkLoaderComponent.main = this;
		this.chunkHandler = this.world.querySingleton(ChunkHandlerComponent);
	}

	get isMain() { return ChunkLoaderComponent.main === this; }

	set isMain(value) {
		if (value)
			ChunkLoaderComponent.main = this;
	}

	updateAllChunks({x, y}) {
		const [positions] = this.world
			.queryEntity(PositionComponent);

		let count = 0;
		for (const position of positions) {
			const delta = Math.max(Math.abs(position.chunkX - x), Math.abs(position.chunkY - y));
			if (delta > this.maxChunkDistance) {
				position.parent.fireEvent(baseEvent("onUnload"));
				count++;
			} else {
				position.parent.fireEvent(baseEvent("onLoad"));
			}
		}
		console.log(`Unloaded ${count}/${positions.length}`);
	}

	onChunkChanged({x, y}) {
		this.chunkHandler.setActiveChunk(x, y);
		const [positions] = this.world
			.withFilter(OnChunk(x, y, this.maxChunkDistance + 2))
			.queryEntity(PositionComponent);

		for (const position of positions) {
			const shouldUnload = Math.max(Math.abs(position.chunkX - x), Math.abs(position.chunkY - y)) > this.maxChunkDistance;
			if (shouldUnload) {
				position.parent.fireEvent(baseEvent("onUnload"));
			} else {
				position.parent.fireEvent(baseEvent("onLoad"));
			}
		}
	}

	static main: ChunkLoaderComponent;
}