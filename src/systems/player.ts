import { toWorldPosition, GameConfig } from "../config";
import { IMiner } from "../sprites/miner";
import { IWorld } from "../worldgen/tileset";
import { IVec2, intersects } from "./collision";
import { Controls } from "./controls";

const SPEED = 1;

export function updatePlayer(miner: IMiner, world: IWorld, dt: number) {
	jump(miner, world, dt);
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
	if (Dig.currentDelay > 0)
		return;

	Controls.digging = false;
	Dig.currentDelay = 0;
	const x = position.x + currentTargetX
	const y = position.y + currentTargetY
	
	const tile = world[y][x]?.sprite;
	if (tile) {
		tile.removeFromParent();
		world[y][x] = null;
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

	const collides = world.some(
		(row) => row?.some((column) => column && intersects(column.rect, miner.rect))
	);
	if (collides) {
		miner.sprite.x = oldPosition.x;
		miner.sprite.y = oldPosition.y;
	}
	return collides;
}