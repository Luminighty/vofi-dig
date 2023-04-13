import { Application, FederatedPointerEvent } from "pixi.js";

export const Controls = {
	left: false,
	right: false,
	up: false,
	down: false,
	digging: false,
	building: false,
	jumping: false,
	mouse: {
		get left() { return this.buttons[0]; },
		get middle() { return this.buttons[1]; },
		get right() { return this.buttons[2]; },
		buttons: [false, false, false],
		x: 0, y: 0
	},

	get x() {
		return +this.right- +this.left
	},
	get y() {
		return +this.down - +this.up
	},
}

const KeyBinds = {
	"KeyW": "up",
	"KeyA": "left",
	"KeyS": "down",
	"KeyD": "right",
	"KeyC": "digging",
	"Space": "jumping",
	"KeyV": "building",
}

export function initControls(app: Application) {

	window.addEventListener('keydown', (event) => {
		const key = KeyBinds[event.code];
		if (key && !event.repeat)
			Controls[key] = true;
	});
	
	window.addEventListener('keyup', (event) => {
		const key = KeyBinds[event.code];
		if (key)
			Controls[key] = false;
	});
	
	app.stage.eventMode = "static"
	app.stage.on("pointermove", (event: FederatedPointerEvent) => {
		Controls.mouse.x = event.globalX / app.stage.scale.x;
		Controls.mouse.y = event.globalY / app.stage.scale.y;
	});

	app.stage.on("pointerdown", (event: FederatedPointerEvent) => {
		Controls.mouse.buttons[event.button] = true;
	});
	app.stage.on("pointerup", (event: FederatedPointerEvent) => {
		Controls.mouse.buttons[event.button] = false;
	});

}
