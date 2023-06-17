import { TileType, WorldGenerator } from "./src";

const worldGen = new WorldGenerator();

const TileMap = {
	[TileType.None]: `\x1b[48;5;16m `,
	[TileType.Dirt]: `\x1b[48;5;130m `,
	[TileType.Stone]: `\x1b[48;5;8m `,
	[TileType.Ruby]: `\x1b[48;5;196m `,
	[TileType.Iron]: `\x1b[48;5;215m `,
	[TileType.MushroomCap]: `\x1b[48;5;124m `,
	[TileType.MushroomCapLeft]: `\x1b[48;5;124m `,
	[TileType.MushroomCapRight]: `\x1b[48;5;124m `,
	[TileType.MushroomTrunk]: `\x1b[48;5;7m `,
}

function printChunk(world: TileType[][]) {
	for (let y = 0; y < world.length; y++) {
		const line = world[y].map((tile) => TileMap[tile] ?? TileMap[TileType.None]).join('');
		console.log(`${line}\x1b[39;49m`);
	}
}

printChunk(worldGen.getChunk(0, -1));
printChunk(worldGen.getChunk(0, 0));
printChunk(worldGen.getChunk(0, 1));