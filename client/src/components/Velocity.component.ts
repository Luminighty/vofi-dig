import { Entity } from "../entities";
import { OnCollideEventProps } from "../events";
import { PositionComponent } from "./Position.component";

export class VelocityComponent {
	static readonly COMPONENT_ID = "VelocityComponent" as const;
	parent!: Entity;
	velocity = { x: 0, y: 0 };
	gravity = 0.1;
	maxFallSpeed = 8;
	position!: PositionComponent;
	enabled = true;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
	}

	onUpdate({dt}) {
		if (!this.enabled)
			return;
		this.velocity.y = Math.min(this.velocity.y + this.gravity * dt, this.maxFallSpeed);

		const delta = { 
			x: this.velocity.x * dt, 
			y: this.velocity.y * dt 
		}
		this.parent.fireEvent("onMove", delta);
	}

	onStuck() {
		this.enabled = false;
		this.velocity = {
			x: 0, y: 0,
		};
	}

	onUnStuck() {
		this.enabled = true;
	}

	onCollide({y}: OnCollideEventProps) {
		if (Math.abs(y) < 0.15)
			return;
		if (y * this.velocity.y > 0) {
			this.velocity.y = 0;
		}
	}
}
