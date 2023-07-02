import { World } from "../../entities";

export class DiggingItemComponent {
	static readonly COMPONENT_ID = "DiggingItemComponent" as const;
	world!: World;
	strength = 1;

	getDigData(props) {
		props.strength = this.strength;
	}

}