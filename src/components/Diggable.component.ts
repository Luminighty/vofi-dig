import { Entity, World } from "../entities";

export class DiggableComponent {
	world!: World;
	parent!: Entity;
	hardness = 30;

	dig() {
		this.world.removeEntity(this.parent);
	}
}