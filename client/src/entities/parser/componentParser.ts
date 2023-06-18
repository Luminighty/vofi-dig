import { parseArray, parseAttributes, tryParseInt } from "./utils";

export const ComponentParser = {
	"SpriteSocketComponent": (component: Element) => {
		const sockets = {};
		const keys: string[] = [];
		for (let i = 0; i < component.children.length; i++) {
			const socket = component.children[i];
			const props = parseAttributes(socket);
			if (!props["key"])
				throw new Error(`Socket is missing key prop: ${JSON.stringify(props)}`);
			keys.push(props["key"]);
			sockets[props["key"]] = props;
		}
		return { sockets, keys: keys.reverse() }
	},
	"RecipeComponent": (component: Element) => {
		const inputs: Array<object> = [];
		const outputs: Array<object> = [];
		for (let i = 0; i < component.children.length; i++) {
			const tag = component.children[i];
			if (tag.tagName === "Input") {
				inputs.push({
					type: parseArray(tag.getAttribute("type") ?? "").filter((v) => v.length > 0),
					amount: tryParseInt(tag.getAttribute("amount")) ?? 1,
					slot: tag.getAttribute("slot") ?? "base",
				});
			}
			if (tag.tagName === "Output") {
				outputs.push({
					item: tag.getAttribute("item"),
					amount: tryParseInt(tag.getAttribute("amount")) ?? 1,
				});
			}
		}
		return {
			inputs, outputs
		}
	}
}