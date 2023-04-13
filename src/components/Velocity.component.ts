import { Entity } from "../entities";
import { baseEvent } from "../events";
import { PositionComponent } from "./Position.component";

export class VelocityComponent {
	parent!: Entity;
	velocity = { x: 0, y: 0 };
	gravity = 0.1;
	maxFallSpeed = 1.5;
	position!: PositionComponent;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
	}

	onUpdate({dt}) {
		this.velocity.y = Math.min(this.velocity.y + this.gravity, this.maxFallSpeed);

		this.parent.fireEvent(baseEvent("onMove", { x: this.velocity.x, y: this.velocity.y } ));
	}
}
