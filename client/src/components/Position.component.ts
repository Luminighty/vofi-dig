import { IVector2 } from "@dig/math";
import { GameConfig } from "../config";
import { Entity, World } from "../entities";
import { Serializable } from "../network";
import { ChunkHandlerComponent } from "./ChunkHandler.component";

@Serializable("x", "y")
export class PositionComponent {
	static readonly COMPONENT_ID = "PositionComponent" as const;
	world!: World;
	parent!: Entity;
	chunkHandler!: ChunkHandlerComponent;

	localX = 0;
	localY = 0;
	chunkX = 0;
	chunkY = 0;

	onInit({x, y}) {
		this.x = x;
		this.y = y;
		this.chunkHandler = this.world.querySingleton(ChunkHandlerComponent);
	}

	onLateInit() {
		this.parent.fireEvent("onPositionChanged", { ...this.position });
		const chunkX = this.chunk.x;
		const chunkY = this.chunk.y;
		if (!isNaN(chunkX) && !isNaN(chunkY))
			this.chunkHandler.add(this, this.chunk.x, this.chunk.y);
	}

	onMove({x, y}) {
		this.position = {
			x: this.x + x ?? 0,
			y: this.y + y ?? 0,
		};
	}

	set position(value: IVector2) {
		const lastChunkX = this.chunkX;
		const lastChunkY = this.chunkY;
		this.x = value.x;
		this.y = value.y;
		if (lastChunkX !== this.chunkX || lastChunkY !== this.chunkY) {
			this.chunkHandler.remove(this, lastChunkX, lastChunkY);
			this.parent.fireEvent("onChunkChanged", { ...this.chunk });
			this.chunkHandler.add(this, this.chunkX, this.chunkY);
		}
		this.parent.fireEvent("onPositionChanged", { ...this.position })
	}

	get position() {
		return {
			x: this.x,
			y: this.y,
		}
	}
	
	get chunk() {
		return {
			x: this.chunkX,
			y: this.chunkY,
		}
	}

	get x() { return this.localX + this.chunkX * GameConfig.chunkSize; }
	set x(x) { 
		this.localX = ((x % GameConfig.chunkSize) + GameConfig.chunkSize) % GameConfig.chunkSize;
		this.chunkX = Math.floor(x / GameConfig.chunkSize);
	}

	get y() { return this.localY + this.chunkY * GameConfig.chunkSize; }
	set y(y) { 
		this.localY = ((y % GameConfig.chunkSize) + GameConfig.chunkSize) % GameConfig.chunkSize;
		this.chunkY = Math.floor(y / GameConfig.chunkSize);
	}

	get grid() {
		return {
			x: this.gridX,
			y: this.gridY,
		}
	}

	get gridX() { return Math.floor(this.x / GameConfig.gridSize); }
	get gridY() { return Math.floor(this.y / GameConfig.gridSize); }
}
