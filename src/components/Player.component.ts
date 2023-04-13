import { Entity, World } from "../entities";
import { Controls } from "../systems/controls";
import { CollisionComponent } from "./Collision.component";
import { PositionComponent } from "./Position.component";
import { TileTagComponent } from "./TileTag.component";
import { VelocityComponent } from "./Velocity.component";

export class PlayerComponent {
	world!: World;
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
		this.build();
	}

	build() {
		if (!Controls.mouse.right)
			return;
		const [positions] = this.world.queryEntity(PositionComponent, TileTagComponent);
		const mouse = {
			x: Math.floor(Controls.mouse.x / 16),
			y: Math.floor(Controls.mouse.y / 16),
		}
		const isTileOccupied = positions.some((p) => Math.floor(p.x / 16) === mouse.x && Math.floor(p.y / 16) === mouse.y);
		if (isTileOccupied)
			return;
		this.world.addEntity("Tile", { x: mouse.x * 16, y: mouse.y * 16});
	}

	onCollide({x, y}) {
		if (y * this.velocity.velocity.y > 0) {
			this.velocity.velocity.y = 0;
		}
		this.canJump = this.canJump || y > 0;
	}
}
