import { Entity, World } from "../../entities";

export class RecipeDBComponent {
	static readonly COMPONENT_ID = "RecipeDBComponent" as const;
	world!: World;
	private db: { [key: string]: Entity } = {};

	get(id: string): Entity {
		if (!this.db[id])
			this.db[id] = this.world.addEntity(id);
		return this.db[id];
	}

}
