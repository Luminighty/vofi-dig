import { Entity, World } from "../entities";

export class DiggableComponent {
	static readonly COMPONENT_ID = "DiggableComponent" as const;
	world!: World;
	parent!: Entity;
	hardness = 30;

	dig() {
		this.world.withNetwork().removeEntity(this.parent);
	}
}