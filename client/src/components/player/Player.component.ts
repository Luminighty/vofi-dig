import { Graphics } from "pixi.js";
import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { VelocityComponent } from "../Velocity.component";
import { CameraComponent } from "../Camera.component";
import { LocalStorage } from "../../systems/storage";
import { ItemContainerComponent } from "../item/ItemContainer.component";
import { ChunkHandlerComponent } from "../ChunkHandler.component";
import { OnChunk } from "../../entities/filter";
import { PositionToChunk, PositionToTile } from "../../config";
import { Vector2 } from "@dig/math";
import { InteractableComponent } from "../Interactable.component";


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

	inventory!: ItemContainerComponent;
	chunkHandler!: ChunkHandlerComponent;

	async onInit(props) {
		this.velocity = this.parent.getComponent(VelocityComponent);
		this.position = this.parent.getComponent(PositionComponent);
		this.camera = this.parent.getComponent(CameraComponent);
		this.inventory = this.parent.getComponent(ItemContainerComponent);
		this.chunkHandler = this.world.querySingleton(ChunkHandlerComponent);
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
	}

	onUpdate({dt}) {
		this.move();
		this.interact();
		if (Controls.isPressed(Controls.inventory)) {
			if (this.inventory.isOpen) {
				this.parent.fireEvent("onCloseDialog");
			} else {
				this.parent.fireEvent("onOpenDialog", { source: this.parent });
			}
		}
	}

	interact() {
		if (!Controls.isPressed(Controls.mouse.right))
			return;
		const playerPosition = this.position.grid;
		const mouse = PositionToTile(Controls.mouse);
		const chunk = PositionToChunk(Controls.mouse);
		const distance = Vector2.blockLength(Vector2.sub(mouse, playerPosition));
		if (distance > 2.5)
			return;
		const [interactables, positions] = this.world
			.withFilter(OnChunk(chunk.x, chunk.y))
			.queryEntity(InteractableComponent, PositionComponent);
		
			for (let i = 0; i < interactables.length; i++) {
				const grid = positions[i].grid;
				if (grid.x === mouse.x && grid.y === mouse.y) {
					interactables[i].interact(this.parent);
					break;
				}
			}
	}

	move() {
		this.velocity.velocity.x = Controls.x * this.speed;
		if (Controls.isPressed(Controls.jumping) && this.canJump) {
			this.velocity.velocity.y = this.jumpSize;
			this.canJump = false;
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

	onChunkChanged({x, y}) {
		this.chunkHandler.setActiveChunk(x, y);
	}
}
