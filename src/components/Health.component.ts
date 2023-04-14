import { Graphics } from "pixi.js";
import { Entity, World } from "../entities";
import { PlayerComponent } from "./player/Player.component";

export class HealthComponent {
	static readonly COMPONENT_ID = "HealthComponent" as const;
	world!: World;
	parent!: Entity;

	isStuck = false;
	stuck = 0;
	oxygen = 100;
	isPlayer = false;
	graphics?: Graphics;

	onInit() {
		this.isPlayer = this.parent.getComponent(PlayerComponent) !== null;
		if (this.isPlayer) {
			this.graphics = new Graphics();
			this.world.renderContainers["farForeground"].addChild(this.graphics);
		}
	}

	onUpdate({dt}) {
		if (this.isStuck)
			this.stuck += dt * 0.5;
		if (this.isPlayer) {
			this.graphics?.clear();
			this.graphics?.beginFill(0xffffff, Math.min(this.stuck / this.oxygen, 0.90));
			const position = this.world.app.stage.pivot
			const width = this.world.app.view.width
			const height = this.world.app.view.height
			this.graphics?.drawRect(position.x - width / 2, position.y -  height / 2, width, height);
			this.graphics?.endFill();
		}
	}

	onStuck() {
		this.isStuck = true;
	}

	onUnStuck() {
		this.isStuck = false;
		this.stuck = 0;
	}
}