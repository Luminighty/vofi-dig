import { World } from "..";
import { Random } from "../../math/random";
import { TileType } from "../caves";

export function generateFeatures(map: World) {
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
}


function generateTree(map: World, x: number, y: number) {
  const MaxDeltaHeight = 3;
  const MinHeight = 2;
  
  const MaxDeltaWidth = 3;
  const MinWidth = 1;
  
  const height = Math.floor(Random.get2D(x, y) * MaxDeltaHeight) + MinHeight;
  const width = Math.floor(Random.get3D(x, y, 399912) * MaxDeltaWidth) + MinWidth;

  for (let i = 0; i < height; i++)
    map[y - i][x] = TileType.MushroomTrunk;

  for (let i = 0; i <= width; i++) {
    map[y - height][x + i] = i < width ? TileType.MushroomCap : TileType.MushroomCapRight;
    map[y - height][x - i] = i < width ? TileType.MushroomCap : TileType.MushroomCapLeft;
  }
}
