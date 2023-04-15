import { Graphics } from "pixi.js";
import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { TileTagComponent } from "../TileTag.component";
import { VelocityComponent } from "../Velocity.component";
import { DiggableComponent } from "../Diggable.component";
import { IVector2, Vector2 } from "../../math";
import { CameraComponent } from "../Camera.component";
import { OnChunk } from "../../entities/filter";
import { PositionToChunk, PositionToTile } from "../../config";

interface IDigData {
	strength: number,
	progress: number,
	target: DiggableComponent | null,
	targetPosition: IVector2 | null,
}

export class PlayerComponent {
	static readonly COMPONENT_ID = "PlayerComponent" as const;
	world!: World;
	parent!: Entity;
	speed = 1;
	jumpSize = -2;
	canJump = true;
	velocity!: VelocityComponent;
	position!: PositionComponent;
	camera!: CameraComponent;
	graphics!: Graphics;

	digData: IDigData = {
		strength: 1,
		progress: 0,
		target: null,
		targetPosition: null,
	};

	onInit() {
		this.velocity = this.parent.getComponent(VelocityComponent);
		this.position = this.parent.getComponent(PositionComponent);
		this.camera = this.parent.getComponent(CameraComponent);
		this.graphics = new Graphics();
		this.world.renderContainers["foreground"].addChild(this.graphics);
		window["player"] = this;
	}

	onUpdate({dt}) {
		this.move(dt);
		this.build();
		this.dig(dt);
	}

	onChunkChanged({x, y}) {
		console.log({x, y});
	}

	move(dt) {
		this.velocity.velocity.x = Controls.x * this.speed;
		if (Controls.jumping && this.canJump) {
			this.velocity.velocity.y = this.jumpSize;
			this.canJump = false;
			Controls.jumping = false;
		}
	}

	build() {
		if (!Controls.mouse.right)
			return;
		const mouse = PositionToTile(Controls.mouse);
		const chunk = PositionToChunk(Controls.mouse);
		// if (this.position.gridX === mouse.x && this.position.gridY === mouse.y - 1)
		// 	return;
		const [positions] = this.world
			.withFilter(OnChunk(chunk.x, chunk.y))
			.queryEntity(PositionComponent, TileTagComponent);
		const isTileOccupied = positions.some((p) => p.gridX === mouse.x && p.gridY === mouse.y);
		if (isTileOccupied)
			return;
		this.world.addEntity("Tile", { x: mouse.x * 16, y: mouse.y * 16});
	}

	dig(dt) {
		this.graphics.clear();
		if (!Controls.mouse.left) {
			if (this.digData.progress != 0) {
			}
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

	onCollide({x, y}) {
		if (Math.abs(y) < 0.15)
			return;
		if (y * this.velocity.velocity.y > 0) {
			this.velocity.velocity.y = 0;
		}
		this.canJump = this.canJump || y > 0;
	}

	onStuck() {
		this.velocity.enabled = false;
		this.camera.enabled = false;
	}

	onUnStuck() {
		this.velocity.enabled = true;
		this.camera.enabled = true;
	}
}
