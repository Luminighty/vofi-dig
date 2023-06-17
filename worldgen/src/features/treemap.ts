import { Random } from "@dig/math";
import { createNoise2D } from "simplex-noise";
import { useMetaGenerator } from "./meta";
import { Chunk } from "../chunk";
import { TileType } from "../caves";

export interface TreeMeta {
	x: number,
	y: number,
	width: number,
	height: number,
}

const chunkSpan = 10;
const metaSize = chunkSpan * 16;
const noise = createNoise2D(Random.get.bind(Random));


export const getTreeMeta = useMetaGenerator(chunkSpan, (metaChunkX, metaChunkY) => {
	const treeAmountVariance = 200;
	const treeAmount = ((noise(metaChunkX, metaChunkY) + 1) * 0.5) * treeAmountVariance;

	const trees: TreeMeta[] = [];
	for (let i = 0; i < treeAmount; i++)
		generateTreeMeta(trees);

	trees.forEach((tree) => {
		tree.x += metaChunkX * metaSize;
		tree.y += metaChunkY * metaSize;
	})
	return trees;
});

export function TreeFeatures(chunk: Chunk) {
	const meta = getTreeMeta(chunk.x, chunk.y) as TreeMeta[];
	generateTrees(meta, chunk);
}

export function generateTrees(trees: TreeMeta[], chunk: Chunk) {
	const topLeft = chunk.topLeft;
	const bottomRight = chunk.bottomRight;
	for (const tree of trees) {
		for (const tileData of TreeIterator(tree)) {
			if (tileData.x < topLeft.x || tileData.y < topLeft.y)
				continue;
			if (tileData.x > bottomRight.x || tileData.y > bottomRight.y)
				continue;
			chunk.setTile(tileData.x - topLeft.x, tileData.y - topLeft.y, tileData.tile);
		}
	}
}

interface TileData {
	tile: TileType,
	x: number,
	y: number
}


function* TreeIterator(tree: TreeMeta): Generator<TileData> {
	for (let y = 0; y < tree.height; y++)
		yield { tile: TileType.MushroomTrunk, x: tree.x, y: tree.y - y };
	for (let x = 1 - tree.width; x < tree.width; x++) {
		yield { tile: TileType.MushroomCap, x: x + tree.x, y: tree.y - tree.height };
	}
	yield { tile: TileType.MushroomCapLeft , x: tree.x - tree.width, y: tree.y - tree.height };
	yield { tile: TileType.MushroomCapRight, x: tree.x + tree.width, y: tree.y - tree.height };
}



function generateTreeMeta(trees: TreeMeta[]) {
	const maxTreeIteration = 10;
	let iterator = 0;
	const height = Math.floor(Random.get() * 3 + 1);
	const width = Math.floor(Random.get() * 2 + 1);
	while (iterator++ < maxTreeIteration) {
		const tree = tryGenerateTree(trees, width, height);
		if (tree) {
			trees.push(tree);
			return;
		}
	}
}

function tryGenerateTree(trees: TreeMeta[], width: number, height: number): TreeMeta | void {
	const x = Math.floor(Random.get() * metaSize);
	const y = Math.floor(Random.get() * metaSize);
	for (const otherTrees of trees) {
		const distanceX = Math.abs(x - otherTrees.x);
		const distanceY = Math.abs(y - otherTrees.y);

		const minDistanceX = otherTrees.width + width;
		const minDistanceY = otherTrees.height + height;

		if (minDistanceX > distanceX && minDistanceY > distanceY)
			return;
	}
	return {
		x, y, width, height
	}
}

function metaChunkToPosition(chunk) {
	return chunk * chunkSpan * 16;
}