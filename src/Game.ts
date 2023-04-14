import { Application, Assets, Container, Graphics } from "pixi.js";
import { registerComponents } from "./components/registry";
import { Entity, World, createWorld, registerEntity } from "./entities";
import { ParseEntity } from "./entities/parser";
import { baseEvent } from "./events";
import { generateCave } from "./worldgen/caves";
import { AppConfig, GameConfig } from "./config";
import { Controls, initControls } from "./systems/controls";
import { SpriteComponent } from "./components/Sprite.component";
import { Vector2 } from "./math";
import { PositionComponent } from "./components/Position.component";

export async function Init(app: Application) {
	registerComponents();
	await initControls(app);

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
			//world.addEntity("Air", { x: x*16, y: y*16 });
			if (tile == 0)
				continue;
			if (Math.abs(x - row.length / 2) < 2 && y == Math.ceil(cave.length / 2))
				continue;
			world.addEntity("Tile", { x: x*16, y: y*16 });
		}
	}

	const graphics = new Graphics();
	app.stage.addChild(graphics);
	const player = world.addEntity("Player", { x: cave[0].length * 8, y: cave.length * 8 });
	app.ticker.add((dt) => {
		world.fireEvent(baseEvent("onUpdate", {dt}));
	});

	Debug(world, app, player);

	app.stage.position.set(app.screen.width/2, app.screen.height/2);
}

async function loadEntityBlueprint(path) {
	const entity = await Assets.load(path);
	registerEntity(ParseEntity(entity));
}

function Debug(world: World, app: Application, player: Entity) {
	
	const [sprites] = world.queryEntity(SpriteComponent);
	const appSize = {x: app.view.width / (2 * AppConfig.scale), y: app.view.height / (2 * AppConfig.scale)};
	const appLength = Math.sqrt(Vector2.dot(appSize, appSize));
	console.log(appLength);
	
	for (const sprite of sprites) {
		if (sprite.parent === player)
			continue;
		const delta = Vector2.sub(sprite.position ?? Vector2.zero, player.getComponent(PositionComponent))
		const distance = Math.sqrt(Vector2.dot(delta, delta));
		if (distance > appLength) {
			sprite.sprite.visible = false;
		}
	}
}