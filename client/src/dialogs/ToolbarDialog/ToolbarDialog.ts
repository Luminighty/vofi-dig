import HTML from "./ToolbarDialog.html";
import CSS from "./ToolbarDialog.css";
import { BaseDialog, withDialog } from "../Dialog/Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "../ItemSlot/ItemSlot";
import { injectCustomElement } from "../utils";

interface ItemContainerProps {
	slots: number;
	items: (ItemProp | undefined)[];
	width?: number,
	allowedTags?: string[],
	onItemsChanged: (items: (ItemProp | undefined)[]) => void;
}

@withDialog({title: "Toolbar", width: 300, height: 122, key: "toolbar"})
export class ToolbarDialog extends HTMLElement {
	private container: HTMLElement;
	private _allowedTags: string[] = [];
	private _selected = 0;
	dialog!: BaseDialog;
	onItemChanged?: (items: (ItemProp | undefined)[]) => void;
	
	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);

		this.container = root.querySelector(".container") as HTMLElement;
	}

	static open(props: ItemContainerProps) {
		const container = document.createElement("toolbar-dialog") as ToolbarDialog;
		container.slotCount = props.slots;
		container.allowedTags = props.allowedTags ?? [];
		container.items = props.items;
		container.onItemChanged = props.onItemsChanged;
		container.selected = 0;
		return container;
	}

	get selected() { return this._selected; }
	set selected(value) {
		this._selected = value;
		for (let i = 0; i < this.container.childElementCount; i++) {
			const slot = this.container.children[i] as ItemSlot;
			if (i === this.selected) {
				slot.classList.add("selected")
			} else {
				slot.classList.remove("selected")
			}
		}
	}
	
	get allowedTags() { return this._allowedTags; }
	set allowedTags(value) {
		this._allowedTags = value;
		for (const child of this.container.childNodes) {
			if (!(child instanceof ItemSlot))
				continue;
			child.allowedTags = value;
		}
	}

	get slotCount() { return this.container.childElementCount; }
	set slotCount(value: number) {
		while (this.container.childElementCount > value)
			this.container.removeChild(this.container.lastElementChild!);
		while (this.container.childElementCount < value) {
			const slot = createItemSlot({allowedTags: this.allowedTags});
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

customElements.define("toolbar-dialog", ToolbarDialog);
