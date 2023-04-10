export interface IRect {
	x: number,
	y: number,
	width: number,
	height: number,
}

export interface IVec2 {
	x: number,
	y: number,
}

export function intersects(rect1: IRect, rect2: IRect) {
	return rect1.x + rect1.width > rect2.x &&
		rect1.x < rect2.x + rect2.width &&
		rect1.y + rect1.height > rect2.y &&
		rect1.y < rect2.y + rect2.height;
}