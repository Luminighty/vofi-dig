import { Application, FederatedPointerEvent } from "pixi.js";

let appRefence!: Application;
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
		screenX: 0, screenY: 0,
		get x() {
			return (this.screenX - appRefence.stage.position.x) / appRefence.stage.scale.x + appRefence.stage.pivot.x
		},
		get y() {
			return (this.screenY - appRefence.stage.position.y) / appRefence.stage.scale.y + appRefence.stage.pivot.y
		},
	},

	get x() {
		return +this.right- +this.left
	},
	get y() {
		return +this.down - +this.up
	},
	app: null,
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
	appRefence = app;

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
	window.addEventListener("pointermove", (event) => {
		Controls.mouse.screenX = event.x;
		Controls.mouse.screenY = event.y;
	})
	//app.stage.on("pointermove", (event: FederatedPointerEvent) => {});

	window.addEventListener("pointerdown", (event) => {
		Controls.mouse.buttons[event.button] = true;
	});
	window.addEventListener("pointerup", (event) => {
		Controls.mouse.buttons[event.button] = false;
	});

}
