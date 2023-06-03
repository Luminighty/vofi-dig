import { Random } from "@dig/math";
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

export function generateCave(width, height) {
	const groundPerlin = create2DPerlin(Random.getSeed(), config.ground.scale);
	const tunnelPerlin = create2DPerlin(Random.getSeed(), config.tunnel.scale);
	const orePerlin = create2DPerlin(Random.getSeed(), config.ore.scale);
	const rubyPerlin = create2DPerlin(Random.getSeed(), config.ruby.scale);
	const dirtPerlin = create2DPerlin(Random.getSeed(), config.dirt.scale);

	const cols = width;
	const rows = height;
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

const pipeline = [
	{ name: "chambers", tile: TileType.None, scale: 0.1, threshold: -0.22, method: onHigh },
	{ name: "dirt", tile: TileType.Dirt, scale: 0.15, threshold: -0.35, method: onHigh },
	{ name: "tunnel", tile: TileType.Dirt, scale: 0.060, threshold: 0.035, method: onGrey },
	{ name: "ore", tile: TileType.Iron, scale: 0.15, threshold: -0.47, method: onHigh },
	{ name: "gem", tile: TileType.Ruby, scale: 0.15, threshold: -0.47, method: onHigh },
]

export class TileGenerator {
	private generators: Map<string, (x: number, y: number) => number> = new Map();

	constructor() {
		pipeline.forEach((p) => {
			const generator = create2DPerlin(Random.getSeed(), p.scale);
			this.generators.set(p.name, generator)
		})
	}

	generate(x, y) {
		for (const pipe of pipeline) {
			const generator = this.generators.get(pipe.name)!;
			const value = pipe.method(generator(x, y), pipe.threshold);
			if (!value)
				return pipe.tile;
		}
		return TileType.Stone;
	}
}