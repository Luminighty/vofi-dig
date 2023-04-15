import { Application } from "pixi.js";
import { registerComponents } from "./components/registry";
import { createWorld, loadEntityBlueprint } from "./entities";
import { generateCave } from "./worldgen/caves";
import { initControls } from "./systems/controls";
import { PositionComponent } from "./components/Position.component";
import { Vector2 } from "./math";
import { GameConfig } from "./config";
import { ChunkLoaderComponent } from "./components/player/ChunkLoader.component";
import { UpdateComponent } from "./components/Update.component";

export async function Init(app: Application) {
	registerComponents();
	await initControls(app);

	await loadEntityBlueprint(`assets/entities/Player.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Tile.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Debug.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Air.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Bedrock.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Fren.entity.xml`);
	const world = createWorld(app);
	const cave = generateCave();

	const gridSize = GameConfig.gridSize;
	for (let y = 0; y < cave.length; y++) {
		const row = cave[y];
		for (let x = 0; x < row.length; x++) {
			const tile = row[x];
			world.addEntity("Air", Vector2.scalar(gridSize, {x, y}));
			if (tile == 0)
				continue;
			if (Math.abs(x - row.length / 2) < 2 && y == Math.ceil(cave.length / 2))
				continue;
			world.addEntity("Tile", Vector2.scalar(gridSize, {x, y}));
		}
	}
	for (let i = 0; i < cave.length; i++) {
		world.addEntity("Bedrock", { x: i * gridSize, y: -gridSize });
		world.addEntity("Bedrock", { y: i * gridSize, x: -gridSize });
		world.addEntity("Bedrock", { x: i * gridSize, y: cave.length * gridSize });
		world.addEntity("Bedrock", { x: cave[i].length * gridSize, y: i * gridSize });
	}
	world.addEntity("Fren", { x: 16, y: cave.length * 16 - 116 });
	const player = world.addEntity("Player", { x: cave[0].length * 8, y: cave.length * 8 });
	
	const position = player.getComponent(PositionComponent);
	player
		.getComponent(ChunkLoaderComponent)
		.updateAllChunks({x: position.chunkX, y: position.chunkY});

	app.ticker.add((dt) => {
		world.queryEntity(UpdateComponent)[0]
			.map((c) => c.update({dt}));
	});
}
