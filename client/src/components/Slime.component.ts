import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";
import { VelocityComponent } from "./Velocity.component";

export class SlimeComponent {
	static readonly COMPONENT_ID = "SlimeComponent" as const;

	world!: World;
	parent!: Entity;
	velocityComponent!: VelocityComponent;
	positionComponent!: PositionComponent;
	wantsToHop = true;
	hopCount = 0;
	direction = 1;
	speed = 0.5;

	onInit() {
		this.velocityComponent = this.parent.getComponent(VelocityComponent);
		this.positionComponent = this.parent.getComponent(PositionComponent);
	}

	onUpdate() {
		if (this.wantsToHop) {
			this.hop();
		}
	}

	onCollide({y}) {
		if (Math.abs(y) < 0.15)
			return;
		if (y * this.velocityComponent.velocity.y > 0) {
			this.velocityComponent.velocity.y = 0;
		}
		this.wantsToHop = y > 0;
	}

	private hop() {
		this.velocityComponent.velocity.y = -1.5;
		this.velocityComponent.velocity.x = this.speed * this.direction * Math.random();
		this.hopCount = (this.hopCount+1)%10;
		if (this.hopCount == 9) {
			this.direction *= -1;
		}
		this.wantsToHop = false;
	}
}