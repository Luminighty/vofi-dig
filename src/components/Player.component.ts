import { Entity } from "../entities";
import { Controls } from "../systems/controls";
import { VelocityComponent } from "./Velocity.component";

export class PlayerComponent {
	parent!: Entity;
	speed = 1;
	jumpSize = -2;
	canJump = true;

	velocity!: VelocityComponent;

	onInit() {
		this.velocity = this.parent.getComponent(VelocityComponent);
	}

	onUpdate(event) {
		this.velocity.velocity.x = Controls.x * event.dt * this.speed;

		if (Controls.jumping && this.canJump) {
			this.velocity.velocity.y = this.jumpSize;
			this.canJump = false;
			Controls.jumping = false;
		}
	}

	onCollide({x, y}) {
		if (y) {
			this.canJump = y > 0;
			this.velocity.velocity.y = 0;

		}
	}
}
