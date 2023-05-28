import { RecipeInput, RecipeOutput } from "../components/item/Recipe.component";
import { createDialog } from "./Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "./ItemSlot";

interface Recipe {
	label: string;
	inputs: RecipeInput[];
	outputs: RecipeOutput[];
}

export interface CraftingDialogProps {
	recipes: Recipe[],
	title: string,
	craftLabel?: string,
	onCraft: (recipe: Recipe, materials: {[key: string]: ItemProp}) => void,
	onDropItem: (item: ItemProp) => void,
}

export function openCraftingDialog(props: CraftingDialogProps): CraftingDialog {
	const dialog = createDialog({
		height: 300,
		width: 400,
		...props,
	});
	const crafting = document.createElement("crafting-dialog") as CraftingDialog;
	crafting.recipes = props.recipes;
	crafting.craftButton.innerText = props.craftLabel ?? "Craft";
	crafting.onDropItem = props.onDropItem;
	crafting.onCraft = props.onCraft;
	document.body.appendChild(dialog);
	dialog.content.appendChild(crafting);
	return crafting;
}

class CraftingDialog extends HTMLElement {
	private _recipes: Recipe[] = [];

	recipesContainer!: HTMLElement;
	craftButton!: HTMLButtonElement;
	craftingSlots: HTMLElement;
	onDropItem!: (item: ItemProp) => void;
	onCraft!: (recipe: Recipe, materials: {[key: string]: ItemProp}) => void;
	private selected = -1;

	get recipes() { return this._recipes; }
	set recipes(recipes: Recipe[]) {
		this._recipes = recipes;
		this.recipesContainer.innerHTML = recipes.map(RecipeEntry).join("");
		this.selectRecipe(this.recipesContainer.firstElementChild as HTMLElement);
	}

	constructor() {
		super();
		const root = this.attachShadow({mode: "open"});
		const wrapper = document.createElement("div");
		wrapper.classList.add("container");
		const style = document.createElement("style");
		wrapper.innerHTML = HTML;
		style.textContent = CSS;
		root.append(style, wrapper);

		this.recipesContainer = wrapper.querySelector("#recipes") as HTMLElement;
		this.craftButton = wrapper.querySelector("#craft-button") as HTMLButtonElement;
		this.craftingSlots = wrapper.querySelector("#slots") as HTMLButtonElement;

		this.recipesContainer.addEventListener("click", (e) => this.selectRecipe(e.target as HTMLElement));
		this.craftButton.addEventListener("click", this.craft.bind(this));
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
		})
		this.onCraft(this.recipes[this.selected], materials);
	}

	selectRecipe(target: HTMLElement) {
		const index = target.dataset.index ?? "-1";
		const last = this.recipesContainer.querySelector(`[data-index="${this.selected}"`);
		if (last)
			last.classList.remove("selected-recipe");
		target.classList.add("selected-recipe");
		this.selected = parseInt(index);
		this.setCraftingRecipe(this.recipes[this.selected]);
		this.canCraft();
	}

	setCraftingRecipe(recipe: Recipe) {
		for (let i = 0; i < this.craftingSlots.childElementCount; i++) {
			const slot = this.craftingSlots.children[i] as ItemSlot;
			if (slot.item)
				this.onDropItem(slot.item);
		}

		this.craftingSlots.innerHTML = "";
		recipe.inputs
			.map(CraftSlot)
			.forEach((element) => {
				element.onItemChanged(() => this.canCraft());
				this.craftingSlots.appendChild(element)
			});
	}

	close() {
		document.body.removeChild(this);
	}
}

const RecipeEntry = (props, index) => `
<button data-index="${index}">${props.label}</button>
`;

const CraftSlot = (props: RecipeInput) => 
	createItemSlot({allowedTags: props.type, label: props.slot });
	
const HTML = `
	<div class="recipes-container">
		<div id="recipes"></div>
		<button id="craft-button"></button>
	</div>
	<div id="slots"></div>
`;

const CSS = `
.container {
	height: 100%;
	display: flex;
}
.recipes-container {
	display: flex;
	flex-direction: column;
  align-items: stretch;
	justify-content: space-between;
}
#recipes {
	width: 150px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	overflow: auto;
}
#recipes > .selected-recipe {
	background: #333333;
}
#craft-button {
	background: grey;
	color: white;
	font-weight: bold;
	font-size: 18px;
	padding: 5px;
	cursor: pointer;
	border: 1px solid black;
}
#craft-button:hover {
	background: #1a1a1a;
}
#craft-button:disabled {
	background: #5a5a5a; */
	color: gray;
}
#recipes > * {
	display: block;
	background: grey;
	color: white;
	font-weight: bold;
	font-size: 18px;
	padding: 10px;
	cursor: pointer;
	text-align: right;
	border: none;
	border-bottom: 1px solid black;
}
#recipes > *:hover {
	background: #1a1a1a;
}
#slots {
	display: flex;
	align-content: space-evenly;
	justify-content: space-evenly;
	justify-items: center;
	flex: 1;
	background-color: #0005;
	flex-wrap: wrap;
}
`;


customElements.define("crafting-dialog", CraftingDialog);
