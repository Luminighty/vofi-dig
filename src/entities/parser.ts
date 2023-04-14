import { ComponentBlueprint, EntityBlueprint } from "./blueprint";

const parser = new DOMParser();
export function ParseEntity(xml: string): EntityBlueprint {
	const entityDoc = parser.parseFromString(xml, "text/xml");
	const root = entityDoc.documentElement;

	const id = root.getAttribute("id")!;

	const components: ComponentBlueprint[] = [];
	for (let i = 0; i < root.children.length; i++) {
		const component = root.children[i];
		const props = {};
		for (let j = 0; j < component.attributes.length; j++) {
			const attribute = component.attributes[j]
			props[attribute.name] = parseAttribute(component.tagName, attribute.name, attribute.value);
		}
		components.push({
			type: component.tagName,
			props
		})
	}

	return { id, components }
}

function parseAttribute(tag: string, key: string, value: string): any {
	const parser = ParseLookup[tag]?.[key] ?? ParseLookup[key];
	if (parser)
		return parser(value);

	if (value.startsWith("0x"))
		return parseInt(value);
	
	if (value.toLowerCase() === "false")
		return false;
	if (value.toLowerCase() === "true")
		return true;

	const number = parseFloat(value);
	return isNaN(number) ? value : number;
}


function parseShape(value: string): {x: number, y: number}[] {
	if (value.toLowerCase().startsWith("rect")) {
		const [x, y, width, height] = value.substring(4).trimStart().split(" ").map((value) => parseFloat(value));
		value = `${x},${y} ; ${x+width},${y} ; ${x+width},${y+height} ; ${x},${y+height}`
	}
	const shape = value
		.split(";")
		.map((v) => v.trim())
		.filter((v) => v)
		.map((v) => v.split(",", 2))
		.map((v) => v.map((v) => parseFloat(v)))
		.map(([x, y]) => ({x, y}))
	return shape;
}


const ParseLookup = {
	"CollisionComponent": {
		"shape": parseShape,
	},
	"DebugRectComponent": {
		"fillColor": parseInt,
	}
}
