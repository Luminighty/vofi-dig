import { IVector2, Vector2 } from "@dig/math";
import { Entity } from "../entities";
import { Polygon } from "./Collision.component";
import { PositionComponent } from "./Position.component";
import { Component } from ".";

export class TriggerColliderComponent {
	static readonly COMPONENT_ID = "TriggerColliderComponent" as const;
	position!: PositionComponent;
	shape: Polygon = [];
	parent!: Entity;
	boundingBox = 0;
	enabled = true;
	colliders: Component[] = [];

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		this.boundingBox = Math.max(...this.shape.map((v) => Math.abs(v.x) + Math.abs(v.y)));
	}
	
	worldShape({x, y}: IVector2) {
		return this.shape.map((v) => Vector2.add(v, {
			x: this.position.x + x,
			y: this.position.y + y,
		}));
	}

	enter(other) {
		const index = this.colliders.findIndex((collider) => collider === other);
		if (index !== -1)
			return;
		this.colliders.push(other);
		other.parent.fireEvent("onTriggerEnter", { source: this });
		this.parent.fireEvent("onTriggerEnter", { source: other });
	}

	exit(other) {
		const index = this.colliders.findIndex((collider) => collider === other);
		if (index === -1)
			return;
		this.colliders.splice(index, 1);
		other.parent.fireEvent("onTriggerExit", { source: this });
		this.parent.fireEvent("onTriggerExit", { source: other });
	}
}