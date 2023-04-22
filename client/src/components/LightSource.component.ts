import { BlurFilter, Container, Graphics, Sprite, Texture, filters } from "pixi.js";
import { Entity, World } from "../entities";
import { Vector2 } from "../math";
import { PositionComponent } from "./Position.component";
import { TileTagComponent } from "./TileTag.component";
import { GameConfig } from "../config";
import { LightMaskComponent } from "./player/LightMask.component";

export class LightSourceComponent {
	static readonly COMPONENT_ID = "LightSourceComponent" as const;
	world!: World;
	parent!: Entity;
	intensity = 5;
	offsetX = 0;
	offsetY = 0;

	graphics!: Graphics
	static _lightContainer: Container;
	static isBaseGraphicsInitialized = false;
	get baseGraphics() {
		if (!LightSourceComponent._lightContainer) {
			const graphics = new Container();
			LightSourceComponent._lightContainer = graphics;
			this.world.renderContainers.farForeground.addChild(graphics);
			this.world.app.stage.mask = graphics;
		}
		return LightSourceComponent._lightContainer;
	}

	onInit({x, y}) {
		this.graphics = new Graphics();
		this.graphics.position.set(x, y);
		this.baseGraphics.addChild(this.graphics);
		this.updateGraphics();

		if (LightSourceComponent.isBaseGraphicsInitialized) {
			const [lightMasks] = this.world.queryEntity(LightMaskComponent);
			lightMasks.forEach((lightMask) => lightMask.updateMask());
			LightSourceComponent.isBaseGraphicsInitialized = true;
		}
	}

	updateGraphics() {
		this.graphics.clear();
		this.graphics.beginFill(0xFFFFFF, 1);
		this.graphics.drawCircle(0, 0, this.intensity);
		this.graphics.endFill();
	}

	onPositionChanged({x, y}) {
		this.graphics.position.set(x + this.offsetX ?? 0, y + this.offsetY ?? 0);
	}

	onDestroy() {
		this.graphics.removeFromParent();
		this.graphics.destroy();
	}

}
