import { GameConfig } from "../config";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";

export class DiggableComponent {
	static readonly COMPONENT_ID = "DiggableComponent" as const;
	world!: World;
	parent!: Entity;
	hardness = 30;
	drop?: string;

	dig() {
		if (this.drop) {
			const position = this.parent.getComponent(PositionComponent);
			const props = { 
				x: position.x + GameConfig.gridSize / 2,
				y: position.y,
			};
			this.world.withNetwork().addEntity(this.drop, props);
		}
		this.world.withNetwork().removeEntity(this.parent);
	}
}