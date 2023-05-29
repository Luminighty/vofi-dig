import { Entity, World } from "../../entities";
import { RecipeComponent } from "./Recipe.component";

export class RecipeDBComponent {
	static readonly COMPONENT_ID = "RecipeDBComponent" as const;
	world!: World;
	private db: { [key: string]: RecipeComponent } = {};

	get(id: string): RecipeComponent {
		if (!this.db[id])
			this.db[id] = this.world.addEntity(id).getComponent(RecipeComponent);
		return this.db[id];
	}

}
