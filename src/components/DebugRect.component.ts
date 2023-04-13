import { Graphics } from "pixi.js";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";

export class DebugRectComponent {
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
	fillAlpha = 0;
	enabled=1

	position?: PositionComponent
	graphics!: Graphics;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		this.graphics = new Graphics();
		this.world.app.stage.addChild(this.graphics);
	}

	onUpdate() {
		if (!this.enabled)
			return;
		this.graphics.clear();
		this.graphics.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha); 
		this.graphics.beginFill(this.fillColor, this.fillAlpha);
		this.graphics.drawRect(
			this.offsetX + (this.position?.x ?? 0),
			this.offsetY + (this.position?.y ?? 0),
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