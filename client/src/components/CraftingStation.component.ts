import { CraftingDialog, RecipeProps } from "../dialogs/CraftingDialog";
import { Entity, World } from "../entities";
import { baseEvent } from "../events";
import { RecipeDBComponent } from "./item/RecipeDB.component";

export class CraftingStationComponent {
	static readonly COMPONENT_ID = "CraftingStationComponent" as const;
	world!: World;
	title = "Crafting Station";
	craftLabel = "Craft";
	container: CraftingDialog | null = null;
	recipeDb!: RecipeDBComponent;
	recipes: string[] = [];

	get isOpen() { return this.container !== null; }

	onInit() {
		this.recipeDb = this.world.querySingleton(RecipeDBComponent);
	}

	onOpenDialog({source}: {source?: Entity}) {
		if (this.container)
			return;
		this.container = CraftingDialog.open({
			title: this.title,
			recipes: this.recipes.map(this.toRecipe.bind(this)),
			craftLabel: this.craftLabel,
			onCraft: (recipe, materials) => {
				console.log({recipe, materials});
				recipe.outputs.forEach(({item, amount}) => {

					source?.fireEvent(baseEvent("onAddItem", { item: item, amount: amount }));
				})
			},
			onDropItem: (item) => {
				source?.fireEvent(baseEvent("onAddItem", { item: item.item, amount: item.amount }));
			},
		})
		this.container.dialog.onClose(() => {
			this.container?.dropItems();
			this.container = null;
		});
	}

	onCloseDialog() {
		if (this.container)
			this.container.dialog.close();
	}

	toRecipe(entry: string): RecipeProps {
		const data = this.recipeDb.get(entry);
		return {
			inputs: data.inputs,
			outputs: data.outputs,
			label: data.label
		}
	}

}