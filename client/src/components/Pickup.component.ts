import { Vector2 } from "@dig/math";
import { Entity, World } from "../entities";
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
	item!: string

	async onLateInit(props) {
		this.item = props.item;
		this.position = this.parent.getComponent(PositionComponent);
		// No need to calculate squareroot of distance
		this.pickupDistance *= this.pickupDistance;
		const itemDb = this.world.querySingleton(ItemDBComponent);
		const item = (await itemDb.get(props.item)).getComponent(ItemComponent);
		this.parent.fireEvent("onSetSprite", { sprite: item.icon });
	}

	onUpdate() {
		if (!this.player)
			this.player = this.world.queryEntity(PlayerComponent)[0]?.[0];
		if (this.player) {
			const delta = Vector2.sub(this.player.position.position, this.position.position);
			const distance = Vector2.dot(delta, delta);
			if (distance < this.pickupDistance) {
				this.pickup();
				this.player.parent.fireEvent("onAddItem", { item: this.item })
			}
		}
	}

	pickup() {
		this.world.withNetwork().removeEntity(this.parent);
	}
}