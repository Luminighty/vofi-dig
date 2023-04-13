import { Application, Assets, Container } from "pixi.js";
import { registerComponents } from "./components/registry";
import { createWorld, registerEntity } from "./entities";
import { ParseEntity } from "./entities/parser";
import { baseEvent } from "./events";
import { generateCave } from "./worldgen/caves";
import { GameConfig } from "./config";
import { initControls } from "./systems/controls";

export async function Init(app: Application) {
	registerComponents();
	initControls(app);

	await loadEntityBlueprint(`assets/entities/Player.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Tile.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Debug.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Air.entity.xml`);
	const world = createWorld(app);
	const cave = generateCave();

	for (let y = 0; y < cave.length; y++) {
		const row = cave[y];
		for (let x = 0; x < row.length; x++) {
			const tile = row[x];
			world.addEntity("Air", { x: x*16, y: y*16 });
			if (tile == 0)
				continue;
			if (Math.abs(x - row.length / 2) < 2 && y == cave.length / 2)
				continue;
			world.addEntity("Tile", { x: x*16, y: y*16 });
		}
	}
	world.addEntity("Player", { x: cave[0].length * 8, y: cave.length * 8 });
	app.ticker.add((dt) => {
		world.fireEvent(baseEvent("onUpdate", {dt}));
	})

}

async function loadEntityBlueprint(path) {
	const entity = await Assets.load(path);
	registerEntity(ParseEntity(entity));
}