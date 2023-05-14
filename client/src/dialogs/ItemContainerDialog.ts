interface Props {
	title: string;
	width: number;
}

export function ItemContainerDialog() {
	const container = document.createElement("div");
	container.innerHTML = HTML;
	document.body.appendChild(container);
}

const HTML = `
<div class="item">
	<img src="assets/textures/items/stone.png" />
</div>
`;

const CSS: Partial<CSSStyleDeclaration> = {
	position: "absolute",
	backgroundColor: "#20202077",
	display: "grid",
	zIndex: "9999",
	padding: "10px",
}