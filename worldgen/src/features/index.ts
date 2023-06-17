import { World } from "..";
import { TileType } from "../caves";
import { Chunk } from "../chunk";
import { WorldGenTool } from "./tools";
import { TreeFeatures } from "./treemap";

export type FeatureGenerator = (tiles: World, chunkX: number, chunkY: number) => World;

export const Features = [
  SpawnFeature,
  TreeFeatures,
].reverse();

function SpawnFeature(chunk: Chunk) {
  if (chunk.x !== 0 || chunk.y !== 0)
    return;
  
  const center = Chunk.chunkSize / 2;
  const sizeX = 2;
  const sizeY = 1;
  for (let i = -sizeX; i <= sizeX; i++)
  for (let j = -sizeY; j <= sizeY; j++)
    chunk.setTile(center + i, center + j, TileType.None);

  for (let i = -sizeX; i <= sizeX; i++)
    chunk.setTile(center + i, center + sizeY + 1, TileType.None);
  const index = Features.indexOf(SpawnFeature);
  if (index >= 0)
    Features.splice(index, 1);
}