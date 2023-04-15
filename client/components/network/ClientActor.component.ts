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
		this.world.networkHandler.createEntity(this.serverEntity, props)
			.then((id) => {
				console.log(`New Id ${id}`);
				this.parent.id = id as number
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
			data[s] = SyncComponent[s](component);
		}
		return data;
	}

	syncComponents() {
		this.world.networkHandler.updateEntity(this.parent.id, this.payload);
	}

}

const SyncComponent = {
	"PositionComponent": (component) => {
		return { x: component.x, y: component.y }
	},
	"SpriteComponent": (component) => {
		return { "scale.x": component.sprite.scale.x }
	},
}