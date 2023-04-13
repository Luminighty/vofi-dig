import { Component } from "../components";

export interface Event {
	call: (component: Component) => void;
}

export function baseEvent(type: string, param = {}): Event {
	return {
		call(component) {
			component[type]?.(param);
		},
	}
}
