import { ClearHover, Drag, Hover } from "./DragContext";

export interface ItemProp {
	img: string;
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
	private listeners: { [key: string]: Array<(event) => void> } = {};

	constructor() {
		super();
		const root = this.attachShadow({mode: "open"});
		const wrapper = document.createElement("div");
		const style = document.createElement("style");
		wrapper.innerHTML = HTML;
		style.textContent = CSS;
		root.append(style, wrapper);
		this.image = wrapper.querySelector("img") as HTMLImageElement;
		this.labelElement = wrapper.querySelector("span") as HTMLElement;
		wrapper.addEventListener("mousedown", this.drag.bind(this));
		wrapper.addEventListener("mouseleave", () => ClearHover(this));
		wrapper.addEventListener("mouseenter", () => Hover(this));
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
		console.log(hovering);
		if (!hovering.allowsItem(this.item))
			return;
		const other = hovering.item && {...hovering.item};
		hovering.setItem(this.item);
		hovering.fireEvent("itemchanged", {});
		this.setItem(other);
		this.fireEvent("itemchanged", {});
	}

	fireEvent(eventType: string, args: object) {
		this.listeners[eventType]?.forEach((callback) => callback(args));
	}

	onItemChanged(callback: (event) => void) {
		if (!this.listeners["itemchanged"]) {
			this.listeners["itemchanged"] = [callback];
		} else {
			this.listeners["itemchanged"].push(callback);
		}
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

const HTML = `
<div class="item-slot">
	<img />
	<span class="label"></span>
</div>
`;

const CSS = `
.item-slot {
  position: relative;
	width: 65px;
	height: 65px;
	background-color: #f0f0f0;
}
.item-slot img {
	width: 65px;
	height: 65px;
	image-rendering: pixelated;
}
.item-slot img[src=""] {
  visibility: hidden;
}
.item-slot img.dragged {
	position: absolute;
	pointer-events: none;
	z-index: 9999;
}
.draggable {
	cursor: pointer;
}
.item-slot .label {
  position: absolute;
  bottom: 0;
  right: 0;
  color: black;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: bold;
}
`

customElements.define("item-slot", ItemSlot);

