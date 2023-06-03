import { Entity, World } from "../../entities";

export class ItemDBComponent {
	static readonly COMPONENT_ID = "ItemDBComponent" as const;
	world!: World;
	private db: { [key: string]: Entity } = {};

	async get(id: string): Promise<Entity> {
		if (!this.db[id])
			this.db[id] = await this.world.addEntity(id);
		return this.db[id];
	}

}
