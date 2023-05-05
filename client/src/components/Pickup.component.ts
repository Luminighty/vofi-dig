import { Entity, World } from "../entities";
import { baseEvent } from "../events";
import { Vector2 } from "../math";
import { PositionComponent } from "./Position.component";
import { ItemComponent } from "./item/Item.component";
import { ItemDBComponent } from "./item/ItemDB.component";
import { PlayerComponent } from "./player/Player.component";

export class PickupComponent {
	static readonly COMPONENT_ID = "PickupComponent" as const;
	parent!: Entity;
	world!: World;
	player?: PlayerComponent;
	position!: PositionComponent;
	pickupDistance = 8;

	onLateInit(props) {
		this.position = this.parent.getComponent(PositionComponent);
		// No need to calculate squareroot of distance
		this.pickupDistance *= this.pickupDistance;
		const itemDb = this.world.queryEntity(ItemDBComponent)[0][0];
		const item = itemDb.get(props.item).getComponent(ItemComponent);
		this.parent.fireEvent(baseEvent("onSetSprite", { sprite: item.icon }));
	}

	onUpdate() {
		if (!this.player)
			this.player = this.world.queryEntity(PlayerComponent)[0]?.[0];
		if (this.player) {
			const delta = Vector2.sub(this.player.position.position, this.position.position);
			const distance = Vector2.dot(delta, delta);
			if (distance < this.pickupDistance)
				this.pickup();
		}
	}

	pickup() {
		this.world.withNetwork().removeEntity(this.parent);
	}
}