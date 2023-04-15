import { Sprite, Texture } from "pixi.js";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";
import { PlayerComponent } from "./player/Player.component";

export class SpriteComponent {
	static readonly COMPONENT_ID = "SpriteComponent" as const;
	parent!: Entity;
	world!: World;
	src!: string;
	sprite!: Sprite;
	anchorX = 0;
	anchorY = 0;
	layer="default";

	onInit({x, y}) {
		const texture = Texture.from(this.src);
		this.sprite = new Sprite(texture);
		this.sprite.anchor.set(this.anchorX, this.anchorY);
		this.sprite.position.set(x, y);
		this.world.renderContainers[this.layer].addChild(this.sprite);
	}

	onDestroy() {
		this.sprite.removeFromParent();
		this.sprite.destroy();
	}

	onMove({x}) {
		if (x * this.sprite.scale.x < 0)
			this.sprite.scale.x *= -1;
	}

	onPositionChanged({ x, y }) {
		if (this.sprite)
			this.sprite.position.set(x, y);
	}

	onLoad() {
		this.sprite.visible = true;
	}
	onUnload() {
		this.sprite.visible = false;
	}
}
