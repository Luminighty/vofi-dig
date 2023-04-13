export class PositionComponent {
	x = 0;
	y = 0;

	onInit({x, y}) {
		this.x = x;
		this.y = y;
	}

	onMove({x, y}) {
		this.x += x ?? 0;
		this.y += y ?? 0;
	}
}
