import { ComponentBlueprint, EntityBlueprint } from "../blueprint";
import { ComponentParser } from "./componentParser";
import { parseAttributes } from "./utils";

const parser = new DOMParser();
export function ParseEntity(xml: string): EntityBlueprint {
	const entityDoc = parser.parseFromString(xml, "text/xml");
	const root = entityDoc.documentElement;

	const id = root.getAttribute("id")!;

	const components: ComponentBlueprint[] = [];
	for (let i = 0; i < root.children.length; i++) {
		const component = root.children[i];
		let props = parseAttributes(component);
		if (ComponentParser[component.tagName])
			props = { ...props, ...ComponentParser[component.tagName](component) }
		components.push({
			type: component.tagName,
			props
		})
	}

	return { id, components }
}
