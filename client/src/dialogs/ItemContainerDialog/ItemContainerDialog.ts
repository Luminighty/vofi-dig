import HTML from "./ItemContainerDialog.html";
import CSS from "./ItemContainerDialog.css";
import { BaseDialog, DialogProps, withDialog } from "../Dialog/Dialog";
import { ItemProp, ItemSlot, createItemSlot } from "../ItemSlot/ItemSlot";
import { injectCustomElement } from "../utils";

interface ItemContainerProps {
	title: string;
	key?: string;
	count: number;
	items: (ItemProp | undefined)[];
	width?: number,
	allowedTags?: string[],
	onItemsChanged: (items: (ItemProp | undefined)[]) => void;
}


@withDialog({title: "Container", width: 300, key: "container"})
export class ItemContainerDialog extends HTMLElement {
	private container: HTMLElement;
	private _allowedTags: string[] = [];
	dialog!: BaseDialog;
	onItemChanged?: (items: (ItemProp | undefined)[]) => void;
	
	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);

		this.container = root.querySelector(".container") as HTMLElement;
	}

	static open(props: ItemContainerProps & DialogProps) {
		const container = document.createElement("item-container") as ItemContainerDialog;
		container.slotCount = props.count;
		container.allowedTags = props.allowedTags ?? [];
		container.items = props.items;
		container.onItemChanged = props.onItemsChanged;
		return container;
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

customElements.define("item-container", ItemContainerDialog);
