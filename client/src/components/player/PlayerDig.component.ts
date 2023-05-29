import { Graphics } from "pixi.js";
import { PositionToTile, PositionToChunk } from "../../config";
import { OnChunk } from "../../entities/filter";
import { IVector2, Vector2 } from "../../math";
import { Controls } from "../../systems/controls";
import { DiggableComponent } from "../Diggable.component";
import { PositionComponent } from "../Position.component";
import { World, Entity } from "../../entities";

interface IDigData {
	strength: number,
	progress: number,
	target: DiggableComponent | null,
	targetPosition: IVector2 | null,
}

export class PlayerDigComponent {
	static readonly COMPONENT_ID = "PlayerDigComponent" as const;
	world!: World;
	parent!: Entity;
	graphics!: Graphics;
	position!: PositionComponent;

	digData: IDigData = {
		strength: 1,
		progress: 0,
		target: null,
		targetPosition: null,
	};

	onInit() {
		this.graphics = new Graphics();
		this.position = this.parent.getComponent(PositionComponent);
		this.world.renderContainers["foreground"].addChild(this.graphics);
	}

	onUpdate({dt}) {
		this.dig(dt);
	}

	dig(dt) {
		this.graphics.clear();
		if (!Controls.mouse.left) {
			this.digData.progress = 0;
			return;
		}

		// Reach
		const mouse = PositionToTile(Controls.mouse);
		const chunk = PositionToChunk(Controls.mouse);
		const playerPosition = this.position.grid;
		playerPosition.y += 1;
		const distance = Vector2.blockLength(Vector2.sub(mouse, playerPosition));
		if (distance > 1.5)
			return;

		// Dig Progress
		const position = this.digData.targetPosition;
		const isTargetSame = position?.x === mouse.x && position?.y === mouse.y
		const digPower = this.digData.strength * dt;

		if (isTargetSame && this.digData.target) {
			this.digData.progress += digPower;
			const progressPercentage = this.digData.progress / (this.digData.target?.hardness ?? this.digData.progress);
			this.graphics.clear();
			this.graphics.beginFill(0xffaa00, progressPercentage)
			this.graphics.drawRect(
				position.x * 16, position.y * 16,
				16, 16
			);
			this.graphics.endFill();
		}

		if (this.digData.target && this.digData.progress >= this.digData.target.hardness) {
			this.graphics.clear();
			this.digData.target.dig();
			this.digData.progress = 0;
			this.digData.target = null;
			this.digData.targetPosition = null;
			return
		}

		if (isTargetSame)
			return;

		// Find dig target
		const [diggables, positions] = this.world
			.withFilter(OnChunk(chunk.x, chunk.y))
			.queryEntity(DiggableComponent, PositionComponent);

		for (let i = 0; i < diggables.length; i++) {
			const grid = positions[i].grid;
			if (grid.x === mouse.x && grid.y === mouse.y) {
				if (diggables[i].hardness <= digPower) {
					diggables[i].dig(); // allow 1 frame digs
					continue;
				}
				this.digData.progress = 0;
				this.digData.target = diggables[i];
				this.digData.targetPosition = grid;
				break;
			}
		}
	}

}