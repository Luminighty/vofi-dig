import { GameConfig } from "../config";
import { Random } from "../math/random";
import { create2DPerlin } from "./perlin";

export enum TileType {
	None = "None",
	Stone = "Stone",
	Iron = "Iron",
	Ruby = "Ruby",
	Dirt = "Dirt",
	MushroomTrunk = "MushroomTrunk",
	MushroomCap = "MushroomCap",
	MushroomCapLeft = "MushroomCapLeft",
	MushroomCapRight = "MushroomCapRight",
}

const onGrey = (value, threshold) => Math.abs(value) > threshold;
const onHigh = (value, threshold) => value > threshold;
const onLow = (value, threshold) => value < threshold;


export type Cave = TileType[][];

const config = {
	ground: { scale: 0.1, threshold: -0.22, method: onHigh },
	dirt: { scale: 0.15, threshold: -0.35, method: onHigh },
	tunnel: { scale: 0.060, threshold: 0.035, method: onGrey },
	ore: { scale: 0.15, threshold: -0.47, method: onLow },
	ruby: { scale: 0.15, threshold: -0.47, method: onLow },
};

export function generateCave() {
	Random.seed = 0;
	const groundPerlin = create2DPerlin(Random.getSeed(), config.ground.scale);
	const tunnelPerlin = create2DPerlin(Random.getSeed(), config.tunnel.scale);
	const orePerlin = create2DPerlin(Random.getSeed(), config.ore.scale);
	const rubyPerlin = create2DPerlin(Random.getSeed(), config.ruby.scale);
	const dirtPerlin = create2DPerlin(Random.getSeed(), config.dirt.scale);

	const cols = GameConfig.world.x;
	const rows = GameConfig.world.y;
	return Array(rows).fill(0).map((_, y) =>
		Array(cols).fill(0).map((_, x) => {
			const chamberValue = config.ground.method(groundPerlin(x, y), config.ground.threshold);
			const dirtValue = config.dirt.method(dirtPerlin(x, y), config.dirt.threshold);
			const tunnelValue = config.tunnel.method(tunnelPerlin(x, y), config.tunnel.threshold);
			const oreValue = config.ore.method(orePerlin(x, y), config.ore.threshold);
			const rubyValue = config.ruby.method(rubyPerlin(x, y), config.ruby.threshold);
			if (!chamberValue)
				return TileType.None;
			if (!dirtValue)
				return TileType.Dirt;
			if (!tunnelValue)
				return TileType.Dirt;
			if (oreValue)
					return TileType.Iron;
			if (rubyValue)
					return TileType.Ruby;
			return TileType.Stone;
		}));
}
