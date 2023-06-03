import { Graphics } from "pixi.js";
import { World, Entity } from "../../entities";
import { PositionComponent } from "../Position.component";
import { PositionToTile } from "../../config";
import { Controls } from "../../systems/controls";

export class MouseDebugComponent {
	static readonly COMPONENT_ID = "MouseDebugComponent" as const;
	world!: World;
	parent!: Entity;
	graphics!: Graphics;
	position!: PositionComponent;

	onInit() {
		this.graphics = new Graphics();
		this.position = this.parent.getComponent(PositionComponent);
		this.world.renderContainers["foreground"].addChild(this.graphics);
	}
	onUpdate({dt}) {
		const mouse = PositionToTile(Controls.mouse);
		this.graphics.clear();
		this.graphics.lineStyle({width: 1, color: "red" })
		this.graphics.drawRect(
			mouse.x * 16, mouse.y * 16,
			16, 16
		);
		this.graphics.endFill();
	}
}