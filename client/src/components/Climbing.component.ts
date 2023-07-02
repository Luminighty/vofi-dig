import { Entity, World } from "../entities";
import { Controls } from "../systems/controls";
import { ClimbableComponent } from "./Climbable.component";
import { PositionComponent } from "./Position.component";
import { VelocityComponent } from "./Velocity.component";
import { TriggerEventProps } from "../events";

export class ClimbingComponent {
	static readonly COMPONENT_ID = "ClimbingComponent" as const;
	world!: World;
	parent!: Entity;
	position!: PositionComponent;
	velocity?: VelocityComponent;
	climbables: ClimbableComponent[] = [];
	isClimbing = false;
	speed = 2;

	get canClimb() { return this.climbables.length > 0 }

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		this.velocity = this.parent.getComponent(VelocityComponent);
	}
	
	onUpdate() {
		if (!this.canClimb || !Controls.isHeld(Controls.up))
			return;
		this.isClimbing = true;
	}

	onTriggerEnter({source}: TriggerEventProps) {
		const climbable = source.parent.getComponent(ClimbableComponent);
		if (!climbable)
			return;
		this.climbables.push(climbable);
	}
	
	onTriggerExit({source}: TriggerEventProps) {
		const climbable = source.parent.getComponent(ClimbableComponent);
		if (!climbable)
			return;
		this.climbables.splice(this.climbables.indexOf(climbable), 1);
	}

	onMove(props) {
		if (!this.isClimbing)
			return;
		props.y = Controls.y;
		if (this.velocity)
			this.velocity.velocity.y = 0;
		
		if (this.canClimb)
			return;
		this.isClimbing = false;
	}
}