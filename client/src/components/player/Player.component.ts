import { Graphics } from "pixi.js";
import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { PositionComponent } from "../Position.component";
import { VelocityComponent } from "../Velocity.component";
import { CameraComponent } from "../Camera.component";
import { LocalStorage } from "../../systems/storage";
import { ItemContainerComponent } from "../ItemContainer.component";
import { baseEvent } from "../../events";


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

	inventory!: ItemContainerComponent;

	onInit(props) {
		this.velocity = this.parent.getComponent(VelocityComponent);
		this.position = this.parent.getComponent(PositionComponent);
		this.camera = this.parent.getComponent(CameraComponent);
		this.inventory = this.parent.getComponent(ItemContainerComponent);
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

	private lastControls = {
		inventory: false
	};
	onUpdate({dt}) {
		this.move();
		if (!this.lastControls.inventory && Controls.inventory) {
			if (this.inventory.isOpen) {
				this.parent.fireEvent(baseEvent("onCloseDialog"));
			} else {
				this.parent.fireEvent(baseEvent("onOpenDialog", { source: this.parent }));
			}
		}

		
		this.lastControls = {...Controls};
	}

	move() {
		this.velocity.velocity.x = Controls.x * this.speed;
		if (Controls.jumping && this.canJump) {
			this.velocity.velocity.y = this.jumpSize;
			this.canJump = false;
			Controls.jumping = false;
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
