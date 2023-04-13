import { Graphics } from "pixi.js";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";
import { Controls } from "../systems/controls";

export class DiggableComponent {
	world!: World;
	parent!: Entity;
	hardness = 30;
	digging = 0;
	position!: PositionComponent;
	graphics!: Graphics;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		this.graphics = new Graphics();
		this.world.app.stage.addChild(this.graphics);
	}

	onUpdate({dt}) {
		const mouse = {
			x: Math.floor(Controls.mouse.x / 16),
			y: Math.floor(Controls.mouse.y / 16),
		};
		this.graphics.clear();
		if (mouse.x === Math.floor(this.position.x / 16) && 
				mouse.y === Math.floor(this.position.y / 16)) {
			this.hovering(dt);
		} else {
			this.digging = 0;
		}
	}

	hovering(dt) {
		this.graphics.beginFill(0xffaa00, this.digging / this.hardness);
		this.graphics.drawRect(
			this.position.x, this.position.y,
			16, 16
		);
		this.graphics.endFill();
		if (Controls.mouse.left) {
			this.digging += dt;
		} else {
			this.digging = 0;
		}
		if (this.digging >= this.hardness) {
			this.world.removeEntity(this.parent);
		}
	}

	onDestroy() {
		this.graphics.removeFromParent();
		this.graphics.destroy();
	}

}