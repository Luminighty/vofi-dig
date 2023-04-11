import { Container, Sprite, Texture } from "pixi.js";
import { TileType } from "../assets";
import { GameConfig } from "../config";
import { IRect } from "../systems/collision";
import { generateCaves } from "./caves";

interface IGroundSprite {
	sprite: Sprite,
	rect: IRect,
}

export type IGrid = (IGroundSprite | null)[][]

export type IWorld = {
	groundLayer: Container,
	airLayer: Container,
	groundSprites: IGrid,
}

export function generateTileset() {
  const groundLayer = new Container();
  const airLayer = new Container();

	const groundTexture = Texture.from(TileType.Dirt);
	const airTexture = Texture.from(TileType.Air);

	const GRID_SIZE = GameConfig.gridSize;
	const ROWS = GameConfig.world.y;
	const COLUMNS = GameConfig.world.x;
	
	const groundSprites: IGrid = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
      groundSprites[i] = new Array(COLUMNS);
  }

	const cave = generateCaves();

  for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLUMNS; j++) {
				const air = new Sprite(airTexture);
				air.x = j * GRID_SIZE;
				air.y = i * GRID_SIZE;
				airLayer.addChild(air);

				if (Math.abs(j - COLUMNS / 2) < 2 && i == ROWS / 2)
					continue;

				if (cave[i][j] == 0)
					continue;

				const ground = new Sprite(groundTexture);
				ground.x = j * GRID_SIZE;
				ground.y = i * GRID_SIZE;
				groundLayer.addChild(ground);
				groundSprites[i][j] = {
					sprite: ground,
					rect: {
						x: ground.x,
						y: ground.y,
						width: GRID_SIZE,
						height: GRID_SIZE,
					}
				};
		}
	}
	
	return {
    groundLayer,
    airLayer,
    groundSprites
  };
}