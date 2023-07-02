import { Entity } from "../entities";

export class InteractableComponent {
	static readonly COMPONENT_ID = "InteractableComponent" as const;
	parent!: Entity;
	event!: string;

	interact(source, props = {}) {
		this.parent.fireEvent(this.event, {source, ...props});
	}
	
}