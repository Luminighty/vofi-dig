import HTML from "./ItemSlot.html"
import CSS from "./ItemSlot.css"
import { ClearHover, Drag, Hover } from "../DragContext";
import { injectCustomElement } from "../utils";
import { EventEmitter } from "../../utils/EventEmitter";

export interface ItemProp {
	img: string;
	item: string;
	amount: number;
	tags: string[];
}

interface ItemSlotProps {
	item?: ItemProp,
	allowedTags?: string[],
	label?: string,
}

export function createItemSlot({allowedTags, item, label}: ItemSlotProps = {}) {
	const slot = document.createElement("item-slot") as ItemSlot;
	slot.allowedTags = allowedTags;
	slot.setItem(item);
	slot.label = label ?? "";
	return slot;
}

export class ItemSlot extends HTMLElement {
	private image: HTMLImageElement;
	item?: ItemProp;
	private labelElement: HTMLElement;
	allowedTags?: string[];
	private itemChangedEmitter = new EventEmitter<void>();

	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);
		const slot = root.querySelector(".item-slot") as HTMLElement;

		this.image = root.querySelector("img") as HTMLImageElement;
		this.labelElement = root.querySelector("span") as HTMLElement;
		
		slot.addEventListener("mousedown", this.drag.bind(this));
		slot.addEventListener("mouseleave", () => ClearHover(this));
		slot.addEventListener("mouseenter", () => Hover(this));
	}

	drag(e: MouseEvent) {
		if (!this.item)
			return;
		Drag(e, this.image, {
			onDrop: this.drop.bind(this),
		})
	}

	drop(hovering: HTMLElement | null) {
		this.image.style.left = "";
		this.image.style.top = "";
		if (!hovering || !this.item)
			return;
		if (!(hovering instanceof ItemSlot))
			return;
		if (!hovering.allowsItem(this.item))
			return;
		const other = hovering.item && {...hovering.item};
		hovering.setItem(this.item);
		hovering.itemChangedEmitter.notify();
		this.setItem(other);
		this.itemChangedEmitter.notify();
	}

	onItemChanged(callback) {
		this.itemChangedEmitter.addListener(callback);
	}

	allowsItem(item: ItemProp) {
		return !this.allowedTags || this.allowedTags.some((tag) => item.tags.includes(tag));
	}

	setItem(item?: ItemProp) {
		this.item = item;
		if (item) {
			this.image.classList.add("draggable");
			this.image.src = item.img;
		} else {
			this.image.classList.remove("draggable");
			this.image.src = "";
		}
	}


	get label() { return this.labelElement.innerText; }
	set label(value: string) {
		this.labelElement.innerText = value;
	}
}

customElements.define("item-slot", ItemSlot);
