import { GameConfig } from "../config";
import { Entity } from "../entities";
import { baseEvent } from "../events";
import { IVector2 } from "../math";
import { Serializable } from "../network";

@Serializable("x", "y")
export class PositionComponent {
	static readonly COMPONENT_ID = "PositionComponent" as const;

	parent!: Entity;

	localX = 0;
	localY = 0;
	chunkX = 0;
	chunkY = 0;

	onInit({x, y}) {
		this.x = x;
		this.y = y;
	}

	onLateInit() {
		this.parent.fireEvent(baseEvent("onPositionChanged", { ...this.position }))
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
		if (lastChunkX !== this.chunkX || lastChunkY !== this.chunkY)
			this.parent.fireEvent(baseEvent("onChunkChanged", { ...this.chunk }));
		this.parent.fireEvent(baseEvent("onPositionChanged", { ...this.position }))
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
	get y() { return this.localY + this.chunkY * GameConfig.chunkSize; }
	set x(x) { 
		this.localX = x % GameConfig.chunkSize;
		this.chunkX = Math.trunc(x / GameConfig.chunkSize);
	}
	set y(y) { 
		this.localY = y % GameConfig.chunkSize;
		this.chunkY = Math.trunc(y / GameConfig.chunkSize);
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
