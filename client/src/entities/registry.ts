import { loadEntityBlueprint } from ".";

export async function registerEntityBlueprints() {
	await loadEntityBlueprint(`assets/entities/Player.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Debug.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Air.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Dirt.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Emerald.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Iron.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Platinum.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Ruby.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Stone.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Tungsten.entity.xml`);
	await loadEntityBlueprint(`assets/entities/tiles/Bedrock.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Fren.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Miner.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Toolbar.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Slime.entity.xml`);
	await loadEntityBlueprint(`assets/entities/Torch.entity.xml`);
}