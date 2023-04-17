import { Component } from "..";
import { Entity, World } from "../../entities";

export class ClientActorComponent {
	static readonly COMPONENT_ID = "ClientActorComponent" as const;
	world!: World;
	parent!: Entity;
	sync: string[] = [];
	components: Component[] = [];
	serverEntity!: string;
	clientEntity!: string;
	delay = 5;
	currentDelay = 0;
	lastPayload = {};

	onLateInit(props) {
		this.components = this.sync.map((s) => this.parent.getComponentByTypeId(s));
		props.isClientOwned = true;
		if (!this.parent.id)
			this.world.networkHandler.createEntity(this.serverEntity, { isClientOwned: true, ...this.payload }, (id) => {
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
		const diff = this.getDifferences();
		if (Object.keys(diff).length > 0)
			this.world.networkHandler.updateEntity(this.parent.id, diff);
	}

	getDifferences(): object {
		const payload = this.payload;
		const diff = {};
		for (let i = 0; i < this.sync.length; i++) {
			const component = this.sync[i];
			const last = this.lastPayload[component];
			const current = payload[component];
			for (const key in current) {
				const currentValue = current[key];
				const lastValue = last?.[key];
				if (currentValue !== lastValue) {
					diff[component] = diff[component] ?? {};
					diff[component][key] = currentValue;
				}
			}
		}
		this.lastPayload = payload;
		return diff;
	}
}
