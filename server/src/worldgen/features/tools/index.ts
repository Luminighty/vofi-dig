import { World } from "../.."
import { TileType } from "../../caves"

export class WorldGenTool {
	private fill?: TileType;
	private stroke?: TileType;

	constructor(
		private map: World
	) {}

	setFill(fill: TileType) { this.fill = fill; return this; }
	setStroke(stroke: TileType) { this.stroke = stroke; return this; }
	end() { this.fill = undefined; this.stroke = undefined; }

	drawLine(x: number, y: number, deltaX: number, deltaY: number) {
		if (!this.stroke)
			return this;
		// Make sure that delta is positive always
		if (deltaX < 0) { x += deltaX; deltaX *= -1; }
		if (deltaY < 0) { y += deltaY; deltaY *= -1; }

		const isHorizontal = deltaX > deltaY;
		const widthRatio = deltaX / deltaY;
		const heightRatio = deltaY / deltaX;
		const iteration = Math.max(deltaX, deltaY);
		const ratio = Math.min(widthRatio, heightRatio);

		let offset = 0;
		let offsetRemainder = 0;
		for (let i = 0; i < iteration; i++) {
			const currentX = isHorizontal ? (x + i) : (x + offset);
			const currentY = isHorizontal ? (y + offset) : (y + i);
			this.set(currentX, currentY, this.stroke);
			offsetRemainder += ratio;
			if (offsetRemainder >= 1.0) {
				offset += Math.floor(offsetRemainder);
				offsetRemainder %= 1;
			}
		}
		return this;
	}

	set(x: number, y: number, tile: TileType) {
		if (!this.map[y])
			this.map[y] = [];
		this.map[y][x] = tile;
	}

	drawRect(x: number, y: number, width: number, height: number) {
		if (this.fill)
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				this.set(x + i, y + j, this.fill);
			}
		}

		if (this.stroke) {
			for (let i = 0; i < width; i++) {
				this.set(x + i, y, this.stroke);
				this.set(x + i, y + height - 1, this.stroke);
			}
			for (let j = 0; j < height; j++) {
				this.set(x, y + j, this.stroke);
				this.set(x + width - 1, y + j, this.stroke);
			}
		}
		return this;
	}

}
