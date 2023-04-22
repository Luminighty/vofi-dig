import { GameConfig } from "../config";

export class TileTagComponent {
	static readonly COMPONENT_ID = "TileTagComponent" as const;

	onInit(props) {
		if (props.x)
			props.x -= props.x % GameConfig.gridSize;
		if (props.y)
			props.y -= props.y % GameConfig.gridSize;
	}

	onPositionChanged({x, y}) {
		
	}


}

export const Tiles = new Map(); 

