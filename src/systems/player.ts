import { Application, Graphics, Sprite, Texture } from "pixi.js";
import { toWorldPosition, GameConfig } from "../config";
import { IMiner } from "../sprites/miner";
import { IWorld } from "../worldgen/tileset";
import { IVec2, intersects } from "./collision";
import { Controls } from "./controls";
import { Sprites, TileType } from "../assets";

const SPEED = 1;
let graphics: Graphics;

export async function initPlayer(app: Application) {
	graphics = new Graphics();
	app.stage.addChild(graphics);
}

export function updatePlayer(miner: IMiner, world: IWorld, dt: number) {
	graphics.clear();
	jump(miner, world, dt);
	if (Controls.building || Build.isBuilding) {
		build(miner, world, dt);
		return
	}
	if (Controls.digging) {
		dig(miner, world, dt);
		return
	}
	move(miner, world, dt);
}

const Dig = {
	DELAY: 25,
	targetX: 0,
	targetY: 0,
	currentDelay: 0,
}

function isTargetting(targetX, targetY) {
	return (targetX == 0 && targetY == 0)
}

function highlightTile(position: IVec2, color?: number, width?: number, fill?: [number, number]) {
	position = toWorldPosition(position)
	graphics.lineStyle(width ?? 1, color ?? 0xff0000, 1);
	graphics.beginFill(...(fill ?? [0x000000, 0]));
	graphics.drawRect(position.x, position.y, GameConfig.gridSize, GameConfig.gridSize)
	graphics.endFill();
}

const Build = {
	isBuilding: false
}
function build(miner: IMiner, world: IWorld, dt: number) {

	Build.isBuilding = true;
	const currentTargetX = Controls.x;
	const currentTargetY = Controls.y;

	const position = miner.gridPosition;
	position.x += currentTargetX;
	position.y += currentTargetY;
	highlightTile(position, 0x00ff00);

	if (!Controls.building) {
		Controls.left = false;
		Controls.right = false;
		Build.isBuilding = false;

		if (currentTargetX == 0 && currentTargetY == 0)
			return;

		if (world.groundSprites[position.y][position.x])
			return;
		
		const sprite = new Sprite(Texture.from(TileType.Dirt));
		const spritePosition = toWorldPosition(position);
		sprite.x = spritePosition.x;
		sprite.y = spritePosition.y;
		world.groundLayer.addChild(sprite);
		world.groundSprites[position.y][position.x] = {
			sprite,
			rect: {
				x: sprite.x,
				y: sprite.y,
				width: GameConfig.gridSize,
				height: GameConfig.gridSize,
			}
		}
	}
}

function dig(miner: IMiner, world: IWorld, dt: number) {
	const currentTargetX = Controls.x;
	const currentTargetY = Controls.y;
	const position = miner.gridPosition;

	if (isTargetting(currentTargetX, currentTargetY)) {
		Dig.currentDelay = 0;
		return;
	}
	const isTargetSame = Dig.targetX == currentTargetX && Dig.targetY == currentTargetY;
	Dig.targetX = currentTargetX;
	Dig.targetY = currentTargetY;
  Dig.currentDelay = Dig.currentDelay && isTargetSame ? Dig.currentDelay - dt : Dig.DELAY;
	highlightTile({ x: position.x + currentTargetX, y: position.y + currentTargetY}, 0, 0, [0xff0000, (Dig.DELAY - Dig.currentDelay) / Dig.DELAY]);
	if (Dig.currentDelay > 0)
		return;

	Controls.digging = false;
	Dig.currentDelay = 0;
	const x = position.x + currentTargetX
	const y = position.y + currentTargetY
	
	const tile = world.groundSprites[y][x]?.sprite;
	if (tile) {
		tile.removeFromParent();
		world.groundSprites[y][x] = null;
		if (Math.random() > 0.95) {
			const gem = new Sprite(Texture.from(Sprites.Gem));
			const gemPosition = toWorldPosition(x, y);
			gem.x = gemPosition.x;
			gem.y = gemPosition.y;
			world.groundLayer.addChild(gem);
			world.groundSprites[y][x] = {
				sprite: gem,
				rect: {
					x: 0, y: 0, width: 0, height: 0
				}
			};
		}
	}
}

const Jump = {
	size: -2,
	isOnGround: false,
}
function jump(miner: IMiner, world: IWorld, dt: number) {
	if (Controls.jumping && Jump.isOnGround) {
		miner.velocity.y = Jump.size;
		Controls.jumping = false;
	}
	
	miner.velocity.y = Math.min(miner.velocity.y + GameConfig.gravity, GameConfig.maxFallSpeed);
	Jump.isOnGround =  tryMove(miner, world, {
		y: miner.velocity.y,
		x: 0,
	});

	if (Jump.isOnGround) {
		miner.velocity.y = 0;
	}
}

function move(miner: IMiner, world: IWorld, dt: number) {
	if (Math.abs(Controls.x) > 0) {
		miner.sprite.scale.x = Controls.x > 0 ? 1 : -1;
	}
	tryMove(miner, world, {
		y: 0,
		x: Controls.x * SPEED * dt
	});
}

function tryMove(miner: IMiner, world: IWorld, offset: IVec2) {
	const oldPosition = {
		x: miner.sprite.x,
		y: miner.sprite.y,
	}
	miner.sprite.x += offset.x;
	miner.sprite.y += offset.y;

	const collides = world.groundSprites.some(
		(row) => row?.some((column) => column && intersects(column.rect, miner.rect))
	);
	if (collides) {
		miner.sprite.x = oldPosition.x;
		miner.sprite.y = oldPosition.y;
	}
	return collides;
}