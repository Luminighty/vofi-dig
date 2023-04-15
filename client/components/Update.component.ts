import { Entity } from "../entities";
import { baseEvent } from "../events";

export class UpdateComponent {
	static readonly COMPONENT_ID = "UpdateComponent" as const;
	parent!: Entity;

	update(props) {
		this.parent.fireEvent(baseEvent("onUpdate", props));
	}
}