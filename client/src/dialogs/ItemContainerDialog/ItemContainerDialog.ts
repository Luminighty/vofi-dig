import HTML from "./ItemContainerDialog.html";
import CSS from "./ItemContainerDialog.css";
import { BaseDialog, withDialog } from "../Dialog/Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "../ItemSlot/ItemSlot";
import { injectCustomElement } from "../utils";

interface ItemContainerProps {
	title: string;
	count: number;
	items: (ItemProp | undefined)[];
	onItemsChanged: (items: (ItemProp | undefined)[]) => void;
}

@withDialog({title: "Container", width: 300})
export class ItemContainerDialog extends HTMLElement {
	private container: HTMLElement;
	dialog!: BaseDialog;
	onItemChanged?: (items: (ItemProp | undefined)[]) => void;
	
	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);

		this.container = root.querySelector(".container") as HTMLElement;
	}

	static open(props: ItemContainerProps) {
		const container = document.createElement("item-container") as ItemContainerDialog;
		container.slotCount = props.count;
		container.items = props.items;
		container.onItemChanged = props.onItemsChanged;
		return container;
	}
	
	get slotCount() { return this.container.childElementCount; }
	set slotCount(value: number) {
		while (this.container.childElementCount > value)
			this.container.removeChild(this.container.lastElementChild!);
		while (this.container.childElementCount < value) {
			const slot = createItemSlot();
			slot.onItemChanged(() => {
				if (this.onItemChanged)
					this.onItemChanged(this.items);
			});
			this.container.appendChild(slot);
		}
	}

	get items() {
		const items: (ItemProp | undefined)[] = [];
		for (let i = 0; i < this.container.childElementCount; i++) {
			const slot = this.container.children[i] as ItemSlot;
			items[i] = slot.item;
		}
		return items;
	}

	set items(items: (ItemProp | undefined)[]) {
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

customElements.define("item-container", ItemContainerDialog);
