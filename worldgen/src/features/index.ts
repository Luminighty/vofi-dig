import { Random } from "@dig/math";
import { World } from "..";
import { TileType } from "../caves";
import { WorldGenTool } from "./tools";

export type FeatureGenerator = (tiles: World, chunkX: number, chunkY: number) => World;

export const Features = [
  generateSpawn,
].reverse();

export function generateSpawn(tiles: World, chunkX: number, chunkY: number): World {
  if (chunkX !== 0 || chunkY !== 0)
    return tiles;

  const center = tiles.length / 2;
  const sizeX = 2;
  const sizeY = 1;
  for (let i = -sizeX; i <= sizeX; i++)
  for (let j = -sizeY; j <= sizeY; j++)
    tiles[center + i][center + j] = TileType.None;

  for (let i = -sizeX; i <= sizeX; i++)
    tiles[center + i][center + sizeY + 1] = TileType.Dirt;
  return tiles;
}

/* let worldgen!: WorldGenTool;

export function generateFeatures(map: World) {
  worldgen = new WorldGenTool(map);
  const width = map[0].length;
  const height = map.length;
  const center = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  };
  generateTree(map, center.x + 5, center.y + 3);
  generateTree(map, center.x - 4, center.y + 1);
  generateTree(map, center.x + 10, center.y + 5);
  generateTree(map, center.x - 10, center.y + 3);
  generateTree(map, center.x - 16, center.y + 3);
  generateTree(map, center.x - 25, center.y + 3);
  generateSpawn(center.x, center.y);
}

function generateSpawn(centerX: number, centerY: number) {
  const width = 4;
  const height = 3;
  worldgen
    .setFill(TileType.None)
    .drawRect(centerX - width + 1, centerY - height + 1, width * 2 - 1, height)
    .end();
  
  worldgen
    .setStroke(TileType.Dirt)
    .drawLine(centerX - width + 1, centerY + 1, width * 2 - 1, 1)
    .end();
}

function generateTree(map: World, x: number, y: number) {
  const MaxDeltaHeight = 3;
  const MinHeight = 3;
  
  const MaxDeltaWidth = 1;
  const MinWidth = 2;
  
  const height = Math.floor(Random.get2D(x, y) * MaxDeltaHeight) + MinHeight;
  const width = Math.floor(Random.get3D(x, y, 399912) * MaxDeltaWidth) + MinWidth;

  worldgen.setStroke(TileType.MushroomTrunk);
  worldgen.drawLine(x, y - height + 1, 1, height);

  worldgen.setStroke(TileType.MushroomCap);
  worldgen.drawLine(x - width, y - height, width * 2 + 1, 1);
  map[y - height][x + width] = TileType.MushroomCapRight
  map[y - height][x - width] = TileType.MushroomCapLeft
  worldgen.end();
}
 */