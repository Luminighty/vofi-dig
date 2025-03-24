/* eslint-disable @typescript-eslint/no-explicit-any */
import HTML from "./Dialog.html";
import CSS from "./Dialog.css";
import { Drag, Drop } from "../DragContext";
import { injectCustomElement } from "../utils";
import { EventEmitter } from "../../utils/EventEmitter";
import { LocalStorage } from "../../systems/storage";

export interface DialogProps {
	title?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	key?: string;
}

const DIALOG_Z_OFFSET = 200;
const openDialogs: BaseDialog[] = [];

function updateDialogZIndex() {
  openDialogs.forEach((dialog, index) => {
    dialog.baseElement.style.zIndex = `${DIALOG_Z_OFFSET + index + 1}`;
  });
}

function moveToFront(dialog: BaseDialog) {
	const index = openDialogs.indexOf(dialog);
	if (index !== -1)
		openDialogs.splice(index, 1);
	openDialogs.push(dialog);
	updateDialogZIndex();
}

window.addEventListener("resize", () => {
	openDialogs.forEach((dialog) => {
		dialog.bindToWindow();
	});
});

export function withDialog<T>(defaultProps: DialogProps = {}) {
  return function <C extends {
		open(props: any): HTMLElement; 
		new (...args: any[]): HTMLElement 
	}>(constructor: C) {
    return class extends constructor {
      static open(props: T) {
        const dialog = createDialog({ ...defaultProps, ...props });
        const container = super.open(props);
				container["dialog"] = dialog;
        dialog.content.appendChild(container);
        return container;
      }
    };
  };
}

export function createDialog(props: DialogProps = {}) {
	const dialog = document.createElement("dialog-base") as BaseDialog;
	document.body.appendChild(dialog);
	if (props.title)
		dialog.title = props.title;
	dialog.height = props.height ?? 200;
	dialog.width = props.width ?? 300;
	const x = (props.key && LocalStorage.getValue(`dialog-${props.key}-x`)) ?? props.x ?? 10;
	const y = (props.key && LocalStorage.getValue(`dialog-${props.key}-y`)) ?? props.y ?? 10;
	dialog.baseElement.style.left = `${x}px`;
	dialog.baseElement.style.top = `${y}px`;
	dialog.key = props.key;
	openDialogs.push(dialog);
	updateDialogZIndex();
	return dialog;
}

export class BaseDialog extends HTMLElement {
	baseElement: HTMLElement;
	private contentElement: HTMLElement;
	private titleElement: HTMLElement;
	private closeListeners = new EventEmitter<void>();
	key?: string;

	constructor() {
		super();
		const root = injectCustomElement(this, HTML, CSS);

		this.baseElement = root.querySelector(".dialog-base") as HTMLElement;
		this.contentElement = root.querySelector(".dialog-content") as HTMLElement;
		this.titleElement = root.querySelector(".title") as HTMLElement;
		const closeButton = root.querySelector(".close-button") as HTMLButtonElement;
		closeButton.addEventListener("click", () => this.close());
		const header = root.querySelector(".dialog-header") as HTMLElement;
		header.addEventListener("mousedown", (e) => Drag(e, this.baseElement));
		header.addEventListener("mouseup", () => {
			Drop(this.baseElement);
			this.bindToWindow();
		});
		root.addEventListener("mousedown", () => moveToFront(this));
	}

	connectedCallback() {
		if (this.getAttribute("title"))
			this.title = this.getAttribute("title")!;
		if (this.getAttribute("height"))
			this.height = parseInt(this.getAttribute("height")!);
		if (this.getAttribute("width"))
			this.width = parseInt(this.getAttribute("width")!);
		this.contentElement.innerHTML = this.innerHTML;
	}

	get height() { return parseFloat(this.baseElement.style.height);}
	set height(value: number | undefined) { 
		this.baseElement.style.height = value ? `${value}px` : ""; 
		this.contentElement.style.height = value ? `${value - this.contentElement.offsetTop}px` : "";
	}

	get width() { return parseFloat(this.baseElement.style.width);}
	set width(value: number | undefined) { 
		this.baseElement.style.width = value ? `${value}px` : ""; 
	}

	get title() { return this.titleElement.innerText; }
	set title(value) { this.titleElement.innerText = value; }

	onClose(callback) {
		this.closeListeners.addListener(callback);
	}

	close() {
		if (this.key) {
			LocalStorage.setValue(`dialog-${this.key}-x`, this.baseElement.offsetLeft);
			LocalStorage.setValue(`dialog-${this.key}-y`, this.baseElement.offsetTop);
		}
		this.closeListeners.notify();
		document.body.removeChild(this);
		const index = openDialogs.indexOf(this);
		if (index !== -1)
			openDialogs.splice(index, 1);
	}

	get content() { return this.contentElement; }

	bindToWindow() {
		const rect = this.baseElement.getBoundingClientRect();
		const padding = 20;
		const x = Math.min(Math.max(rect.left, padding - rect.width), window.innerWidth - padding);
		const y = Math.min(Math.max(rect.top, padding), window.innerHeight - padding);
		this.baseElement.style.left = `${x}px`;
		this.baseElement.style.top = `${y}px`;
	}
}

customElements.define("dialog-base", BaseDialog);