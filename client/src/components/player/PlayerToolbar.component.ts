import { PositionToChunk, PositionToTile } from "../../config";
import { World } from "../../entities";
import { OnChunk } from "../../entities/filter";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { TileTagComponent } from "../TileTag.component";

export class PlayerToolbarComponent {
	static readonly COMPONENT_ID = "PlayerToolbarComponent" as const;
	entities: string[] = [];
	selected = 0;
	world!: World;

	selectionText!: HTMLElement;

	onInit() {
		this.selectionText = document.querySelector("#selectedBlock")!;
		this.selectionText.innerText = this.entities[this.selected]
	}

	onUpdate() {
		this.select();
		this.build();
	}

	select() {
		if (Controls.mouse.scrollY) {
			this.selected += Controls.mouse.scrollY;
			this.selected = (this.selected + this.entities.length) % this.entities.length;
			this.selectionText.innerText = this.entities[this.selected]
		}
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
		this.world.withNetwork().addEntity(this.entities[this.selected], { x: mouse.x * 16, y: mouse.y * 16});
	}



}