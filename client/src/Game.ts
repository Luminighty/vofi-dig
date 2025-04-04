import { Application } from "pixi.js";
import { registerComponents } from "./components/registry";
import { Entity, World, createWorld, loadEntityBlueprintRegistry } from "./entities";
import { initControls, updateControls } from "./systems/controls";
import { PositionComponent } from "./components/Position.component";
import { ChunkLoaderComponent } from "./components/player/ChunkLoader.component";
import { UpdateComponent } from "./components/Update.component";
import { Socket } from "socket.io-client";
import { LocalStorage } from "./systems/storage";
import { PlayerComponent } from "./components/player/Player.component";
import { PlayerSkinComponent } from "./components/player/PlayerSkin.component";
import { LoadingBar } from "./dialogs/LoadingBar";
import { initDebug } from "./debug";
import { ClientActorComponent } from "./components/network/ClientActor.component";
import { RecipeDBComponent } from "./components/item/RecipeDB.component";
import { GameConfig } from "./config";

export async function Init(app: Application, socket: Socket) {
	const loadingBar = LoadingBar();

	registerComponents();
	await loadEntityBlueprintRegistry(loadingBar);
	await initControls(app);
	const world = createWorld(app, socket);
	world.addEntity("DataStorage");

	loadingBar.label = "Loading Player";
	loadingBar.determinate = false;
	const { userId, entities, spawn } = await world.networkHandler.initPlayer();

	LocalStorage.setUserId(userId);
	LocalStorage.clearEntities(entities);
	entities.forEach((id) => LoadClientEntity(id, world));

	world.addEntity("Fren", { x: GameConfig.chunkSize * 10, y: GameConfig.chunkSize * -4 });
	
	const player = await getOrCreatePlayer(world, {...spawn});
	const position = player.getComponent(PositionComponent);
	player
		.getComponent(ChunkLoaderComponent)
		.updateAllChunks({x: position.chunkX, y: position.chunkY});
	
	await world.networkHandler.getState(loadingBar, position.position);

	console.log("Starting ticker");
		
	app.ticker.add((dt) => {
		world.queryEntity(UpdateComponent)[0]
			.map((c) => c.update({dt}));
		updateControls();
	});

	initDebug(world, player);

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "hidden")
			return;
		const clientActors = world.queryEntity(ClientActorComponent)[0];
		clientActors.forEach(SaveClientActor);
	});

	setInterval(() => {
		const clientActors = world.queryEntity(ClientActorComponent)[0];
		clientActors.forEach(SaveClientActor);
	}, 10000);
	loadingBar.finish();
}

function SaveClientActor(clientActor: ClientActorComponent) {
	const id = clientActor.parent.id;
	const components = Entity.serialize(clientActor.parent);
	const data = {
		components,
		entityBlueprint: clientActor.clientEntity
	};
	LocalStorage.updateEntity(id, data);
}

async function LoadClientEntity(entityId: number, world: World) {
	const data = LocalStorage.getEntity(entityId);
	if (!data)
		return;
	const entity = await world.addEntity(data.entityBlueprint, {}, entityId);
	Entity.deserialize(entity, data.components);
}

async function getOrCreatePlayer(world: World, props: object) {
	const players = world.queryEntity(PlayerComponent)[0];
	if (players.length === 0) {
		const player = await world.addEntity("Player", props);
		player.getComponent(PlayerSkinComponent).randomize();
		return player;
	}
	return players[0].parent;
}