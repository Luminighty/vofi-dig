import { Sprite, Texture } from "pixi.js";
import { Entity, World } from "../entities";
import { Serializable } from "../network";

const EMPTY_TEXTURE = "assets/textures/empty.png";

@Serializable("sprite.scale.x")
export class SpriteComponent {
	static readonly COMPONENT_ID = "SpriteComponent" as const;
	parent!: Entity;
	world!: World;
	src!: string;
	sprite!: Sprite;
	anchorX = 0;
	anchorY = 0;
	layer="default";

	onInit({x, y, sprite}) {
		const texture = Texture.from(sprite ?? this.src ?? EMPTY_TEXTURE);
		this.sprite = new Sprite(texture);
		this.sprite.anchor.set(this.anchorX, this.anchorY);
		this.sprite.position.set(x, y);
		this.world.renderContainers[this.layer].addChild(this.sprite);
	}

	onSetSprite({sprite}) {
		this.sprite.texture = Texture.from(sprite);
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
