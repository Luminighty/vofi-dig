import { Entity, World } from "../entities";
import { Vector2 } from "../math";
import { PositionComponent } from "./Position.component";
import { SpriteComponent } from "./Sprite.component";

export class CameraComponent {
	static readonly COMPONENT_ID = "CameraComponent" as const;

	parent!: Entity;
	world!: World;
	position!: PositionComponent;
	offsetX = 0;
	offsetY = 0;
	enabled = true;
	get offset() { return { x: this.offsetX, y: this.offsetY } }

	onInit({ x, y, }) {
		const pivot = Vector2.add({x, y}, this.offset)
		this.world.app.stage.pivot.copyFrom(pivot);
	}

	onPositionChanged({x, y}) {
		if (!this.enabled)
			return;
		const pivot = Vector2.add({x, y}, this.offset)
		this.world.app.stage.pivot.copyFrom(pivot);
	}

}