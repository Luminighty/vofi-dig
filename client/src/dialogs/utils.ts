export function injectCustomElement(self: HTMLElement, html: string, css: string) {
	const root = self.attachShadow({mode: "open"});
	const style = document.createElement("style");
	style.textContent = css;
	root.innerHTML = html;
	root.prepend(style);
	return root
}
