import { Graphics } from "pixi.js";
import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { VelocityComponent } from "../Velocity.component";
import { DiggableComponent } from "../Diggable.component";
import { IVector2, Vector2 } from "../../math";
import { CameraComponent } from "../Camera.component";
import { OnChunk } from "../../entities/filter";
import { PositionToChunk, PositionToTile } from "../../config";
import { LocalStorage } from "../../systems/storage";

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
	toolbar!: Entity;

	digData: IDigData = {
		strength: 1,
		progress: 0,
		target: null,
		targetPosition: null,
	};

	onInit(props) {
		this.velocity = this.parent.getComponent(VelocityComponent);
		this.position = this.parent.getComponent(PositionComponent);
		this.camera = this.parent.getComponent(CameraComponent);
		this.graphics = new Graphics();
		this.world.renderContainers["foreground"].addChild(this.graphics);
		window["player"] = this;

		props.name = LocalStorage.getValue("player_name");
		props.nameColor = LocalStorage.getValue("player_color");


		if (!props.name) {
			props.name = prompt("Username");
			LocalStorage.setValue("player_name", props.name);
		}

		if (!props.nameColor) {
			const hue = `${Math.trunc(Math.random() * 360)}deg`;
			const saturation = `${Math.trunc(Math.random() * 30 + 70)}%`;
			const lightness = `${Math.trunc(Math.random() * 20 + 70)}%`;
			props.nameColor = `hsl(${hue} ${saturation} ${lightness})`;
			LocalStorage.setValue("player_color", props.nameColor);
		}

		this.toolbar = this.world.addEntity("Toolbar");
	}

	onUpdate({dt}) {
		this.move();
		this.dig(dt);
	}

	move() {
		this.velocity.velocity.x = Controls.x * this.speed;
		if (Controls.jumping && this.canJump) {
			this.velocity.velocity.y = this.jumpSize;
			this.canJump = false;
			Controls.jumping = false;
		}
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

	onCollide({y}) {
		if (Math.abs(y) < 0.15)
			return;
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
