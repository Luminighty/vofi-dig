import { Entity, World } from "../entities";
import { Vector2 } from "../math";
import { PositionComponent } from "./Position.component";
import { PlayerComponent } from "./player/Player.component";

export class PickupComponent {
	static readonly COMPONENT_ID = "PickupComponent" as const;
	parent!: Entity;
	world!: World;
	player?: PlayerComponent;
	position!: PositionComponent;

	pickupDistance = 8;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		// No need to calculate squareroot of distance
		this.pickupDistance *= this.pickupDistance;
	}

	onUpdate() {
		if (!this.player)
			this.player = this.world.queryEntity(PlayerComponent)[0]?.[0];
		if (this.player) {
			const delta = Vector2.sub(this.player.position.position, this.position.position);
			const distance = Vector2.dot(delta, delta);
			if (distance < this.pickupDistance)
				this.pickup();
		}
	}

	pickup() {
		this.world.withNetwork().removeEntity(this.parent);
	}
}