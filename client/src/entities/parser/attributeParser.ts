import { parseArray, parseShape } from "./utils";

export const ParseLookup = {
	"CollisionComponent": {
		"shape": parseShape,
	},
	"DebugRectComponent": {
		"fillColor": parseInt,
	},
	"ClientActorComponent": {
		"sync": parseArray,
	},
	"PlayerToolbarComponent": {
		"entities": parseArray,
	},
	"CraftingStationComponent": {
		"recipes": parseArray,
	},
	"ItemComponent": {
		"tags": parseArray,
	},
}