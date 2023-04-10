import { Texture, Sprite } from "pixi.js";
import { GameConfig, toWorldPosition } from "../config";
import { Sprites } from "../assets";
import { IRect, IVec2 } from "../systems/collision";

export interface IMiner {
	sprite: Sprite,
	rect: IRect,
	gridPosition: IVec2,
	velocity: IVec2,
}

export function createMiner(): IMiner {
  const minerTexture = Texture.from(Sprites.Miner);
  const miner = new Sprite(minerTexture);
	miner.anchor.set(0.5, 0);

	let center = GameConfig.center;
	center = toWorldPosition(center.x, center.y);

	miner.x = center.x;
	miner.y = center.y;

	return {
		sprite: miner,
		velocity: { x: 0, y: 0 },
		get rect() {
			return {
				x: this.sprite.x - 6,
				y: this.sprite.y + 3,
				width: 12,
				height: 13,
			}
		},
		get gridPosition() {
			return {
				x: Math.floor(this.sprite.x / GameConfig.gridSize),
				y: Math.floor((this.sprite.y + GameConfig.gridSize / 2) / GameConfig.gridSize),
			}
		}
	}
}