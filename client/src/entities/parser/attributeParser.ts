import { parseArray, parseShape } from "./utils";

export const ParseLookup = {
	"CollisionComponent": {
		"shape": parseShape,
	},
	"TriggerColliderComponent": {
		"shape": parseShape,
	},
	"DebugRectComponent": {
		"fillColor": parseInt,
	},
	"ClientActorComponent": {
		"sync": parseArray,
	},
	"CraftingStationComponent": {
		"recipes": parseArray,
	},
	"ItemComponent": {
		"tags": parseArray,
	},
}