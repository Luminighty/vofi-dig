interface SliderOptions {
	min: number,
	max: number,
	step: number,
	value: number,
}
export function Slider(parent: HTMLElement, title: string, onChange?: () => void, options: Partial<SliderOptions> = {}) {

	const container = document.createElement("div");
	container.innerHTML = `
		<span>${title}: </span>
		<input min="${options.min ?? 0}" max="${options.max ?? 0}" step="${options.step ?? 1}" value="${options.value}" type="range" />
		<span class="value">${options.value}</span>
	`;

	parent.appendChild(container);
	const slider = container.querySelector("input") as HTMLInputElement;
	const value = container.querySelector(".value") as HTMLSpanElement;

	slider.addEventListener("input", () => {
		value.innerText = slider.value;
		onChange?.();
	});

	return slider;
}