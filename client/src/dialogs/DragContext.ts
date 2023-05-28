interface IDragContext {
	current: HTMLElement | null,
	hover: HTMLElement | null,
	options: DragOptions,
	x: number,
	y: number,
}

const dragContext: IDragContext = {
	current: null,
	hover: null,
	options: {},
	x: 0,
	y: 0,
}

interface DragOptions {
	onDrop?: (hover: HTMLElement | null) => void;
}

export function Drag(event: MouseEvent, element: HTMLElement, options: DragOptions = {}) {
	element.classList.add("dragged");
	dragContext.options = options;
	dragContext.current = element;
	dragContext.x = event.clientX - element.offsetLeft;
	dragContext.y = event.clientY - element.offsetTop;
}

export function Drop(element: HTMLElement) {
	if (dragContext.current !== element)
		return null;
	dragContext.current.classList.remove("dragged");
	dragContext.current = null;
	dragContext.options.onDrop?.(dragContext.hover);
	return dragContext.hover;
}

export function Hover(element: HTMLElement) {
	dragContext.hover = element;
}
export function ClearHover(element: HTMLElement) {
	if (element === dragContext.hover)
		dragContext.hover = null;
}

document.body.addEventListener("mousemove", (event) => {
	if (!dragContext.current)
		return;
	event.stopPropagation();
	event.preventDefault();
	dragContext.current.style.left = `${event.clientX - dragContext.x}px`;
	dragContext.current.style.top = `${event.clientY - dragContext.y}px`;
});

document.body.addEventListener("mouseup", (event) => {
	if (dragContext.current)
		Drop(dragContext.current);
})