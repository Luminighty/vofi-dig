import { Application, Graphics } from "pixi.js";
import { generateTileset } from "./worldgen";
import { createMiner } from "./sprites/miner";
import { Controls } from "./systems/controls";
import { GameConfig, toWorldPosition } from "./config";
import { intersects } from "./systems/collision";
import { updatePlayer } from "./systems/player";

export async function Init(app: Application) {
	const tileset = generateTileset();
	const miner = createMiner();
	const graphics = new Graphics();

	app.stage.addChild(tileset.airLayer);
	app.stage.addChild(tileset.groundLayer);
	app.stage.addChild(miner.sprite);
	app.stage.addChild(graphics);


	app.ticker.add((dt) => {
		updatePlayer(miner, tileset.groundSprites, dt);

		const position = toWorldPosition(miner.gridPosition);
		// graphics.clear();
		// graphics.lineStyle(1, 0xff0000, 1);
		// graphics.beginFill(0x000000, 0);
		// graphics.drawRect(position.x, position.y, GameConfig.gridSize, GameConfig.gridSize)
		// graphics.endFill();
	})
}