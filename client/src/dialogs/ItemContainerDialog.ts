import { createDialog } from "./Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "./ItemSlot";

interface ItemContainerProps {
	title: string;
	count: number;
	items: ItemProp[];
}

export function openItemContainerDialog(props: ItemContainerProps) {
	const dialog = createDialog({
		...props,
		width: 300,
	});
	const container = document.createElement("item-container") as ItemContainerDialog;
	dialog.title = props.title;
	container.slotCount = props.count;
	document.body.appendChild(dialog);
	dialog.content.appendChild(container);
	container.items = props.items;
	return container;
}

export class ItemContainerDialog extends HTMLElement {
	private container: HTMLElement;
	private _items: ItemProp[] = [];
	
	constructor() {
		super();
		const root = this.attachShadow({mode: "open"});
		const wrapper = document.createElement("div");
		const style = document.createElement("style");
		wrapper.innerHTML = HTML;
		style.textContent = CSS;
		root.append(style, wrapper);

		this.container = wrapper.querySelector(".container") as HTMLElement;
	}
	
	get slotCount() { return this.container.childElementCount; }
	set slotCount(value: number) {
		while (this.container.childElementCount > value)
			this.container.removeChild(this.container.lastElementChild!);
		while (this.container.childElementCount < value) {
			const slot = createItemSlot();
			this.container.appendChild(slot);
		}
	}

	get item() { return this._items; }
	set items(items: ItemProp[]) {
		this._items = items;
		for (let i = 0; i < this.container.childElementCount; i++) {
			const slot = this.container.children[i] as ItemSlot;
			slot.setItem(items[i]);
		}
	}

	addItem(item: ItemProp) {
		for (let i = 0; i < this.container.childElementCount; i++) {
			const slot = this.container.children[i] as ItemSlot;
			if (!slot.item) {
				slot.setItem(item);
				return;
			}
		}
	}

}

const HTML = `
<div class="container"></div>
`;

const CSS = `
.container {
	display: flex;
	justify-items: stretch;
	flex-wrap: wrap;
	justify-content: space-evenly;
	grid-gap: 5px;
	padding: 10px;
}
.item-slot {
	width: 65px;
	height: 65px;
	background-color: #f0f0f0;
	cursor: move;
}
`

customElements.define("item-container", ItemContainerDialog);
