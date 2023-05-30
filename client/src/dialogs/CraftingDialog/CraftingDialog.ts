import CSS from "./CraftingDialog.css"
import HTML from "./CraftingDialog.html"
import { RecipeInput, RecipeOutput } from "../../components/item/Recipe.component";
import { BaseDialog, withDialog } from "../Dialog/Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "../ItemSlot/ItemSlot";
import { injectCustomElement } from "../utils";

export interface RecipeProps {
	label: string;
	inputs: RecipeInput[];
	outputs: RecipeOutput[];
}

export interface CraftingDialogProps {
	recipes: RecipeProps[],
	title: string,
	craftLabel?: string,
	onCraft: (recipe: RecipeProps, materials: {[key: string]: ItemProp}) => void,
	onDropItem: (item: ItemProp) => void,
}

@withDialog({ title: "Crafting", height: 300, width: 400, y: 200, key: "crafting" })
export class CraftingDialog extends HTMLElement {
	private _recipes: RecipeProps[] = [];
	dialog!: BaseDialog;

	recipesContainer!: HTMLElement;
	craftButton!: HTMLButtonElement;
	craftingSlots: HTMLElement;
	onDropItem!: (item: ItemProp) => void;
	onCraft!: (recipe: RecipeProps, materials: {[key: string]: ItemProp}) => void;
	private selected = -1;

	get recipes() { return this._recipes; }
	set recipes(recipes: RecipeProps[]) {
		this._recipes = recipes;
		this.recipesContainer.innerHTML = recipes.map(RecipeEntry).join("");
		this.selectRecipe(this.recipesContainer.firstElementChild as HTMLElement);
	}

	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);

		this.recipesContainer = root.querySelector("#recipes") as HTMLElement;
		this.craftButton = root.querySelector("#craft-button") as HTMLButtonElement;
		this.craftingSlots = root.querySelector("#slots") as HTMLButtonElement;

		this.recipesContainer.addEventListener("click", (e) => this.selectRecipe(e.target as HTMLElement));
		this.craftButton.addEventListener("click", this.craft.bind(this));
	}

	static open(props: CraftingDialogProps) {
		const crafting = document.createElement("crafting-dialog") as CraftingDialog;
		crafting.recipes = props.recipes;
		crafting.craftButton.innerText = props.craftLabel ?? "Craft";
		crafting.onDropItem = props.onDropItem;
		crafting.onCraft = props.onCraft;
		return crafting;
	}

	canCraft() {
		let haveAllInputs = true;
		for (let i = 0; i < this.craftingSlots.childElementCount; i++) {
			const slot = this.craftingSlots.children[i] as ItemSlot;
			const input = this.recipes[this.selected]?.inputs[i];
			haveAllInputs = haveAllInputs && (slot.item?.amount ?? -1) >= input?.amount;
		}
		this.craftButton.disabled = !haveAllInputs;
	}

	craft() {
		const recipe = this.recipes[this.selected];
		const materials: {[key: string]: ItemProp } = {};
		recipe.inputs.forEach((input, index) => {
			const slot = this.craftingSlots.children[index] as ItemSlot;
			materials[input.slot] = slot.item!;
			if (slot.item!.amount > input.amount) {
				slot.item!.amount -= input.amount;
			} else {
				slot.setItem();
			}
		})
		this.onCraft(this.recipes[this.selected], materials);
	}

	selectRecipe(target: HTMLElement) {
		const index = parseInt(target.dataset.index ?? "-1");
		if (this.selected === index)
			return;
		const last = this.recipesContainer.querySelector(`[data-index="${this.selected}"`);
		if (last)
			last.classList.remove("selected-recipe");
		target.classList.add("selected-recipe");
		this.selected = index;
		this.setCraftingRecipe(this.recipes[this.selected]);
		this.canCraft();
	}

	dropItems() {
		for (let i = 0; i < this.craftingSlots.childElementCount; i++) {
			const slot = this.craftingSlots.children[i] as ItemSlot;
			if (slot.item)
				this.onDropItem(slot.item);
		}
	}

	setCraftingRecipe(recipe: RecipeProps) {
		this.dropItems();
		this.craftingSlots.innerHTML = "";
		recipe.inputs
			.map(CraftSlot)
			.forEach((element) => {
				element.onItemChanged(() => this.canCraft());
				this.craftingSlots.appendChild(element)
			});
	}

	close() {
		this.dropItems();
		this.dialog.close();
	}

}

const RecipeEntry = (props, index) => `
<button data-index="${index}">${props.label}</button>
`;

const CraftSlot = (props: RecipeInput) => 
	createItemSlot({allowedTags: props.type, label: props.slot });
	
customElements.define("crafting-dialog", CraftingDialog);
