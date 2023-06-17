import { Random } from "@dig/math";
import { Perlin2D, create2DPerlin } from "../perlin";
import { FeatureGenerator } from ".";

export class ForestGenerator {
	
	chunkGenerator: Perlin2D;

	constructor() {
		this.chunkGenerator = create2DPerlin(Random.getSeed(), 0.5);
	}

	get feature(): FeatureGenerator {
		return (tiles, chunkX, chunkY) => {
			return tiles
		}
	}
}