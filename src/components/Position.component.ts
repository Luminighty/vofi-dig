import { GameConfig } from "../config";

export class PositionComponent {
	x = 0;
	y = 0;

	onInit({x, y}) {
		this.x = x;
		this.y = y;
	}

	onMove({x, y}) {
		this.x += x ?? 0;
		this.y += y ?? 0;
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
