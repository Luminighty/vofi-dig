import { loadEntityBlueprint } from ".";

export async function registerEntityBlueprints() {
	await loadEntityBlueprint(`assets/entities/Player.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Tile.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Debug.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Air.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Bedrock.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Fren.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Miner.entity.xml`);
}