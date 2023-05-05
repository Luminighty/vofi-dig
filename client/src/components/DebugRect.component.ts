import { Graphics } from "pixi.js";
import { Entity, World } from "../entities";

export class DebugRectComponent {
	static readonly COMPONENT_ID = "DebugRectComponent" as const;
	parent!: Entity;
	world!: World;
	
	offsetX = 0;
	offsetY = 0;

	width!: number;
	height!: number;

	lineWidth = 0;
	lineColor = 0;
	lineAlpha = 0;

	fillColor = 0;
	fillAlpha = 1;
	enabled=1

	graphics!: Graphics;

	onInit() {
		this.graphics = new Graphics();
		this.world.app.stage.addChild(this.graphics);
	}

	onPositionChanged({x, y}) {
		this.drawDebug(x, y);
	}

	drawDebug(x, y) {
		if (!this.enabled)
			return
		this.graphics.clear();
		this.graphics.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha); 
		this.graphics.beginFill(this.fillColor, this.fillAlpha);
		this.graphics.drawRect(
			this.offsetX + (x ?? 0),
			this.offsetY + (y ?? 0),
			this.width,
			this.height
		);
		this.graphics.endFill();
	}

	onDestroy() {
		this.graphics.removeFromParent();
		this.graphics.destroy();
	}


}