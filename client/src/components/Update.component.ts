import { Entity } from "../entities";

export class UpdateComponent {
	static readonly COMPONENT_ID = "UpdateComponent" as const;
	parent!: Entity;

	update(props) {
		this.parent.fireEvent("onUpdate", props);
	}
}