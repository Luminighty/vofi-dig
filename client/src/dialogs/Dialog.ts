import { Drag, Drop } from "./DragContext";

export interface DialogProps {
	title?: string;
	width?: number;
	height?: number;
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

export function createDialog(props: DialogProps = {}) {
	const dialog = document.createElement("dialog-base") as BaseDialog;
	document.body.appendChild(dialog);
	if (props.title)
		dialog.title = props.title;
	dialog.height = props.height;
	dialog.width = props.width;
	dialog.onClose(() => {
		document.body.removeChild(dialog);
		const index = openDialogs.indexOf(dialog);
		if (index !== -1)
			openDialogs.splice(index, 1);
	});
	openDialogs.push(dialog);
	updateDialogZIndex();
	return dialog;
}

export class BaseDialog extends HTMLElement {
	baseElement: HTMLElement;
	private contentElement: HTMLElement;
	private titleElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor() {
		super();
		
		const root = this.attachShadow({mode: "open"});
		const wrapper = document.createElement("div");
		const style = document.createElement("style");
		wrapper.innerHTML = HTML;
		style.textContent = CSS;
		root.append(style, wrapper);

		this.baseElement = wrapper.querySelector(".dialog-base") as HTMLElement;
		this.contentElement = wrapper.querySelector(".dialog-content") as HTMLElement;
		this.titleElement = wrapper.querySelector(".title") as HTMLElement;
		this.closeButton = wrapper.querySelector(".close-button") as HTMLButtonElement;
		const header = wrapper.querySelector(".dialog-header") as HTMLElement;
		header.addEventListener("mousedown", (e) => Drag(e, this.baseElement));
		header.addEventListener("mouseup", () => Drop(this.baseElement));
		wrapper.addEventListener("mousedown", () => moveToFront(this));
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
		return this.closeButton.addEventListener("click", callback);
	}

	get content() { return this.contentElement; }

}

const HTML = `
<div class="dialog-base">
	<div class="dialog-header">
		<span class="title">Test</span>
		<button class="close-button">X</button>
	</div>
	<div class="dialog-content">
	</div>
</div>
`;

const CSS = `
.dialog-base {
	position: absolute;
	background-color: grey;
	z-index: 10;
	border: 1px solid black;
	box-shadow: 2px 2px 6px 2px black;
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  cursor: move;
}
.title {
  font-weight: bold;
}
.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}
`;

customElements.define("dialog-base", BaseDialog);