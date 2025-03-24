import { World } from "../../entities";
import { RecipeComponent } from "./Recipe.component";

export class RecipeDBComponent {
	static readonly COMPONENT_ID = "RecipeDBComponent" as const;
	world!: World;
	private db: { [key: string]: RecipeComponent } = {};

	async get(id: string) {
		if (!this.db[id])
			this.db[id] = (await this.world.addEntity(id)).getComponent(RecipeComponent);
		return this.db[id];
	}

}
