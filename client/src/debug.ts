import { PositionComponent } from "./components/Position.component";
import { ClientActorComponent } from "./components/network/ClientActor.component";
import { ChunkLoaderComponent } from "./components/player/ChunkLoader.component";
import { ToolbarDialog } from "./dialogs/ToolbarDialog/ToolbarDialog";
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
}


function LoadClientActor(clientActor: ClientActorComponent) {
	const data = LocalStorage.getEntity(clientActor.parent.id);
	Entity.deserialize(clientActor.parent, data)
}