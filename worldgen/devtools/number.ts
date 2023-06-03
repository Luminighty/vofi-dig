interface NumberOptions {
	value: number
}
export function Number(parent: HTMLElement, title: string, onChange?: () => void, options: Partial<NumberOptions> = {}) {

	const container = document.createElement("div");
	container.innerHTML = `
		<span>${title}: </span>
		<input type="number" value="${options.value ?? 1}" />
	`;

	parent.appendChild(container);
	const input = container.querySelector("input") as HTMLInputElement;

	input.addEventListener("input", () => {
		onChange?.();
	});

	return input;
}