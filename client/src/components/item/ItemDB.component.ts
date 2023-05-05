import { Entity, World } from "../../entities";

export class ItemDBComponent {
	static readonly COMPONENT_ID = "ItemDBComponent" as const;
	world!: World;
	private db: { [key: string]: Entity } = {};

	get(id: string): Entity {
		if (!this.db[id])
			this.db[id] = this.world.addEntity(id);
		return this.db[id];
	}

}
