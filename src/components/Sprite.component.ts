import { Sprite, Texture } from "pixi.js";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";

export class SpriteComponent {
	parent!: Entity;
	world!: World;
	src!: string;
	sprite!: Sprite;
	position?: PositionComponent;
	anchorX = 0;
	anchorY = 0;

	onInit({}) {
		const texture = Texture.from(this.src);
		this.sprite = new Sprite(texture);
		this.sprite.anchor.set(this.anchorX, this.anchorY);
		this.world.app.stage.addChild(this.sprite);

		this.position = this.parent.getComponent(PositionComponent);
	}

	onDestroy() {
		this.sprite.removeFromParent();
	}

	onUpdate(event) {
		this.sprite.position.set(this.position?.x, this.position?.y)
	}

	onMove({x}) {
		if (x * this.sprite.scale.x < 0)
			this.sprite.scale.x *= -1;
	}
}
