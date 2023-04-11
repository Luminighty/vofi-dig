import { Application, Graphics } from "pixi.js";
import { generateTileset } from "./worldgen";
import { createMiner } from "./sprites/miner";
import { Controls } from "./systems/controls";
import { GameConfig, toWorldPosition } from "./config";
import { intersects } from "./systems/collision";
import { initPlayer, updatePlayer } from "./systems/player";

export async function Init(app: Application) {
	const world = generateTileset();
	const miner = createMiner();

	app.stage.addChild(world.airLayer);
	app.stage.addChild(world.groundLayer);
	app.stage.addChild(miner.sprite);

	await initPlayer(app);


	app.ticker.add((dt) => {
		updatePlayer(miner, world, dt);

	})
}