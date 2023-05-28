import { PositionComponent } from "./components/Position.component";
import { ClientActorComponent } from "./components/network/ClientActor.component";
import { ChunkLoaderComponent } from "./components/player/ChunkLoader.component";
import { openCraftingDialog } from "./dialogs/CraftingDialog";
import { createDialog } from "./dialogs/Dialog";
import { ItemContainerDialog, openItemContainerDialog } from "./dialogs/ItemContainerDialog";
import { Entity, World } from "./entities";
import { LocalStorage } from "./systems/storage";

export function initDebug(world: World, player: Entity) {
	const position = player.getComponent(PositionComponent);
	document.addEventListener("keydown", (event) => {
		if (event.code == "KeyO") {
			if (ChunkLoaderComponent.main) {
				ChunkLoaderComponent.main.updateAllChunks(position.chunk);
			} else {
				console.error("ChunkLoaderComponent.main not found!");
			}
		}
		if (event.code == "KeyL") {
			const clientActors = world.queryEntity(ClientActorComponent)[0];
			clientActors.forEach(LoadClientActor);
		}
	});


	window["crafting"] = openCraftingDialog({
		onCraft: (recipe, materials) => console.log({recipe, materials}),
		title: "Crafting",
		recipes: [
			{ 
				label: "Pickaxe", 
				inputs: [
					{ type:["WOOD"], amount: 1, slot:"handle" },
					{ type:["WOOD", "STONE", "STEEL"], amount: 2, slot:"head" },
				], 
				outputs: [] 
			},
			{ label: "Axe", inputs: [], outputs: [] },
			{ label: "Sword", inputs: [], outputs: [] },
			{ label: "Shovel", inputs: [], outputs: [] },
		],
		onDropItem: (item) => {
			const container = window["inventory"] as ItemContainerDialog;
			container.addItem(item);
		}
	})

	console.log("Creating dialog base");
	
	window["inventory"] = openItemContainerDialog({
		title: "Inventory",
		count: 8,
		items: [
			{ amount: 2, img: "assets/textures/items/stone.png", tags: ["STONE"], },
			{ amount: 2, img: "assets/textures/items/iron.png", tags: ["STEEL"], },
			{ amount: 2, img: "assets/textures/mushroom/item.png", tags: ["WOOD"], },
		],
	})
	
}


function LoadClientActor(clientActor: ClientActorComponent) {
	const data = LocalStorage.getEntity(clientActor.parent.id);
	Entity.deserialize(clientActor.parent, data)
}