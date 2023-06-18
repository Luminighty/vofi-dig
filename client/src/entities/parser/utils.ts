import { ParseLookup } from "./attributeParser";

export function parseAttributes(component: Element): object {
	const props = {};
	for (let j = 0; j < component.attributes.length; j++) {
		const attribute = component.attributes[j]
		props[attribute.name] = parseAttribute(component.tagName, attribute.name, attribute.value);
	}
	return props;
}

export function parseAttribute(tag: string, key: string, value: string): unknown {
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

export function parseArray(value: string) {
	return value.split(";").map((v) => v.trim());
}

export function tryParseInt(value: string | null, radix?: number) : number | null {
	if (!value) return null;
	const number = parseInt(value, radix);
	return isNaN(number) ? null : number;
}

export function tryParseFloat(value: string | null) : number | null {
	if (!value) return null;
	const number = parseFloat(value);
	return isNaN(number) ? null : number;
}

export function parseShape(value: string): {x: number, y: number}[] {
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
