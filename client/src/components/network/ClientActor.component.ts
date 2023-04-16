import { Component } from "..";
import { Entity, World } from "../../entities";

export class ClientActorComponent {
	static readonly COMPONENT_ID = "ClientActorComponent" as const;
	world!: World;
	parent!: Entity;
	sync: string[] = [];
	components: Component[] = [];
	serverEntity!: string;
	delay = 5;
	currentDelay = 0;

	onLateInit(props) {
		this.components = this.sync.map((s) => this.parent.getComponentByTypeId(s));
		props.isClientOwned = true;
		this.world.networkHandler.createEntity(this.serverEntity, props, (id) => {
			this.parent.id = id;
		});
	}

	onUpdate({dt}) {
		if (this.parent.id < 0)
			return;
		this.currentDelay += dt;
		if (this.currentDelay < this.delay)
			return;
		this.currentDelay = 0;
		this.syncComponents();
	}

	get payload() {
		const data = {};
		for (let i = 0; i < this.sync.length; i++) {
			const s = this.sync[i];
			const component = this.components[i];
			const serialize = component.constructor["serialize"];
			if (!serialize)
				throw new Error(`Component '${component.constructor["COMPONENT_ID"]}' can't be serialized`)
			data[s] = serialize(component);
		}
		return data;
	}

	syncComponents() {
		this.world.networkHandler.updateEntity(this.parent.id, this.payload);
	}

}
