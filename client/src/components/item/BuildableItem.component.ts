import { PositionToChunk, PositionToTile } from "../../config";
import { World } from "../../entities";
import { OnChunk } from "../../entities/filter";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { TileTagComponent } from "../TileTag.component";

export class BuildableItemComponent {
	static readonly COMPONENT_ID = "BuildableItemComponent" as const;
	world!: World;
	entity!: string;

	onUse() {
		this.build();
	}

	build() {
		if (!Controls.mouse.right)
			return;
		const mouse = PositionToTile(Controls.mouse);
		const chunk = PositionToChunk(Controls.mouse);
		const [positions] = this.world
			.withFilter(OnChunk(chunk.x, chunk.y))
			.queryEntity(PositionComponent, TileTagComponent);
		const isTileOccupied = positions.some((p) => p.gridX === mouse.x && p.gridY === mouse.y);
		if (isTileOccupied)
			return;
		console.log(`Building ${this.entity}`);
		
		this.world.withNetwork().addEntity(this.entity, { x: mouse.x * 16, y: mouse.y * 16});
	}
}