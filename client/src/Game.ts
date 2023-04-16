import { Application } from "pixi.js";
import { registerComponents } from "./components/registry";
import { createWorld } from "./entities";
import { initControls } from "./systems/controls";
import { PositionComponent } from "./components/Position.component";
import { GameConfig } from "./config";
import { ChunkLoaderComponent } from "./components/player/ChunkLoader.component";
import { UpdateComponent } from "./components/Update.component";
import { Socket } from "socket.io-client";
import { registerEntityBlueprints } from "./entities/registry";

export async function Init(app: Application, socket: Socket) {
	registerComponents();
	await registerEntityBlueprints();
	await initControls(app);

	const world = createWorld(app, socket);

	const gridSize = GameConfig.gridSize;
	const mapSize = 150;

	await world.networkHandler.getState();
	world.addEntity("Fren", { x: 16, y: mapSize * 16 - 116 });
	const player = world.addEntity("Player", { x: mapSize * 8, y: mapSize * 8 });
	
	const position = player.getComponent(PositionComponent);
	player
		.getComponent(ChunkLoaderComponent)
		.updateAllChunks({x: position.chunkX, y: position.chunkY});

	app.ticker.add((dt) => {
		world.queryEntity(UpdateComponent)[0]
			.map((c) => c.update({dt}));
	});

	document.addEventListener("keydown", (event) => {
		if (event.code == "KeyP") {
			if (ChunkLoaderComponent.main) {
				ChunkLoaderComponent.main.updateAllChunks(position.chunk);
			} else {
				console.error("ChunkLoaderComponent.main not found!");
			}
		}
	});
}
